# backend/app/__init__.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import auth_router, assets_router, audit_router, reports_router

def create_app():
    app = FastAPI(title="CyberGuard API", description="Cybersecurity Audit Platform API")
    
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],  # React frontend
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(auth_router, prefix="/api")
    app.include_router(assets_router, prefix="/api")
    app.include_router(audit_router, prefix="/api")
    app.include_router(reports_router, prefix="/api")
    
    @app.get("/")
    async def root():
        return {"message": "Welcome to CyberGuard API", "status": "running"}
    
    @app.get("/health")
    async def health_check():
        return {"status": "healthy", "timestamp": datetime.now().isoformat()}
    
    return app
