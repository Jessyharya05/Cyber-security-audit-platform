# backend/app/routes/reports.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta

from ..models import SessionLocal, Audit, Finding, Company, User
from .auth import get_current_user

router = APIRouter(prefix="/reports", tags=["Reports"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/compliance")
async def get_compliance_report(db: Session = Depends(get_db), user=Depends(get_current_user)):
    # Get all companies
    companies = db.query(Company).all()
    
    report_data = []
    for company in companies:
        findings = db.query(Finding).filter(Finding.company_id == company.id).all()
        total_findings = len(findings)
        critical = len([f for f in findings if f.severity == 'critical'])
        high = len([f for f in findings if f.severity == 'high'])
        medium = len([f for f in findings if f.severity == 'medium'])
        low = len([f for f in findings if f.severity == 'low'])
        
        # Simple compliance calculation (mock)
        compliance = 100 - (total_findings * 2)
        if compliance < 0:
            compliance = 0
        
        report_data.append({
            "company": company.name,
            "compliance": compliance,
            "findings": {
                "critical": critical,
                "high": high,
                "medium": medium,
                "low": low,
                "total": total_findings
            },
            "last_audit": company.created_at.strftime("%Y-%m-%d")
        })
    
    return {
        "report_name": "Compliance Report",
        "generated": datetime.now().strftime("%Y-%m-%d"),
        "total_companies": len(companies),
        "average_compliance": sum([c["compliance"] for c in report_data]) / len(report_data) if report_data else 0,
        "companies": report_data
    }

@router.get("/findings-summary")
async def get_findings_summary(db: Session = Depends(get_db), user=Depends(get_current_user)):
    findings = db.query(Finding).all()
    
    severity_counts = {
        "critical": len([f for f in findings if f.severity == 'critical']),
        "high": len([f for f in findings if f.severity == 'high']),
        "medium": len([f for f in findings if f.severity == 'medium']),
        "low": len([f for f in findings if f.severity == 'low'])
    }
    
    status_counts = {
        "open": len([f for f in findings if f.status == 'open']),
        "in-progress": len([f for f in findings if f.status == 'in-progress']),
        "closed": len([f for f in findings if f.status == 'closed'])
    }
    
    return {
        "report_name": "Findings Summary",
        "generated": datetime.now().strftime("%Y-%m-%d"),
        "total_findings": len(findings),
        "by_severity": severity_counts,
        "by_status": status_counts
    }

@router.get("/auditor-performance")
async def get_auditor_performance(db: Session = Depends(get_db), user=Depends(get_current_user)):
    from ..models import Auditor
    
    auditors = db.query(Auditor).all()
    
    performance_data = []
    for auditor in auditors:
        audits = db.query(Audit).filter(Audit.auditorId == auditor.id).all()
        completed = len([a for a in audits if a.status == 'completed'])
        in_progress = len([a for a in audits if a.status == 'in-progress'])
        
        performance_data.append({
            "name": auditor.name,
            "specialization": auditor.specialization,
            "assigned": auditor.assigned,
            "completed": completed,
            "in_progress": in_progress,
            "rating": float(auditor.rating),
            "total_findings": sum([a.findings for a in audits])
        })
    
    return {
        "report_name": "Auditor Performance Report",
        "generated": datetime.now().strftime("%Y-%m-%d"),
        "auditors": performance_data
    }
