# backend/app/routes/risk.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime
from pydantic import BaseModel

from ..models import (
    SessionLocal, Vulnerability, AssetVulnerability, 
    Asset, NistChecklist, AuditResult, Finding, Company
)
from .auth import get_current_user_dependency

router = APIRouter(prefix="/risk", tags=["Risk Assessment"])

# ========== PYDANTIC MODELS ==========
class VulnerabilityBase(BaseModel):
    name: str
    category: Optional[str] = None
    description: Optional[str] = None
    likelihood_default: Optional[str] = "Medium"
    impact_default: Optional[str] = "Medium"
    cvss_score: Optional[float] = None
    nist_function: Optional[str] = None

class VulnerabilityResponse(VulnerabilityBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class AssetVulnerabilityCreate(BaseModel):
    asset_id: int
    vulnerability_id: int
    likelihood: str
    impact: str

class AssetVulnerabilityResponse(BaseModel):
    id: int
    asset_id: int
    vulnerability_id: int
    likelihood: str
    impact: str
    risk_score: float
    risk_level: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class ChecklistResponse(BaseModel):
    id: int
    control_id: str
    control_name: str
    function_name: str
    category: Optional[str] = None
    description: Optional[str] = None
    audit_procedure: Optional[str] = None
    
    class Config:
        from_attributes = True

class AuditResultCreate(BaseModel):
    asset_id: int
    checklist_id: int
    status: str
    comments: Optional[str] = None

class FindingCreate(BaseModel):
    company_id: int
    asset_id: Optional[int] = None
    vulnerability_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    risk_level: str
    recommendation: Optional[str] = None
    due_date: Optional[date] = None

class FindingResponse(FindingCreate):
    id: int
    status: str
    discovered: date
    progress: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# ========== DATABASE DEPENDENCY ==========
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ========== HELPER FUNCTIONS ==========
def calculate_risk_score(likelihood: str, impact: str) -> dict:
    """Calculate risk score based on likelihood and impact"""
    likelihood_map = {"Low": 1, "Medium": 2, "High": 3}
    impact_map = {"Low": 1, "Medium": 2, "High": 3, "Critical": 4}
    
    l_score = likelihood_map.get(likelihood, 1)
    i_score = impact_map.get(impact, 1)
    
    score = l_score * i_score
    
    if score >= 12:
        level = "Critical"
    elif score >= 8:
        level = "High"
    elif score >= 4:
        level = "Medium"
    else:
        level = "Low"
    
    return {"score": score, "level": level}

def calculate_compliance(company_id: int, db: Session) -> dict:
    """Calculate compliance percentage for a company"""
    assets = db.query(Asset).filter(Asset.company_id == company_id).all()
    if not assets:
        return {"compliance": 0, "details": {}}
    
    total_controls = 0
    compliant_controls = 0
    function_stats = {}
    
    for asset in assets:
        results = db.query(AuditResult).filter(AuditResult.asset_id == asset.id).all()
        for result in results:
            total_controls += 1
            if result.status == "Compliant":
                compliant_controls += 1
            
            checklist = db.query(NistChecklist).filter(NistChecklist.id == result.checklist_id).first()
            if checklist and checklist.function_name:
                if checklist.function_name not in function_stats:
                    function_stats[checklist.function_name] = {"total": 0, "compliant": 0}
                function_stats[checklist.function_name]["total"] += 1
                if result.status == "Compliant":
                    function_stats[checklist.function_name]["compliant"] += 1
    
    overall = (compliant_controls / total_controls * 100) if total_controls > 0 else 0
    
    # Calculate per-function compliance
    function_compliance = {}
    for func, stats in function_stats.items():
        function_compliance[func] = round((stats["compliant"] / stats["total"] * 100) if stats["total"] > 0 else 0)
    
    return {
        "overall": round(overall),
        "by_function": function_compliance,
        "total_controls": total_controls,
        "compliant_controls": compliant_controls
    }

# ========== API ENDPOINTS ==========

# MODULE 4: Vulnerability Library
@router.get("/vulnerabilities", response_model=List[VulnerabilityResponse])
async def get_vulnerabilities(
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Get all vulnerabilities (optionally filtered by category)"""
    query = db.query(Vulnerability)
    if category:
        query = query.filter(Vulnerability.category == category)
    return query.all()

@router.get("/vulnerabilities/{vuln_id}", response_model=VulnerabilityResponse)
async def get_vulnerability(
    vuln_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Get vulnerability by ID"""
    vuln = db.query(Vulnerability).filter(Vulnerability.id == vuln_id).first()
    if not vuln:
        raise HTTPException(status_code=404, detail="Vulnerability not found")
    return vuln

# MODULE 4 & 5: Asset Vulnerability Mapping (Risk Assessment)
@router.post("/assessments", response_model=AssetVulnerabilityResponse)
async def create_assessment(
    assessment: AssetVulnerabilityCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Create a new risk assessment for an asset"""
    # Check if asset exists
    asset = db.query(Asset).filter(Asset.id == assessment.asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    # Check if vulnerability exists
    vuln = db.query(Vulnerability).filter(Vulnerability.id == assessment.vulnerability_id).first()
    if not vuln:
        raise HTTPException(status_code=404, detail="Vulnerability not found")
    
    # Calculate risk
    risk = calculate_risk_score(assessment.likelihood, assessment.impact)
    
    # Check if mapping already exists
    existing = db.query(AssetVulnerability).filter(
        AssetVulnerability.asset_id == assessment.asset_id,
        AssetVulnerability.vulnerability_id == assessment.vulnerability_id
    ).first()
    
    if existing:
        # Update existing
        existing.likelihood = assessment.likelihood
        existing.impact = assessment.impact
        existing.risk_score = risk["score"]
        existing.risk_level = risk["level"]
        db.commit()
        db.refresh(existing)
        return existing
    else:
        # Create new
        new_assessment = AssetVulnerability(
            asset_id=assessment.asset_id,
            vulnerability_id=assessment.vulnerability_id,
            likelihood=assessment.likelihood,
            impact=assessment.impact,
            risk_score=risk["score"],
            risk_level=risk["level"]
        )
        db.add(new_assessment)
        db.commit()
        db.refresh(new_assessment)
        return new_assessment

@router.get("/assessments/asset/{asset_id}", response_model=List[AssetVulnerabilityResponse])
async def get_asset_assessments(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Get all risk assessments for an asset"""
    return db.query(AssetVulnerability).filter(AssetVulnerability.asset_id == asset_id).all()

@router.get("/assessments/{assessment_id}", response_model=AssetVulnerabilityResponse)
async def get_assessment(
    assessment_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Get risk assessment by ID"""
    assessment = db.query(AssetVulnerability).filter(AssetVulnerability.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return assessment

@router.delete("/assessments/{assessment_id}")
async def delete_assessment(
    assessment_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Delete a risk assessment"""
    assessment = db.query(AssetVulnerability).filter(AssetVulnerability.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    db.delete(assessment)
    db.commit()
    return {"success": True, "message": "Assessment deleted"}

# MODULE 6: NIST CSF Checklist
@router.get("/checklist", response_model=List[ChecklistResponse])
async def get_checklist(
    function: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Get NIST CSF checklist (optionally filtered by function)"""
    query = db.query(NistChecklist)
    if function:
        query = query.filter(NistChecklist.function_name == function)
    return query.all()

@router.get("/checklist/{control_id}", response_model=ChecklistResponse)
async def get_checklist_item(
    control_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Get checklist item by control ID"""
    item = db.query(NistChecklist).filter(NistChecklist.control_id == control_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Control not found")
    return item

@router.post("/checklist/generate/{company_id}")
async def generate_checklist(
    company_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Generate audit checklist for a company based on its assets"""
    assets = db.query(Asset).filter(Asset.company_id == company_id).all()
    if not assets:
        raise HTTPException(status_code=404, detail="No assets found for this company")
    
    # Get all checklist items
    checklist_items = db.query(NistChecklist).all()
    
    # For each asset and checklist item, create audit result if not exists
    count = 0
    for asset in assets:
        for item in checklist_items:
            existing = db.query(AuditResult).filter(
                AuditResult.asset_id == asset.id,
                AuditResult.checklist_id == item.id
            ).first()
            
            if not existing:
                new_result = AuditResult(
                    asset_id=asset.id,
                    checklist_id=item.id,
                    status="Not Applicable",
                    auditor_id=current_user.id
                )
                db.add(new_result)
                count += 1
    
    db.commit()
    return {"success": True, "message": f"Generated {count} checklist items"}

# MODULE 8: Audit Results & Compliance
@router.post("/audit-results")
async def create_audit_result(
    result: AuditResultCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Create or update audit result"""
    existing = db.query(AuditResult).filter(
        AuditResult.asset_id == result.asset_id,
        AuditResult.checklist_id == result.checklist_id
    ).first()
    
    if existing:
        existing.status = result.status
        existing.comments = result.comments
        existing.auditor_id = current_user.id
        existing.audit_date = date.today()
        db.commit()
        db.refresh(existing)
        return existing
    else:
        new_result = AuditResult(
            asset_id=result.asset_id,
            checklist_id=result.checklist_id,
            status=result.status,
            comments=result.comments,
            auditor_id=current_user.id
        )
        db.add(new_result)
        db.commit()
        db.refresh(new_result)
        return new_result

@router.get("/compliance/company/{company_id}")
async def get_company_compliance(
    company_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Get compliance score for a company"""
    return calculate_compliance(company_id, db)

@router.get("/compliance/asset/{asset_id}")
async def get_asset_compliance(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Get compliance for a specific asset"""
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    results = db.query(AuditResult).filter(AuditResult.asset_id == asset_id).all()
    
    total = len(results)
    compliant = len([r for r in results if r.status == "Compliant"])
    
    return {
        "asset_id": asset_id,
        "asset_name": asset.name,
        "compliance": round((compliant / total * 100) if total > 0 else 0),
        "total_controls": total,
        "compliant_controls": compliant,
        "results": results
    }

# MODULE 9: Findings Generator
@router.post("/findings/generate/{company_id}")
async def generate_findings(
    company_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Automatically generate findings from audit results"""
    # Get all non-compliant audit results
    non_compliant = db.query(AuditResult).join(
        Asset, AuditResult.asset_id == Asset.id
    ).filter(
        Asset.company_id == company_id,
        AuditResult.status.in_(["Non-Compliant", "Partially Compliant"])
    ).all()
    
    findings = []
    for result in non_compliant:
        # Get related data
        asset = db.query(Asset).filter(Asset.id == result.asset_id).first()
        checklist = db.query(NistChecklist).filter(NistChecklist.id == result.checklist_id).first()
        
        if not asset or not checklist:
            continue
        
        # Check if finding already exists for this
        existing = db.query(Finding).filter(
            Finding.asset_id == asset.id,
            Finding.title.like(f"%{checklist.control_id}%")
        ).first()
        
        if existing:
            continue
        
        # Generate finding
        risk_level = "High" if result.status == "Non-Compliant" else "Medium"
        
        finding = Finding(
            company_id=company_id,
            asset_id=asset.id,
            title=f"Non-compliant: {checklist.control_name} ({checklist.control_id})",
            description=f"Asset '{asset.name}' is {result.status.lower()} for control {checklist.control_id}. {checklist.description}",
            risk_level=risk_level,
            recommendation=checklist.audit_procedure or "Review and implement required controls",
            status="Open",
            progress=0
        )
        db.add(finding)
        findings.append(finding)
    
    db.commit()
    
    return {
        "success": True,
        "message": f"Generated {len(findings)} findings",
        "findings": findings
    }

@router.get("/findings/company/{company_id}", response_model=List[FindingResponse])
async def get_company_findings(
    company_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Get all findings for a company"""
    return db.query(Finding).filter(Finding.company_id == company_id).all()

@router.get("/findings/{finding_id}", response_model=FindingResponse)
async def get_finding(
    finding_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Get finding by ID"""
    finding = db.query(Finding).filter(Finding.id == finding_id).first()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")
    return finding

@router.put("/findings/{finding_id}")
async def update_finding(
    finding_id: int,
    status: Optional[str] = None,
    progress: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Update finding status/progress"""
    finding = db.query(Finding).filter(Finding.id == finding_id).first()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")
    
    if status:
        finding.status = status
    if progress is not None:
        finding.progress = min(max(progress, 0), 100)
    
    db.commit()
    db.refresh(finding)
    return finding

@router.delete("/findings/{finding_id}")
async def delete_finding(
    finding_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Delete a finding"""
    finding = db.query(Finding).filter(Finding.id == finding_id).first()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")
    
    db.delete(finding)
    db.commit()
    return {"success": True, "message": "Finding deleted"}