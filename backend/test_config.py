# test_config.py
from app.config import Config

print("="*50)
print("DATABASE CONFIGURATION CHECK")
print("="*50)
print(f"DB_HOST: {Config.DB_HOST}")
print(f"DB_PORT: {Config.DB_PORT}")
print(f"DB_NAME: {Config.DB_NAME}")
print(f"DB_USER: {Config.DB_USER}")
print(f"DB_PASSWORD: {Config.DB_PASSWORD}")
print("-"*50)
print(f"FULL URL: {Config.SQLALCHEMY_DATABASE_URL}")
print("="*50)