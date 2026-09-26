# Medsync — AI Healthcare Assistant & Hospital Management Platform

A production-ready healthcare technology platform connecting hospitals, doctors, and patients while making medical information intuitive and easy to understand. Powered by a **FastAPI + PyMongo** backend on **MongoDB Atlas**, a **React + TypeScript + PWA** web application, and a **Capacitor Android** mobile app.

---

## 🏛️ Comprehensive Architecture

```text
                         ┌──────────────────────┐
                         │  PUBLIC MARKETING    │
                         │      WEBSITE         │
                         └──────────┬───────────┘
                                    │
                              Login / Signup
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   REACT WEB APP      │
                         │     + PWA            │
                         └──────────┬───────────┘
                                    │
                         ┌──────────▼───────────┐
                         │      CAPACITOR       │
                         │   Android Wrapper    │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    ANDROID STUDIO    │
                         │   (app/src/main)     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     FASTAPI          │
                         │      BACKEND         │
                         └──────────┬───────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     ▼                             ▼
              MongoDB Atlas                 Python AI/ML
       (healthcare_ai_demo)            (OCR, RAG, Safety)
```

---

## 🚀 Key Features

1. **Public Marketing Website** (`/`):
   - Hero: *"Smarter Healthcare. Simpler for Everyone."*
   - Problem & Solution cards: Addressing cryptic reports, missed medications, and fragmented hospital operations.
   - Interactive Solutions Tabs: Custom experiences for Patients, Doctors, and Hospitals.
   - Interactive FAQ, safety banners, and Android installation showcase.

2. **Authenticated Healthcare Portals** (`/app/*`):
   - **Super Admin** (`/app/super-admin`): Multi-tenant oversight, aggregate metrics, zero-PHI privacy enforcement.
   - **Hospital Admin** (`/app/hospital-admin`): Single-tenant management of staff, patients, departments, and beds.
   - **Doctor Portal** (`/app/doctor`): Daily consultation queue, electronic prescriptions, lab analysis reviews.
   - **Receptionist Portal** (`/app/receptionist`): Patient intake, token queues, doctor appointment scheduling.
   - **Patient Portal** (`/app/patient`): Lab report uploader, medicine schedule reminders, and conversational AI assistant.

3. **Clinical AI & Safety Guardrails**:
   - Automated OCR & biomarker extraction (Hemoglobin, Glucose, Creatinine, etc.).
   - RAG-powered plain-English explanations with source attribution badges.
   - Hardcoded safety guard: strictly blocks medical diagnosis and dosage changes. Emergency red flags trigger instant emergency care advisories.
   - Persistent safety notice: *"AI assists understanding. Doctors make medical decisions."*

4. **Progressive Web App (PWA) & Mobile Bottom Nav**:
   - `manifest.webmanifest` configured with mobile viewport settings (`viewport-fit=cover`).
   - Mobile-responsive bottom bar navigation for fast thumb-reach navigation on phones and tablets.

5. **Android App (Capacitor + Android Studio)**:
   - Package ID: `com.medsync.healthcare`
   - Android native project generated in `apps/web/android`.
   - Android hardware back-button listener integrated via `@capacitor/app`.
   - Cleartext traffic enabled for local development and Android emulator loopback (`10.0.2.2`).

---

## 🔑 Demo Login Accounts

| Role | Name | Email | Password |
|---|---|---|---|
| **Super Admin** | Platform Director | `superadmin@demo.com` | `password123` |
| **Hospital Admin** | Dr. Ananya Rao | `admin@sunrisehospital.demo` | `Admin@12345` |
| **Doctor** | Dr. Arjun Mehta | `arjun.mehta@sunrisehospital.demo` | `Doctor@12345` |
| **Receptionist** | Kavya Reddy | `kavya.reddy@sunrisehospital.demo` | `Reception@12345` |
| **Patient** | Rajesh Kumar | `patient001@sunrisehospital.demo` | `Patient@12345` |

---

## 💻 Quickstart Commands

### 1. Run Web & Backend (Development)
```bash
# Starts FastAPI backend (port 8000) and React frontend (port 5173) concurrently
npm run dev
```

### 2. Run Tests
```bash
# Runs full pytest RBAC, Multi-tenancy, and AI Safety suite
npm run test
```

### 3. Build Web Application & Sync to Android
```bash
# 1. Build React Web App
npm --prefix apps/web run build

# 2. Sync web assets into Android Studio project
npx --prefix apps/web cap sync android

# 3. Open project directly in Android Studio
npx --prefix apps/web cap open android
```

---

## 📱 Android Studio Build & Deployment

### Opening in Android Studio
1. Launch **Android Studio**.
2. Select **Open an Existing Project** and choose:
   `D:\Medsync\apps\web\android`
3. Allow Gradle to sync dependencies.

### Generating Debug APK
From Android Studio:
- Click **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
- Or via terminal:
  ```powershell
  cd apps/web/android
  ./gradlew assembleDebug
  ```
  The generated APK will be at: `apps/web/android/app/build/outputs/apk/debug/app-debug.apk`.

### Generating Release AAB (Google Play)
1. In Android Studio, select **Build** > **Generate Signed Bundle / APK**.
2. Select **Android App Bundle (AAB)** and follow the signing wizard.
