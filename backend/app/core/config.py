"""
Configuration settings for the application.
"""
try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings."""
    
    # API Settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "Document Indexing System"
    
    # Data paths
    DATA_DIR: str = "data"
    INDICES_DIR: str = "data/indices"
    SAMPLE_DOCUMENTS_DIR: str = "data/sample_documents"
    
    # Index settings
    INDEX_TYPE_SUFFIX: str = "suffix"
    INDEX_TYPE_PATRICIA: str = "patricia"
    
    # CORS
    BACKEND_CORS_ORIGINS: list = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

