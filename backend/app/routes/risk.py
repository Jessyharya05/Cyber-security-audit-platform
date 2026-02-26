# app/routes/risk.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from app.database import get_db
from app.models import Vulnerability, AssetVulnerability, Asset
from app.services.risk_calculator import RiskCalculator
from app.utils.owasp_data import VULNERABILITY_IMPACT_MAPPING
from app.routes.auth import get_current_user

router = APIRouter(prefix="/api/risk", tags=["Risk Assessment"])

# ========== SCHEMAS ==========
class VulnerabilityResponse(BaseModel):
    id: int
    name: str
    category: str
    description: str
    likelihood_default: str
    impact_default: str
    cvss_score: float
    nist_function: str
    
    class Config:
        from_attributes = True

class RiskAssessmentRequest(BaseModel):
    asset_id: int
    vulnerability_id: int
    likelihood: Optional[str] = None
    impact: Optional[str] = None

class RiskAssessmentResponse(BaseModel):
    id: int
    asset_id: int
    vulnerability_name: str
    likelihood: str
    impact: str
    risk_score: float
    risk_level: str
    impact_example: Optional[str] = None
    
    class Config:
        from_attributes = True

class RiskSummaryResponse(BaseModel):
    Critical: int
    High: int
    Medium: int
    Low: int

class RiskMatrixResponse(BaseModel):
    matrix: dict

# ========== ENDPOINTS ==========

@router.get("/vulnerabilities", response_model=List[VulnerabilityResponse])
async def get_all_vulnerabilities(
    db: Session = Depends(get_db),
    category: Optional[str] = None,
    nist_function: Optional[str] = None
):
    """
    MODUL 4: Get OWASP vulnerabilities (bisa filter by category atau nist_function)
    """
    query = db.query(Vulnerability)
    
    if category:
        query = query.filter(Vulnerability.category == category)
    if nist_function:
        query = query.filter(Vulnerability.nist_function == nist_function)
    
    return query.all()


@router.get("/vulnerabilities/{vuln_id}", response_model=VulnerabilityResponse)
async def get_vulnerability(vuln_id: int, db: Session = Depends(get_db)):
    """
    Get detail vulnerability by ID
    """
    vuln = db.query(Vulnerability).filter(Vulnerability.id == vuln_id).first()
    if not vuln:
        raise HTTPException(status_code=404, detail="Vulnerability not found")
    return vuln


