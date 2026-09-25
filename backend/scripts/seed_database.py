import os
import sys
from datetime import datetime, timezone, timedelta
import random

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import db_manager, get_db
from app.core.security import hash_password

def seed_database():
    print("=" * 60)
    print("Medsync Python FastAPI — MongoDB Demo Hospital Seeder")
    print("=" * 60)

    db_manager.connect()
    db = get_db()

    print("Clearing collections in 'healthcare_ai_demo'...")
    collections = [
        "hospitals", "users", "doctors", "patients", "receptionists",
        "departments", "appointments", "consultations", "prescriptions",
        "medicineschedules", "medicalreports", "reportanalyses",
        "followups", "notifications", "auditlogs"
    ]
    for c in collections:
        db[c].delete_many({})

    default_admin_pw = hash_password("Admin@12345")
    default_doc_pw = hash_password("Doctor@12345")
    default_rec_pw = hash_password("Reception@12345")
    default_pat_pw = hash_password("Patient@12345")
    default_superadmin_pw = hash_password("password123")

    now = datetime.now(timezone.utc)

    # 1. Super Admin
    print("[1/10] Seeding Super Admin...")
    db.users.insert_one({
        "email": "superadmin@demo.com",
        "passwordHash": default_superadmin_pw,
        "role": "SUPER_ADMIN",
        "fullName": "Platform Director",
        "phone": "+91 98765 00000",
        "isActive": True,
        "createdAt": now,
        "updatedAt": now,
    })

    # 2. Main Demo Hospital
    print("[2/10] Seeding Sunrise Multispeciality Hospital...")
    hospital_id = "HOSP-DEMO-001"
    db.hospitals.insert_one({
        "hospitalId": hospital_id,
        "name": "Sunrise Multispeciality Hospital",
        "code": "SUNRISE-01",
        "location": "Guntur, Andhra Pradesh, India",
        "address": "Near Collectorate Circle, Main Road, Guntur, Andhra Pradesh 522004",
        "phone": "+91 863 223 4567",
        "type": "Multispeciality Hospital",
        "status": "ACTIVE",
        "createdAt": now,
        "updatedAt": now,
    })

    # 3. Hospital Admin
    print("[3/10] Seeding Hospital Admin...")
    db.users.insert_one({
        "hospitalId": hospital_id,
        "email": "admin@sunrisehospital.demo",
        "passwordHash": default_admin_pw,
        "role": "HOSPITAL_ADMIN",
        "fullName": "Dr. Ananya Rao",
        "phone": "+91 98480 11223",
        "isActive": True,
        "createdAt": now,
        "updatedAt": now,
    })

    # 4. 9 Clinical Departments
    print("[4/10] Seeding 9 Clinical Departments...")
    dept_specs = [
        ("General Medicine", "Primary care, fever, diabetes, lifestyle & acute illness management."),
        ("Cardiology", "Advanced heart disease prevention, ECG/Echo diagnostics, and hypertension."),
        ("Neurology", "Neurological assessments, migraine, epilepsy, and peripheral neuropathy care."),
        ("Orthopedics", "Bone fractures, joint replacements, arthritis, and musculoskeletal therapy."),
        ("Pediatrics", "Comprehensive neonatal, infant, and child developmental healthcare."),
        ("Gynecology", "Women’s reproductive wellness, maternity monitoring, and prenatal support."),
        ("Dermatology", "Clinical skin therapy, allergy patch testing, and hair-scalp treatments."),
        ("Radiology", "X-Ray, Ultrasound, CT scanning, and clinical imaging diagnostics."),
        ("Pathology", "Full automated lab analysis: Hematology, Biochemistry, and Serology."),
    ]
    for i, (d_name, d_desc) in enumerate(dept_specs, start=1):
        db.departments.insert_one({
            "departmentId": f"DEPT-{str(i).zfill(3)}",
            "hospitalId": hospital_id,
            "name": d_name,
            "description": d_desc,
            "status": "ACTIVE",
            "createdAt": now,
            "updatedAt": now,
        })

    # 5. 8 Doctors
    print("[5/10] Seeding 8 Doctors...")
    doctors_info = [
        ("Dr. Arjun Mehta", "arjun.mehta@sunrisehospital.demo", "Cardiology", "DEPT-002", "MBBS, MD, DM (Cardiology)", "14 Years", "AP-MED-55102", 600),
        ("Dr. Priya Sharma", "priya.sharma@sunrisehospital.demo", "General Medicine", "DEPT-001", "MBBS, MD (General Medicine)", "11 Years", "AP-MED-44918", 500),
        ("Dr. Rahul Verma", "rahul.verma@sunrisehospital.demo", "Neurology", "DEPT-003", "MBBS, MD, DM (Neurology)", "12 Years", "AP-MED-66231", 700),
        ("Dr. Sneha Reddy", "sneha.reddy@sunrisehospital.demo", "Gynecology", "DEPT-006", "MBBS, MS (OBG), DGO", "10 Years", "AP-MED-77182", 550),
        ("Dr. Karthik Rao", "karthik.rao@sunrisehospital.demo", "Orthopedics", "DEPT-004", "MBBS, MS (Orthopedics), MCh", "15 Years", "AP-MED-33490", 650),
        ("Dr. Meera Nair", "meera.nair@sunrisehospital.demo", "Pediatrics", "DEPT-005", "MBBS, MD (Pediatrics), DCH", "8 Years", "AP-MED-88219", 450),
        ("Dr. Vikram Singh", "vikram.singh@sunrisehospital.demo", "Dermatology", "DEPT-007", "MBBS, MD (DVL)", "9 Years", "AP-MED-99314", 500),
        ("Dr. Neha Kapoor", "neha.kapoor@sunrisehospital.demo", "Radiology", "DEPT-008", "MBBS, MD (Radiodiagnosis)", "13 Years", "AP-MED-22184", 500),
    ]

    doctor_docs = []
    for i, (d_name, d_email, d_spec, d_dept, d_qual, d_exp, d_lic, d_fee) in enumerate(doctors_info, start=1):
        u_res = db.users.insert_one({
            "hospitalId": hospital_id,
            "email": d_email,
            "passwordHash": default_doc_pw,
            "fullName": d_name,
            "phone": f"+91 98490 {str(10000 + i)}",
            "role": "DOCTOR",
            "isActive": True,
            "createdAt": now,
            "updatedAt": now,
        })
        d_id = f"DOC-{hospital_id[-3:]}-{str(i).zfill(3)}"
        doc_entry = {
            "doctorId": d_id,
            "userId": u_res.inserted_id,
            "hospitalId": hospital_id,
            "departmentId": d_dept,
            "departmentName": d_spec,
            "specialization": d_spec,
            "qualification": d_qual,
            "experience": d_exp,
            "licenseNumber": d_lic,
            "consultationFee": d_fee,
            "status": "ACTIVE",
            "createdAt": now,
            "updatedAt": now,
        }
        db.doctors.insert_one(doc_entry)
        doctor_docs.append(doc_entry)

    # 6. 3 Receptionists
    print("[6/10] Seeding 3 Receptionists...")
    recs_info = [
        ("Kavya Reddy", "kavya.reddy@sunrisehospital.demo", "MORNING"),
        ("Rahul Kumar", "rahul.kumar@sunrisehospital.demo", "EVENING"),
        ("Swathi Rao", "swathi.rao@sunrisehospital.demo", "NIGHT"),
    ]
    for i, (r_name, r_email, r_shift) in enumerate(recs_info, start=1):
        u_res = db.users.insert_one({
            "hospitalId": hospital_id,
            "email": r_email,
            "passwordHash": default_rec_pw,
            "fullName": r_name,
            "phone": f"+91 98485 {str(20000 + i)}",
            "role": "RECEPTIONIST",
            "isActive": True,
            "createdAt": now,
            "updatedAt": now,
        })
        db.receptionists.insert_one({
            "receptionistId": f"REC-{hospital_id[-3:]}-{str(i).zfill(3)}",
            "userId": u_res.inserted_id,
            "hospitalId": hospital_id,
            "shift": r_shift,
            "createdAt": now,
            "updatedAt": now,
        })

    # 7. 20 Patients
    print("[7/10] Seeding 20 Patients...")
    patients_data = [
        ("Aarav Sharma", 45, "MALE", "O+", "Type 2 Diabetes, Mild Hypertension"),
        ("Diya Patel", 32, "FEMALE", "B+", "Allergic Bronchitis"),
        ("Vihaan Reddy", 58, "MALE", "A+", "Coronary Artery Disease"),
        ("Ananya Verma", 28, "FEMALE", "AB+", "First Trimester Antenatal Routine"),
        ("Ishaan Gupta", 10, "MALE", "O-", "Pediatric Asthma"),
        ("Sanya Malhotra", 34, "FEMALE", "A-", "Chronic Migraine"),
        ("Rohan Kulkarni", 52, "MALE", "B+", "Lumbar Spondylosis"),
        ("Pooja Nair", 29, "FEMALE", "O+", "Contact Dermatitis"),
        ("Aditya Deshmukh", 64, "MALE", "O+", "Post-angioplasty Recovery"),
        ("Kavita Iyer", 41, "FEMALE", "B-", "Hypothyroidism, Anemia"),
        ("Manish Joshi", 49, "MALE", "A+", "Hyperlipidemia"),
        ("Tanvi Rao", 24, "FEMALE", "AB-", "Iron Deficiency Anemia"),
        ("Suresh Chandra", 67, "MALE", "B+", "Osteoarthritis Both Knees"),
        ("Meenal Shah", 38, "FEMALE", "O+", "Cervical Spondylosis"),
        ("Gautam Nambiar", 44, "MALE", "A+", "Early Stage Fatty Liver"),
        ("Divya Menon", 31, "FEMALE", "B+", "Gestational Diabetes Assessment"),
        ("Rajesh Pillai", 53, "MALE", "O+", "Essential Hypertension"),
        ("Sunita Saxena", 61, "FEMALE", "A-", "Post-menopausal Osteoporosis"),
        ("Varun Agarwal", 36, "MALE", "AB+", "Recurrent Acid Peptic Disease"),
        ("Harini Krishna", 27, "FEMALE", "O+", "Atopic Eczema Flare-up"),
    ]

    patient_docs = []
    for i, (p_name, p_age, p_gender, p_bg, p_hist) in enumerate(patients_data, start=1):
        p_email = f"patient{str(i).zfill(3)}@sunrisehospital.demo"
        u_res = db.users.insert_one({
            "hospitalId": hospital_id,
            "email": p_email,
            "passwordHash": default_pat_pw,
            "fullName": p_name,
            "phone": f"+91 98481 {str(i).zfill(5)}",
            "role": "PATIENT",
            "isActive": True,
            "createdAt": now,
            "updatedAt": now,
        })
        p_id = f"PAT-DEMO-{str(i).zfill(3)}"
        assigned_doc = doctor_docs[(i - 1) % len(doctor_docs)]
        pat_entry = {
            "patientId": p_id,
            "userId": u_res.inserted_id,
            "hospitalId": hospital_id,
            "name": p_name,
            "age": p_age,
            "gender": p_gender,
            "bloodGroup": p_bg,
            "emergencyContact": f"+91 99000 {str(i).zfill(5)}",
            "assignedDoctorId": assigned_doc["doctorId"],
            "assignedDoctorName": doctors_info[(i - 1) % len(doctors_info)][0],
            "medicalHistoryNotes": [p_hist],
            "registrationDate": now,
            "status": "ACTIVE",
            "createdAt": now,
            "updatedAt": now,
        }
        db.patients.insert_one(pat_entry)
        patient_docs.append(pat_entry)

    # 8. 42 Appointments
    print("[8/10] Seeding 42 Appointments across doctors and patients...")
    statuses = ["COMPLETED", "CHECKED_IN", "SCHEDULED", "CONFIRMED"]
    reasons = [
        "Routine checkup and blood pressure monitoring",
        "HbA1c & fasting blood glucose review",
        "Persistent headache and migraine follow-up",
        "Joint pain in left knee and physical exam",
        "Antenatal ultrasound scan evaluation",
        "Skin rash allergy consultation",
        "Follow-up ECG and lipid profile check",
    ]

    for i in range(1, 43):
        apt_id = f"APT-DEMO-{str(i).zfill(3)}"
        p = patient_docs[(i - 1) % len(patient_docs)]
        d = doctor_docs[(i - 1) % len(doctor_docs)]
        
        # Day offset: past (-5 to -1), today (0), future (+1 to +7)
        day_offset = (i % 12) - 4
        apt_dt = now + timedelta(days=day_offset, hours=(i % 7) + 2)
        date_str = apt_dt.strftime("%Y-%m-%d")
        time_str = apt_dt.strftime("%I:%M %p")
        status_choice = "COMPLETED" if day_offset < 0 else ("CHECKED_IN" if day_offset == 0 else "CONFIRMED")

        db.appointments.insert_one({
            "appointmentId": apt_id,
            "hospitalId": hospital_id,
            "patientId": p["patientId"],
            "doctorId": d["doctorId"],
            "departmentId": d["departmentId"],
            "dateTime": apt_dt,
            "date": date_str,
            "time": time_str,
            "reason": reasons[i % len(reasons)],
            "status": status_choice,
            "queueNumber": 100 + i,
            "notes": "Patient reported consistent adherence to initial regimen.",
            "createdAt": now,
            "updatedAt": now,
        })

    # 9. 20 Consultations, 15 Prescriptions, and Medicine Schedules
    print("[9/10] Seeding Consultations, Prescriptions & Medicine Schedules...")
    meds_catalog = [
        {"name": "Metformin Hydrochloride", "dose": "500 mg", "freq": "Twice daily", "time": "AFTER_MEAL", "sched": "08:30 AM"},
        {"name": "Amlodipine Besylate", "dose": "5 mg", "freq": "Once daily", "time": "AFTER_MEAL", "sched": "09:00 PM"},
        {"name": "Atorvastatin Calcium", "dose": "10 mg", "freq": "Once daily", "time": "NIGHT", "sched": "10:00 PM"},
        {"name": "Telmisartan", "dose": "40 mg", "freq": "Once daily", "time": "MORNING", "sched": "08:00 AM"},
        {"name": "Paracetamol", "dose": "650 mg", "freq": "As needed (SOS)", "time": "AFTER_MEAL", "sched": "01:00 PM"},
        {"name": "Pantoprazole", "dose": "40 mg", "freq": "Once daily", "time": "BEFORE_MEAL", "sched": "07:30 AM"},
    ]

    for i in range(1, 21):
        c_id = f"CNS-DEMO-{str(i).zfill(3)}"
        p = patient_docs[i - 1]
        d = doctor_docs[(i - 1) % len(doctor_docs)]
        apt_id = f"APT-DEMO-{str(i).zfill(3)}"

        db.consultations.insert_one({
            "consultationId": c_id,
            "hospitalId": hospital_id,
            "appointmentId": apt_id,
            "patientId": p["patientId"],
            "doctorId": d["doctorId"],
            "chiefComplaint": "Routine clinical examination and monitoring",
            "diagnosis": p["medicalHistoryNotes"][0],
            "clinicalNotes": "Vitals stable. Patient advised regular exercise and low sodium diet.",
            "treatmentInstructions": "Continue prescribed therapy and monitor morning BP readings.",
            "followUpRequired": True,
            "followUpDate": now + timedelta(days=14),
            "followUpInstructions": "Repeat fasting blood glucose and lipid profile before next visit.",
            "createdAt": now,
            "updatedAt": now,
        })

        if i <= 15:
            rx_id = f"RX-DEMO-{str(i).zfill(3)}"
            selected_meds = [meds_catalog[(i - 1) % len(meds_catalog)], meds_catalog[i % len(meds_catalog)]]
            rx_meds = []
            for m in selected_meds:
                rx_meds.append({
                    "medicineName": m["name"],
                    "dosage": m["dose"],
                    "frequency": m["freq"],
                    "timing": m["time"],
                    "scheduledTime": m["sched"],
                    "startDate": now,
                    "endDate": now + timedelta(days=30),
                    "instructions": f"Take strictly {m['time'].replace('_', ' ').lower()}.",
                    "status": "ACTIVE"
                })

            db.prescriptions.insert_one({
                "prescriptionId": rx_id,
                "hospitalId": hospital_id,
                "consultationId": c_id,
                "appointmentId": apt_id,
                "patientId": p["patientId"],
                "doctorId": d["doctorId"],
                "diagnosis": p["medicalHistoryNotes"][0],
                "instructions": "Adhere to the exact scheduled timings. Avoid skipping breakfast.",
                "notes": "Emergency numbers provided on the back of prescription.",
                "medicines": rx_meds,
                "createdAt": now,
                "updatedAt": now,
            })

            # Create standalone medicine schedule reminders
            for med in rx_meds:
                sched_id = f"SCHED-DEMO-{str(len(list(db.medicineschedules.find())) + 1).zfill(3)}"
                db.medicineschedules.insert_one({
                    "medicineScheduleId": sched_id,
                    "hospitalId": hospital_id,
                    "prescriptionId": rx_id,
                    "patientId": p["patientId"],
                    "medicineName": med["medicineName"],
                    "dosage": med["dosage"],
                    "frequency": med["frequency"],
                    "timing": med["timing"],
                    "scheduledTime": med["scheduledTime"],
                    "startDate": med["startDate"],
                    "endDate": med["endDate"],
                    "instructions": med["instructions"],
                    "status": "ACTIVE",
                    "logs": [
                        {"scheduledTime": med["scheduledTime"], "action": "TAKEN", "notes": "Taken with water", "loggedAt": now - timedelta(hours=3)}
                    ],
                    "createdAt": now,
                    "updatedAt": now,
                })

    # 10. 15 Medical Reports, Analyses, Follow-Ups & Notifications
    print("[10/10] Seeding Medical Reports, AI Analyses, Follow-ups & Reminders...")
    reports_data = [
        ("Comprehensive Metabolic Panel & HbA1c", "LAB", "Fasting Blood Sugar: 118 mg/dL\nHbA1c: 7.8 %\nTotal Cholesterol: 215 mg/dL\nLDL Cholesterol: 130 mg/dL\nSerum Creatinine: 0.9 mg/dL"),
        ("Complete Blood Count (CBC)", "LAB", "Hemoglobin: 13.5 g/dL\nWBC: 6,800 /mcL\nPlatelet Count: 240,000 /mcL"),
        ("Lipid Profile", "LAB", "Total Cholesterol: 228 mg/dL\nTriglycerides: 180 mg/dL\nHDL Cholesterol: 42 mg/dL\nLDL Cholesterol: 145 mg/dL"),
        ("Renal Function Test (RFT)", "LAB", "Blood Urea: 28 mg/dL\nSerum Creatinine: 1.1 mg/dL\nUric Acid: 5.4 mg/dL"),
        ("Liver Function Test (LFT)", "LAB", "SGOT: 32 U/L\nSGPT: 38 U/L\nTotal Bilirubin: 0.8 mg/dL\nAlkaline Phosphatase: 85 U/L"),
    ]

    for i in range(1, 16):
        rep_id = f"REP-DEMO-{str(i).zfill(3)}"
        p = patient_docs[(i - 1) % len(patient_docs)]
        r_title, r_cat, r_text = reports_data[(i - 1) % len(reports_data)]

        db.medicalreports.insert_one({
            "reportId": rep_id,
            "hospitalId": hospital_id,
            "patientId": p["patientId"],
            "uploadedBy": str(p["userId"]),
            "reportType": r_cat,
            "reportDate": now - timedelta(days=i),
            "title": f"{r_title} - {p['name']}",
            "category": r_cat,
            "fileName": f"report_{str(i).zfill(3)}.pdf",
            "fileUrl": f"/uploads/sample_report_{str(i).zfill(3)}.pdf",
            "extractedText": r_text,
            "status": "PROCESSED",
            "createdAt": now,
            "updatedAt": now,
        })

        db.reportanalyses.insert_one({
            "reportId": rep_id,
            "patientId": p["patientId"],
            "hospitalId": hospital_id,
            "summary": f"Your {r_title} has been evaluated into plain language. Key laboratory parameters are structured for your understanding.",
            "keyFindings": [line for line in r_text.split("\n") if line.strip()],
            "whyItMatters": "Monitoring routine laboratory metrics allows your clinical physician to track progress and adjust medication safety.",
            "questionsForDoctor": [
                "What do these specific numbers mean for my daily dietary routine?",
                "Do I need any follow-up tests before my next visit?",
            ],
            "disclaimer": "This AI explanation is an educational aid and does NOT constitute clinical diagnosis or prescription.",
            "aiModel": "medsync-ai-v1",
            "analyzedAt": now,
            "createdAt": now,
            "updatedAt": now,
        })

    # Follow-ups (12)
    for i in range(1, 13):
        p = patient_docs[i - 1]
        d = doctor_docs[(i - 1) % len(doctor_docs)]
        fu_date = now + timedelta(days=i + 3)
        db.followups.insert_one({
            "followUpId": f"FOL-DEMO-{str(i).zfill(3)}",
            "hospitalId": hospital_id,
            "patientId": p["patientId"],
            "doctorId": d["doctorId"],
            "followUpDate": fu_date,
            "dueDate": fu_date,
            "reason": "Routine clinical follow-up and parameter re-check",
            "status": "PENDING",
            "createdAt": now,
            "updatedAt": now,
        })

        # Reminders in Notifications
        db.notifications.insert_one({
            "notificationId": f"NOTIF-DEMO-{str(i).zfill(3)}",
            "hospitalId": hospital_id,
            "patientId": p["patientId"],
            "userId": str(p["userId"]),
            "type": "FOLLOWUP_REMINDER",
            "title": "Upcoming Follow-Up Review",
            "message": f"Your follow-up consultation is scheduled for {fu_date.strftime('%b %d, %Y')}.",
            "isRead": False,
            "createdAt": now,
            "updatedAt": now,
        })

    print("=" * 40)
    print("DATABASE SEED COMPLETE")
    print("Hospital: Sunrise Multispeciality Hospital")
    print(f"Departments: {db.departments.count_documents({})}")
    print(f"Doctors: {db.doctors.count_documents({})}")
    print(f"Receptionists: {db.receptionists.count_documents({})}")
    print(f"Patients: {db.patients.count_documents({})}")
    print(f"Appointments: {db.appointments.count_documents({})}+")
    print(f"Reports: {db.medicalreports.count_documents({})}")
    print(f"Prescriptions: {db.prescriptions.count_documents({})}")
    print(f"Follow-ups: {db.followups.count_documents({})}+")
    print("=" * 40)

if __name__ == "__main__":
    seed_database()
