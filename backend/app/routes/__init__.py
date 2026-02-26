# backend/app/routes/__init__.py
from .auth import router as auth_router
from .assets import router as assets_router
from .audit import router as audit_router
from .evidence import router as evidence_router
from .reports import router as reports_router
from .vulnerabilities import router as vulnerabilities_router
from .risk import router as risk_router
from .checklist import router as checklist_router
from .findings import router as findings_router

__all__ = [
    'auth_router',
    'assets_router',
    'audit_router',
    'evidence_router',
    'reports_router',
    'vulnerabilities_router',
    'risk_router',
    'checklist_router',
    'findings_router'
]