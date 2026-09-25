from fastapi import APIRouter, HTTPException, Depends, status, Request
from datetime import datetime, timezone
import random
from app.models.schemas import HospitalCreateRequest, HospitalStatusUpdateRequest
from app.core.database import get_db
from app.core.security import hash_password
from app.middleware.auth import require_roles, AuthenticatedUser
from app.services.audit_service import log_audit

router = APIRouter(prefix="/super-admin", tags=["super-admin"])

@router.get("/dashboard")
def get_super_admin_dashboard(current_user: AuthenticatedUser = Depends(require_roles("SUPER_ADMIN"))):
    db = get_db()
    
    total_hospitals = db.hospitals.count_documents({})
    active_hospitals = db.hospitals.count_documents({"status": "ACTIVE"})
    total_doctors = db.users.count_documents({"role": "DOCTOR"})
    total_patients = db.users.count_documents({"role": "PATIENT"})
    total_receptionists = db.users.count_documents({"role": "RECEPTIONIST"})
    total_users = db.users.count_documents({})

    recent_hospitals_cursor = db.hospitals.find().sort("createdAt", -1).limit(5)
    formatted_recent = []
    for h in recent_hospitals_cursor:
        doc_count = db.doctors.count_documents({"hospitalId": h["hospitalId"]})
        pat_count = db.patients.count_documents({"hospitalId": h["hospitalId"]})
        rec_count = db.receptionists.count_documents({"hospitalId": h["hospitalId"]})
        formatted_recent.append({
            "id": h["hospitalId"],
            "name": h["name"],
            "code": h["code"],
            "address": h["address"],
            "phone": h["phone"],
            "status": h["status"],
            "createdAt": h.get("createdAt", datetime.now(timezone.utc)).isoformat() if isinstance(h.get("createdAt"), datetime) else str(h.get("createdAt")),
            "_count": {
                "doctors": doc_count,
                "patients": pat_count,
                "receptionists": rec_count,
            }
        })

    return {
        "success": True,
        "data": {
            "stats": {
                "totalHospitals": total_hospitals,
                "activeHospitals": active_hospitals,
                "totalDoctors": total_doctors,
                "totalPatients": total_patients,
                "totalReceptionists": total_receptionists,
                "totalUsers": total_users,
            },
            "charts": {
                "userGrowth": [
                    {"month": "Jan", "hospitals": 1, "doctors": 4, "patients": 8},
                    {"month": "Mar", "hospitals": 1, "doctors": 6, "patients": 12},
                    {"month": "May", "hospitals": 1, "doctors": 8, "patients": 16},
                    {"month": "Jul", "hospitals": 1, "doctors": 8, "patients": 18},
                    {"month": "Sep", "hospitals": 1, "doctors": total_doctors, "patients": total_patients},
                ],
                "hospitalsByStatus": [
                    {"name": "Active", "value": active_hospitals},
                    {"name": "Suspended", "value": total_hospitals - active_hospitals},
                ]
            },
            "recentHospitals": formatted_recent,
        }
    }

@router.get("/hospitals")
def list_hospitals(current_user: AuthenticatedUser = Depends(require_roles("SUPER_ADMIN"))):
    db = get_db()
    hospitals = list(db.hospitals.find().sort("createdAt", -1))
    
    formatted = []
    for h in hospitals:
        admin_user = db.users.find_one({"hospitalId": h["hospitalId"], "role": "HOSPITAL_ADMIN"})
        doc_count = db.doctors.count_documents({"hospitalId": h["hospitalId"]})
        pat_count = db.patients.count_documents({"hospitalId": h["hospitalId"]})
        rec_count = db.receptionists.count_documents({"hospitalId": h["hospitalId"]})

        formatted.append({
            "id": h["hospitalId"],
            "name": h["name"],
            "code": h["code"],
            "address": h["address"],
            "phone": h["phone"],
            "status": h["status"],
            "adminName": admin_user.get("fullName") if admin_user else "Unassigned",
            "adminEmail": admin_user.get("email") if admin_user else None,
            "doctorCount": doc_count,
            "patientCount": pat_count,
            "receptionistCount": rec_count,
            "createdAt": h.get("createdAt", datetime.now(timezone.utc)).isoformat() if isinstance(h.get("createdAt"), datetime) else str(h.get("createdAt")),
        })

    return {"success": True, "data": formatted}

