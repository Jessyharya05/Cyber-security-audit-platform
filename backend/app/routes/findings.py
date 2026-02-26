

# backend/app/routes/findings.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime

from ..models import SessionLocal, Finding, Company, Asset
from .auth import get_current_user_dependency
from pydantic import BaseModel

router = APIRouter(prefix="/findings", tags=["Findings"])

# Pydantic models
class FindingBase(BaseModel):
    title: str
    description: Optional[str] = None
    severity: str
    asset: Optional[str] = None
    asset_id: Optional[int] = None
    recommendation: Optional[str] = None
    due_date: Optional[date] = None

class FindingCreate(FindingBase):
    company_id: int

class FindingResponse(FindingBase):
    id: int
    company_id: int
    status: str
    discovered: date
    progress: int
    created_at: datetime
    
    class Config:
        from_attributes = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[FindingResponse])
async def get_all_findings(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Get all findings (admin only)"""
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin only")
    
    findings = db.query(Finding).all()
    return findings

@router.get("/company/{company_id}")
async def get_findings_by_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Get findings for a specific company"""
    findings = db.query(Finding).filter(Finding.company_id == company_id).all()
    return findings

@router.post("/")
async def create_finding(
    finding: FindingCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Create new finding"""
    new_finding = Finding(
        company_id=finding.company_id,
        title=finding.title,
        description=finding.description,
        severity=finding.severity,
        asset=finding.asset,
        asset_id=finding.asset_id,
        recommendation=finding.recommendation,
        due_date=finding.due_date,
        status="open",
        discovered=date.today(),
        progress=0
    )
    
    db.add(new_finding)
    db.commit()
    db.refresh(new_finding)
    
    return new_finding

@router.get("/{finding_id}")
async def get_finding_by_id(
    finding_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Get finding by ID"""

    finding = db.query(Finding).filter(Finding.id == finding_id).first()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")
    

    return finding

@router.put("/{finding_id}")
async def update_finding(
    finding_id: int,
    finding_data: dict,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Update finding status/progress"""
    finding = db.query(Finding).filter(Finding.id == finding_id).first()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")
    
    for key, value in finding_data.items():
        if hasattr(finding, key):
            setattr(finding, key, value)
    
    db.commit()
    db.refresh(finding)
    
    return finding

@router.delete("/{finding_id}")
async def delete_finding(
    finding_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Delete finding"""

    finding = db.query(Finding).filter(Finding.id == finding_id).first()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")
    
    db.delete(finding)
    db.commit()

    
    return {"success": True, "message": "Finding deleted"}
