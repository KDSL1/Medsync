# Medsync — AI Healthcare Assistant & Hospital Management Platform

A production-style, multi-tenant healthcare platform where an AI assistant acts as an educational and communication layer between patients and healthcare professionals, powered by a **Python + FastAPI** backend, **MongoDB Atlas (PyMongo)**, and a **React + TypeScript** frontend.

---

## 🏛️ System Architecture

```
React (TypeScript + Vite)
         │
         │ REST API (Base: http://localhost:8000/api)
         ▼
FastAPI (Python 3.13)
         │
         ▼
Python AI Services (OCR, RAG, Safety Guards)
         │
         ▼
MongoDB Atlas (PyMongo Database Layer)
```

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS (`apps/web`)
- **Backend**: Python 3.13 + FastAPI (`backend/`)
- **Database**: MongoDB Atlas (`healthcare_ai_demo`)
- **Driver**: PyMongo
- **AI & Safety**: Python RAG context builder, OCR pipeline, and medical guardrails

---

## 🏥 Demo Hospital: Sunrise Multispeciality Hospital

The platform is pre-configured with **Sunrise Multispeciality Hospital**:
- **Hospital Name**: Sunrise Multispeciality Hospital
- **Hospital ID**: `HOSP-DEMO-001`
- **Location**: Guntur, Andhra Pradesh, India
- **Type**: Multispeciality Hospital
- **Status**: `ACTIVE`
- **Departments (9)**: General Medicine, Cardiology, Neurology, Orthopedics, Pediatrics, Gynecology, Dermatology, Radiology, Pathology.

---

## 🔑 Demo Login Accounts (DEMO ACCOUNTS ONLY)

> [!NOTE]
> All credentials below are **DEMO ACCOUNTS ONLY** with passwords securely hashed with bcrypt in MongoDB:

| Role | Name / Identifier | Demo Email | Demo Password |
|---|---|---|---|
| **Super Admin** | Platform Director | `superadmin@demo.com` | `password123` |
| **Hospital Admin** | Dr. Ananya Rao | `admin@sunrisehospital.demo` | `Admin@12345` |
| **Doctor (Cardiology)** | Dr. Arjun Mehta | `arjun.mehta@sunrisehospital.demo` | `Doctor@12345` |
| **Doctor (General Med)** | Dr. Priya Sharma | `priya.sharma@sunrisehospital.demo` | `Doctor@12345` |
| **Doctor (Neurology)** | Dr. Rahul Verma | `rahul.verma@sunrisehospital.demo` | `Doctor@12345` |
| **Doctor (Gynecology)** | Dr. Sneha Reddy | `sneha.reddy@sunrisehospital.demo` | `Doctor@12345` |
| **Doctor (Orthopedics)** | Dr. Karthik Rao | `karthik.rao@sunrisehospital.demo` | `Doctor@12345` |
| **Doctor (Pediatrics)** | Dr. Meera Nair | `meera.nair@sunrisehospital.demo` | `Doctor@12345` |
| **Doctor (Dermatology)** | Dr. Vikram Singh | `vikram.singh@sunrisehospital.demo` | `Doctor@12345` |
| **Doctor (Radiology)** | Dr. Neha Kapoor | `neha.kapoor@sunrisehospital.demo` | `Doctor@12345` |
| **Receptionist 1** | Kavya Reddy | `kavya.reddy@sunrisehospital.demo` | `Reception@12345` |
| **Receptionist 2** | Rahul Kumar | `rahul.kumar@sunrisehospital.demo` | `Reception@12345` |
| **Receptionist 3** | Swathi Rao | `swathi.rao@sunrisehospital.demo` | `Reception@12345` |
| **Patient (PAT-DEMO-001)** | Aarav Sharma | `patient001@sunrisehospital.demo` | `Patient@12345` |
| **Patient (PAT-DEMO-002)** | Diya Patel | `patient002@sunrisehospital.demo` | `Patient@12345` |
| **Patients 003–020** | Patients 3 to 20 | `patient003@sunrisehospital.demo` ... `patient020@sunrisehospital.demo` | `Patient@12345` |

---

## 🍃 MongoDB Atlas Setup

To connect the platform to your MongoDB Atlas cluster:

1. **Create Cluster**: Go to [MongoDB Atlas](https://cloud.mongodb.com/) and create a cluster (M0 Free tier or dedicated).
2. **Create Database User**:
   - In **Database Access**, create a user with `Read and write to any database` privileges.
3. **Configure Network Access**:
   - In **Network Access**, add an IP Access List entry (e.g., `0.0.0.0/0` for development or your current IP).
4. **Obtain Connection String**:
   - Click **Connect** > **Drivers** > select **Python** (version 3.6 or later).
   - Copy the SRV URI format: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority`
5. **Configure Environment**:
   - Copy `.env.example` to `backend/.env`.
   - Set `MONGODB_URI=your_connection_string_here` (replace `<username>` and `<password>` with your database user credentials).
   - Database name is `healthcare_ai_demo`.
6. **Populate Demo Hospital Data**:
   ```bash
   python backend/scripts/seed_database.py
   ```

---

## 🚀 Local Setup & Development

### Backend Setup
1. Open terminal in `backend/` (or root):
   ```bash
   cd backend
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Linux/macOS:
   source venv/bin/activate
   ```
2. Install requirements:
   ```bash
   pip install -r requirements.txt email-validator
   ```
3. Create `.env` from `.env.example`:
   ```bash
   cp .env.example .env
   # Add MONGODB_URI=your_mongodb_connection_string
   ```
4. Start backend:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   Interactive Swagger documentation is available at `http://localhost:8000/docs`.

### Frontend Setup
1. Open terminal in `apps/web/`:
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```
   Web application starts on `http://localhost:5173`.

### Automated Security & Safety Tests
Run full pytest suite covering RBAC, tenant isolation, and AI safety checks:
```bash
npm test
# or
pytest backend/tests/test_rbac_safety.py -v
```
