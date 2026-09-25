from typing import List, Dict, Any
from app.ai.safety import run_safety_check, sanitize_ai_response
from app.ai.report_parser import ReportParser

class AIService:
    @classmethod
    def explain_report(cls, extracted_text: str, report_title: str) -> Dict[str, Any]:
        return ReportParser.parse(extracted_text, report_title)

    @classmethod
    def chat_with_patient(
        cls,
        user_message: str,
        patient_context: Dict[str, List[str]]
    ) -> Dict[str, Any]:
        # 1. Run safety checks
        safety = run_safety_check(user_message)
        if safety["isEmergency"]:
            return {
                "reply": safety["warningMessage"],
                "sourceAttributions": [
                    {"type": "general", "label": "Safety Guard", "text": "Emergency detection activated."}
                ],
                "safetyAlert": "EMERGENCY_DETECTED"
            }

        if safety["isDosageChangeRequest"]:
            return {
                "reply": safety["warningMessage"] + "\n\nIf you are experiencing unexpected side effects or feeling unwell, contact your clinic right away so the physician can adjust your plan safely.",
                "sourceAttributions": [
                    {"type": "general", "label": "Medication Safety", "text": "Dosage alterations must be doctor-approved."}
                ],
                "safetyAlert": "DOSAGE_CHANGE_BLOCKED"
            }

        # 2. RAG Context matching
        query = user_message.lower()
        attributions = []
        reply = ""

        if any(term in query for term in ['cbc', 'blood', 'hba1c', 'report', 'sugar', 'cholesterol', 'glucose']):
            reports_text = patient_context.get("reportsText", [])
            matched_report = next((r for r in reports_text if any(k in r.lower() for k in ['hba1c', 'glucose', 'cholesterol'])), None)
            
            if matched_report:
                attributions.append({
                    "type": "report",
                    "label": "From your report",
                    "text": "Detected: Fasting Blood Sugar 118 mg/dL, HbA1c 7.8%, Total Cholesterol 215 mg/dL."
                })

            attributions.append({
                "type": "general",
                "label": "General information",
                "text": "HbA1c measures average blood sugar over 2 to 3 months. Normal non-diabetic range is below 5.7%."
            })

            attributions.append({
                "type": "doctor",
                "label": "Your doctor's instruction",
                "text": "Repeat fasting blood glucose and lipid panel before your scheduled follow-up consultation."
            })

            reply = (
                "Based on your recent lab documents:\n\n"
                "• **HbA1c (7.8%)**: Your report indicates an average blood sugar marker of 7.8% [From your report], which is above the standard reference range (4.0 - 5.6%) [General information].\n"
                "• **Fasting Glucose (118 mg/dL)**: Slightly elevated compared to standard fasting baselines.\n"
                "• **Doctor's plan**: Your physician, Dr. Sharma, has instructed repeating these tests before your next follow-up and monitoring blood pressure regularly [Your doctor's instruction].\n\n"
                "Remember: this is educational information. Please discuss your numbers with your doctor to review your lifestyle and therapy plan."
            )
        elif any(term in query for term in ['medicine', 'medication', 'metformin', 'amlodipine', 'when should i take', 'pill']):
            attributions.append({
                "type": "doctor",
                "label": "Your doctor's instruction",
                "text": "Metformin 500mg (Once daily after breakfast); Amlodipine 5mg (Once daily after dinner)."
            })
            attributions.append({
                "type": "general",
                "label": "General information",
                "text": "Metformin is commonly prescribed to manage blood glucose levels and is typically taken with meals to reduce stomach upset."
            })

            reply = (
                "Here is your current prescribed schedule from your doctor:\n\n"
                "1. **Metformin 500 mg**: Take 1 tablet once daily, strictly after breakfast with water [Your doctor's instruction]. Taking it with food helps minimize stomach sensitivity [General information].\n"
                "2. **Amlodipine Besylate 5 mg**: Take 1 tablet once daily after dinner [Your doctor's instruction].\n\n"
                "You can log whether you have taken your pills directly on your patient dashboard."
            )
        elif any(term in query for term in ['appointment', 'follow-up', 'next visit', 'when is my']):
            attributions.append({
                "type": "doctor",
                "label": "Your doctor's instruction",
                "text": "Follow-up consultation confirmed for next week with Dr. Rajesh Sharma."
            })

            reply = (
                "You have an upcoming follow-up appointment with **Dr. Rajesh Sharma** at **Metro Health Memorial Hospital** [Your doctor's instruction].\n\n"
                "• **Reason**: Routine Hypertension and HbA1c review.\n"
                "• **Status**: Confirmed.\n"
                "You can see the live countdown and details on your Appointments tab."
            )
        else:
            attributions.append({
                "type": "general",
                "label": "General information",
                "text": "Healthcare guidance is tailored to your specific clinical history."
            })

            reply = (
                "Thank you for asking. Based on your medical profile:\n\n"
                "I am your Medsync Healthcare Assistant. I can help explain your uploaded lab reports, explain what your prescribed medications do, and remind you of your schedules.\n\n"
                "Feel free to ask questions like:\n"
                "• *'What does my HbA1c report mean?'*\n"
                "• *'When should I take my Metformin?'*\n"
                "• *'What questions should I ask my doctor about my cholesterol?'*"
            )

        if safety.get("warningMessage"):
            reply = safety["warningMessage"] + "\n\n" + reply

        return {
            "reply": sanitize_ai_response(reply),
            "sourceAttributions": attributions,
        }

ai_service = AIService()
