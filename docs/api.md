# Medsync REST API Reference

Base URL: `http://localhost:5000/api`

## Authentication
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/auth/login` | Log in with email and password | No |
| GET | `/auth/me` | Fetch authenticated user profile | Yes |
| POST | `/auth/logout` | Terminate session & write audit log | Yes |

## Super Admin
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/super-admin/dashboard` | Aggregated platform KPIs & growth charts | `SUPER_ADMIN` |
| GET | `/super-admin/hospitals` | List all hospitals & metrics | `SUPER_ADMIN` |
| POST | `/super-admin/hospitals` | Onboard new hospital & admin | `SUPER_ADMIN` |
| PATCH | `/super-admin/hospitals/:id/status` | Suspend or activate tenant | `SUPER_ADMIN` |
| GET | `/super-admin/audit-logs` | Platform-wide security audit trail | `SUPER_ADMIN` |

## Hospital Administration
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/hospital/dashboard` | Hospital overview and KPIs | `HOSPITAL_ADMIN` |
| GET | `/hospital/doctors` | List doctors within tenant | `HOSPITAL_ADMIN`, `RECEPTIONIST` |
| POST | `/hospital/doctors` | Register licensed doctor | `HOSPITAL_ADMIN` |
| GET | `/hospital/receptionists` | List front desk staff | `HOSPITAL_ADMIN` |
| POST | `/hospital/receptionists` | Add receptionist account | `HOSPITAL_ADMIN` |
| GET | `/hospital/patients` | List hospital patients | `HOSPITAL_ADMIN`, `DOCTOR`, `RECEPTIONIST` |
| GET | `/hospital/departments` | Clinical departments | `HOSPITAL_ADMIN`, `DOCTOR` |
| POST | `/hospital/departments` | Create clinical department | `HOSPITAL_ADMIN` |

## Appointments & Queue
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/appointments` | List appointments (role-scoped) | `DOCTOR`, `RECEPTIONIST`, `PATIENT` |
| POST | `/appointments` | Book appointment | Any authenticated |
| PATCH | `/appointments/:id/status` | Update status (`CHECKED_IN`, `IN_CONSULTATION`, `COMPLETED`) | Staff |

## Prescriptions & Medicine Reminders
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/prescriptions` | List prescriptions | `DOCTOR`, `PATIENT` |
| POST | `/prescriptions` | Issue prescription with medicine schedule | `DOCTOR` only |
| GET | `/medicines` | Patient medicine schedules | `PATIENT`, `DOCTOR` |
| POST | `/medicines/:id/action` | Mark medicine `TAKEN`, `SKIPPED`, or `SNOOZED` | `PATIENT` only |

## Reports & AI Assistant
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/reports` | List patient medical documents | Patient / Doctor |
| GET | `/reports/:id` | View specific report & explanation | Patient / Doctor |
| POST | `/reports/upload` | Upload report, trigger OCR & AI | Patient / Doctor |
| POST | `/reports/:id/analyze` | Re-analyze report | Patient / Doctor |
| POST | `/ai/chat` | Safe RAG chat over patient context | `PATIENT` |
