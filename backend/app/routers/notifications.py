from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime, timezone
from app.core.database import get_db
from app.middleware.auth import get_current_user, AuthenticatedUser

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("")
def list_notifications(current_user: AuthenticatedUser = Depends(get_current_user)):
    db = get_db()
    notifications = list(db.notifications.find({"userId": current_user.id}).sort("createdAt", -1).limit(50))
    formatted = []
    for n in notifications:
        formatted.append({
            "id": n.get("notificationId"),
            "notificationId": n.get("notificationId"),
            "title": n.get("title"),
            "message": n.get("message"),
            "type": n.get("type"),
            "isRead": n.get("isRead", False),
            "createdAt": n["createdAt"].isoformat() if isinstance(n.get("createdAt"), datetime) else str(n.get("createdAt")),
        })

    return {"success": True, "data": formatted}

@router.patch("/{id}/read")
def mark_notification_read(id: str, current_user: AuthenticatedUser = Depends(get_current_user)):
    db = get_db()
    notif = db.notifications.find_one_and_update(
        {"$or": [{"notificationId": id}, {"_id": id}], "userId": current_user.id},
        {"$set": {"isRead": True, "updatedAt": datetime.now(timezone.utc)}},
        return_document=True
    )
    if not notif:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"success": False, "message": "Notification not found.", "code": "NOT_FOUND"})

    notif["_id"] = str(notif["_id"])
    if isinstance(notif.get("createdAt"), datetime):
        notif["createdAt"] = notif["createdAt"].isoformat()

    return {"success": True, "data": notif}

@router.post("/read-all")
def mark_all_notifications_read(current_user: AuthenticatedUser = Depends(get_current_user)):
    db = get_db()
    db.notifications.update_many(
        {"userId": current_user.id, "isRead": False},
        {"$set": {"isRead": True, "updatedAt": datetime.now(timezone.utc)}}
    )
    return {"success": True, "data": {"success": True}}
