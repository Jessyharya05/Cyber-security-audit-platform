# backend/app/routes/audit.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime

from ..models import SessionLocal, Audit, Company, User, Auditor
from .auth import get_current_user_dependency
from pydantic import BaseModel

router = APIRouter(prefix="/audit", tags=["Audit"])

# Pydantic models
class AuditBase(BaseModel):
    companyId: int
    auditorId: int
    scope: str
    startDate: Optional[date] = None
    endDate: Optional[date] = None
    priority: Optional[str] = "medium"

class AuditCreate(AuditBase):
    pass

class AuditResponse(AuditBase):
    id: int
    status: str
    progress: int
    findings: int
    criticalFindings: int
    created_at: datetime
    companyName: Optional[str] = None
    auditorName: Optional[str] = None

    class Config:
        from_attributes = True

class CompanySimple(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ─────────────────────────────────────────────
# HELPER: Dapatkan Auditor record dari current_user
# ─────────────────────────────────────────────
def get_auditor_from_user(current_user, db: Session):
    """
    current_user.id = ID di tabel 'users'
    Auditor.id      = ID di tabel 'auditors'
    Kita link lewat email karena tidak ada FK langsung.
    """
    auditor = db.query(Auditor).filter(Auditor.email == current_user.email).first()
    return auditor


# ─────────────────────────────────────────────
# GET /audit/my-companies → companies milik auditor yg login
# ─────────────────────────────────────────────
@router.get("/my-companies", response_model=List[CompanySimple])
async def get_my_companies(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Ambil semua companies yang di-assign ke auditor yang sedang login"""
    if current_user.role != 'auditor':
        raise HTTPException(status_code=403, detail="Auditor only")

    # Cari record auditor berdasarkan email user yang login
    auditor = get_auditor_from_user(current_user, db)
    if not auditor:
        raise HTTPException(status_code=404, detail="Auditor profile not found")

    # Ambil semua audit milik auditor ini (pakai auditor.id, bukan user.id)
    audits = db.query(Audit).filter(Audit.auditorId == auditor.id).all()
    company_ids = list(set([a.companyId for a in audits]))

    if not company_ids:
        return []

    companies = db.query(Company).filter(Company.id.in_(company_ids)).all()
    return [{"id": c.id, "name": c.name} for c in companies]


# ─────────────────────────────────────────────
# GET /audit/
# ─────────────────────────────────────────────
@router.get("/", response_model=List[AuditResponse])
async def get_audits(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Get all audits - admin dapat semua, auditor hanya miliknya"""
    query = db.query(Audit)

    if current_user.role == 'auditor':
        # ✅ FIX: cari auditor.id lewat email, bukan pakai current_user.id langsung
        auditor = get_auditor_from_user(current_user, db)
        if not auditor:
            return []  # Auditor belum punya profil
        query = query.filter(Audit.auditorId == auditor.id)

    audits = query.all()

    result = []
    for a in audits:
        company = db.query(Company).filter(Company.id == a.companyId).first()
        # Ambil nama auditor dari tabel auditors (bukan users)
        auditor_record = db.query(Auditor).filter(Auditor.id == a.auditorId).first()

        result.append({
            "id": a.id,
            "companyId": a.companyId,
            "companyName": company.name if company else "Unknown",
            "auditorId": a.auditorId,
            "auditorName": auditor_record.name if auditor_record else "Unknown",
            "scope": a.scope,
            "startDate": a.startDate,
            "endDate": a.endDate,
            "status": a.status,
            "progress": a.progress,
            "findings": a.findings,
            "criticalFindings": a.criticalFindings,
            "priority": getattr(a, 'priority', 'medium'),
            "created_at": a.created_at
        })

    return result


# ─────────────────────────────────────────────
# POST /audit/
# ─────────────────────────────────────────────
@router.post("/", response_model=AuditResponse)
async def create_audit(
    audit: AuditCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Create new audit (admin only)"""
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin only")

    company = db.query(Company).filter(Company.id == audit.companyId).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    # ✅ FIX: cek auditor di tabel auditors, bukan users
    auditor = db.query(Auditor).filter(Auditor.id == audit.auditorId).first()
    if not auditor:
        raise HTTPException(status_code=404, detail="Auditor not found")

    new_audit = Audit(
        companyId=audit.companyId,
        auditorId=audit.auditorId,
        scope=audit.scope,
        startDate=audit.startDate,
        endDate=audit.endDate,
        status="pending",
        progress=0,
        findings=0,
        criticalFindings=0
    )

    db.add(new_audit)
    db.commit()
    db.refresh(new_audit)

    return {
        "id": new_audit.id,
        "companyId": new_audit.companyId,
        "companyName": company.name,
        "auditorId": new_audit.auditorId,
        "auditorName": auditor.name,
        "scope": new_audit.scope,
        "startDate": new_audit.startDate,
        "endDate": new_audit.endDate,
        "status": new_audit.status,
        "progress": new_audit.progress,
        "findings": new_audit.findings,
        "criticalFindings": new_audit.criticalFindings,
        "priority": audit.priority,
        "created_at": new_audit.created_at
    }


# ─────────────────────────────────────────────
# GET /audit/{audit_id}
# ─────────────────────────────────────────────
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
        # ✅ FIX: bandingkan dengan auditor.id, bukan user.id
        auditor = get_auditor_from_user(current_user, db)
        if not auditor or audit.auditorId != auditor.id:
            raise HTTPException(status_code=403, detail="Not authorized to view this audit")

    company = db.query(Company).filter(Company.id == audit.companyId).first()
    auditor_record = db.query(Auditor).filter(Auditor.id == audit.auditorId).first()

    return {
        "id": audit.id,
        "companyId": audit.companyId,
        "companyName": company.name if company else "Unknown",
        "auditorId": audit.auditorId,
        "auditorName": auditor_record.name if auditor_record else "Unknown",
        "scope": audit.scope,
        "startDate": audit.startDate,
        "endDate": audit.endDate,
        "status": audit.status,
        "progress": audit.progress,
        "findings": audit.findings,
        "criticalFindings": audit.criticalFindings,
        "priority": getattr(audit, 'priority', 'medium'),
        "created_at": audit.created_at
    }


# ─────────────────────────────────────────────
# PUT /audit/{audit_id}
# ─────────────────────────────────────────────
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
        # ✅ FIX: bandingkan dengan auditor.id, bukan user.id
        auditor = get_auditor_from_user(current_user, db)
        if not auditor or audit.auditorId != auditor.id:
            raise HTTPException(status_code=403, detail="Not authorized")

    for key, value in audit_data.items():
        if hasattr(audit, key):
            setattr(audit, key, value)

    db.commit()
    db.refresh(audit)
    return audit


# ─────────────────────────────────────────────
# DELETE /audit/{audit_id}
# ─────────────────────────────────────────────
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