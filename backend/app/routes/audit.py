# backend/app/routes/audit.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date, datetime  # <-- FIX: tambah datetime
from ..models import SessionLocal, Audit, Company, Auditor, Finding
from .auth import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/audit", tags=["Audit"])

# Pydantic models
class AuditBase(BaseModel):
    companyId: int
    auditorId: int
    scope: str
    startDate: date
    endDate: date

class AuditCreate(AuditBase):
    pass

class AuditUpdate(BaseModel):
    status: str
    progress: int
    findings: int
    criticalFindings: int

class AuditResponse(AuditBase):
    id: int
    status: str
    progress: int
    findings: int
    criticalFindings: int
    created_at: datetime  # <-- sekarang udah kenal datetime
    
    class Config:
        from_attributes = True
        
class FindingBase(BaseModel):
    title: str
    description: str
    severity: str
    asset: str
    due_date: date
    recommendation: str

class FindingCreate(FindingBase):
    company_id: int

class FindingResponse(FindingBase):
    id: int
    company_id: int
    status: str
    discovered: date
    progress: int
    
    class Config:
        from_attributes = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Audit endpoints
@router.get("/", response_model=List[AuditResponse])
async def get_audits(db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user['role'] == 'admin':
        audits = db.query(Audit).all()
    elif user['role'] == 'auditor':
        # Get auditor id from user email (simplified)
        auditor = db.query(Auditor).filter(Auditor.email == user['email']).first()
        if auditor:
            audits = db.query(Audit).filter(Audit.auditorId == auditor.id).all()
        else:
            audits = []
    else:
        # Auditee - get company audits
        company = db.query(Company).filter(Company.user_id == user['id']).first()
        if company:
            audits = db.query(Audit).filter(Audit.companyId == company.id).all()
        else:
            audits = []
    
    return audits

@router.post("/", response_model=AuditResponse)
async def schedule_audit(audit: AuditCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    # Only admin can schedule audits
    if user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admin can schedule audits")
    
    new_audit = Audit(**audit.dict(), status="pending", progress=0, findings=0, criticalFindings=0)
    db.add(new_audit)
    db.commit()
    db.refresh(new_audit)
    
    return new_audit

@router.put("/{audit_id}", response_model=AuditResponse)
async def update_audit(audit_id: int, audit_update: AuditUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    audit = db.query(Audit).filter(Audit.id == audit_id).first()
    if not audit:
        raise HTTPException(status_code=404, detail="Audit not found")
    
    for key, value in audit_update.dict().items():
        setattr(audit, key, value)
    
    db.commit()
    db.refresh(audit)
    
    return audit

# Findings endpoints
@router.get("/findings/company/{company_id}", response_model=List[FindingResponse])
async def get_findings(company_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    findings = db.query(Finding).filter(Finding.company_id == company_id).all()
    return findings

@router.post("/findings", response_model=FindingResponse)
async def create_finding(finding: FindingCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    new_finding = Finding(
        **finding.dict(),
        status="open",
        discovered=date.today(),
        progress=0
    )
    
    db.add(new_finding)
    db.commit()
    db.refresh(new_finding)
    
    # Update audit findings count
    audit = db.query(Audit).filter(Audit.companyId == finding.company_id).first()
    if audit:
        audit.findings += 1
        if finding.severity == "critical":
            audit.criticalFindings += 1
        db.commit()
    
    return new_finding

@router.put("/findings/{finding_id}", response_model=FindingResponse)
async def update_finding(finding_id: int, status: str, progress: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    finding = db.query(Finding).filter(Finding.id == finding_id).first()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")
    
    finding.status = status
    finding.progress = progress
    db.commit()
    db.refresh(finding)
    
    return finding
