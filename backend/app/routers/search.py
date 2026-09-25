from fastapi import APIRouter, Depends, Query
import re
from bson import ObjectId
from app.core.database import get_db
from app.middleware.auth import get_current_user, AuthenticatedUser

router = APIRouter(prefix="/search", tags=["search"])

@router.get("")
def global_search(q: str = Query(""), current_user: AuthenticatedUser = Depends(get_current_user)):
    search_text = q.strip()
    if not search_text:
        return {"success": True, "data": {"results": []}}

    db = get_db()
    regex = {"$regex": re.escape(search_text), "$options": "i"}
    results = []

    if current_user.role == "SUPER_ADMIN":
        hospitals = list(db.hospitals.find({
            "$or": [
                {"name": regex},
                {"code": regex},
                {"location": regex},
                {"hospitalId": regex},
            ]
        }).limit(10))

        for h in hospitals:
            results.append({
                "type": "hospital",
                "id": h.get("hospitalId"),
                "title": h.get("name"),
                "subtitle": f"ID: {h.get('hospitalId')} • Status: {h.get('status')}"
            })
    elif current_user.role in ["HOSPITAL_ADMIN", "RECEPTIONIST", "DOCTOR"]:
        hospital_id = current_user.hospitalId or ""
        patients = list(db.patients.find({
            "hospitalId": hospital_id,
            "$or": [
                {"name": regex},
                {"email": regex},
                {"phone": regex},
                {"patientId": regex},
            ]
        }).limit(5))

        for p in patients:
            results.append({
                "type": "patient",
                "id": p.get("patientId"),
                "title": p.get("name"),
                "subtitle": f"ID: {p.get('patientId')} • Blood: {p.get('bloodGroup', 'N/A')}"
            })

        doctors = list(db.doctors.find({
            "hospitalId": hospital_id,
            "$or": [
                {"specialization": regex},
                {"licenseNumber": regex},
                {"departmentName": regex},
                {"doctorId": regex},
            ]
        }).limit(5))

        for d in doctors:
            user = db.users.find_one({"_id": d["userId"]})
            results.append({
                "type": "doctor",
                "id": d.get("doctorId"),
                "title": user.get("fullName", "Dr. Doctor") if user else "Dr. Doctor",
                "subtitle": f"{d.get('specialization')} ({d.get('departmentName', 'General')})"
            })
    elif current_user.role == "PATIENT":
        pat = db.patients.find_one({"userId": current_user.id})
        if not pat:
            try:
                pat = db.patients.find_one({"userId": ObjectId(current_user.id)})
            except Exception:
                pass

        if pat:
            pat_id = pat["patientId"]
            reports = list(db.medicalreports.find({"patientId": pat_id, "title": regex}).limit(5))
            for r in reports:
                results.append({
                    "type": "report",
                    "id": r.get("reportId"),
                    "title": r.get("title"),
                    "subtitle": f"Category: {r.get('category')}"
                })

            meds = list(db.medicineschedules.find({"patientId": pat_id, "medicineName": regex}).limit(5))
            for m in meds:
                results.append({
                    "type": "medicine",
                    "id": m.get("medicineScheduleId"),
                    "title": m.get("medicineName"),
                    "subtitle": f"{m.get('dosage')} - {m.get('frequency')}"
                })

    return {"success": True, "data": {"results": results}}
