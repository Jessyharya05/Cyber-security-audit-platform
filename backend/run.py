# backend/run.py

import uvicorn
from app import create_app
from app.models import init_db
from datetime import datetime

app = create_app()

if __name__ == "__main__":
    print("=" * 50)
    print("🚀 Starting CyberGuard Backend Server")
    print("=" * 50)
    
    # Initialize database
    try:
        init_db()
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
    
    # Run server
    print("\n📡 Server starting at http://localhost:8000")
    print("📚 API Documentation at http://localhost:8000/docs")
    print("=" * 50)
    
    uvicorn.run(
        "run:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )