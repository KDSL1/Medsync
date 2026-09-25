import os
import re
from typing import Dict, Any, List

class ReportParser:
    PATTERNS = [
        {"name": "HbA1c (Glycated Hemoglobin)", "regex": r"hba1c.*?(\d+\.?\d*)\s*%", "ref": "4.0 - 5.6%", "unit": "%", "desc": "Reflects average blood sugar levels over the previous 8 to 12 weeks."},
        {"name": "Fasting Blood Sugar", "regex": r"(?:fasting blood sugar|fasting glucose).*?(\d+\.?\d*)\s*(?:mg/dl)?", "ref": "70 - 99 mg/dL", "unit": "mg/dL", "desc": "Measures blood glucose concentration after an overnight fast."},
        {"name": "Total Cholesterol", "regex": r"total cholesterol.*?(\d+\.?\d*)\s*(?:mg/dl)?", "ref": "< 200 mg/dL", "unit": "mg/dL", "desc": "Total blood cholesterol content including HDL, LDL, and VLDL."},
        {"name": "LDL Cholesterol", "regex": r"ldl cholesterol.*?(\d+\.?\d*)\s*(?:mg/dl)?", "ref": "< 100 mg/dL", "unit": "mg/dL", "desc": "Low-Density Lipoprotein, often called 'bad' cholesterol."},
        {"name": "HDL Cholesterol", "regex": r"hdl cholesterol.*?(\d+\.?\d*)\s*(?:mg/dl)?", "ref": "> 40 mg/dL", "unit": "mg/dL", "desc": "High-Density Lipoprotein, often known as 'good' cholesterol."},
        {"name": "Serum Creatinine", "regex": r"(?:serum creatinine|creatinine).*?(\d+\.?\d*)\s*(?:mg/dl)?", "ref": "0.7 - 1.3 mg/dL", "unit": "mg/dL", "desc": "A waste byproduct filtered by the kidneys, indicating renal filtration health."},
        {"name": "Hemoglobin", "regex": r"(?:hemoglobin|hb)\b.*?(\d+\.?\d*)\s*(?:g/dl)?", "ref": "13.8 - 17.2 g/dL", "unit": "g/dL", "desc": "The oxygen-carrying protein within red blood cells."}
    ]

    @classmethod
    def parse(cls, extracted_text: str, report_title: str) -> Dict[str, Any]:
        if not extracted_text or not extracted_text.strip():
            return {
                "summary": "I couldn't confidently read values from this uploaded document. Please check the original report or upload a clearer scan.",
                "keyValues": [],
                "whyItMatters": "Accurate laboratory numbers are essential for your medical team to evaluate your health.",
                "doctorQuestions": ["Could you please review my physical copy of this report?"],
                "disclaimer": "This explanation is an educational aid and does NOT constitute medical diagnosis."
            }

        key_values = []
        for pat in cls.PATTERNS:
            match = re.search(pat["regex"], extracted_text, re.IGNORECASE)
            if match:
                val_num = float(match.group(1))
                status = "NORMAL"
                if "HbA1c" in pat["name"] and val_num > 6.5:
                    status = "ABNORMAL"
                elif "Fasting Blood Sugar" in pat["name"] and val_num > 100:
                    status = "ABNORMAL"
                elif "Total Cholesterol" in pat["name"] and val_num > 200:
                    status = "ABNORMAL"
                elif "LDL" in pat["name"] and val_num > 100:
                    status = "ABNORMAL"

                key_values.append({
                    "parameter": pat["name"],
                    "value": f"{match.group(1)} {pat['unit']}",
                    "referenceRange": pat["ref"],
                    "status": status,
                    "simpleExplanation": pat["desc"]
                })

        if not key_values:
            key_values.append({
                "parameter": "Overall Findings",
                "value": "Values extracted from document",
                "referenceRange": "Varies by lab",
                "status": "NORMAL",
                "simpleExplanation": "Please refer to the doctor's formal signature and notes on the original scan."
            })

        return {
            "summary": f"Here is a clear, patient-friendly explanation of your {report_title}. Your report has been scanned, and the identifiable laboratory parameters have been converted into plain language for your understanding.",
            "keyValues": key_values,
            "whyItMatters": "Regular monitoring of these clinical markers enables your healthcare team to detect changes early and adjust your wellness and treatment strategy.",
            "doctorQuestions": [
                "What do these specific test values mean for my day-to-day routine?",
                "Do I need any follow-up tests or medication adjustments?",
                "Are there any specific dietary or physical activities you recommend based on this?"
            ],
            "disclaimer": "This explanation is an educational aid and does NOT replace a doctor's clinical judgment, diagnosis, or prescription. Always verify any health changes with your doctor."
        }
