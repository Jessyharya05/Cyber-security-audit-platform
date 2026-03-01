# test_db.py
from app.models import SessionLocal
from sqlalchemy import text

try:
    db = SessionLocal()
    db.execute(text("SELECT 1"))
    print("✅ Database connection OK!")
    
    # Cek jumlah companies
    result = db.execute(text("SELECT COUNT(*) FROM companies"))
    count = result.scalar()
    print(f"📊 Total companies in DB: {count}")
    
    db.close()
except Exception as e:
    print(f"❌ Database error: {e}")