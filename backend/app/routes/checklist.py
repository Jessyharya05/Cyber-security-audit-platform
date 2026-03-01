# app/routes/checklist.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from ..database import get_db
from ..models import NistChecklist, AuditResult, Asset, Company, Audit, Auditor
from .auth import get_current_user_dependency

router = APIRouter(prefix="/checklist", tags=["NIST CSF Checklist"])

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

class ChecklistWithStatusResponse(BaseModel):
    id: int           # ini adalah audit_results.id (atau nist_checklist.id kalau belum ada result)
    checklist_id: int # nist_checklist.id
    control: str
    description: str
    function: str
    companyId: int
    status: str
    evidence: str
    lastUpdated: Optional[str] = None

class ChecklistUpdateRequest(BaseModel):
    status: str
    evidence: Optional[str] = None
    notes: Optional[str] = None

class AuditResultRequest(BaseModel):
    asset_id: int
    checklist_id: int
    status: str
    comments: Optional[str] = None

class AuditResultResponse(BaseModel):
    id: int
    asset_id: Optional[int] = None
    checklist_id: Optional[int] = None
    status: Optional[str] = None
    audit_date: Optional[str] = None
    comments: Optional[str] = None

    class Config:
        from_attributes = True

class GenerateChecklistRequest(BaseModel):
    asset_id: int
    vulnerabilities: List[str]


# ========== ENDPOINTS ==========

@router.get("/company/{company_id}", response_model=List[ChecklistWithStatusResponse])
async def get_checklist_by_company(
    company_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user_dependency)
):
    """
    Ambil semua checklist items untuk company tertentu,
    digabung dengan status audit_results yang sudah ada.
    """
    # Ambil semua nist_checklist
    all_checklists = db.query(NistChecklist).all()

    # Ambil audit_results untuk company ini (via asset)
    # audit_results tidak punya company_id langsung, tapi punya asset_id
    # Cari asset milik company ini
    assets = db.query(Asset).filter(Asset.company_id == company_id).all()
    asset_ids = [a.id for a in assets]

    # Ambil audit results yang punya asset dari company ini
    existing_results = {}
    if asset_ids:
        results = db.query(AuditResult).filter(
            AuditResult.asset_id.in_(asset_ids)
        ).all()
        for r in results:
            existing_results[r.checklist_id] = r
    
    # Juga cek audit_results yang tidak punya asset_id tapi punya checklist_id
    # (hasil dari update sebelumnya yang tidak pakai asset_id)
    results_no_asset = db.query(AuditResult).filter(
        AuditResult.asset_id == None,
        AuditResult.checklist_id != None
    ).all()
    for r in results_no_asset:
        if r.checklist_id not in existing_results:
            existing_results[r.checklist_id] = r

    response = []
    for item in all_checklists:
        result = existing_results.get(item.id)

        # Map status dari DB ke frontend format
        status_map = {
            'Compliant': 'compliant',
            'Partially Compliant': 'partially',
            'Non-Compliant': 'non-compliant',
            'Not Applicable': 'non-compliant',
        }
        raw_status = result.status if result else None
        status = status_map.get(raw_status, 'partially')

        # Map evidence
        evidence = 'pending'
        if result:
            if raw_status == 'Compliant':
                evidence = 'uploaded'
            elif raw_status == 'Non-Compliant':
                evidence = 'missing'
            else:
                evidence = 'pending'

        response.append({
            "id": result.id if result else item.id,
            "checklist_id": item.id,
            "control": item.control_id,
            "description": item.description,
            "function": item.function_name,
            "companyId": company_id,
            "status": status,
            "evidence": evidence,
            "lastUpdated": str(result.audit_date) if result and result.audit_date else None
        })

    return response


@router.get("/", response_model=List[ChecklistResponse])
async def get_all_checklist(
    db: Session = Depends(get_db),
    function: Optional[str] = None
):
    query = db.query(NistChecklist)
    if function:
        query = query.filter(NistChecklist.function_name == function)
    return query.all()


