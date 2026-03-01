# backend/app/routes/companies.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ..models import SessionLocal, Company, User, Audit
from .auth import get_current_user_dependency
from pydantic import BaseModel

router = APIRouter(prefix="/companies", tags=["Companies"])

# Pydantic models
class CompanyResponse(BaseModel):
    id: int
    name: str
    sector: Optional[str] = None
    employees: Optional[int] = None
    system_type: Optional[str] = None
    exposure_level: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    created_at: Optional[datetime] = None
    status: Optional[str] = "active"
    
    class Config:
        from_attributes = True

class CompanyCreate(BaseModel):
    name: str
    sector: Optional[str] = "Technology"
    employees: Optional[int] = 0
    system_type: Optional[str] = ""
    exposure_level: Optional[str] = "Low"
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    user_id: Optional[int] = None

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def calculate_exposure_level(sector: str, employees: int, system_type: str) -> str:
    """Calculate exposure level based on company data"""
    score = 0
    
    high_risk_sectors = ['Finance', 'Healthcare', 'Government']
    if sector in high_risk_sectors:
        score += 3
    elif sector == 'Technology':
        score += 2
    else:
        score += 1
    
    if employees > 1000:
        score += 3
    elif employees > 100:
        score += 2
    else:
        score += 1
    
    if system_type and 'cloud' in system_type.lower():
        score += 3
    elif system_type and 'web' in system_type.lower():
        score += 2
    else:
        score += 1
    
    if score >= 8:
        return 'High'
    elif score >= 5:
        return 'Medium'
    else:
        return 'Low'

# ===== ADMIN ONLY =====
@router.get("/", response_model=List[CompanyResponse])
async def get_all_companies(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Get all companies (admin only)"""
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin only")
    
    companies = db.query(Company).all()
    
    result = []
    for c in companies:
        user = db.query(User).filter(User.id == c.user_id).first()
        result.append({
            "id": c.id,
            "name": c.name,
            "sector": c.sector,
            "employees": c.employees,
            "system_type": c.system_type,
            "exposure_level": c.exposure_level,
            "email": user.email if user else None,
            "phone": getattr(c, 'phone', None),
            "address": getattr(c, 'address', None),
            "created_at": c.created_at,
            "status": "active"
        })
    
    return result

# ===== AUDITEE ONLY =====
@router.get("/my-company")
async def get_my_company(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Get company for current user (auditee only)"""
    if current_user.role != 'auditee':
        raise HTTPException(status_code=403, detail="Only auditee can access their company")
    
    company = db.query(Company).filter(Company.user_id == current_user.id).first()
    if not company:
        # Return default data
        return {
            "id": 0,
            "name": f"{current_user.fullname}'s Company",
            "sector": "Technology",
            "employees": 0,
            "system_type": "",
            "exposure_level": "Low",
            "email": current_user.email,
            "phone": "",
            "address": "",
            "created_at": datetime.utcnow(),
            "status": "active"
        }
    
    return {
        "id": company.id,
        "name": company.name,
        "sector": company.sector,
        "employees": company.employees,
        "system_type": company.system_type,
        "exposure_level": company.exposure_level,
        "email": current_user.email,
        "phone": getattr(company, 'phone', ''),
        "address": getattr(company, 'address', ''),
        "created_at": company.created_at,
        "status": "active"
    }

# ===== AUDITOR ONLY =====
@router.get("/assigned")
async def get_assigned_companies(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Get companies assigned to current auditor"""
    if current_user.role != 'auditor':
        raise HTTPException(status_code=403, detail="Auditor only")
    
    # Import Audit model
    from ..models import Audit
    
    # PAKAI auditorId (camelCase) karena di MODEL, BUKAN auditor_id
    audits = db.query(Audit).filter(Audit.auditorId == current_user.id).all()
    
    if not audits:
        return []
    
    # Ambil company IDs dari audits (pake companyId, BUKAN company_id)
    company_ids = [a.companyId for a in audits]
    
    # Ambil companies berdasarkan IDs
    companies = db.query(Company).filter(Company.id.in_(company_ids)).all()
    
    result = []
    for c in companies:
        result.append({
            "id": c.id,
            "name": c.name,
            "sector": c.sector,
            "employees": c.employees,
            "system_type": c.system_type,
            "exposure_level": c.exposure_level,
            "status": "active"
        })
    
    return result

# ===== PUBLIC (DENGAN VALIDASI) =====
@router.get("/{company_id}")
async def get_company_by_id(
    company_id: int,
    db: Session = Depends(get_db)
):
    """Get company by ID"""
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    user = db.query(User).filter(User.id == company.user_id).first()
    
    return {
        "id": company.id,
        "name": company.name,
        "sector": company.sector,
        "employees": company.employees,
        "system_type": company.system_type,
        "exposure_level": company.exposure_level,
        "email": user.email if user else '',
        "phone": getattr(company, 'phone', ''),
        "address": getattr(company, 'address', ''),
        "created_at": company.created_at,
        "status": "active"
    }

# ===== ADMIN ONLY =====
@router.post("/")
async def create_company(
    company_data: CompanyCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Create new company (admin only)"""
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin only")
    
    exposure_level = calculate_exposure_level(
        company_data.sector,
        company_data.employees,
        company_data.system_type
    )
    
    new_company = Company(
        user_id=company_data.user_id,
        name=company_data.name,
        sector=company_data.sector,
        employees=company_data.employees,
        system_type=company_data.system_type,
        exposure_level=exposure_level
    )
    
    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    
    return {"success": True, "company": new_company}

# ===== PEMILIK ATAU ADMIN =====
@router.put("/{company_id}")
async def update_company(
    company_id: int,
    company_data: dict,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Update company profile"""
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Check if user owns this company
    if company.user_id != current_user.id and current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Recalculate exposure if relevant fields changed
    recalc = False
    for key, value in company_data.items():
        if hasattr(company, key) and value is not None:
            setattr(company, key, value)
            if key in ['sector', 'employees', 'system_type']:
                recalc = True
    
    if recalc:
        company.exposure_level = calculate_exposure_level(
            company.sector,
            company.employees,
            company.system_type
        )
    
    db.commit()
    db.refresh(company)
    
    return {"success": True, "company": company}

# ===== ADMIN ONLY =====
@router.delete("/{company_id}")
async def delete_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Delete company (admin only)"""
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin only")
    
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    db.delete(company)
    db.commit()
    
    return {"success": True, "message": "Company deleted"}