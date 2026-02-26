# test_connection.py
import psycopg2
from app.config import Config

try:
    # Ambil DATABASE_URL dari Config
    print(f"Connecting to: {Config.SQLALCHEMY_DATABASE_URL}")
    
    conn = psycopg2.connect(Config.SQLALCHEMY_DATABASE_URL)
    print("✅ Koneksi database berhasil!")
    
    cur = conn.cursor()
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
    tables = cur.fetchall()
    print(f"📊 Tabel yang tersedia: {tables}")
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Error: {e}")