@router.post("/hospitals")
def create_hospital(payload: HospitalCreateRequest, request: Request, current_user: AuthenticatedUser = Depends(require_roles("SUPER_ADMIN"))):
    db = get_db()
    
    if db.hospitals.find_one({"code": payload.code.upper()}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": "Hospital code already exists.", "code": "DUPLICATE_CODE"}
        )

    admin_email = payload.adminEmail.lower().strip()
    if db.users.find_one({"email": admin_email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": "Admin email already registered.", "code": "DUPLICATE_EMAIL"}
        )

    hospital_id = f"HOSP-{payload.code.upper()}-{random.randint(100, 999)}"
    now = datetime.now(timezone.utc)

    hospital_doc = {
        "hospitalId": hospital_id,
        "name": payload.name,
        "code": payload.code.upper(),
        "address": payload.address,
        "phone": payload.phone,
        "location": payload.location or "India",
        "type": "Multispeciality Hospital",
        "status": "ACTIVE",
        "createdAt": now,
        "updatedAt": now,
    }
    db.hospitals.insert_one(hospital_doc)

    pw_hash = hash_password(payload.adminPassword)
    admin_doc = {
        "hospitalId": hospital_id,
        "email": admin_email,
        "passwordHash": pw_hash,
        "fullName": payload.adminFullName,
        "role": "HOSPITAL_ADMIN",
        "phone": payload.phone,
        "isActive": True,
        "createdAt": now,
        "updatedAt": now,
    }
    res_admin = db.users.insert_one(admin_doc)

    log_audit(
        action="CREATE_HOSPITAL",
        resource_type="Hospital",
        user_id=current_user.id,
        user_role=current_user.role,
        resource_id=hospital_id,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={"hospitalName": payload.name, "adminEmail": admin_email}
    )

    hospital_doc["_id"] = str(hospital_doc["_id"])
    return {
        "success": True,
        "message": "Hospital and Admin created successfully",
        "data": {
            "hospital": hospital_doc,
            "adminUser": {"id": str(res_admin.inserted_id), "email": admin_email}
        }
    }

@router.patch("/hospitals/{id}/status")
def update_hospital_status(id: str, payload: HospitalStatusUpdateRequest, request: Request, current_user: AuthenticatedUser = Depends(require_roles("SUPER_ADMIN"))):
    if payload.status not in ["ACTIVE", "SUSPENDED", "PENDING"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": "Invalid hospital status.", "code": "VALIDATION_ERROR"}
        )

    db = get_db()
    hospital = db.hospitals.find_one_and_update(
        {"hospitalId": id},
        {"$set": {"status": payload.status, "updatedAt": datetime.now(timezone.utc)}},
        return_document=True
    )

    if not hospital:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"success": False, "message": "Hospital not found.", "code": "NOT_FOUND"}
        )

    log_audit(
        action="UPDATE_HOSPITAL_STATUS",
        resource_type="Hospital",
        user_id=current_user.id,
        user_role=current_user.role,
        resource_id=hospital["hospitalId"],
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={"newStatus": payload.status}
    )

    hospital["_id"] = str(hospital["_id"])
    return {
        "success": True,
        "message": f"Hospital status updated to {payload.status}",
        "data": hospital
    }

@router.get("/audit-logs")
def get_platform_audit_logs(current_user: AuthenticatedUser = Depends(require_roles("SUPER_ADMIN"))):
    db = get_db()
    logs = list(db.auditlogs.find().sort("timestamp", -1).limit(100))
    
    formatted = []
    for l in logs:
        hospital_name = "Platform"
        if l.get("hospitalId"):
            h = db.hospitals.find_one({"hospitalId": l["hospitalId"]})
            if h:
                hospital_name = h.get("name", "Hospital")

        formatted.append({
            "id": l.get("auditId"),
            "createdAt": l.get("timestamp", datetime.now(timezone.utc)).isoformat() if isinstance(l.get("timestamp"), datetime) else str(l.get("timestamp")),
            "userRole": l.get("role"),
            "action": l.get("action"),
            "resource": l.get("resourceType"),
            "user": {"fullName": l.get("role", "System")},
            "hospital": {"name": hospital_name},
        })

    return {"success": True, "data": formatted}
