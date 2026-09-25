import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import db_manager
from app.routers import (
    auth,
    super_admin,
    hospital_admin,
    appointments,
    prescriptions,
    medicines,
    reports,
    ai,
    notifications,
    followups,
    search,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB & ensure indexes
    db_manager.connect()
    os.makedirs(settings.STORAGE_DIR, exist_ok=True)
    yield
    # Shutdown: Close database connection
    db_manager.close()

app = FastAPI(
    title="Medsync Healthcare AI Platform API",
    description="Python FastAPI + PyMongo Backend with Multi-Tenancy, RBAC & AI Safety Layer",
    version="2.0.0",
    lifespan=lifespan
)

# CORS configuration matching React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static uploads
os.makedirs(settings.STORAGE_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.STORAGE_DIR), name="uploads")

# Global HTTP error handler to preserve standard contract: {"success": false, "message": "...", "code": "..."}
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    from fastapi import HTTPException
    if isinstance(exc, HTTPException):
        detail = exc.detail
        if isinstance(detail, dict):
            return JSONResponse(status_code=exc.status_code, content=detail)
        return JSONResponse(
            status_code=exc.status_code,
            content={"success": False, "message": str(detail), "code": "HTTP_ERROR"}
        )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"success": False, "message": str(exc), "code": "SERVER_ERROR"}
    )

# Root & Health check
@app.get("/")
def root():
    return {
        "success": True,
        "name": "Medsync Healthcare AI Assistant & Management Platform",
        "version": "2.0.0 (Python + FastAPI)",
        "docs": "/docs"
    }

@app.get("/health")
def health():
    is_db_connected = db_manager.is_connected()
    if is_db_connected:
        return {
            "status": "healthy",
            "database": "connected"
        }
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "status": "unhealthy",
            "database": "disconnected"
        }
    )

# Mount API Routers under /api
api_prefix = "/api"
app.include_router(auth.router, prefix=api_prefix)
app.include_router(super_admin.router, prefix=api_prefix)
app.include_router(hospital_admin.router, prefix=api_prefix)
app.include_router(appointments.router, prefix=api_prefix)
app.include_router(prescriptions.router, prefix=api_prefix)
app.include_router(medicines.router, prefix=api_prefix)
app.include_router(reports.router, prefix=api_prefix)
app.include_router(ai.router, prefix=api_prefix)
app.include_router(notifications.router, prefix=api_prefix)
app.include_router(followups.router, prefix=api_prefix)
app.include_router(search.router, prefix=api_prefix)
