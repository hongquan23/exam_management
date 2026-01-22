from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # ==============================
    # APP
    # ==============================
    APP_NAME: str = "Exam Management System"
    DEBUG: bool = True

    # ==============================
    # DATABASE
    # ==============================
    DATABASE_URL: str

    # ==============================
    # SECURITY / JWT
    # ==============================
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # ==============================
    # AI / GROQ
    # ==============================
    GROQ_API_KEY: str  # 👈 THÊM DÒNG NÀY

    # ==============================
    # CORS
    # ==============================
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
    ]

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
    }


settings = Settings()
