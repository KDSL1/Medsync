from fastapi import APIRouter, HTTPException, Depends, status, Request, Query
from datetime import datetime, timezone
from typing import Optional
from bson import ObjectId
from app.models.schemas import DoctorCreateRequest, ReceptionistCreateRequest, DepartmentCreateRequest
from app.core.database import get_db
from app.core.security import hash_password
from app.middleware.auth import require_roles, AuthenticatedUser
from app.services.audit_service import log_audit

router = APIRouter(prefix="/hospital", tags=["hospital"])

@router.get("/dashboard")
def get_hospital_dashboard(current_user: AuthenticatedUser = Depends(require_roles("HOSPITAL_ADMIN"))):
    hospital_id = current_user.hospitalId
    if not hospital_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": "Hospital context missing.", "code": "BAD_REQUEST"}
        )

    db = get_db()
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    total_doctors = db.doctors.count_documents({"hospitalId": hospital_id, "status": "ACTIVE"})
    total_patients = db.patients.count_documents({"hospitalId": hospital_id})
    total_receptionists = db.receptionists.count_documents({"hospitalId": hospital_id})
    today_appointments = db.appointments.count_documents({"hospitalId": hospital_id, "date": today_str})
    upcoming_appointments = db.appointments.count_documents({
        "hospitalId": hospital_id,
        "date": {"$gt": today_str},
        "status": {"$in": ["SCHEDULED", "CONFIRMED"]}
    })
    pending_follow_ups = db.followups.count_documents({"hospitalId": hospital_id, "status": "PENDING"})

    # Departments with live counts
    departments = list(db.departments.find({"hospitalId": hospital_id}))
    departments_with_counts = []
    for d in departments:
        doc_count = db.doctors.count_documents({"hospitalId": hospital_id, "departmentId": d["departmentId"]})
        apt_count = db.appointments.count_documents({"hospitalId": hospital_id, "departmentId": d["departmentId"]})
        departments_with_counts.append({
            "id": d["departmentId"],
            "name": d["name"],
            "description": d.get("description"),
            "_count": {
                "doctors": doc_count,
                "appointments": apt_count,
            }
        })

    # Recent patients
    recent_patients = list(db.patients.find({"hospitalId": hospital_id}).sort("createdAt", -1).limit(5))
    formatted_recent = []
    for p in recent_patients:
        created_at = p.get("createdAt") or p.get("registrationDate") or datetime.now(timezone.utc)
        formatted_recent.append({
            "id": p["patientId"],
            "fullName": p["name"],
            "email": p.get("email"),
            "phone": p.get("phone"),
            "createdAt": created_at.isoformat() if isinstance(created_at, datetime) else str(created_at),
        })

    return {
        "success": True,
        "data": {
            "stats": {
                "totalDoctors": total_doctors,
                "totalPatients": total_patients,
                "totalReceptionists": total_receptionists,
                "todayAppointments": today_appointments,
                "upcomingAppointments": upcoming_appointments,
                "pendingFollowUps": pending_follow_ups,
            },
            "departments": departments_with_counts,
            "recentRegistrations": formatted_recent,
        }
    }

@router.get("/doctors")
def list_hospital_doctors(current_user: AuthenticatedUser = Depends(require_roles("HOSPITAL_ADMIN", "RECEPTIONIST"))):
    hospital_id = current_user.hospitalId
    if not hospital_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"success": False, "message": "Hospital context required.", "code": "FORBIDDEN"})

    db = get_db()
    doctors = list(db.doctors.find({"hospitalId": hospital_id}))
    formatted = []
    for doc in doctors:
        user = db.users.find_one({"_id": doc["userId"]})
        apt_count = db.appointments.count_documents({"hospitalId": hospital_id, "doctorId": doc["doctorId"]})
        pat_count = db.patients.count_documents({"hospitalId": hospital_id, "assignedDoctorId": doc["doctorId"]})

        formatted.append({
            "id": doc["doctorId"],
            "doctorId": doc["doctorId"],
            "specialization": doc["specialization"],
            "licenseNumber": doc["licenseNumber"],
            "consultationFee": doc.get("consultationFee", 0),
            "department": {"name": doc.get("departmentName") or doc.get("specialization")},
            "user": {
                "id": str(user["_id"]) if user else "",
                "fullName": user.get("fullName", "Dr. Unknown") if user else "Dr. Unknown",
                "email": user.get("email") if user else "",
                "phone": user.get("phone") if user else "",
                "isActive": user.get("isActive", True) if user else True,
            } if user else {"fullName": "Dr. Unknown"},
            "_count": {
                "appointments": apt_count,
                "assignedPatients": pat_count,
            }
        })

    return {"success": True, "data": formatted}

