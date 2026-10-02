from fastapi import APIRouter, HTTPException, Depends, status, Request, UploadFile, File, Form
from datetime import datetime, timezone
import json
import os
import shutil
from typing import Optional
from bson import ObjectId
from app.core.config import settings
from app.core.database import get_db
from app.middleware.auth import get_current_user, AuthenticatedUser
from app.services.audit_service import log_audit
from app.ai.ocr import extract_text_from_document
from app.ai.llm import ai_service

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("")
def list_reports(current_user: AuthenticatedUser = Depends(get_current_user)):
    if current_user.role == "SUPER_ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"success": False, "message": "Access denied. Super Admin cannot access patient medical records.", "code": "FORBIDDEN"}
        )

    db = get_db()
    where_clause = {"hospitalId": current_user.hospitalId}

    if current_user.role == "PATIENT":
        pat = db.patients.find_one({"userId": current_user.id})
        if not pat:
            try:
                pat = db.patients.find_one({"userId": ObjectId(current_user.id)})
            except Exception:
                pass
        if pat:
            where_clause["patientId"] = pat["patientId"]

    reports = list(db.medicalreports.find(where_clause).sort("createdAt", -1))
    formatted = []
    for r in reports:
        patient = db.patients.find_one({"patientId": r["patientId"]})
        analysis = db.reportanalyses.find_one({"reportId": r["reportId"]})
        if analysis:
            analysis["_id"] = str(analysis["_id"])
            if isinstance(analysis.get("analyzedAt"), datetime):
                analysis["analyzedAt"] = analysis["analyzedAt"].isoformat()

        formatted.append({
            "id": r["reportId"],
            "reportId": r["reportId"],
            "title": r.get("title"),
            "category": r.get("category"),
            "fileUrl": r.get("fileUrl"),
            "createdAt": r["createdAt"].isoformat() if isinstance(r.get("createdAt"), datetime) else str(r.get("createdAt")),
            "extractedText": r.get("extractedText"),
            "patient": {
                "id": patient.get("patientId") if patient else "",
                "user": {"fullName": patient.get("name", "Patient") if patient else "Patient", "email": patient.get("email") if patient else ""}
            },
            "analysis": analysis,
        })

    return {"success": True, "data": formatted}

@router.get("/{id}")
def get_report_by_id(id: str, current_user: AuthenticatedUser = Depends(get_current_user)):
    db = get_db()
    report = db.medicalreports.find_one({"$or": [{"reportId": id}, {"_id": id}]})
    if not report and ObjectId.is_valid(id):
        report = db.medicalreports.find_one({"_id": ObjectId(id)})

    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"success": False, "message": "Report not found.", "code": "NOT_FOUND"})

    if current_user.role == "SUPER_ADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"success": False, "message": "Access denied. Super admin cannot view medical reports.", "code": "FORBIDDEN"})

    if current_user.role == "PATIENT":
        pat = db.patients.find_one({"userId": current_user.id})
        if not pat:
            try:
                pat = db.patients.find_one({"userId": ObjectId(current_user.id)})
            except Exception:
                pass
        if not pat or pat.get("patientId") != report.get("patientId"):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"success": False, "message": "Access denied. You cannot view another patient's report.", "code": "FORBIDDEN"})
    elif current_user.hospitalId != report.get("hospitalId"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"success": False, "message": "Access denied. Tenant isolation prevents cross-hospital report access.", "code": "FORBIDDEN"})

    patient = db.patients.find_one({"patientId": report["patientId"]})
    analysis = db.reportanalyses.find_one({"reportId": report["reportId"]})
    if analysis:
        analysis["_id"] = str(analysis["_id"])
        if isinstance(analysis.get("analyzedAt"), datetime):
            analysis["analyzedAt"] = analysis["analyzedAt"].isoformat()

    log_audit(
        action="VIEW_REPORT",
        resource_type="MedicalReport",
        user_id=current_user.id,
        user_role=current_user.role,
        hospital_id=current_user.hospitalId,
        resource_id=report["reportId"]
    )

    report["_id"] = str(report["_id"])
    if isinstance(report.get("createdAt"), datetime):
        report["createdAt"] = report["createdAt"].isoformat()

    return {
        "success": True,
        "data": {
            **report,
            "id": report["reportId"],
            "patient": {"user": {"fullName": patient.get("name") if patient else "Patient"}},
            "analysis": analysis,
        }
    }

