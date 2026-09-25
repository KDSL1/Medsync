export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  HOSPITAL_ADMIN = 'HOSPITAL_ADMIN',
  DOCTOR = 'DOCTOR',
  RECEPTIONIST = 'RECEPTIONIST',
  PATIENT = 'PATIENT'
}

export enum HospitalStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING'
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  IN_CONSULTATION = 'IN_CONSULTATION',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export enum MedicineTiming {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT',
  BEFORE_MEAL = 'BEFORE_MEAL',
  AFTER_MEAL = 'AFTER_MEAL',
  WITH_MEAL = 'WITH_MEAL'
}

export enum MedicineStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  STOPPED = 'STOPPED'
}

export enum MedicineLogAction {
  TAKEN = 'TAKEN',
  SKIPPED = 'SKIPPED',
  SNOOZED = 'SNOOZED'
}

export enum FollowUpStatus {
  PENDING = 'PENDING',
  NOTIFIED = 'NOTIFIED',
  BOOKED = 'BOOKED',
  DISMISSED = 'DISMISSED'
}

export enum NotificationType {
  MEDICINE_REMINDER = 'MEDICINE_REMINDER',
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  FOLLOWUP_REMINDER = 'FOLLOWUP_REMINDER',
  REPORT_READY = 'REPORT_READY',
  DOCTOR_MESSAGE = 'DOCTOR_MESSAGE',
  PRESCRIPTION_CREATED = 'PRESCRIPTION_CREATED',
  SYSTEM_NOTIFICATION = 'SYSTEM_NOTIFICATION'
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  hospitalId: string | null;
  hospitalName?: string;
  phone?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  code?: string;
  errors?: any;
}

export interface HospitalDto {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  status: HospitalStatus;
  adminName?: string;
  doctorCount?: number;
  patientCount?: number;
  receptionistCount?: number;
  createdAt: string;
}

export interface ReportExplanationDto {
  summary: string;
  keyValues: Array<{
    parameter: string;
    value: string;
    referenceRange?: string;
    status?: 'NORMAL' | 'ABNORMAL' | 'CRITICAL' | 'UNKNOWN';
    simpleExplanation: string;
  }>;
  whyItMatters: string;
  doctorQuestions: string[];
  doctorNotes?: string;
  disclaimer: string;
}

export interface ChatMessageDto {
  id?: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  sourceAttributions?: Array<{
    type: 'report' | 'general' | 'doctor';
    label: string;
    text: string;
  }>;
  safetyAlert?: string;
  timestamp: string;
}
