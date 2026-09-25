from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    fullName: str
    role: str
    hospitalId: Optional[str] = None
    hospitalName: Optional[str] = None
    profileId: Optional[str] = None
    phone: Optional[str] = None

class LoginResponseData(BaseModel):
    user: UserResponse
    accessToken: str
    refreshToken: str

class HospitalCreateRequest(BaseModel):
    name: str
    code: str
    address: str
    phone: str
    location: Optional[str] = "India"
    adminFullName: str
    adminEmail: EmailStr
    adminPassword: str

class HospitalStatusUpdateRequest(BaseModel):
    status: str

class DoctorCreateRequest(BaseModel):
    fullName: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    departmentId: Optional[str] = None
    specialization: str
    licenseNumber: str
    consultationFee: Optional[float] = 100.0

class ReceptionistCreateRequest(BaseModel):
    fullName: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    shift: Optional[str] = "MORNING"

class DepartmentCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None

class AppointmentCreateRequest(BaseModel):
    patientId: str
    doctorId: str
    departmentId: Optional[str] = None
    dateTime: str
    reason: str
    notes: Optional[str] = None

class AppointmentStatusUpdateRequest(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class MedicineItemSchema(BaseModel):
    medicineName: str
    dosage: str
    frequency: str
    timing: str = "AFTER_MEAL"
    scheduledTime: str = "08:00 AM"
    startDate: str
    endDate: str
    instructions: Optional[str] = None

class PrescriptionCreateRequest(BaseModel):
    appointmentId: Optional[str] = None
    patientId: str
    diagnosis: str
    instructions: Optional[str] = None
    notes: Optional[str] = None
    followUpRequired: Optional[bool] = False
    followUpDate: Optional[str] = None
    followUpInstructions: Optional[str] = None
    medicines: List[MedicineItemSchema]

class MedicineActionRequest(BaseModel):
    action: str
    notes: Optional[str] = None

class AIChatRequest(BaseModel):
    message: str
