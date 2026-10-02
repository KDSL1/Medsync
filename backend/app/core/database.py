import logging
from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.database import Database
from app.core.config import settings

logger = logging.getLogger("medsync.database")

class DatabaseManager:
    client: MongoClient = None
    db: Database = None

    def connect(self):
        try:
            logger.info(f"Connecting to MongoDB at {settings.MONGODB_URI.split('@')[-1]}...")
            try:
                import certifi
                ca_file = certifi.where()
                self.client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=5000, tlsCAFile=ca_file)
                self.client.admin.command('ping')
            except Exception:
                # Fallback for Windows TLS environments
                self.client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=5000, tlsAllowInvalidCertificates=True)
                self.client.admin.command('ping')

            self.db = self.client[settings.MONGODB_DB_NAME]
            logger.info(f"Connected to MongoDB database: '{settings.MONGODB_DB_NAME}'")
            self.create_indexes()
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise e

    def close(self):
        if self.client:
            self.client.close()
            self.client = None
            self.db = None
            logger.info("MongoDB connection closed.")

    def is_connected(self) -> bool:
        if not self.client:
            return False
        try:
            self.client.admin.command('ping')
            return True
        except Exception:
            return False

    def create_indexes(self):
        """Ensure all required collection indexes are built."""
        try:
            # hospitals
            self.db.hospitals.create_index([("hospitalId", ASCENDING)], unique=True)
            self.db.hospitals.create_index([("code", ASCENDING)], unique=True)

            # users
            self.db.users.create_index([("email", ASCENDING)], unique=True)
            self.db.users.create_index([("hospitalId", ASCENDING), ("role", ASCENDING)])

            # departments
            self.db.departments.create_index([("departmentId", ASCENDING)], unique=True)
            self.db.departments.create_index([("hospitalId", ASCENDING), ("name", ASCENDING)])

            # doctors
            self.db.doctors.create_index([("doctorId", ASCENDING)], unique=True)
            self.db.doctors.create_index([("hospitalId", ASCENDING), ("specialization", ASCENDING)])
            self.db.doctors.create_index([("userId", ASCENDING)], unique=True)

            # receptionists
            self.db.receptionists.create_index([("receptionistId", ASCENDING)], unique=True)
            self.db.receptionists.create_index([("hospitalId", ASCENDING)])
            self.db.receptionists.create_index([("userId", ASCENDING)], unique=True)

            # patients
            self.db.patients.create_index([("patientId", ASCENDING)], unique=True)
            self.db.patients.create_index([("hospitalId", ASCENDING), ("patientId", ASCENDING)])
            self.db.patients.create_index([("userId", ASCENDING)], unique=True)

            # appointments
            self.db.appointments.create_index([("appointmentId", ASCENDING)], unique=True)
            self.db.appointments.create_index([("hospitalId", ASCENDING), ("date", ASCENDING)])
            self.db.appointments.create_index([("hospitalId", ASCENDING), ("doctorId", ASCENDING), ("date", ASCENDING)])
            self.db.appointments.create_index([("hospitalId", ASCENDING), ("patientId", ASCENDING), ("date", ASCENDING)])

            # consultations
            self.db.consultations.create_index([("consultationId", ASCENDING)], unique=True)
            self.db.consultations.create_index([("hospitalId", ASCENDING), ("patientId", ASCENDING)])

            # prescriptions
            self.db.prescriptions.create_index([("prescriptionId", ASCENDING)], unique=True)
            self.db.prescriptions.create_index([("hospitalId", ASCENDING), ("patientId", ASCENDING)])

            # medicineschedules
            self.db.medicineschedules.create_index([("medicineScheduleId", ASCENDING)], unique=True)
            self.db.medicineschedules.create_index([("hospitalId", ASCENDING), ("patientId", ASCENDING)])
            self.db.medicineschedules.create_index([("patientId", ASCENDING), ("status", ASCENDING)])

            # medicalreports
            self.db.medicalreports.create_index([("reportId", ASCENDING)], unique=True)
            self.db.medicalreports.create_index([("hospitalId", ASCENDING), ("patientId", ASCENDING)])

            # reportanalyses
            self.db.reportanalyses.create_index([("reportId", ASCENDING)], unique=True)
            self.db.reportanalyses.create_index([("hospitalId", ASCENDING), ("patientId", ASCENDING)])

            # followups
            self.db.followups.create_index([("followUpId", ASCENDING)], unique=True)
            self.db.followups.create_index([("hospitalId", ASCENDING), ("patientId", ASCENDING)])

            # notifications
            self.db.notifications.create_index([("notificationId", ASCENDING)], unique=True)
            self.db.notifications.create_index([("userId", ASCENDING), ("isRead", ASCENDING)])

            # auditlogs
            self.db.auditlogs.create_index([("auditId", ASCENDING)], unique=True)
            self.db.auditlogs.create_index([("hospitalId", ASCENDING), ("timestamp", DESCENDING)])

            logger.info("MongoDB indexes verified successfully.")
        except Exception as e:
            logger.warning(f"Note on creating indexes: {e}")

db_manager = DatabaseManager()

def get_db() -> Database:
    if db_manager.db is None:
        db_manager.connect()
    return db_manager.db
