from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime
from app.core.database import get_db
from app.middleware.auth import get_current_user, AuthenticatedUser

router = APIRouter(prefix="/followups", tags=["followups"])

@router.get("")
def list_followups(current_user: AuthenticatedUser = Depends(get_current_user)):
    if current_user.role == "SUPER_ADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"success": False, "message": "Access denied.", "code": "FORBIDDEN"})

    db = get_db()
    where_clause = {"hospitalId": current_user.hospitalId}

    if current_user.role == "PATIENT":
        from bson import ObjectId
        pat = db.patients.find_one({"userId": current_user.id})
        if not pat:
            try:
                pat = db.patients.find_one({"userId": ObjectId(current_user.id)})
            except Exception:
                pass
        if pat:
            where_clause["patientId"] = pat["patientId"]
    elif current_user.role == "DOCTOR":
        from bson import ObjectId
        doc = db.doctors.find_one({"userId": current_user.id})
        if not doc:
            try:
                doc = db.doctors.find_one({"userId": ObjectId(current_user.id)})
            except Exception:
                pass
        if doc:
            where_clause["doctorId"] = doc["doctorId"]

    followups = list(db.followups.find(where_clause).sort("dueDate", 1))
    formatted = []
    for f in followups:
        patient = db.patients.find_one({"patientId": f["patientId"]})
        doctor = db.doctors.find_one({"doctorId": f["doctorId"]})
        doc_user = db.users.find_one({"_id": doctor["userId"]}) if doctor else None

        due_date_val = f.get("dueDate") or f.get("followUpDate")
        due_date_str = due_date_val.isoformat() if isinstance(due_date_val, datetime) else str(due_date_val)

        formatted.append({
            "id": f.get("followUpId"),
            "followUpId": f.get("followUpId"),
            "reason": f.get("reason"),
            "status": f.get("status"),
            "dueDate": due_date_str,
            "patient": {
                "id": patient.get("patientId") if patient else "",
                "user": {"fullName": patient.get("name") if patient else "Patient"}
            },
            "doctor": {
                "id": doctor.get("doctorId") if doctor else "",
                "user": {"fullName": doc_user.get("fullName", "Dr. Assigned") if doc_user else "Dr. Assigned"}
            }
        })

    return {"success": True, "data": formatted}
