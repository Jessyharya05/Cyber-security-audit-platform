# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import dari app folder (struktur Dev A)
from app.routes import auth, assets, evidence
from app.models import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CyberGuard API", version="1.0")

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routes
app.include_router(auth.router)      # Dari Dev A (auth)
app.include_router(assets.router)    # Dari Dev A (assets) 
app.include_router(evidence.router)  # Dari KAMU (evidence)

@app.get("/")
async def root():
    return {"message": "CyberGuard API is running", "status": "OK"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}