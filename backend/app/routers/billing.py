from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any, List
from datetime import datetime, timezone, timedelta
from app.core.database import get_db
from app.middleware.auth import get_current_user, require_roles
from app.models.schemas import CheckoutRequest
from app.services.audit_service import log_audit

router = APIRouter(prefix="/billing", tags=["Billing & Monetization"])

# Commercial SaaS Pricing Catalog
PLANS = {
    "STARTER": {
        "id": "STARTER",
        "name": "Clinic Starter",
        "target": "Small clinics & polyclinics",
        "priceUSD": 49.0,
        "priceINR": 3999.0,
        "doctorLimit": 5,
        "aiReportLimit": 100,
        "features": [
            "Up to 5 Certified Doctors",
            "100 AI Lab Report Scans / month",
            "Digital Prescription Generator",
            "Patient Queue & Token Intake",
            "Automated Dosage Reminders",
            "Email & Community Support"
        ]
    },
    "PROFESSIONAL": {
        "id": "PROFESSIONAL",
        "name": "Hospital Pro",
        "target": "Multi-specialty hospitals & diagnostic labs",
        "priceUSD": 199.0,
        "priceINR": 14999.0,
        "doctorLimit": 25,
        "aiReportLimit": 1000,
        "features": [
            "Up to 25 Certified Doctors",
            "1,000 AI Lab Report Scans / month",
            "Multi-Department Hospital Analytics",
            "Priority AI RAG & OCR Compute",
            "Direct WhatsApp Patient Reminders",
            "HIPAA Audit Trail Access",
            "24/7 Priority Support"
        ]
    },
    "ENTERPRISE": {
        "id": "ENTERPRISE",
        "name": "Enterprise Health",
        "target": "Hospital chains & large medical centers",
        "priceUSD": 599.0,
        "priceINR": 44999.0,
        "doctorLimit": 9999,
        "aiReportLimit": 10000,
        "features": [
            "Unlimited Doctors & Departments",
            "10,000+ AI Lab Scans / month",
            "Dedicated Cloud Tenancy Option",
            "Custom Hospital Branding & Domain",
            "Custom EHR / HL7 / FHIR Integrations",
            "Dedicated Account Manager",
            "Custom BAA & SLA Guarantees"
        ]
    },
    "CARE_PLUS": {
        "id": "CARE_PLUS",
        "name": "Medsync Care+ (Patient)",
        "target": "Patients & family health tracking",
        "priceUSD": 4.99,
        "priceINR": 299.0,
        "doctorLimit": 0,
        "aiReportLimit": 50,
        "features": [
            "Unlimited AI Lab Report Explanations",
            "Historical Biomarker Trend Graphs",
            "WhatsApp Medication Alarms",
            "Caregiver / Family Emergency Alerts",
            "Tele-consultation booking discounts"
        ]
    }
}

@router.get("/plans")
def get_plans():
    """Returns the commercial SaaS pricing plans catalog."""
    return {
        "success": True,
        "data": {
            "plans": list(PLANS.values())
        }
    }

