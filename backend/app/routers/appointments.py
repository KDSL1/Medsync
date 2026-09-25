from fastapi import APIRouter, HTTPException, Depends, status, Request
from datetime import datetime, timezone
from app.models.schemas import AppointmentCreateRequest, AppointmentStatusUpdateRequest
from app.core.database import get_db
from app.middleware.auth import get_current_user, require_roles, AuthenticatedUser
from app.services.audit_service import log_audit

router = APIRouter(prefix="/appointments", tags=["appointments"])

@router.get("")
def list_appointments(current_user: AuthenticatedUser = Depends(get_current_user)):
    if current_user.role == "SUPER_ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"success": False, "message": "Access denied. Super Admin cannot access clinical records.", "code": "FORBIDDEN"}
        )

    db = get_db()
    where_clause = {}
    if current_user.hospitalId:
        where_clause["hospitalId"] = current_user.hospitalId

    if current_user.role == "DOCTOR":
        doc = db.doctors.find_one({"userId": current_user.id})
        if not doc:
            from bson import ObjectId
            try:
                doc = db.doctors.find_one({"userId": ObjectId(current_user.id)})
            except Exception:
                pass
        if doc:
            where_clause["doctorId"] = doc["doctorId"]
    elif current_user.role == "PATIENT":
        pat = db.patients.find_one({"userId": current_user.id})
        if not pat:
            from bson import ObjectId
            try:
                pat = db.patients.find_one({"userId": ObjectId(current_user.id)})
            except Exception:
                pass
        if pat:
            where_clause["patientId"] = pat["patientId"]

    appointments = list(db.appointments.find(where_clause).sort("dateTime", -1))
    formatted = []
    for apt in appointments:
        patient = db.patients.find_one({"patientId": apt["patientId"]})
        doctor = db.doctors.find_one({"doctorId": apt["doctorId"]})
        doc_user = db.users.find_one({"_id": doctor["userId"]}) if doctor else None
        department = db.departments.find_one({"departmentId": apt.get("departmentId")}) if apt.get("departmentId") else None

        date_time_val = apt.get("dateTime")
        if isinstance(date_time_val, datetime):
            date_time_str = date_time_val.isoformat()
        else:
            date_time_str = str(date_time_val)

        formatted.append({
            "id": apt["appointmentId"],
            "appointmentId": apt["appointmentId"],
            "hospitalId": apt["hospitalId"],
            "patientId": apt["patientId"],
            "doctorId": apt["doctorId"],
            "departmentId": apt.get("departmentId"),
            "dateTime": date_time_str,
            "reason": apt.get("reason"),
            "status": apt.get("status"),
            "queueNumber": apt.get("queueNumber"),
            "notes": apt.get("notes"),
            "patient": {
                "id": patient.get("patientId") if patient else "",
                "user": {
                    "fullName": patient.get("name", "Patient") if patient else "Patient",
                    "email": patient.get("email") if patient else "",
                    "phone": patient.get("phone") if patient else "",
                }
            },
            "doctor": {
                "id": doctor.get("doctorId") if doctor else "",
                "specialization": doctor.get("specialization") if doctor else "",
                "user": {
                    "fullName": doc_user.get("fullName", "Dr. Assigned") if doc_user else "Dr. Assigned",
                    "email": doc_user.get("email") if doc_user else "",
                },
                "department": {
                    "name": (department.get("name") if department else (doctor.get("departmentName") if doctor else "General Medicine"))
                }
            },
            "department": {
                "name": department.get("name") if department else "General Medicine"
            }
        })

    return {"success": True, "data": formatted}

