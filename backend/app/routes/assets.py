# backend/app/routes/assets.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from ..models import SessionLocal, Asset, Company, Audit, Auditor
from .auth import get_current_user, get_current_user_dependency
from pydantic import BaseModel, validator
from datetime import datetime

router = APIRouter(prefix="/assets", tags=["Assets"])

# ─────────────────────────────────────────────
# Pydantic models
# ─────────────────────────────────────────────
class AssetBase(BaseModel):
    name: str
    owner: str
    location: str
    type: str
    cia: str
    
    @validator('location')
    def validate_location(cls, v):
        allowed = ['cloud', 'on-premise', 'hybrid', 'Cloud', 'On-premise', 'Hybrid']
        if v not in allowed:
            raise ValueError(f'Location must be one of: {allowed}')
        return v.lower()
    
    @validator('type')
    def validate_type(cls, v):
        allowed = ['database', 'server', 'application', 'network', 
                   'Database', 'Server', 'Application', 'Network']
        if v not in allowed:
            raise ValueError(f'Type must be one of: {allowed}')
        return v.lower()
    
    @validator('cia')
    def validate_cia(cls, v):
        allowed = ['Low', 'Medium', 'High', 'Critical', 
                   'low', 'medium', 'high', 'critical']
        if v not in allowed:
            raise ValueError(f'CIA must be one of: Low, Medium, High, Critical')
        return v.capitalize()

class AssetCreate(AssetBase):
    company_id: int

class AssetUpdate(BaseModel):
    name: Optional[str] = None
    owner: Optional[str] = None
    location: Optional[str] = None
    type: Optional[str] = None
    cia: Optional[str] = None

class AssetResponse(AssetBase):
    id: int
    company_id: int
    criticality: float
    risk_level: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# ─────────────────────────────────────────────
# Dependency
# ─────────────────────────────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ─────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────
def get_auditor_from_user(current_user, db: Session):
    return db.query(Auditor).filter(Auditor.email == current_user.email).first()

def calculate_criticality(type: str, location: str, cia: str) -> dict:
    cia_scores = {
        'Critical': {'C': 4, 'I': 4, 'A': 4},
        'High': {'C': 3, 'I': 3, 'A': 3},
        'Medium': {'C': 2, 'I': 2, 'A': 2},
        'Low': {'C': 1, 'I': 1, 'A': 1}
    }
    cia_val = cia_scores.get(cia, cia_scores['Low'])
    cia_weighted = (cia_val['C'] * 3) + (cia_val['I'] * 3) + (cia_val['A'] * 2)
    cia_score = (cia_weighted / 24) * 6
    type_weights = {'database': 2.5, 'server': 2.0, 'application': 1.5, 'network': 1.0}
    type_score = type_weights.get(type.lower(), 1.0)
    location_risk = {'cloud': 1.5, 'hybrid': 1.2, 'on-premise': 0.8}
    location_score = location_risk.get(location.lower(), 1.0)
    total_score = cia_score + type_score + location_score
    if total_score >= 8: risk_level = "CRITICAL"
    elif total_score >= 6: risk_level = "HIGH"
    elif total_score >= 4: risk_level = "MEDIUM"
    elif total_score >= 2: risk_level = "LOW"
    else: risk_level = "INFORMATIONAL"
    return {"score": round(total_score, 1), "level": risk_level}

def get_recommendations(asset_type: str, risk_level: str) -> List[str]:
    recommendations = []
    if risk_level == "CRITICAL":
        recommendations += ["Monthly security assessments required", "Multi-factor authentication mandatory",
                            "Real-time monitoring needed", "Immediate patch management"]
    elif risk_level == "HIGH":
        recommendations += ["Quarterly security reviews", "Strong password policy required",
                            "Regular backup verification", "Access reviews every 3 months"]
    elif risk_level == "MEDIUM":
        recommendations += ["Bi-annual security assessment", "Standard security controls", "Annual access review"]
    else:
        recommendations.append("Basic security hygiene sufficient")
    if asset_type.lower() == 'database':
        recommendations += ["Encrypt data at rest and in transit", "Implement database activity monitoring"]
    elif asset_type.lower() == 'application':
        recommendations += ["Regular penetration testing", "Implement WAF"]
    elif asset_type.lower() == 'server':
        recommendations += ["Harden OS configuration", "Regular vulnerability scanning"]
    elif asset_type.lower() == 'network':
        recommendations += ["Network segmentation", "Implement firewall rules"]
    return recommendations

def get_nist_mapping(asset_type: str, risk_level: str) -> dict:
    mapping = {
        'database': ['PR.DS-1', 'PR.DS-2', 'DE.CM-3'],
        'server': ['PR.AC-4', 'PR.IP-12', 'DE.CM-7'],
        'application': ['PR.AC-3', 'PR.IP-10', 'DE.CM-8'],
        'network': ['PR.AC-5', 'DE.AE-2', 'RS.MI-3']
    }
    return {"functions": mapping.get(asset_type.lower(), []), "priority": risk_level}

