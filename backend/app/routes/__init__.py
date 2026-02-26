# backend/app/routes/__init__.py

from .auth import router as auth_router
from .users import router as users_router
from .companies import router as companies_router
from .assets import router as assets_router
from .evidence import router as evidence_router
from .audit import router as audit_router
from .reports import router as reports_router