@router.get("/subscription")
def get_current_subscription(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Retrieves current subscription status and quota meters for the tenant or user."""
    db = get_db()
    hospital_id = current_user.get("hospitalId")
    role = current_user.get("role")

    if hospital_id:
        sub = db.subscriptions.find_one({"hospitalId": hospital_id})
        if not sub:
            # Default to active Pro Trial
            sub = {
                "hospitalId": hospital_id,
                "planTier": "PROFESSIONAL",
                "billingCycle": "MONTHLY",
                "status": "ACTIVE",
                "doctorLimit": 25,
                "aiReportLimit": 1000,
                "validUntil": (datetime.now(timezone.utc) + timedelta(days=30)).isoformat(),
                "currency": "USD",
                "price": 199.0
            }
            db.subscriptions.update_one({"hospitalId": hospital_id}, {"$set": sub}, upsert=True)

        doctor_count = db.doctors.count_documents({"hospitalId": hospital_id})
        reports_count = db.medicalreports.count_documents({"hospitalId": hospital_id})
        
        return {
            "success": True,
            "data": {
                **sub,
                "_id": str(sub.get("_id", "")),
                "doctorCount": doctor_count,
                "aiReportUsed": reports_count,
                "planDetails": PLANS.get(sub.get("planTier", "PROFESSIONAL"), PLANS["PROFESSIONAL"])
            }
        }
    
    # Patient subscription
    patient_sub = db.subscriptions.find_one({"userId": current_user["id"]})
    is_care_plus = bool(patient_sub and patient_sub.get("status") == "ACTIVE")
    
    return {
        "success": True,
        "data": {
            "userId": current_user["id"],
            "planTier": "CARE_PLUS" if is_care_plus else "FREE",
            "status": "ACTIVE" if is_care_plus else "FREE_TIER",
            "aiReportLimit": 50 if is_care_plus else 5,
            "aiReportUsed": db.medicalreports.count_documents({"patientId": current_user.get("profileId", "")}),
            "planDetails": PLANS["CARE_PLUS"] if is_care_plus else None
        }
    }

@router.post("/checkout")
def create_checkout_session(payload: CheckoutRequest, current_user: Dict[str, Any] = Depends(get_current_user)):
    """Simulates payment gateway checkout (Stripe / Razorpay) and immediately activates the subscription."""
    db = get_db()
    plan = PLANS.get(payload.planTier)
    if not plan:
        raise HTTPException(status_code=400, detail="Invalid plan tier specified")

    hospital_id = current_user.get("hospitalId")
    now = datetime.now(timezone.utc)
    expiry = now + (timedelta(days=365) if payload.billingCycle == "ANNUAL" else timedelta(days=30))
    price = plan["priceINR"] if payload.currency == "INR" else plan["priceUSD"]
    if payload.billingCycle == "ANNUAL":
        price = price * 10 # 2 months free discount

    invoice_id = f"INV-{now.strftime('%Y%m')}-{int(now.timestamp()) % 10000:04d}"

    subscription_record = {
        "planTier": payload.planTier,
        "billingCycle": payload.billingCycle,
        "currency": payload.currency,
        "price": price,
        "status": "ACTIVE",
        "doctorLimit": plan["doctorLimit"],
        "aiReportLimit": plan["aiReportLimit"],
        "updatedAt": now.isoformat(),
        "validUntil": expiry.isoformat()
    }

    if hospital_id:
        subscription_record["hospitalId"] = hospital_id
        db.subscriptions.update_one({"hospitalId": hospital_id}, {"$set": subscription_record}, upsert=True)
    else:
        subscription_record["userId"] = current_user["id"]
        db.subscriptions.update_one({"userId": current_user["id"]}, {"$set": subscription_record}, upsert=True)

    # Save invoice receipt
    invoice_doc = {
        "invoiceId": invoice_id,
        "userId": current_user["id"],
        "hospitalId": hospital_id,
        "userEmail": current_user.get("email"),
        "planTier": payload.planTier,
        "amount": price,
        "currency": payload.currency,
        "status": "PAID",
        "paymentMethod": "STRIPE_INSTANT_CARD",
        "createdAt": now.isoformat()
    }
    db.invoices.insert_one(invoice_doc)

    log_audit(
        action="SUBSCRIPTION_PURCHASED",
        resource_type="SUBSCRIPTION",
        resource_id=invoice_id,
        hospital_id=hospital_id,
        user_id=current_user["id"],
        user_role=current_user["role"],
        metadata={"details": f"Subscribed to {payload.planTier} ({payload.billingCycle}) for {payload.currency} {price}"}
    )

    return {
        "success": True,
        "message": f"Successfully activated {plan['name']}!",
        "data": {
            "invoiceId": invoice_id,
            "status": "ACTIVE",
            "planTier": payload.planTier,
            "amountPaid": price,
            "currency": payload.currency,
            "validUntil": expiry.isoformat()
        }
    }

@router.get("/invoices")
def get_invoices(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Fetches billing history and paid invoices."""
    db = get_db()
    query = {}
    if current_user.get("hospitalId"):
        query["hospitalId"] = current_user["hospitalId"]
    else:
        query["userId"] = current_user["id"]

    invoices = list(db.invoices.find(query, {"_id": 0}).sort("createdAt", -1).limit(20))
    return {
        "success": True,
        "data": {
            "invoices": invoices
        }
    }
