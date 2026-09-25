from fastapi import Request, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Dict, Any, List
from bson import ObjectId
from app.core.security import decode_access_token
from app.core.database import get_db

security = HTTPBearer(auto_error=False)

class AuthenticatedUser:
    def __init__(self, id: str, email: str, role: str, hospital_id: Optional[str] = None):
        self.id = id
        self.email = email
        self.role = role
        self.hospital_id = hospital_id
        # For compatibility with property styles
        self.hospitalId = hospital_id

async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> AuthenticatedUser:
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "message": "Missing authentication credentials.", "code": "UNAUTHORIZED"}
        )
    
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "message": "Invalid or expired token.", "code": "UNAUTHORIZED"}
        )
    
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "message": "Invalid token payload.", "code": "UNAUTHORIZED"}
        )
    
    db = get_db()
    try:
        query = {"_id": ObjectId(user_id)}
    except Exception:
        query = {"_id": user_id}
    
    user = db.users.find_one(query)
    if not user or not user.get("isActive", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "message": "User not found or deactivated.", "code": "UNAUTHORIZED"}
        )
    
    return AuthenticatedUser(
        id=str(user["_id"]),
        email=user["email"],
        role=user["role"],
        hospital_id=user.get("hospitalId")
    )

def require_roles(*allowed_roles: str):
    def role_checker(current_user: AuthenticatedUser = Depends(get_current_user)) -> AuthenticatedUser:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"success": False, "message": f"Access denied. Required roles: {list(allowed_roles)}", "code": "FORBIDDEN"}
            )
        return current_user
    return role_checker
