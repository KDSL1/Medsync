from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime, timezone
from app.models.schemas import MedicineActionRequest
from app.core.database import get_db
from app.middleware.auth import get_current_user, require_roles, AuthenticatedUser

router = APIRouter(prefix="/medicines", tags=["medicines"])

@router.get("")
def list_medicines(current_user: AuthenticatedUser = Depends(get_current_user)):
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

    medicines = list(db.medicineschedules.find(where_clause).sort("createdAt", -1))
    formatted = []
    for m in medicines:
        formatted.append({
            "id": m["medicineScheduleId"],
            "medicineScheduleId": m["medicineScheduleId"],
            "medicineName": m["medicineName"],
            "dosage": m["dosage"],
            "frequency": m["frequency"],
            "timing": m.get("timing", "AFTER_MEAL"),
            "scheduledTime": m.get("scheduledTime", "08:00 AM"),
            "startDate": m["startDate"].isoformat() if isinstance(m["startDate"], datetime) else str(m["startDate"]),
            "endDate": m["endDate"].isoformat() if isinstance(m["endDate"], datetime) else str(m["endDate"]),
            "instructions": m.get("instructions"),
            "status": m.get("status", "ACTIVE"),
            "logs": m.get("logs", []),
        })

    return {"success": True, "data": formatted}

@router.post("/{id}/action")
def log_medicine_action(id: str, payload: MedicineActionRequest, current_user: AuthenticatedUser = Depends(require_roles("PATIENT"))):
    if payload.action not in ["TAKEN", "SKIPPED", "SNOOZED"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": "Invalid action. Must be TAKEN, SKIPPED, or SNOOZED.", "code": "VALIDATION_ERROR"}
        )

    db = get_db()
    schedule = db.medicineschedules.find_one({"$or": [{"medicineScheduleId": id}, {"_id": id}]})
    if not schedule:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"success": False, "message": "Medicine schedule not found.", "code": "NOT_FOUND"})

    from bson import ObjectId
    pat = db.patients.find_one({"userId": current_user.id})
    if not pat:
        try:
            pat = db.patients.find_one({"userId": ObjectId(current_user.id)})
        except Exception:
            pass

    if not pat or pat.get("patientId") != schedule.get("patientId"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"success": False, "message": "You can only log your own medicines.", "code": "FORBIDDEN"})

    new_log = {
        "scheduledTime": schedule.get("scheduledTime", "08:00 AM"),
        "action": payload.action,
        "notes": payload.notes,
        "loggedAt": datetime.now(timezone.utc),
    }

    updated = db.medicineschedules.find_one_and_update(
        {"_id": schedule["_id"]},
        {"$push": {"logs": new_log}, "$set": {"updatedAt": datetime.now(timezone.utc)}},
        return_document=True
    )

    updated["_id"] = str(updated["_id"])
    if isinstance(updated.get("startDate"), datetime):
        updated["startDate"] = updated["startDate"].isoformat()
    if isinstance(updated.get("endDate"), datetime):
        updated["endDate"] = updated["endDate"].isoformat()

    return {"success": True, "message": f"Medicine marked as {payload.action.lower()}", "data": updated}
