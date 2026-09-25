from fastapi import APIRouter, HTTPException, Depends, status, Request
from bson import ObjectId
from app.models.schemas import LoginRequest
from app.core.database import get_db
from app.core.security import verify_password, create_access_token, create_refresh_token
from app.middleware.auth import get_current_user, AuthenticatedUser
from app.services.audit_service import log_audit

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
def login(payload: LoginRequest, request: Request):
    db = get_db()
    email = payload.email.lower().strip()
    user = db.users.find_one({"email": email})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "message": "Invalid credentials.", "code": "UNAUTHORIZED"}
        )

    if not user.get("isActive", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"success": False, "message": "Your account has been deactivated.", "code": "FORBIDDEN"}
        )

    hospital = None
    if user.get("hospitalId"):
        hospital = db.hospitals.find_one({"hospitalId": user["hospitalId"]})
        if hospital and hospital.get("status") == "SUSPENDED":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"success": False, "message": "Hospital organization is currently suspended. Please contact platform support.", "code": "FORBIDDEN"}
            )

    if not verify_password(payload.password, user["passwordHash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "message": "Invalid credentials.", "code": "UNAUTHORIZED"}
        )

    user_id_str = str(user["_id"])
    token_payload = {
        "id": user_id_str,
        "email": user["email"],
        "role": user["role"],
        "hospitalId": user.get("hospitalId"),
    }

    access_token = create_access_token(token_payload)
    refresh_token = create_refresh_token(token_payload)

    # Find profile ID
    profile_id = None
    if user["role"] == "DOCTOR":
        doc = db.doctors.find_one({"userId": user["_id"]})
        profile_id = doc.get("doctorId") if doc else None
    elif user["role"] == "PATIENT":
        pat = db.patients.find_one({"userId": user["_id"]})
        profile_id = pat.get("patientId") if pat else None
    elif user["role"] == "RECEPTIONIST":
        rec = db.receptionists.find_one({"userId": user["_id"]})
        profile_id = rec.get("receptionistId") if rec else None

    # Audit log
    log_audit(
        action="LOGIN",
        resource_type="User",
        user_id=user_id_str,
        user_role=user["role"],
        hospital_id=user.get("hospitalId"),
        resource_id=user_id_str,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )

    return {
        "success": True,
        "message": "Login successful",
        "data": {
            "user": {
                "id": user_id_str,
                "email": user["email"],
                "fullName": user["fullName"],
                "role": user["role"],
                "hospitalId": user.get("hospitalId"),
                "hospitalName": hospital.get("name") if hospital else None,
                "profileId": profile_id,
                "phone": user.get("phone"),
            },
            "accessToken": access_token,
            "refreshToken": refresh_token,
        }
    }

@router.get("/me")
def get_current_user_profile(current_user: AuthenticatedUser = Depends(get_current_user)):
    db = get_db()
    try:
        user = db.users.find_one({"_id": ObjectId(current_user.id)})
    except Exception:
        user = db.users.find_one({"_id": current_user.id})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"success": False, "message": "User not found.", "code": "NOT_FOUND"}
        )

    hospital = None
    if user.get("hospitalId"):
        hospital = db.hospitals.find_one({"hospitalId": user["hospitalId"]})
        if hospital:
            hospital["_id"] = str(hospital["_id"])

    doctor_profile = None
    patient_profile = None
    receptionist_profile = None

    if user["role"] == "DOCTOR":
        doctor_profile = db.doctors.find_one({"userId": user["_id"]})
        if doctor_profile:
            doctor_profile["_id"] = str(doctor_profile["_id"])
            doctor_profile["userId"] = str(doctor_profile["userId"])
    elif user["role"] == "PATIENT":
        patient_profile = db.patients.find_one({"userId": user["_id"]})
        if patient_profile:
            patient_profile["_id"] = str(patient_profile["_id"])
            patient_profile["userId"] = str(patient_profile["userId"])
    elif user["role"] == "RECEPTIONIST":
        receptionist_profile = db.receptionists.find_one({"userId": user["_id"]})
        if receptionist_profile:
            receptionist_profile["_id"] = str(receptionist_profile["_id"])
            receptionist_profile["userId"] = str(receptionist_profile["userId"])

    profile_id = (
        (doctor_profile.get("doctorId") if doctor_profile else None) or
        (patient_profile.get("patientId") if patient_profile else None) or
        (receptionist_profile.get("receptionistId") if receptionist_profile else None)
    )

    return {
        "success": True,
        "data": {
            "id": str(user["_id"]),
            "email": user["email"],
            "fullName": user["fullName"],
            "role": user["role"],
            "hospitalId": user.get("hospitalId"),
            "hospital": hospital,
            "phone": user.get("phone"),
            "profileId": profile_id,
            "doctorProfile": doctor_profile,
            "patientProfile": patient_profile,
            "receptionistProfile": receptionist_profile,
        }
    }

@router.post("/logout")
def logout(request: Request, current_user: AuthenticatedUser = Depends(get_current_user)):
    log_audit(
        action="LOGOUT",
        resource_type="User",
        user_id=current_user.id,
        user_role=current_user.role,
        hospital_id=current_user.hospitalId,
        resource_id=current_user.id,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )
    return {
        "success": True,
        "message": "Successfully logged out.",
        "data": {"loggedOut": True}
    }
