from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime, timezone
from bson import ObjectId
from app.models.schemas import AIChatRequest
from app.core.database import get_db
from app.middleware.auth import require_roles, AuthenticatedUser
from app.services.audit_service import log_audit
from app.ai.llm import ai_service

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/chat")
def chat_with_assistant(payload: AIChatRequest, current_user: AuthenticatedUser = Depends(require_roles("PATIENT"))):
    db = get_db()
    
    pat = db.patients.find_one({"userId": current_user.id})
    if not pat:
        try:
            pat = db.patients.find_one({"userId": ObjectId(current_user.id)})
        except Exception:
            pass

    if not pat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"success": False, "message": "Patient record not found.", "code": "NOT_FOUND"})

    patient_id = pat["patientId"]
    medical_reports = list(db.medicalreports.find({"patientId": patient_id}).sort("createdAt", -1).limit(5))
    medicine_schedules = list(db.medicineschedules.find({"patientId": patient_id, "status": "ACTIVE"}))
    appointments = list(db.appointments.find({"patientId": patient_id, "status": {"$in": ["SCHEDULED", "CONFIRMED"]}}).sort("dateTime", 1).limit(3))
    consultations = list(db.consultations.find({"patientId": patient_id}).sort("createdAt", -1).limit(2))

    reports_text = [f"{r.get('title')}: {r.get('extractedText', '')}" for r in medical_reports]
    medicines = [f"{m.get('medicineName')} ({m.get('dosage')}, {m.get('frequency')})" for m in medicine_schedules]
    appointments_text = [f"{a.get('reason')} on {str(a.get('date'))}" for a in appointments]
    doctor_notes = [f"Doctor Notes: {c.get('clinicalNotes') or c.get('diagnosis')}" for c in consultations]

    patient_context = {
        "reportsText": reports_text,
        "medicines": medicines,
        "appointments": appointments_text,
        "doctorNotes": doctor_notes,
    }

    ai_response = ai_service.chat_with_patient(payload.message, patient_context)

    log_audit(
        action="AI_CHAT_QUERY",
        resource_type="AIAssistant",
        user_id=current_user.id,
        user_role=current_user.role,
        hospital_id=current_user.hospitalId,
        metadata={"hasSafetyAlert": bool(ai_response.get("safetyAlert"))}
    )

    return {"success": True, "data": ai_response}
