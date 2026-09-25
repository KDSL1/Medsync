import os
import sys
import pytest
from fastapi.testclient import TestClient

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.ai.safety import run_safety_check

client = TestClient(app)

@pytest.fixture(scope="module")
def auth_tokens():
    # Login as Super Admin
    res_sa = client.post("/api/auth/login", json={
        "email": "superadmin@demo.com",
        "password": "password123"
    })
    assert res_sa.status_code == 200, f"Super admin login failed: {res_sa.text}"
    sa_token = res_sa.json()["data"]["accessToken"]

    # Login as Hospital Admin
    res_ha = client.post("/api/auth/login", json={
        "email": "admin@sunrisehospital.demo",
        "password": "Admin@12345"
    })
    assert res_ha.status_code == 200, f"Hospital admin login failed: {res_ha.text}"
    ha_token = res_ha.json()["data"]["accessToken"]

    # Login as Doctor
    res_doc = client.post("/api/auth/login", json={
        "email": "arjun.mehta@sunrisehospital.demo",
        "password": "Doctor@12345"
    })
    assert res_doc.status_code == 200, f"Doctor login failed: {res_doc.text}"
    doc_token = res_doc.json()["data"]["accessToken"]

    # Login as Receptionist
    res_rec = client.post("/api/auth/login", json={
        "email": "kavya.reddy@sunrisehospital.demo",
        "password": "Reception@12345"
    })
    assert res_rec.status_code == 200, f"Receptionist login failed: {res_rec.text}"
    rec_token = res_rec.json()["data"]["accessToken"]

    # Login as Patient
    res_pat = client.post("/api/auth/login", json={
        "email": "patient001@sunrisehospital.demo",
        "password": "Patient@12345"
    })
    assert res_pat.status_code == 200, f"Patient login failed: {res_pat.text}"
    pat_token = res_pat.json()["data"]["accessToken"]

    return {
        "super_admin": sa_token,
        "hospital_admin": ha_token,
        "doctor": doc_token,
        "receptionist": rec_token,
        "patient": pat_token,
    }

def test_super_admin_dashboard(auth_tokens):
    """Test Super Admin dashboard aggregation metrics."""
    res = client.get("/api/super-admin/dashboard", headers={
        "Authorization": f"Bearer {auth_tokens['super_admin']}"
    })
    assert res.status_code == 200
    data = res.json()["data"]
    stats = data["stats"]
    assert stats["totalHospitals"] >= 1
    assert stats["totalDoctors"] >= 8
    assert stats["totalPatients"] >= 20

def test_super_admin_clinical_reports_access_guard(auth_tokens):
    """Super Admin must NOT have direct access to patient clinical reports."""
    res = client.get("/api/reports", headers={
        "Authorization": f"Bearer {auth_tokens['super_admin']}"
    })
    assert res.status_code == 403

def test_receptionist_prescription_block(auth_tokens):
    """Receptionist cannot create prescriptions (403 Forbidden)."""
    res = client.post("/api/prescriptions", headers={
        "Authorization": f"Bearer {auth_tokens['receptionist']}"
    }, json={
        "patientId": "PAT-DEMO-001",
        "diagnosis": "Test Diagnosis",
        "medicines": []
    })
    assert res.status_code == 403

def test_patient_prescription_block(auth_tokens):
    """Patient cannot create prescriptions (403 Forbidden)."""
    res = client.post("/api/prescriptions", headers={
        "Authorization": f"Bearer {auth_tokens['patient']}"
    }, json={
        "patientId": "PAT-DEMO-001",
        "diagnosis": "Self Prescription Attempt",
        "medicines": []
    })
    assert res.status_code == 403

def test_patient_own_medicines_access(auth_tokens):
    """Patient can access their own prescribed medicine schedule."""
    res = client.get("/api/medicines", headers={
        "Authorization": f"Bearer {auth_tokens['patient']}"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)

def test_patient_unauthorized_report_access_guard(auth_tokens):
    """Patient attempting to view non-existent or other patient report receives 403 or 404."""
    res = client.get("/api/reports/REP-UNKNOWN-999", headers={
        "Authorization": f"Bearer {auth_tokens['patient']}"
    })
    assert res.status_code in [403, 404]

# AI Safety Layer Tests
def test_ai_safety_emergency_detection():
    result = run_safety_check("I am having severe crushing chest pain and cannot breathe")
    assert result["isEmergency"] is True
    assert result["isSafe"] is False
    assert "MEDICAL EMERGENCY NOTICE" in result["warningMessage"]

def test_ai_safety_dosage_change_block():
    result = run_safety_check("Should I stop taking my metformin dose because my stomach hurts?")
    assert result["isDosageChangeRequest"] is True
    assert result["isSafe"] is False
    assert "MEDICATION SAFETY NOTICE" in result["warningMessage"]

def test_ai_safety_educational_lab_query():
    result = run_safety_check("What does an HbA1c value of 7.8% mean?")
    assert result["isEmergency"] is False
    assert result["isDosageChangeRequest"] is False
    assert result["isSafe"] is True
