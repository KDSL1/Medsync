# AI Safety Framework & Clinical Guardrails

## Core Principle
The AI Assistant acts as a **communication and patient-understanding layer**, not a diagnostic authority or substitute for medical professionals.

```
DOCTOR
  ↓ (Clinical Diagnoses & Prescriptions)
AI HEALTHCARE ASSISTANT
  ↓ (Simplification, Translation, Medication Schedule Reminders)
PATIENT
```

## Guardrails Implemented

### 1. Emergency Detection
- **Trigger**: Queries containing acute medical distress terms (e.g. *severe chest pain*, *cannot breathe*, *heavy bleeding*, *stroke*, *fainting*).
- **Enforcement**: Blocks standard answering and returns an explicit **Medical Emergency Notice** directing the user to dial 911/112 or visit an emergency room immediately.

### 2. Dosage Modification Prevention
- **Trigger**: Requests asking to stop, increase, decrease, or skip prescribed medication dosages.
- **Enforcement**: Blocks recommendation and emphasizes: *"Never adjust, start, or discontinue any prescribed medication without direct consultation from your prescribing doctor."*

### 3. Diagnostic Boundaries
- **Enforcement**: Explicitly declares that laboratory findings, test values, and explanations do not constitute clinical diagnoses. Prompts patients to bring structured questions to their next appointment.

### 4. Verified Source Attributions
The AI chat assistant categorizes information sources into clear badges:
- `[From your report]`: Data derived directly from uploaded laboratory documents.
- `[General information]`: Standard educational context on health concepts and medications.
- `[Your doctor's instruction]`: Direct instructions and prescriptions entered by attending physicians.