@router.post("/doctors")
def add_doctor(payload: DoctorCreateRequest, request: Request, current_user: AuthenticatedUser = Depends(require_roles("HOSPITAL_ADMIN"))):
    hospital_id = current_user.hospitalId
    if not hospital_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"success": False, "message": "Hospital context required.", "code": "FORBIDDEN"})

    db = get_db()
    email = payload.email.lower().strip()
    if db.users.find_one({"email": email}):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"success": False, "message": "Email already in use.", "code": "DUPLICATE_EMAIL"})

    now = datetime.now(timezone.utc)
    user_doc = {
        "hospitalId": hospital_id,
        "email": email,
        "passwordHash": hash_password(payload.password),
        "fullName": payload.fullName,
        "phone": payload.phone,
        "role": "DOCTOR",
        "isActive": True,
        "createdAt": now,
        "updatedAt": now,
    }
    user_res = db.users.insert_one(user_doc)

    dept_name = payload.specialization
    if payload.departmentId:
        dept = db.departments.find_one({"departmentId": payload.departmentId})
        if dept:
            dept_name = dept.get("name")

    doctor_count = db.doctors.count_documents({"hospitalId": hospital_id})
    doctor_id = f"DOC-{hospital_id[-3:]}-{str(doctor_count + 1).zfill(3)}"

    doctor_doc = {
        "doctorId": doctor_id,
        "userId": user_res.inserted_id,
        "hospitalId": hospital_id,
        "departmentId": payload.departmentId,
        "departmentName": dept_name,
        "specialization": payload.specialization,
        "licenseNumber": payload.licenseNumber,
        "consultationFee": payload.consultationFee or 100,
        "status": "ACTIVE",
        "createdAt": now,
        "updatedAt": now,
    }
    db.doctors.insert_one(doctor_doc)

    log_audit(
        action="ADD_DOCTOR",
        resource_type="Doctor",
        user_id=current_user.id,
        user_role=current_user.role,
        hospital_id=hospital_id,
        resource_id=doctor_id,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={"doctorName": payload.fullName, "email": email}
    )

    user_doc["_id"] = str(user_doc["_id"])
    doctor_doc["_id"] = str(doctor_doc["_id"])
    doctor_doc["userId"] = str(doctor_doc["userId"])

    return {
        "success": True,
        "message": "Doctor added successfully",
        "data": {"user": user_doc, "doctorProfile": doctor_doc}
    }

@router.get("/receptionists")
def list_hospital_receptionists(current_user: AuthenticatedUser = Depends(require_roles("HOSPITAL_ADMIN"))):
    hospital_id = current_user.hospitalId
    if not hospital_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"success": False, "message": "Hospital context required.", "code": "FORBIDDEN"})

    db = get_db()
    recs = list(db.receptionists.find({"hospitalId": hospital_id}))
    formatted = []
    for r in recs:
        user = db.users.find_one({"_id": r["userId"]})
        formatted.append({
            "id": r["receptionistId"],
            "shift": r.get("shift", "MORNING"),
            "user": {
                "id": str(user["_id"]) if user else "",
                "fullName": user.get("fullName", "Receptionist") if user else "Receptionist",
                "email": user.get("email") if user else "",
                "phone": user.get("phone") if user else "",
            } if user else {"fullName": "Receptionist"}
        })

    return {"success": True, "data": formatted}

@router.post("/receptionists")
def add_receptionist(payload: ReceptionistCreateRequest, request: Request, current_user: AuthenticatedUser = Depends(require_roles("HOSPITAL_ADMIN"))):
    hospital_id = current_user.hospitalId
    if not hospital_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"success": False, "message": "Hospital context required.", "code": "FORBIDDEN"})

    db = get_db()
    email = payload.email.lower().strip()
    if db.users.find_one({"email": email}):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"success": False, "message": "Email already in use.", "code": "DUPLICATE_EMAIL"})

    now = datetime.now(timezone.utc)
    user_doc = {
        "hospitalId": hospital_id,
        "email": email,
        "passwordHash": hash_password(payload.password),
        "fullName": payload.fullName,
        "phone": payload.phone,
        "role": "RECEPTIONIST",
        "isActive": True,
        "createdAt": now,
        "updatedAt": now,
    }
    user_res = db.users.insert_one(user_doc)

    rec_count = db.receptionists.count_documents({"hospitalId": hospital_id})
    rec_id = f"REC-{hospital_id[-3:]}-{str(rec_count + 1).zfill(3)}"

    rec_doc = {
        "receptionistId": rec_id,
        "userId": user_res.inserted_id,
        "hospitalId": hospital_id,
        "shift": payload.shift or "MORNING",
        "createdAt": now,
        "updatedAt": now,
    }
    db.receptionists.insert_one(rec_doc)

    log_audit(
        action="ADD_RECEPTIONIST",
        resource_type="Receptionist",
        user_id=current_user.id,
        user_role=current_user.role,
        hospital_id=hospital_id,
        resource_id=rec_id,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={"receptionistName": payload.fullName, "email": email}
    )

    user_doc["_id"] = str(user_doc["_id"])
    rec_doc["_id"] = str(rec_doc["_id"])
    rec_doc["userId"] = str(rec_doc["userId"])

    return {
        "success": True,
        "message": "Receptionist added successfully",
        "data": {"user": user_doc, "receptionistProfile": rec_doc}
    }