@router.put("/{item_id}")
async def update_checklist_item(
    item_id: int,
    update_data: ChecklistUpdateRequest,
    db: Session = Depends(get_db),
    user = Depends(get_current_user_dependency)
):
    """
    Update status checklist item.
    item_id bisa berupa audit_results.id ATAU nist_checklist.id
    """
    # Map status dari frontend ke DB format
    status_map = {
        'compliant': 'Compliant',
        'partially': 'Partially Compliant',
        'non-compliant': 'Non-Compliant',
    }
    db_status = status_map.get(update_data.status, update_data.status)

    # Coba cari di audit_results by id dulu
    audit_item = db.query(AuditResult).filter(AuditResult.id == item_id).first()

    if not audit_item:
        # Coba cari by checklist_id
        audit_item = db.query(AuditResult).filter(
            AuditResult.checklist_id == item_id
        ).first()

    if not audit_item:
        # Buat baru — pastikan checklist_id valid
        checklist = db.query(NistChecklist).filter(NistChecklist.id == item_id).first()
        if not checklist:
            raise HTTPException(status_code=404, detail=f"Checklist item with id {item_id} not found")

        audit_item = AuditResult(
            checklist_id=item_id,
            asset_id=None,
            auditor_id=user.id,
            status=db_status,
            comments=update_data.notes,
            audit_date=datetime.now().date()
        )
        db.add(audit_item)
    else:
        audit_item.status = db_status
        audit_item.comments = update_data.notes
        audit_item.audit_date = datetime.now().date()

    db.commit()
    db.refresh(audit_item)

    return {
        "success": True,
        "message": "Checklist item updated successfully",
        "data": {
            "id": audit_item.id,
            "checklist_id": audit_item.checklist_id,
            "status": audit_item.status,
            "comments": audit_item.comments,
            "audit_date": str(audit_item.audit_date)
        }
    }


@router.get("/{item_id}", response_model=ChecklistResponse)
async def get_checklist_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(NistChecklist).filter(NistChecklist.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Checklist item not found")
    return item


@router.post("/generate", response_model=List[ChecklistResponse])
async def generate_checklist(
    request: GenerateChecklistRequest,
    db: Session = Depends(get_db),
    user = Depends(get_current_user_dependency)
):
    if user.role not in ['admin', 'auditor']:
        raise HTTPException(status_code=403, detail="Not authorized")

    mapping = {
        'SQL Injection': ['PR.DS-1', 'ID.AM-1'],
        'Command Injection': ['PR.DS-1'],
        'Weak Password Policy': ['PR.AC-1'],
        'No Account Lockout': ['PR.AC-1'],
        'No HTTPS/TLS': ['PR.DS-2'],
        'Default Credentials': ['PR.AC-1'],
        'Directory Listing Enabled': ['PR.AC-4'],
        'Cross-Site Scripting (XSS)': ['PR.DS-1'],
        'No Audit Logs': ['DE.CM-1'],
        'Outdated Server Software': ['ID.AM-1']
    }

    control_ids = set()
    for vuln in request.vulnerabilities:
        if vuln in mapping:
            control_ids.update(mapping[vuln])

    if not control_ids:
        return []

    return db.query(NistChecklist).filter(
        NistChecklist.control_id.in_(control_ids)
    ).all()


@router.post("/audit-result", response_model=AuditResultResponse)
async def create_audit_result(
    request: AuditResultRequest,
    db: Session = Depends(get_db),
    user = Depends(get_current_user_dependency)
):
    if user.role not in ['admin', 'auditor']:
        raise HTTPException(status_code=403, detail="Not authorized")

    asset = db.query(Asset).filter(Asset.id == request.asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    checklist = db.query(NistChecklist).filter(NistChecklist.id == request.checklist_id).first()
    if not checklist:
        raise HTTPException(status_code=404, detail="Checklist item not found")

    existing = db.query(AuditResult).filter(
        AuditResult.asset_id == request.asset_id,
        AuditResult.checklist_id == request.checklist_id
    ).first()

    if existing:
        existing.status = request.status
        existing.comments = request.comments
        existing.audit_date = datetime.now().date()
        db.commit()
        db.refresh(existing)
        return existing
    else:
        audit_result = AuditResult(
            asset_id=request.asset_id,
            checklist_id=request.checklist_id,
            status=request.status,
            comments=request.comments,
            audit_date=datetime.now().date()
        )
        db.add(audit_result)
        db.commit()
        db.refresh(audit_result)
        return audit_result