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
    return db.query(AssetVulnerability).filter(AssetVulnerability.asset_id == asset_id).all()

@router.get("/summary")
def get_risk_summary(db: Session = Depends(get_db)):
    from sqlalchemy import func
    result = db.query(
        AssetVulnerability.risk_level, 
        func.count(AssetVulnerability.risk_level).label('count')
    ).group_by(AssetVulnerability.risk_level).all()
    
    summary = {'Critical': 0, 'High': 0, 'Medium': 0, 'Low': 0}
    for level, count in result:
        summary[level] = count
    return summary