from datetime import datetime, timezone
import uuid
from typing import Optional, Dict, Any
from app.core.database import get_db

def log_audit(
    action: str,
    resource_type: str,
    user_id: Optional[str] = None,
    user_role: Optional[str] = None,
    hospital_id: Optional[str] = None,
    resource_id: Optional[str] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
):
    """Log an action to the auditlogs collection."""
    try:
        db = get_db()
        audit_id = f"AUDIT-{uuid.uuid4().hex[:12].upper()}"
        now = datetime.now(timezone.utc)
        
        doc = {
            "auditId": audit_id,
            "hospitalId": hospital_id,
            "userId": user_id,
            "role": user_role,
            "action": action,
            "resourceType": resource_type,
            "resourceId": resource_id,
            "ipAddress": ip_address,
            "userAgent": user_agent,
            "metadata": metadata or {},
            "timestamp": now,
            "createdAt": now,
            "updatedAt": now,
        }
        db.auditlogs.insert_one(doc)
    except Exception as e:
        print(f"Error writing audit log: {e}")
