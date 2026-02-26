# init_db.py - Versi dengan debugging lengkap
import sys
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

try:
    logger.info("=" * 50)
    logger.info("STARTING DATABASE INITIALIZATION")
    logger.info("=" * 50)
    
    # Import dari app
    logger.info("Importing from app...")
    from app.models import Base, engine
    from app.config import Config
    
    logger.info(f"Database URL: {Config.SQLALCHEMY_DATABASE_URL}")
    logger.info(f"Engine created: {engine}")
    
    # Cek koneksi dulu
    logger.info("Testing database connection...")
    with engine.connect() as conn:
        logger.info("✅ Database connection successful")
    
    # Create tables
    logger.info("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Tables created successfully!")
    
    # Verifikasi
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    logger.info(f"Tables in database: {tables}")
    
    logger.info("=" * 50)
    logger.info("DATABASE INITIALIZATION COMPLETE")
    logger.info("=" * 50)
    
except Exception as e:
    logger.error(f"❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)