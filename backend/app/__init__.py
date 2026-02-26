# backend/app/__init__.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

# Import hanya router yang benar-benar ada
from .routes import (
    auth_router,
    assets_router,
    audit_router,
    evidence_router,
    reports_router,
    findings_router
)

def create_app():
    app = FastAPI(
        title="CyberGuard API",
        description="Backend API for Cybersecurity Audit Platform",
        version="1.0.0"
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register routers
    app.include_router(auth_router, prefix="/api")
    app.include_router(assets_router, prefix="/api")
    app.include_router(audit_router, prefix="/api")
    app.include_router(evidence_router, prefix="/api")
    app.include_router(reports_router, prefix="/api")
    app.include_router(findings_router, prefix="/api")

    @app.get("/")
    async def root():
        return {"message": "CyberGuard API is running", "status": "ok"}

    @app.get("/health")
    async def health_check():
        return {"status": "healthy", "timestamp": datetime.now().isoformat()}

    return app