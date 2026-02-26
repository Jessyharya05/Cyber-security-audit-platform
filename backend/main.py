from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import (
    auth, users, companies, assets, evidence, risk
)
from app.models import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CyberGuard API", version="1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(companies.router)
app.include_router(assets.router)
app.include_router(evidence.router)
app.include_router(risk.router)   # ← NAMANYA risk.router, BUKAN audit.router!

@app.get("/")
async def root():
    return {"message": "CyberGuard API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}