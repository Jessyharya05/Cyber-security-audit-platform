# backend/app/routes/reports.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date

from ..models import SessionLocal, Company, Asset, Finding, Evidence
from .auth import get_current_user_dependency
from pydantic import BaseModel

router = APIRouter(prefix="/reports", tags=["Reports"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/company/{company_id}/summary")
async def get_company_report_summary(
    company_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Get summary report for a company"""
    # Get company data
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Get assets
    assets = db.query(Asset).filter(Asset.company_id == company_id).all()
    
    # Get findings
    findings = db.query(Finding).filter(Finding.company_id == company_id).all()
    
    # Get evidence
    evidence = db.query(Evidence).filter(Evidence.company_id == company_id).all()
    
    # Calculate stats
    total_findings = len(findings)
    open_findings = len([f for f in findings if f.status == 'open'])
    critical_findings = len([f for f in findings if f.severity == 'critical'])
    
    compliance_rate = round(((total_findings - open_findings) / (total_findings or 1)) * 100)
    
    return {
        "company": {
            "id": company.id,
            "name": company.name,
            "sector": company.sector,
            "exposure_level": company.exposure_level
        },
        "stats": {
            "total_assets": len(assets),
            "critical_assets": len([a for a in assets if a.cia == 'Critical']),
            "total_findings": total_findings,
            "open_findings": open_findings,
            "critical_findings": critical_findings,
            "compliance_rate": compliance_rate,
            "evidence_uploaded": len([e for e in evidence if e.status == 'uploaded']),
            "evidence_pending": len([e for e in evidence if e.status == 'pending'])
        },
        "generated_at": datetime.utcnow().isoformat()
    }

@router.get("/company/{company_id}/compliance")
async def get_compliance_report(
    company_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Get compliance report with NIST CSF mapping"""
    findings = db.query(Finding).filter(Finding.company_id == company_id).all()
    
    # Mock NIST CSF functions compliance
    nist_functions = {
        "Identify": 68,
        "Protect": 72,
        "Detect": 45,
        "Respond": 80,
        "Recover": 55
    }
    
    return {
        "company_id": company_id,
        "nist_csf": nist_functions,
        "overall_compliance": round(sum(nist_functions.values()) / len(nist_functions)),
        "generated_at": datetime.utcnow().isoformat()
    }

@router.get("/company/{company_id}/findings")
async def get_findings_report(
    company_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Get detailed findings report"""
    findings = db.query(Finding).filter(Finding.company_id == company_id).all()
    
    by_severity = {
        "critical": len([f for f in findings if f.severity == 'critical']),
        "high": len([f for f in findings if f.severity == 'high']),
        "medium": len([f for f in findings if f.severity == 'medium']),
        "low": len([f for f in findings if f.severity == 'low'])
    }
    
    by_status = {
        "open": len([f for f in findings if f.status == 'open']),
        "in_progress": len([f for f in findings if f.status == 'in-progress']),
        "closed": len([f for f in findings if f.status == 'closed'])
    }
    
    return {
        "company_id": company_id,
        "total_findings": len(findings),
        "by_severity": by_severity,
        "by_status": by_status,
        "findings": findings,
        "generated_at": datetime.utcnow().isoformat()
    }