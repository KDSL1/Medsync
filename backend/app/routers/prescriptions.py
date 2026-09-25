from fastapi import APIRouter, HTTPException, Depends, status, Request
from datetime import datetime, timezone
from app.models.schemas import PrescriptionCreateRequest
from app.core.database import get_db
from app.middleware.auth import get_current_user, require_roles, AuthenticatedUser
from app.services.audit_service import log_audit

router = APIRouter(prefix="/prescriptions", tags=["prescriptions"])

@router.get("")
def list_prescriptions(current_user: AuthenticatedUser = Depends(get_current_user)):
    if current_user.role == "SUPER_ADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"success": False, "message": "Access denied.", "code": "FORBIDDEN"})

    db = get_db()
    where_clause = {"hospitalId": current_user.hospitalId}

    if current_user.role == "PATIENT":
        pat = db.patients.find_one({"userId": current_user.id})
        if not pat:
            from bson import ObjectId
            try:
                pat = db.patients.find_one({"userId": ObjectId(current_user.id)})
            except Exception:
                pass
        if pat:
            where_clause["patientId"] = pat["patientId"]
    elif current_user.role == "DOCTOR":
        doc = db.doctors.find_one({"userId": current_user.id})
        if not doc:
            from bson import ObjectId
            try:
                doc = db.doctors.find_one({"userId": ObjectId(current_user.id)})
            except Exception:
                pass
        if doc:
            where_clause["doctorId"] = doc["doctorId"]

    prescriptions = list(db.prescriptions.find(where_clause).sort("createdAt", -1))
    formatted = []
    for p in prescriptions:
        patient = db.patients.find_one({"patientId": p["patientId"]})
        doctor = db.doctors.find_one({"doctorId": p["doctorId"]})
        doc_user = db.users.find_one({"_id": doctor["userId"]}) if doctor else None

        created_at_val = p.get("createdAt")
        created_at_str = created_at_val.isoformat() if isinstance(created_at_val, datetime) else str(created_at_val)

        formatted.append({
            "id": p["prescriptionId"],
            "prescriptionId": p["prescriptionId"],
            "diagnosis": p.get("diagnosis"),
            "instructions": p.get("instructions"),
            "notes": p.get("notes"),
            "createdAt": created_at_str,
            "patient": {
                "id": patient.get("patientId") if patient else "",
                "user": {"fullName": patient.get("name", "Patient") if patient else "Patient", "email": patient.get("email") if patient else ""}
            },
            "doctor": {
                "id": doctor.get("doctorId") if doctor else "",
                "user": {"fullName": doc_user.get("fullName", "Dr. Assigned") if doc_user else "Dr. Assigned"},
                "department": {"name": doctor.get("departmentName", "General Medicine") if doctor else "General Medicine"}
            },
            "medicineSchedules": p.get("medicines", []),
        })

    return {"success": True, "data": formatted}