@router.post("/upload")
def upload_report(
    title: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    patientId: Optional[str] = Form(None),
    file: UploadFile = File(...),
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    hospital_id = current_user.hospitalId
    if not hospital_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"success": False, "message": "Hospital context missing.", "code": "FORBIDDEN"})

    db = get_db()
    target_patient_id = patientId

    if current_user.role == "PATIENT":
        pat = db.patients.find_one({"userId": current_user.id})
        if not pat:
            try:
                pat = db.patients.find_one({"userId": ObjectId(current_user.id)})
            except Exception:
                pass
        if not pat:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"success": False, "message": "Patient profile not found.", "code": "NOT_FOUND"})
        target_patient_id = pat["patientId"]

    patient = db.patients.find_one({"$or": [{"patientId": target_patient_id}, {"_id": target_patient_id}]})
    if not patient or patient.get("hospitalId") != hospital_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"success": False, "message": "Patient belongs to a different hospital or does not exist.", "code": "FORBIDDEN"})

    # Save uploaded file
    os.makedirs(settings.STORAGE_DIR, exist_ok=True)
    filename = f"{int(datetime.now().timestamp())}_{file.filename}"
    file_path = os.path.join(settings.STORAGE_DIR, filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = os.path.getsize(file_path)
    ocr_result = extract_text_from_document(file_path, file.content_type or "application/pdf")

    report_count = db.medicalreports.count_documents({"hospitalId": hospital_id})
    report_id = f"REP-{hospital_id[-3:]}-{str(report_count + 1).zfill(3)}"
    now = datetime.now(timezone.utc)

    report_doc = {
        "reportId": report_id,
        "hospitalId": hospital_id,
        "patientId": patient["patientId"],
        "uploadedBy": current_user.id,
        "title": title or file.filename,
        "category": category or "LAB",
        "reportType": category or "LAB",
        "fileUrl": f"/uploads/{filename}",
        "fileName": file.filename,
        "mimeType": file.content_type or "application/pdf",
        "fileSize": file_size,
        "extractedText": ocr_result.get("text", ""),
        "status": "PROCESSED",
        "createdAt": now,
        "updatedAt": now,
    }
    db.medicalreports.insert_one(report_doc)

    # Run AI Report analysis
    analysis_data = ai_service.explain_report(ocr_result.get("text", ""), report_doc["title"])
    analysis_doc = {
        "reportId": report_id,
        "patientId": patient["patientId"],
        "hospitalId": hospital_id,
        "summary": analysis_data["summary"],
        "keyFindings": [f"{k['parameter']}: {k['value']} ({k['status']})" for k in analysis_data.get("keyValues", [])],
        "keyValuesJson": json.dumps(analysis_data.get("keyValues", [])),
        "whyItMatters": analysis_data.get("whyItMatters"),
        "questionsForDoctor": analysis_data.get("doctorQuestions", []),
        "disclaimer": analysis_data.get("disclaimer"),
        "aiModel": "medsync-ai-v1",
        "analyzedAt": now,
        "createdAt": now,
        "updatedAt": now,
    }
    db.reportanalyses.insert_one(analysis_doc)

    # Notify patient
    db.notifications.insert_one({
        "notificationId": f"NOTIF-{int(datetime.now().timestamp() * 1000)}",
        "userId": str(patient["userId"]),
        "patientId": patient["patientId"],
        "hospitalId": hospital_id,
        "type": "REPORT_READY",
        "title": "New Medical Report Explained",
        "message": f"Your report '{report_doc['title']}' has been scanned and converted into plain language.",
        "metadata": {"reportId": report_id},
        "isRead": False,
        "createdAt": now,
        "updatedAt": now,
    })

    log_audit(
        action="UPLOAD_REPORT",
        resource_type="MedicalReport",
        user_id=current_user.id,
        user_role=current_user.role,
        hospital_id=hospital_id,
        resource_id=report_id,
        metadata={"title": report_doc["title"], "category": report_doc["category"]}
    )

    report_doc["_id"] = str(report_doc["_id"])
    report_doc["createdAt"] = report_doc["createdAt"].isoformat()
    analysis_doc["_id"] = str(analysis_doc["_id"])
    analysis_doc["analyzedAt"] = analysis_doc["analyzedAt"].isoformat()

    return {
        "success": True,
        "message": "Report uploaded and analyzed successfully",
        "data": {"report": report_doc, "analysis": analysis_doc}
    }

@router.post("/{id}/analyze")
def analyze_report(id: str, current_user: AuthenticatedUser = Depends(get_current_user)):
    db = get_db()
    report = db.medicalreports.find_one({"$or": [{"reportId": id}, {"_id": id}]})
    if not report and ObjectId.is_valid(id):
        report = db.medicalreports.find_one({"_id": ObjectId(id)})

    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"success": False, "message": "Report not found.", "code": "NOT_FOUND"})

    if current_user.role == "PATIENT":
        pat = db.patients.find_one({"userId": current_user.id})
        if not pat:
            try:
                pat = db.patients.find_one({"userId": ObjectId(current_user.id)})
            except Exception:
                pass
        if not pat or pat.get("patientId") != report.get("patientId"):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"success": False, "message": "Forbidden.", "code": "FORBIDDEN"})

    explanation = ai_service.explain_report(report.get("extractedText", ""), report.get("title", "Medical Report"))
    now = datetime.now(timezone.utc)

    updated_analysis = db.reportanalyses.find_one_and_update(
        {"reportId": report["reportId"]},
        {"$set": {
            "summary": explanation["summary"],
            "keyFindings": [f"{k['parameter']}: {k['value']}" for k in explanation.get("keyValues", [])],
            "keyValuesJson": json.dumps(explanation.get("keyValues", [])),
            "whyItMatters": explanation.get("whyItMatters"),
            "questionsForDoctor": explanation.get("doctorQuestions", []),
            "disclaimer": explanation.get("disclaimer"),
            "analyzedAt": now,
            "updatedAt": now,
        }},
        upsert=True,
        return_document=True
    )

    updated_analysis["_id"] = str(updated_analysis["_id"])
    if isinstance(updated_analysis.get("analyzedAt"), datetime):
        updated_analysis["analyzedAt"] = updated_analysis["analyzedAt"].isoformat()

    return {"success": True, "message": "Report re-analyzed successfully", "data": updated_analysis}

