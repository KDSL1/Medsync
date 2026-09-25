import re
from typing import Dict, Any, Optional

EMERGENCY_KEYWORDS = [
    'chest pain', 'heart attack', 'shortness of breath', 'cannot breathe', 'difficulty breathing',
    'stroke', 'unconscious', 'fainted', 'bleeding heavily', 'severe trauma', 'suicide', 'suicidal',
    'anaphylaxis', 'choking', 'overdose', 'poisoning', 'seizure', 'severe allergic reaction'
]

DOSAGE_CHANGE_PATTERNS = [
    re.compile(r"should i (stop|quit|increase|decrease|double|skip|change) (my|the)? (dose|dosage|medicine|medication|pill)", re.IGNORECASE),
    re.compile(r"can i take (more|less|double|extra|2|3) (pills|tablets|dose)", re.IGNORECASE),
    re.compile(r"should i stop taking", re.IGNORECASE),
    re.compile(r"stopped taking my", re.IGNORECASE),
    re.compile(r"increase my dose", re.IGNORECASE),
    re.compile(r"decrease my dose", re.IGNORECASE)
]

DIAGNOSIS_PATTERNS = [
    re.compile(r"do i have (cancer|diabetes|hiv|a tumor|leukemia|stroke|pneumonia)", re.IGNORECASE),
    re.compile(r"diagnose me", re.IGNORECASE),
    re.compile(r"what disease do i have", re.IGNORECASE),
    re.compile(r"is this (cancer|a malignant tumor)", re.IGNORECASE)
]

def run_safety_check(user_query: str) -> Dict[str, Any]:
    query_lower = user_query.lower()

    # 1. Emergency detection
    for kw in EMERGENCY_KEYWORDS:
        if kw in query_lower:
            return {
                "isSafe": False,
                "isEmergency": True,
                "isDosageChangeRequest": False,
                "isDiagnosisRequest": False,
                "warningMessage": "⚠️ MEDICAL EMERGENCY NOTICE: If you are experiencing acute chest pain, severe shortness of breath, heavy bleeding, or other severe symptoms, please immediately call your local emergency services (e.g. 911/112) or go to the nearest emergency room. This assistant cannot evaluate emergencies."
            }

    # 2. Medication / dosage modification attempts
    for pattern in DOSAGE_CHANGE_PATTERNS:
        if pattern.search(user_query):
            return {
                "isSafe": False,
                "isEmergency": False,
                "isDosageChangeRequest": True,
                "isDiagnosisRequest": False,
                "warningMessage": "⚠️ MEDICATION SAFETY NOTICE: Never adjust, start, or discontinue any prescribed medication or dosage without direct consultation and approval from your prescribing doctor. Changing your dosage without medical guidance can lead to serious health complications."
            }

    # 3. Diagnosis inquiry
    for pattern in DIAGNOSIS_PATTERNS:
        if pattern.search(user_query):
            return {
                "isSafe": True,
                "isEmergency": False,
                "isDosageChangeRequest": False,
                "isDiagnosisRequest": True,
                "warningMessage": "Notice: As an AI assistant, I can provide general medical information but I cannot diagnose medical conditions. Diagnoses require comprehensive clinical assessment, tests, and physical examination by your physician."
            }

    return {
        "isSafe": True,
        "isEmergency": False,
        "isDosageChangeRequest": False,
        "isDiagnosisRequest": False,
    }

def sanitize_ai_response(response: str) -> str:
    resp_lower = response.lower()
    if 'consult' not in resp_lower and 'doctor' not in resp_lower:
        response += "\n\n*Educational reminder: Please consult your doctor for personalized clinical advice.*"
    return response