@router.get("/patients")
def list_hospital_patients(search: Optional[str] = Query(None), current_user: AuthenticatedUser = Depends(require_roles("HOSPITAL_ADMIN", "RECEPTIONIST", "DOCTOR"))):
    hospital_id = current_user.hospitalId
    if not hospital_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"success": False, "message": "Hospital context required.", "code": "FORBIDDEN"})

    db = get_db()
    query = {"hospitalId": hospital_id}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"phone": {"$regex": search, "$options": "i"}},
            {"patientId": {"$regex": search, "$options": "i"}},
        ]

    patients = list(db.patients.find(query).sort("createdAt", -1))
    formatted = []
    for p in patients:
        assigned_doc_name = p.get("assignedDoctorName") or "Dr. Priya Sharma"
        if p.get("assignedDoctorId") and not p.get("assignedDoctorName"):
            doc = db.doctors.find_one({"doctorId": p["assignedDoctorId"]})
            if doc:
                user = db.users.find_one({"_id": doc["userId"]})
                if user:
                    assigned_doc_name = user.get("fullName", assigned_doc_name)

        apt_count = db.appointments.count_documents({"hospitalId": hospital_id, "patientId": p["patientId"]})
        rep_count = db.medicalreports.count_documents({"hospitalId": hospital_id, "patientId": p["patientId"]})
        rx_count = db.prescriptions.count_documents({"hospitalId": hospital_id, "patientId": p["patientId"]})

        formatted.append({
            "id": p["patientId"],
            "patientId": p["patientId"],
            "gender": p.get("gender"),
            "bloodGroup": p.get("bloodGroup"),
            "emergencyContact": p.get("emergencyContact"),
            "user": {
                "fullName": p.get("name"),
                "email": p.get("email"),
                "phone": p.get("phone"),
            },
            "assignedDoctor": {
                "user": {"fullName": assigned_doc_name}
            },
            "_count": {
                "appointments": apt_count,
                "medicalReports": rep_count,
                "prescriptions": rx_count,
            }
        })

    return {"success": True, "data": formatted}

@router.get("/departments")
def list_hospital_departments(current_user: AuthenticatedUser = Depends(require_roles("HOSPITAL_ADMIN", "DOCTOR", "RECEPTIONIST"))):
    hospital_id = current_user.hospitalId
    if not hospital_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"success": False, "message": "Hospital context required.", "code": "FORBIDDEN"})

    db = get_db()
    departments = list(db.departments.find({"hospitalId": hospital_id}))
    formatted = []
    for d in departments:
        doc_count = db.doctors.count_documents({"hospitalId": hospital_id, "departmentId": d["departmentId"]})
        apt_count = db.appointments.count_documents({"hospitalId": hospital_id, "departmentId": d["departmentId"]})
        formatted.append({
            "id": d["departmentId"],
            "name": d["name"],
            "description": d.get("description"),
            "_count": {
                "doctors": doc_count,
                "appointments": apt_count,
            }
        })

    return {"success": True, "data": formatted}

@router.post("/departments")
def create_hospital_department(payload: DepartmentCreateRequest, current_user: AuthenticatedUser = Depends(require_roles("HOSPITAL_ADMIN"))):
    hospital_id = current_user.hospitalId
    if not hospital_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"success": False, "message": "Hospital context required.", "code": "FORBIDDEN"})

    if not payload.name or not payload.name.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"success": False, "message": "Department name is required.", "code": "VALIDATION_ERROR"})

    db = get_db()
    dept_count = db.departments.count_documents({"hospitalId": hospital_id})
    dept_id = f"DEPT-{hospital_id[-3:]}-{str(dept_count + 1).zfill(3)}"
    now = datetime.now(timezone.utc)

    dept_doc = {
        "departmentId": dept_id,
        "hospitalId": hospital_id,
        "name": payload.name.strip(),
        "description": payload.description,
        "status": "ACTIVE",
        "createdAt": now,
        "updatedAt": now,
    }
    db.departments.insert_one(dept_doc)
    dept_doc["_id"] = str(dept_doc["_id"])

    return {"success": True, "message": "Department created successfully", "data": dept_doc}
