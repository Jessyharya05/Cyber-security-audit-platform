# backend/app/routes/assets.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from ..models import SessionLocal, Asset, Company
from .auth import get_current_user
from pydantic import BaseModel, validator
from datetime import datetime

router = APIRouter(prefix="/assets", tags=["Assets"])

# Pydantic models dengan validasi
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

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def calculate_criticality(type: str, location: str, cia: str) -> dict:
    """
    Advanced Criticality Calculation
    Score 0-10 berdasarkan:
    - CIA Values (bobot 60%)
    - Asset Type (bobot 25%)
    - Location Risk (bobot 15%)
    """
    
    # 1. CIA SCORES (bobot 60% - max 6 points)
    cia_scores = {
        'Critical': {'C': 4, 'I': 4, 'A': 4},  # Total 12
        'High': {'C': 3, 'I': 3, 'A': 3},      # Total 9
        'Medium': {'C': 2, 'I': 2, 'A': 2},     # Total 6
        'Low': {'C': 1, 'I': 1, 'A': 1}         # Total 3
    }
    
    cia = cia_scores.get(cia, cia_scores['Low'])
    
    # Weighted CIA:
    # Confidentiality (C) x3, Integrity (I) x3, Availability (A) x2
    cia_weighted = (cia['C'] * 3) + (cia['I'] * 3) + (cia['A'] * 2)
    cia_score = (cia_weighted / 24) * 6  # Normalisasi ke 0-6
    
    # 2. ASSET TYPE WEIGHTS (bobot 25% - max 2.5 points)
    type_weights = {
        'database': 2.5,     # Most critical (data)
        'server': 2.0,       # Infrastructure
        'application': 1.5,  # Business logic
        'network': 1.0       # Connectivity
    }
    
    type_score = type_weights.get(type.lower(), 1.0)
    type_score = (type_score / 2.5) * 2.5  # Normalisasi ke 0-2.5
    
    # 3. LOCATION RISK (bobot 15% - max 1.5 points)
    location_risk = {
        'cloud': 1.5,        # High risk (exposed to internet)
        'hybrid': 1.2,       # Medium risk
        'on-premise': 0.8    # Lower risk (behind firewall)
    }
    
    location_score = location_risk.get(location.lower(), 1.0)
    location_score = (location_score / 1.5) * 1.5  # Normalisasi ke 0-1.5
    
    # 4. TOTAL SCORE (0-10)
    total_score = cia_score + type_score + location_score
    
    # 5. DETERMINE RISK LEVEL
    if total_score >= 8:
        risk_level = "CRITICAL"
    elif total_score >= 6:
        risk_level = "HIGH"
    elif total_score >= 4:
        risk_level = "MEDIUM"
    elif total_score >= 2:
        risk_level = "LOW"
    else:
        risk_level = "INFORMATIONAL"
    
    return {
        "score": round(total_score, 1),
        "level": risk_level,
        "components": {
            "cia": round(cia_score, 1),
            "type": round(type_score, 1),
            "location": round(location_score, 1)
        }
    }

def get_recommendations(asset_type: str, risk_level: str) -> List[str]:
    """Generate recommendations based on asset type and risk level"""
    recommendations = []
    
    # Risk-based recommendations
    if risk_level == "CRITICAL":
        recommendations.append("Monthly security assessments required")
        recommendations.append("Multi-factor authentication mandatory")
        recommendations.append("Real-time monitoring needed")
        recommendations.append("Immediate patch management")
    elif risk_level == "HIGH":
        recommendations.append("Quarterly security reviews")
        recommendations.append("Strong password policy required")
        recommendations.append("Regular backup verification")
        recommendations.append("Access reviews every 3 months")
    elif risk_level == "MEDIUM":
        recommendations.append("Bi-annual security assessment")
        recommendations.append("Standard security controls")
        recommendations.append("Annual access review")
    else:
        recommendations.append("Basic security hygiene sufficient")
    
    # Type-specific recommendations
    if asset_type.lower() == 'database':
        recommendations.append("Encrypt data at rest and in transit")
        recommendations.append("Implement database activity monitoring")
        recommendations.append("Regular backup testing")
    elif asset_type.lower() == 'application':
        recommendations.append("Regular penetration testing")
        recommendations.append("Implement WAF (Web Application Firewall)")
        recommendations.append("Secure SDLC practices")
    elif asset_type.lower() == 'server':
        recommendations.append("Harden OS configuration")
        recommendations.append("Regular vulnerability scanning")
        recommendations.append("Implement host-based IDS")
    elif asset_type.lower() == 'network':
        recommendations.append("Network segmentation")
        recommendations.append("Implement firewall rules")
        recommendations.append("Monitor for unusual traffic")
    
    return recommendations