@router.get("/trends/{patient_id}")
def get_biomarker_trends(patient_id: str, current_user: AuthenticatedUser = Depends(get_current_user)):
    """Extracts chronological biomarker data (e.g. Hemoglobin, Glucose, Creatinine) across patient reports."""
    if current_user.role == "SUPER_ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"success": False, "message": "Super Admin cannot view patient PHI.", "code": "FORBIDDEN"}
        )

    db = get_db()
    if current_user.role == "PATIENT":
        pat = db.patients.find_one({"userId": current_user.id})
        if not pat:
            try:
                pat = db.patients.find_one({"userId": ObjectId(current_user.id)})
            except Exception:
                pass
        if not pat or pat.get("patientId") != patient_id:
            raise HTTPException(status_code=403, detail="Access denied to other patients' records.")

    analyses = list(db.reportanalyses.find({"patientId": patient_id}).sort("analyzedAt", 1))
    if not analyses:
        # Fallback to finding reports for this patient then their analyses
        reports = list(db.medicalreports.find({"patientId": patient_id}))
        rep_ids = [r["reportId"] for r in reports]
        analyses = list(db.reportanalyses.find({"reportId": {"$in": rep_ids}}).sort("analyzedAt", 1))

    trends_map = {}
    for a in analyses:
        date_str = a.get("analyzedAt")
        if isinstance(date_str, datetime):
            date_str = date_str.strftime("%b %d, %Y")
        elif not date_str:
            date_str = "Recent"

        kv_json = a.get("keyValuesJson")
        if kv_json:
            try:
                kvs = json.loads(kv_json)
                for item in kvs:
                    param = item.get("parameter", "").strip()
                    val = item.get("value", "")
                    # Extract numeric value
                    import re
                    match = re.search(r"[-+]?\d*\.\d+|\d+", str(val))
                    if match:
                        num_val = float(match.group())
                        if param not in trends_map:
                            trends_map[param] = {
                                "parameter": param,
                                "unit": item.get("unit", ""),
                                "normalRange": item.get("normalRange", ""),
                                "dataPoints": []
                            }
                        trends_map[param]["dataPoints"].append({
                            "date": str(date_str),
                            "value": num_val,
                            "status": item.get("status", "NORMAL")
                        })
            except Exception:
                continue

    return {
        "success": True,
        "data": {
            "patientId": patient_id,
            "biomarkers": list(trends_map.values())
        }
    }

