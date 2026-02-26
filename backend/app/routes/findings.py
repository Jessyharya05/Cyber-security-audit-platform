# app/routes/findings.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from ..database import get_db
from ..models import Finding, AuditResult, Asset
from ..services.finding_generator import FindingGenerator

router = APIRouter(prefix="/findings", tags=["Findings"])

@router.get("/asset/{asset_id}")
def get_asset_findings(
    asset_id: int, 
    status: Optional[str] = Query(None, description="Filter by status (Open, In Progress, Closed)"),
    db: Session = Depends(get_db)
):
    """Get all findings for an asset, optionally filtered by status"""
    query = db.query(Finding).filter(Finding.asset_id == asset_id)
    if status:
        query = query.filter(Finding.status == status)
    return query.all()

@router.post("/generate/{asset_id}")
def generate_findings(asset_id: int, db: Session = Depends(get_db)):
    """Generate findings automatically from audit results"""
    # Get non-compliant audit results
    non_compliant = db.query(AuditResult).filter(
        AuditResult.asset_id == asset_id,
        AuditResult.status.in_(["Non-Compliant", "Partially Compliant"])
    ).all()
    
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    findings = []
    for result in non_compliant:
        finding_data = FindingGenerator.generate_from_audit(result, asset.name)
        
        # Simpan ke database
        finding = Finding(
            asset_id=asset_id,
            title=finding_data['title'],
            description=finding_data['description'],
            risk_level=finding_data.get('severity', 'Medium'),
            recommendation=finding_data['recommendation'],
            status='Open'
        )
        db.add(finding)
        findings.append(finding_data)
    
    db.commit()
    
    return {
        "message": f"Generated {len(findings)} findings",
        "count": len(findings),
        "findings": findings
    }

@router.put("/{finding_id}/status")
def update_finding_status(
    finding_id: int, 
    status: str = Query(..., regex="^(Open|In Progress|Closed)$"),
    db: Session = Depends(get_db)
):
    """Update finding status (Open, In Progress, Closed)"""
    finding = db.query(Finding).filter(Finding.id == finding_id).first()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")
    
    finding.status = status
    db.commit()
    
    return {
        "message": f"Finding status updated to {status}",
        "finding_id": finding_id,
        "status": status
    }

@router.delete("/{finding_id}")
def delete_finding(finding_id: int, db: Session = Depends(get_db)):
    """Delete a finding"""
    finding = db.query(Finding).filter(Finding.id == finding_id).first()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")
    
    db.delete(finding)
    db.commit()
    return {"message": "Finding deleted successfully"}

@router.get("/summary/{asset_id}")
def get_findings_summary(asset_id: int, db: Session = Depends(get_db)):
    """Get summary of findings by status and severity"""
    from sqlalchemy import func
    
    # Count by status
    status_counts = db.query(
        Finding.status, 
        func.count(Finding.status).label('count')
    ).filter(Finding.asset_id == asset_id).group_by(Finding.status).all()
    
    # Count by severity
    severity_counts = db.query(
        Finding.risk_level, 
        func.count(Finding.risk_level).label('count')
    ).filter(Finding.asset_id == asset_id).group_by(Finding.risk_level).all()
    
    return {
        "by_status": {s: c for s, c in status_counts},
        "by_severity": {s: c for s, c in severity_counts},
        "total": sum(c for _, c in status_counts)
    }