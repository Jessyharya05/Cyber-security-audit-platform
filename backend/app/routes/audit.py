# backend/app/routes/audit.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime

from ..models import SessionLocal, Audit, Company, User, Auditor
from .auth import get_current_user_dependency
from pydantic import BaseModel

router = APIRouter(prefix="/audit", tags=["Audit"])

class AuditCreate(BaseModel):
    companyId: int
    auditorId: int
    scope: str
    startDate: Optional[date] = None
    endDate: Optional[date] = None
    priority: Optional[str] = "medium"

# ✅ SEMUA FIELD OPTIONAL supaya data lama dengan NULL tidak crash
class AuditResponse(BaseModel):
    id: int
    companyId: int
    auditorId: int
    scope: Optional[str] = None
    startDate: Optional[date] = None
    endDate: Optional[date] = None
    status: Optional[str] = "pending"
    progress: Optional[int] = 0
    findings: Optional[int] = 0          # ← NULL-safe
    criticalFindings: Optional[int] = 0  # ← NULL-safe
    priority: Optional[str] = "medium"
    created_at: Optional[datetime] = None  # ← NULL-safe
    companyName: Optional[str] = None
    auditorName: Optional[str] = None

    class Config:
        from_attributes = True

class CompanySimple(BaseModel):
    id: int
    name: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_auditor_from_user(current_user, db: Session):
    return db.query(Auditor).filter(Auditor.email == current_user.email).first()

def serialize_audit(a, db):
    """Serialize audit dengan handle NULL dari data lama di DB"""
    company = db.query(Company).filter(Company.id == a.companyId).first()
    auditor_record = db.query(Auditor).filter(Auditor.id == a.auditorId).first()
    return {
        "id": a.id,
        "companyId": a.companyId,
        "companyName": company.name if company else "Unknown",
        "auditorId": a.auditorId,
        "auditorName": auditor_record.name if auditor_record else "Unknown",
        "scope": a.scope or "",
        "startDate": a.startDate,
        "endDate": a.endDate,
        "status": a.status or "pending",
        "progress": a.progress or 0,
        "findings": a.findings if a.findings is not None else 0,
        "criticalFindings": a.criticalFindings if a.criticalFindings is not None else 0,
        "priority": getattr(a, 'priority', 'medium') or 'medium',
        "created_at": a.created_at or datetime.utcnow()
    }


@router.get("/my-companies", response_model=List[CompanySimple])
async def get_my_companies(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    if current_user.role != 'auditor':
        raise HTTPException(status_code=403, detail="Auditor only")
    auditor = get_auditor_from_user(current_user, db)
    if not auditor:
        raise HTTPException(status_code=404, detail="Auditor profile not found")
    audits = db.query(Audit).filter(Audit.auditorId == auditor.id).all()
    company_ids = list(set([a.companyId for a in audits]))
    if not company_ids:
        return []
    companies = db.query(Company).filter(Company.id.in_(company_ids)).all()
    return [{"id": c.id, "name": c.name} for c in companies]


@router.get("/", response_model=List[AuditResponse])
async def get_audits(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    query = db.query(Audit)
    if current_user.role == 'auditor':
        auditor = get_auditor_from_user(current_user, db)
        if not auditor:
            return []
        query = query.filter(Audit.auditorId == auditor.id)
    audits = query.all()
    return [serialize_audit(a, db) for a in audits]


@router.post("/", response_model=AuditResponse)
async def create_audit(
    audit: AuditCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin only")
    company = db.query(Company).filter(Company.id == audit.companyId).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    auditor = db.query(Auditor).filter(Auditor.id == audit.auditorId).first()
    if not auditor:
        raise HTTPException(status_code=404, detail="Auditor not found")
    new_audit = Audit(
        companyId=audit.companyId, auditorId=audit.auditorId,
        scope=audit.scope, startDate=audit.startDate, endDate=audit.endDate,
        status="pending", progress=0, findings=0, criticalFindings=0
    )
    db.add(new_audit)
    db.commit()
    db.refresh(new_audit)
    return serialize_audit(new_audit, db)


@router.get("/{audit_id}", response_model=AuditResponse)
async def get_audit_by_id(
    audit_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    audit = db.query(Audit).filter(Audit.id == audit_id).first()
    if not audit:
        raise HTTPException(status_code=404, detail="Audit not found")
    if current_user.role == 'auditor':
        auditor = get_auditor_from_user(current_user, db)
        if not auditor or audit.auditorId != auditor.id:
            raise HTTPException(status_code=403, detail="Not authorized")
    return serialize_audit(audit, db)


@router.put("/{audit_id}")
async def update_audit(
    audit_id: int,
    audit_data: dict,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    audit = db.query(Audit).filter(Audit.id == audit_id).first()
    if not audit:
        raise HTTPException(status_code=404, detail="Audit not found")
    if current_user.role == 'auditor':
        auditor = get_auditor_from_user(current_user, db)
        if not auditor or audit.auditorId != auditor.id:
            raise HTTPException(status_code=403, detail="Not authorized")
    for key, value in audit_data.items():
        if hasattr(audit, key):
            setattr(audit, key, value)
    db.commit()
    db.refresh(audit)
    return serialize_audit(audit, db)


@router.delete("/{audit_id}")
async def delete_audit(
    audit_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin only")
    audit = db.query(Audit).filter(Audit.id == audit_id).first()
    if not audit:
        raise HTTPException(status_code=404, detail="Audit not found")
    db.delete(audit)
    db.commit()
    return {"success": True, "message": "Audit deleted"}