@router.get("/company/{company_id}", response_model=List[AssetResponse])
async def get_assets(company_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    assets = db.query(Asset).filter(Asset.company_id == company_id).all()
    return assets

@router.post("/", response_model=AssetResponse)
async def create_asset(asset: AssetCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    # Check if company exists and belongs to user
    company = db.query(Company).filter(Company.id == asset.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Calculate criticality with advanced formula
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
    
    # Add recommendations as note (optional - bisa tambah kolom di model)
    # new_asset.recommendations = get_recommendations(asset.type, criticality_result["level"])
    
    return new_asset

@router.put("/{asset_id}", response_model=AssetResponse)
async def update_asset(asset_id: int, asset: AssetUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    db_asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not db_asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    # Update fields
    update_data = asset.dict(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None:
            # Handle case normalization
            if key == 'location':
                setattr(db_asset, key, value.lower())
            elif key == 'type':
                setattr(db_asset, key, value.lower())
            elif key == 'cia':
                setattr(db_asset, key, value.capitalize())
            else:
                setattr(db_asset, key, value)
    
    # Recalculate criticality if relevant fields changed
    if any(field in update_data for field in ['type', 'location', 'cia']):
        criticality_result = calculate_criticality(
            db_asset.type, 
            db_asset.location, 
            db_asset.cia
        )
        db_asset.criticality = criticality_result["score"]
        db_asset.risk_level = criticality_result["level"] 
    
    db.commit()
    db.refresh(db_asset)
    
    return db_asset

@router.delete("/{asset_id}")
async def delete_asset(asset_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    db.delete(asset)
    db.commit()
    
    return {"success": True, "message": "Asset deleted"}

@router.get("/{asset_id}/risk-analysis")
async def get_asset_risk_analysis(asset_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    """Get detailed risk analysis for an asset"""
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    criticality_result = calculate_criticality(asset.type, asset.location, asset.cia)
    recommendations = get_recommendations(asset.type, criticality_result["level"])
    
    return {
        "asset": {
            "id": asset.id,
            "name": asset.name,
            "type": asset.type,
            "location": asset.location,
            "cia": asset.cia
        },
        "criticality": criticality_result,
        "recommendations": recommendations,
        "compliance": {
            "nist_csf": get_nist_mapping(asset.type, criticality_result["level"]),
            "iso_27001": get_iso_mapping(asset.type)
        }
    }

def get_nist_mapping(asset_type: str, risk_level: str) -> dict:
    """Map to NIST CSF functions"""
    mapping = {
        'database': ['PR.DS-1', 'PR.DS-2', 'DE.CM-3'],
        'server': ['PR.AC-4', 'PR.IP-12', 'DE.CM-7'],
        'application': ['PR.AC-3', 'PR.IP-10', 'DE.CM-8'],
        'network': ['PR.AC-5', 'DE.AE-2', 'RS.MI-3']
    }
    return {
        "functions": mapping.get(asset_type.lower(), []),
        "priority": risk_level
    }

def get_iso_mapping(asset_type: str) -> List[str]:
    """Map to ISO 27001 controls"""
    mapping = {
        'database': ['A.8.2.3', 'A.10.1.1', 'A.12.4.1'],
        'server': ['A.9.1.2', 'A.12.5.1', 'A.12.6.1'],
        'application': ['A.14.2.1', 'A.14.2.5', 'A.18.2.3'],
        'network': ['A.13.1.1', 'A.13.1.3', 'A.13.2.1']
    }
    return mapping.get(asset_type.lower(), [])