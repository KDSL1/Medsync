import os
import sys
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.routers.billing import PLANS

client = TestClient(app)

def test_get_billing_plans():
    """Verify commercial SaaS pricing plans catalog is public and contains valid tiers."""
    response = client.get("/api/billing/plans")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    plans = data["data"]["plans"]
    assert len(plans) >= 4

    plan_ids = [p["id"] for p in plans]
    assert "STARTER" in plan_ids
    assert "PROFESSIONAL" in plan_ids
    assert "ENTERPRISE" in plan_ids
    assert "CARE_PLUS" in plan_ids

    # Verify price and doctor limits
    pro = next(p for p in plans if p["id"] == "PROFESSIONAL")
    assert pro["priceUSD"] == 199.0
    assert pro["priceINR"] == 14999.0
    assert pro["doctorLimit"] == 25
    assert pro["aiReportLimit"] == 1000

def test_unauthenticated_checkout_blocked():
    """Verify unauthorized users cannot execute a checkout session."""
    response = client.post("/api/billing/checkout", json={
        "planTier": "STARTER",
        "billingCycle": "MONTHLY",
        "currency": "USD"
    })
    assert response.status_code == 401
