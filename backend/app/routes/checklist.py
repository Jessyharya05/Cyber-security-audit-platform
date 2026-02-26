# app/routes/checklist.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.database import get_db
from app.models import NistChecklist, AuditResult, Asset
from app.services.compliance_calculator import ComplianceCalculator
from app.routes.auth import get_current_user

router = APIRouter(prefix="/api/checklist", tags=["NIST CSF Checklist"])

# ========== SCHEMAS ==========
class ChecklistResponse(BaseModel):
    id: int
    control_id: str
    control_name: str
    function_name: str
    category: str
    description: str
    audit_procedure: str
    
    class Config:
        from_attributes = True

class AuditResultRequest(BaseModel):
    asset_id: int
    checklist_id: int
    status: str  # Compliant, Partially Compliant, Non-Compliant, Not Applicable
    comments: Optional[str] = None

class AuditResultResponse(BaseModel):
    id: int
    asset_id: int
    checklist_id: int
    status: str
    audit_date: str
    comments: Optional[str]
    
    class Config:
        from_attributes = True

class GenerateChecklistRequest(BaseModel):
    asset_id: int
    vulnerabilities: List[str]  # List nama vulnerability

# ========== ENDPOINTS ==========

@router.get("/", response_model=List[ChecklistResponse])
async def get_all_checklist(
    db: Session = Depends(get_db),
    function: Optional[str] = None
):
    """
    MODUL 6: Get all NIST CSF checklist items
    Bisa filter by function (Identify, Protect, Detect, Respond, Recover)
    """
    query = db.query(NistChecklist)
    
    if function:
        query = query.filter(NistChecklist.function_name == function)
    
    return query.all()


@router.get("/{item_id}", response_model=ChecklistResponse)
async def get_checklist_item(item_id: int, db: Session = Depends(get_db)):
    """
    Get detail checklist item by ID
    """
    item = db.query(NistChecklist).filter(NistChecklist.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Checklist item not found")
    return item


@router.post("/generate", response_model=List[ChecklistResponse])
async def generate_checklist(
    request: GenerateChecklistRequest,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    """
    MODUL 4 → MODUL 6: Generate checklist berdasarkan vulnerabilities yang dipilih
    """
    if user['role'] not in ['admin', 'auditor']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Mapping vulnerability ke control
    mapping = {
        'SQL Injection': ['PR.DS-1', 'ID.RA-1'],
        'Command Injection': ['PR.DS-1'],
        'Weak Password Policy': ['PR.AC-1'],
        'No Account Lockout': ['PR.AC-1'],
        'No HTTPS/TLS': ['PR.DS-2'],
        'Default Credentials': ['PR.AC-1'],
        'Directory Listing Enabled': ['PR.AC-4'],
        'Cross-Site Scripting (XSS)': ['PR.DS-1'],
        'No Audit Logs': ['DE.CM-1'],
        'Outdated Server Software': ['ID.RA-1']
    }
    
    control_ids = set()
    for vuln in request.vulnerabilities:
        if vuln in mapping:
            control_ids.update(mapping[vuln])
    
    if not control_ids:
        return []
    
    # Ambil checklist items dari database
    checklist = db.query(NistChecklist).filter(
        NistChecklist.control_id.in_(control_ids)
    ).all()
    
    return checklist


@router.post("/audit-result", response_model=Audit

# app/routes/checklist.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models import NistChecklist

router = APIRouter(prefix="/checklist", tags=["NIST CSF Checklist"])

@router.get("/")
def get_all_checklist(
    function: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all NIST CSF checklist items"""
    query = db.query(NistChecklist)
    if function:
        query = query.filter(NistChecklist.function_name == function)
    return query.all()