@router.post("")
def create_prescription(payload: PrescriptionCreateRequest, current_user: AuthenticatedUser = Depends(require_roles("DOCTOR"))):
    hospital_id = current_user.hospitalId
    if not hospital_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"success": False, "message": "Hospital context missing.", "code": "FORBIDDEN"})

    db = get_db()
    from bson import ObjectId
    try:
        doctor = db.doctors.find_one({"userId": ObjectId(current_user.id)})
    except Exception:
        doctor = db.doctors.find_one({"userId": current_user.id})

    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"success": False, "message": "Doctor profile not found.", "code": "NOT_FOUND"})

    patient = db.patients.find_one({"$or": [{"patientId": payload.patientId}, {"_id": payload.patientId}]})
    if not patient or patient.get("hospitalId") != hospital_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"success": False, "message": "Patient not found or belongs to another hospital.", "code": "FORBIDDEN"})

    now = datetime.now(timezone.utc)
    consultation_id = None

    if payload.appointmentId:
        cons_count = db.consultations.count_documents({"hospitalId": hospital_id})
        consultation_id = f"CNS-{hospital_id[-3:]}-{str(cons_count + 1).zfill(3)}"
        
        fu_date = None
        if payload.followUpDate:
            try:
                fu_date = datetime.fromisoformat(payload.followUpDate.replace("Z", "+00:00"))
            except Exception:
                pass

        db.consultations.insert_one({
            "consultationId": consultation_id,
            "hospitalId": hospital_id,
            "appointmentId": payload.appointmentId,
            "patientId": patient["patientId"],
            "doctorId": doctor["doctorId"],
            "chiefComplaint": "Clinical consultation visit",
            "diagnosis": payload.diagnosis,
            "clinicalNotes": payload.notes or "",
            "treatmentInstructions": payload.instructions,
            "followUpRequired": bool(payload.followUpRequired),
            "followUpDate": fu_date,
            "followUpInstructions": payload.followUpInstructions,
            "createdAt": now,
            "updatedAt": now,
        })

        db.appointments.update_one(
            {"$or": [{"appointmentId": payload.appointmentId}, {"_id": payload.appointmentId}]},
            {"$set": {"status": "COMPLETED", "updatedAt": now}}
        )

    presc_count = db.prescriptions.count_documents({"hospitalId": hospital_id})
    prescription_id = f"RX-{hospital_id[-3:]}-{str(presc_count + 1).zfill(3)}"

    medicines_list = []
    for m in payload.medicines:
        try:
            start_d = datetime.fromisoformat(m.startDate.replace("Z", "+00:00"))
            end_d = datetime.fromisoformat(m.endDate.replace("Z", "+00:00"))
        except Exception:
            start_d = now
            end_d = now

        med_dict = m.model_dump()
        med_dict["startDate"] = start_d
        med_dict["endDate"] = end_d
        med_dict["status"] = "ACTIVE"
        medicines_list.append(med_dict)

    prescription_doc = {
        "prescriptionId": prescription_id,
        "hospitalId": hospital_id,
        "consultationId": consultation_id,
        "appointmentId": payload.appointmentId,
        "patientId": patient["patientId"],
        "doctorId": doctor["doctorId"],
        "diagnosis": payload.diagnosis,
        "instructions": payload.instructions,
        "notes": payload.notes,
        "medicines": medicines_list,
        "createdAt": now,
        "updatedAt": now,
    }
    db.prescriptions.insert_one(prescription_doc)

    # Standalone medicine schedule reminders
    for med in medicines_list:
        sched_count = db.medicineschedules.count_documents({"hospitalId": hospital_id})
        db.medicineschedules.insert_one({
            "medicineScheduleId": f"SCHED-{hospital_id[-3:]}-{str(sched_count + 1).zfill(3)}",
            "hospitalId": hospital_id,
            "prescriptionId": prescription_id,
            "patientId": patient["patientId"],
            "medicineName": med["medicineName"],
            "dosage": med["dosage"],
            "frequency": med["frequency"],
            "timing": med.get("timing", "AFTER_MEAL"),
            "scheduledTime": med.get("scheduledTime", "08:00 AM"),
            "startDate": med["startDate"],
            "endDate": med["endDate"],
            "instructions": med.get("instructions"),
            "status": "ACTIVE",
            "logs": [],
            "createdAt": now,
            "updatedAt": now,
        })

    # Follow-Up Record if required
    if payload.followUpRequired and payload.followUpDate:
        try:
            fu_date = datetime.fromisoformat(payload.followUpDate.replace("Z", "+00:00"))
        except Exception:
            fu_date = now

        fu_count = db.followups.count_documents({"hospitalId": hospital_id})
        db.followups.insert_one({
            "followUpId": f"FOL-{hospital_id[-3:]}-{str(fu_count + 1).zfill(3)}",
            "hospitalId": hospital_id,
            "patientId": patient["patientId"],
            "doctorId": doctor["doctorId"],
            "consultationId": consultation_id,
            "appointmentId": payload.appointmentId,
            "followUpDate": fu_date,
            "dueDate": fu_date,
            "reason": payload.followUpInstructions or "Routine follow-up review",
            "status": "PENDING",
            "createdAt": now,
            "updatedAt": now,
        })

        db.notifications.insert_one({
            "notificationId": f"NOTIF-{int(datetime.now().timestamp() * 1000)}-1",
            "userId": str(patient["userId"]),
            "patientId": patient["patientId"],
            "hospitalId": hospital_id,
            "type": "FOLLOWUP_REMINDER",
            "title": "Follow-up Recommended",
            "message": f"Dr. {current_user.email} recommended a follow-up visit on {fu_date.strftime('%b %d, %Y')}.",
            "isRead": False,
            "createdAt": now,
            "updatedAt": now,
        })

    # Patient Notification for new prescription
    db.notifications.insert_one({
        "notificationId": f"NOTIF-{int(datetime.now().timestamp() * 1000)}-2",
        "userId": str(patient["userId"]),
        "patientId": patient["patientId"],
        "hospitalId": hospital_id,
        "type": "PRESCRIPTION_CREATED",
        "title": "New Prescription Created",
        "message": f"Dr. {current_user.email} prescribed {len(payload.medicines)} medicine(s). Reminders are updated on your dashboard.",
        "metadata": {"prescriptionId": prescription_id},
        "isRead": False,
        "createdAt": now,
        "updatedAt": now,
    })

    log_audit(
        action="CREATE_PRESCRIPTION",
        resource_type="Prescription",
        user_id=current_user.id,
        user_role=current_user.role,
        hospital_id=hospital_id,
        resource_id=prescription_id,
        metadata={"medicinesCount": len(payload.medicines), "patientId": patient["patientId"]}
    )

    prescription_doc["_id"] = str(prescription_doc["_id"])
    prescription_doc["createdAt"] = prescription_doc["createdAt"].isoformat()
    return {"success": True, "message": "Prescription created successfully", "data": prescription_doc}
