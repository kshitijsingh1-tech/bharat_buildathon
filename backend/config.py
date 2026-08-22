"""
Sarthi Backend Configuration Settings
"""
import os

class Settings:
    PROJECT_NAME: str = "Sarthi - AI Government Benefits Copilot Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "*"
    ]

settings = Settings()
