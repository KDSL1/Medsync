# 4-Tier Architecture Overview

The **Medsync AI Healthcare Assistant & Hospital Management Platform** is engineered following a 4-tier enterprise architecture ensuring security, tenant isolation, clinical governance, and AI safety.

```
       Tier 1: Presentation Layer (React + Vite + Tailwind CSS + Recharts)
                                      ↓
       Tier 2: Application & Gateway Layer (Node.js + Express + TypeScript)
                                      ↓
       Tier 3: Business & AI Services Layer (OCR + AI Safety Guard + RAG)
                                      ↓
       Tier 4: Data & Infrastructure Layer (PostgreSQL / SQLite + Prisma ORM)
```

## Tier 1: Presentation Layer
- **Portals**:
  1. `SuperAdminPortal`: Platform health, tenant onboarding, suspension, platform-level analytics.
  2. `HospitalAdminPortal`: Doctors, receptionists, patients, and clinical departments management.
  3. `DoctorPortal`: Live queue, patient medical history, consultation notes, structured prescriptions, follow-ups.
  4. `ReceptionistPortal`: Patient check-in, token assignment, doctor availability, appointment booking.
  5. `PatientPortal`: Mobile-responsive dashboard, medicine schedules (Taken/Skipped/Snooze), OCR report explanations, and contextual AI chat assistant.

## Tier 2: Application / API Layer
- **Authentication**: JWT access tokens (12h) + refresh tokens (7d).
- **Tenant Isolation**: Strict `hospitalId` enforcement on every mutating and query endpoint.
- **RBAC**: Guard middleware for 5 distinct roles (`SUPER_ADMIN`, `HOSPITAL_ADMIN`, `DOCTOR`, `RECEPTIONIST`, `PATIENT`).
- **Audit Logging**: Every sensitive action (login, logout, viewing records, prescribing drugs, uploading reports) is written to the immutable `AuditLog` table.

## Tier 3: Business & AI Services Layer
- **AI Safety Guard**:
  - Detects emergency keywords (chest pain, shortness of breath) -> Returns emergency guidance.
  - Blocks requests to modify, discontinue, or alter medication dosages.
  - Enforces medical disclaimers on all outputs.
- **OCR Pipeline**: `tesseract.js` image & PDF text recognition with laboratory parameter matching (HbA1c, glucose, cholesterol, creatinine).
- **Context RAG**: Queries authorized patient documents only, generating source attributions:
  - `[From your report]`
  - `[General information]`
  - `[Your doctor's instruction]`

## Tier 4: Data & Infrastructure Layer
- **ORM**: Prisma Client with UUID primary keys and relational foreign keys.
- **Database**: Production PostgreSQL (`postgresql://...`) and local development SQLite (`file:./dev.db`).