@router.post("")
def create_appointment(payload: AppointmentCreateRequest, request: Request, current_user: AuthenticatedUser = Depends(require_roles("HOSPITAL_ADMIN", "RECEPTIONIST", "DOCTOR", "PATIENT"))):
    hospital_id = current_user.hospitalId
    if not hospital_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"success": False, "message": "Hospital context missing.", "code": "FORBIDDEN"})

    db = get_db()
    patient = db.patients.find_one({"$or": [{"patientId": payload.patientId}, {"_id": payload.patientId}]})
    doctor = db.doctors.find_one({"$or": [{"doctorId": payload.doctorId}, {"_id": payload.doctorId}]})

    if not patient or patient.get("hospitalId") != hospital_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"success": False, "message": "Patient does not belong to this hospital.", "code": "FORBIDDEN"})

    if not doctor or doctor.get("hospitalId") != hospital_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"success": False, "message": "Doctor does not belong to this hospital.", "code": "FORBIDDEN"})

    try:
        dt = datetime.fromisoformat(payload.dateTime.replace("Z", "+00:00"))
    except Exception:
        dt = datetime.now(timezone.utc)

    date_str = dt.strftime("%Y-%m-%d")
    time_str = dt.strftime("%I:%M %p")

    count_today = db.appointments.count_documents({"hospitalId": hospital_id, "date": date_str})
    apt_count_total = db.appointments.count_documents({"hospitalId": hospital_id})
    appointment_id = f"APT-{hospital_id[-3:]}-{str(apt_count_total + 1).zfill(3)}"
    now = datetime.now(timezone.utc)

    appointment_doc = {
        "appointmentId": appointment_id,
        "hospitalId": hospital_id,
        "patientId": patient["patientId"],
        "doctorId": doctor["doctorId"],
        "departmentId": payload.departmentId or doctor.get("departmentId"),
        "dateTime": dt,
        "date": date_str,
        "time": time_str,
        "reason": payload.reason,
        "notes": payload.notes,
        "status": "SCHEDULED",
        "queueNumber": 100 + count_today + 1,
        "createdBy": current_user.id,
        "createdAt": now,
        "updatedAt": now,
    }
    db.appointments.insert_one(appointment_doc)

    # Patient Notification
    doc_user = db.users.find_one({"_id": doctor["userId"]})
    db.notifications.insert_one({
        "notificationId": f"NOTIF-{int(datetime.now().timestamp() * 1000)}",
        "userId": str(patient["userId"]),
        "patientId": patient["patientId"],
        "hospitalId": hospital_id,
        "type": "APPOINTMENT_REMINDER",
        "title": "Appointment Scheduled",
        "message": f"Your appointment with {doc_user.get('fullName', 'Doctor') if doc_user else 'Doctor'} is confirmed for {dt.strftime('%b %d, %Y %I:%M %p')}.",
        "metadata": {"appointmentId": appointment_id},
        "isRead": False,
        "createdAt": now,
        "updatedAt": now,
    })

    log_audit(
        action="CREATE_APPOINTMENT",
        resource_type="Appointment",
        user_id=current_user.id,
        user_role=current_user.role,
        hospital_id=hospital_id,
        resource_id=appointment_id,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={"patientId": patient["patientId"], "doctorId": doctor["doctorId"]}
    )

    appointment_doc["_id"] = str(appointment_doc["_id"])
    appointment_doc["dateTime"] = appointment_doc["dateTime"].isoformat()
    return {"success": True, "message": "Appointment scheduled successfully", "data": appointment_doc}

@router.patch("/{id}/status")
def update_appointment_status(id: str, payload: AppointmentStatusUpdateRequest, current_user: AuthenticatedUser = Depends(require_roles("HOSPITAL_ADMIN", "RECEPTIONIST", "DOCTOR"))):
    db = get_db()
    existing = db.appointments.find_one({"$or": [{"appointmentId": id}, {"_id": id}]})
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"success": False, "message": "Appointment not found.", "code": "NOT_FOUND"})

    if existing.get("hospitalId") != current_user.hospitalId and current_user.role != "SUPER_ADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"success": False, "message": "Cannot update appointment from another hospital.", "code": "FORBIDDEN"})

    update_fields = {"updatedAt": datetime.now(timezone.utc)}
    if payload.status:
        update_fields["status"] = payload.status
    if payload.notes is not None:
        update_fields["notes"] = payload.notes

    updated = db.appointments.find_one_and_update(
        {"_id": existing["_id"]},
        {"$set": update_fields},
        return_document=True
    )

    log_audit(
        action="UPDATE_APPOINTMENT_STATUS",
        resource_type="Appointment",
        user_id=current_user.id,
        user_role=current_user.role,
        hospital_id=current_user.hospitalId,
        resource_id=existing.get("appointmentId"),
        metadata={"newStatus": payload.status}
    )

    updated["_id"] = str(updated["_id"])
    if isinstance(updated.get("dateTime"), datetime):
        updated["dateTime"] = updated["dateTime"].isoformat()

    return {"success": True, "message": f"Appointment updated to {payload.status}", "data": updated}
