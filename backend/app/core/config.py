import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    NODE_ENV: str = "development"
    
    # MongoDB
    MONGODB_URI: str = "mongodb://127.0.0.1:27017/healthcare_ai_demo"
    MONGODB_DB_NAME: str = "healthcare_ai_demo"
    
    # Security / JWT
    JWT_SECRET: str = "super-secret-jwt-key-change-in-production-healthcare-ai-2026"
    JWT_REFRESH_SECRET: str = "super-secret-refresh-jwt-key-change-in-production-2026"
    JWT_EXPIRY_HOURS: int = 12
    ALGORITHM: str = "HS256"
    
    # AI & Uploads
    AI_API_KEY: str = ""
    AI_MODEL: str = "gemini-1.5-flash"
    STORAGE_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
    FRONTEND_URL: str = "http://localhost:5173"

    class Config:
        env_file = (
            os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env"),
            os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "backend", ".env"),
            ".env"
        )
        extra = "ignore"

settings = Settings()