def get_iso_mapping(asset_type: str) -> List[str]:
    mapping = {
        'database': ['A.8.2.3', 'A.10.1.1', 'A.12.4.1'],
        'server': ['A.9.1.2', 'A.12.5.1', 'A.12.6.1'],
        'application': ['A.14.2.1', 'A.14.2.5', 'A.18.2.3'],
        'network': ['A.13.1.1', 'A.13.1.3', 'A.13.2.1']
    }
    return mapping.get(asset_type.lower(), [])


# ── STATIC ROUTES ──────────────────

@router.get("/my-assets", response_model=List[AssetResponse])
async def get_my_assets(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    print(f"\n🔍 DEBUG /my-assets => email={current_user.email}, role={current_user.role}, id={current_user.id}")

    if current_user.role == 'auditor':
        auditor = get_auditor_from_user(current_user, db)
        print(f"🔍 DEBUG auditor record => {auditor}")
        if not auditor:
            print("❌ DEBUG auditor not found in auditors table!")
            raise HTTPException(status_code=404, detail="Auditor profile not found")

        audits = db.query(Audit).filter(Audit.auditorId == auditor.id).all()
        print(f"🔍 DEBUG audits => count={len(audits)}, ids={[a.id for a in audits]}")

        company_ids = list(set([a.companyId for a in audits]))
        print(f"🔍 DEBUG company_ids => {company_ids}")

        if not company_ids:
            print("❌ DEBUG no company_ids found, returning []")
            return []

        assets = db.query(Asset).filter(Asset.company_id.in_(company_ids)).all()
        print(f"✅ DEBUG assets found => {len(assets)}")
        return assets

    elif current_user.role == 'auditee':
        company = db.query(Company).filter(Company.user_id == current_user.id).first()
        print(f"🔍 DEBUG auditee company => {company}")
        if not company:
            print("❌ DEBUG company not found for this auditee!")
            raise HTTPException(status_code=404, detail="Company not found")

        assets = db.query(Asset).filter(Asset.company_id == company.id).all()
        print(f"✅ DEBUG auditee assets found => {len(assets)}")
        return assets

    else:
        assets = db.query(Asset).all()
        print(f"✅ DEBUG admin assets => {len(assets)}")
        return assets


@router.get("/company/{company_id}", response_model=List[AssetResponse])
async def get_assets_by_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    if current_user.role == 'auditor':
        auditor = get_auditor_from_user(current_user, db)
        if auditor:
            has_access = db.query(Audit).filter(
                Audit.auditorId == auditor.id,
                Audit.companyId == company_id
            ).first()
            if not has_access:
                raise HTTPException(status_code=403, detail="No access to this company's assets")

    return db.query(Asset).filter(Asset.company_id == company_id).all()


@router.post("/", response_model=AssetResponse)
async def create_asset(
    asset: AssetCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    company = db.query(Company).filter(Company.id == asset.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    criticality_result = calculate_criticality(asset.type, asset.location, asset.cia)

    new_asset = Asset(
        name=asset.name,
        owner=asset.owner,
        location=asset.location.lower(),
        type=asset.type.lower(),
        cia=asset.cia.capitalize(),
        company_id=asset.company_id,
        criticality=criticality_result["score"],
        risk_level=criticality_result["level"],
        status="active"
    )
    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)
    return new_asset


# ── DYNAMIC ROUTES ──────────────────

@router.get("/{asset_id}/risk-analysis")
async def get_asset_risk_analysis(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    criticality_result = calculate_criticality(asset.type, asset.location, asset.cia)
    recommendations = get_recommendations(asset.type, criticality_result["level"])

    return {
        "asset": {"id": asset.id, "name": asset.name, "type": asset.type,
                  "location": asset.location, "cia": asset.cia},
        "criticality": criticality_result,
        "recommendations": recommendations,
        "compliance": {
            "nist_csf": get_nist_mapping(asset.type, criticality_result["level"]),
            "iso_27001": get_iso_mapping(asset.type)
        }
    }


@router.put("/{asset_id}", response_model=AssetResponse)
async def update_asset(
    asset_id: int,
    asset: AssetUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    db_asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not db_asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    update_data = asset.dict(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None:
            if key in ('location', 'type'):
                setattr(db_asset, key, value.lower())
            elif key == 'cia':
                setattr(db_asset, key, value.capitalize())
            else:
                setattr(db_asset, key, value)

    if any(f in update_data for f in ['type', 'location', 'cia']):
        criticality_result = calculate_criticality(db_asset.type, db_asset.location, db_asset.cia)
        db_asset.criticality = criticality_result["score"]
        db_asset.risk_level = criticality_result["level"]

    db.commit()
    db.refresh(db_asset)
    return db_asset


@router.delete("/{asset_id}")
async def delete_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    db.delete(asset)
    db.commit()
    return {"success": True, "message": "Asset deleted"}