@router.post("/assess", response_model=RiskAssessmentResponse)
async def assess_risk(
    request: RiskAssessmentRequest,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    """
    MODUL 4 & 5: Assess risk untuk asset dengan vulnerability
    - Auto suggest likelihood & impact jika tidak disediakan
    - Hitung risk score = Likelihood × Impact
    - Tentukan risk level
    """
    # Validasi user role (hanya auditor/admin)
    if user['role'] not in ['admin', 'auditor']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Cek asset exists
    asset = db.query(Asset).filter(Asset.id == request.asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    # Cek vulnerability exists
    vuln = db.query(Vulnerability).filter(Vulnerability.id == request.vulnerability_id).first()
    if not vuln:
        raise HTTPException(status_code=404, detail="Vulnerability not found")
    
    # Tentukan likelihood & impact
    if request.likelihood:
        likelihood = request.likelihood
    else:
        likelihood = RiskCalculator.suggest_likelihood(vuln.name)
    
    if request.impact:
        impact = request.impact
    else:
        impact = RiskCalculator.suggest_impact(vuln.name)
    
    # Hitung risk
    risk_score = RiskCalculator.calculate_risk_score(likelihood, impact)
    risk_level = RiskCalculator.get_risk_level(risk_score)
    
    # Simpan ke database
    asset_vuln = AssetVulnerability(
        asset_id=request.asset_id,
        vulnerability_id=request.vulnerability_id,
        likelihood=likelihood,
        impact=impact,
        risk_score=risk_score,
        risk_level=risk_level
    )
    
    db.add(asset_vuln)
    db.commit()
    db.refresh(asset_vuln)
    
    # Dapatkan impact example
    impact_example = VULNERABILITY_IMPACT_MAPPING.get(vuln.name)
    
    return {
        "id": asset_vuln.id,
        "asset_id": asset_vuln.asset_id,
        "vulnerability_name": vuln.name,
        "likelihood": asset_vuln.likelihood,
        "impact": asset_vuln.impact,
        "risk_score": asset_vuln.risk_score,
        "risk_level": asset_vuln.risk_level,
        "impact_example": impact_example
    }


@router.get("/asset/{asset_id}", response_model=List[RiskAssessmentResponse])
async def get_asset_risks(
    asset_id: int,
    db: Session = Depends(get_db)
):
    """
    Get semua risks untuk suatu asset
    """
    risks = db.query(AssetVulnerability).filter(
        AssetVulnerability.asset_id == asset_id
    ).all()
    
    result = []
    for r in risks:
        vuln = db.query(Vulnerability).filter(Vulnerability.id == r.vulnerability_id).first()
        result.append({
            "id": r.id,
            "asset_id": r.asset_id,
            "vulnerability_name": vuln.name if vuln else "Unknown",
            "likelihood": r.likelihood,
            "impact": r.impact,
            "risk_score": r.risk_score,
            "risk_level": r.risk_level
        })
    
    return result


@router.get("/summary", response_model=RiskSummaryResponse)
async def get_risk_summary(db: Session = Depends(get_db)):
    """
    Get summary jumlah risk per level
    """
    risks = db.query(AssetVulnerability).all()
    
    summary = {
        'Critical': 0,
        'High': 0,
        'Medium': 0,
        'Low': 0
    }
    
    for r in risks:
        summary[r.risk_level] += 1
    
    return summary


@router.get("/matrix", response_model=RiskMatrixResponse)
async def get_risk_matrix(db: Session = Depends(get_db)):
    """
    MODUL 5: Generate risk matrix (heatmap) untuk visualisasi
    """
    risks = db.query(AssetVulnerability).all()
    
    # Konversi ke format yang bisa diproses
    risks_data = [
        {"likelihood": r.likelihood, "impact": r.impact}
        for r in risks
    ]
    
    matrix = RiskCalculator.generate_risk_matrix(risks_data)
    
    return {"matrix": matrix}


@router.delete("/{risk_id}")
async def delete_risk(
    risk_id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    """
    Delete risk assessment (hanya admin)
    """
    if user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Not authorized")
    
    risk = db.query(AssetVulnerability).filter(AssetVulnerability.id == risk_id).first()
    if not risk:
        raise HTTPException(status_code=404, detail="Risk not found")
    
    db.delete(risk)
    db.commit()
    
    return {"message": "Risk deleted successfully"}

    # app/routes/risk.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import AssetVulnerability, Vulnerability, Asset
from ..schemas import RiskAssessmentRequest, RiskAssessmentResponse
from ..services.risk_calculator import RiskCalculator

router = APIRouter(prefix="/risk", tags=["Risk Assessment"])

@router.post("/assess", response_model=RiskAssessmentResponse)
def assess_risk(request: RiskAssessmentRequest, db: Session = Depends(get_db)):
    """Calculate risk score (Likelihood × Impact)"""
    vuln = db.query(Vulnerability).filter(Vulnerability.id == request.vulnerability_id).first()
    if not vuln:
        raise HTTPException(status_code=404, detail="Vulnerability not found")
    
    risk_score = RiskCalculator.calculate(request.likelihood, request.impact)
    risk_level = RiskCalculator.get_level(risk_score)
    
    asset_vuln = AssetVulnerability(
        asset_id=request.asset_id,
        vulnerability_id=request.vulnerability_id,
        likelihood=request.likelihood,
        impact=request.impact,
        risk_score=risk_score,
        risk_level=risk_level
    )
    db.add(asset_vuln)
    db.commit()
    db.refresh(asset_vuln)
    
    return {
        "id": asset_vuln.id,
        "asset_id": asset_vuln.asset_id,
        "vulnerability_name": vuln.name,
        "likelihood": asset_vuln.likelihood,
        "impact": asset_vuln.impact,
        "risk_score": asset_vuln.risk_score,
        "risk_level": asset_vuln.risk_level
    }

@router.get("/asset/{asset_id}")
def get_asset_risks(asset_id: int, db: Session = Depends(get_db)):
    """Get all risks for an asset"""
    risks = db.query(AssetVulnerability).filter(AssetVulnerability.asset_id == asset_id).all()
    return risks

@router.get("/summary")
def get_risk_summary(db: Session = Depends(get_db)):
    """Get summary of risks by level"""
    from sqlalchemy import func
    result = db.query(
        AssetVulnerability.risk_level, 
        func.count(AssetVulnerability.risk_level).label('count')
    ).group_by(AssetVulnerability.risk_level).all()
    
    summary = {'Critical': 0, 'High': 0, 'Medium': 0, 'Low': 0}
    for level, count in result:
        summary[level] = count
    return summary