# backend/run.py

import uvicorn
from app import create_app
from app.models import init_db

app = create_app()

if __name__ == "__main__":
    # Initialize database
    init_db()
    print("✅ Database initialized")
    
    # Run server
    uvicorn.run(
        "run:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
