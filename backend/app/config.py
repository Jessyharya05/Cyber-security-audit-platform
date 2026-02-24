# backend/app/config.py

import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database PostgreSQL
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "5433")  # PostgreSQL 16 di port 5433
    DB_NAME = os.getenv("DB_NAME", "cyberguard_db")
    DB_USER = os.getenv("DB_USER", "postgres")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")  # Ganti dengan password kamu
    
    # Database URL untuk SQLAlchemy
    SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    
    # JWT Secret
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
