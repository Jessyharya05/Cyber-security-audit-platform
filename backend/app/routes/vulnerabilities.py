# app/routes/vulnerabilities.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import Vulnerability
from ..schemas import VulnerabilityResponse

router = APIRouter(prefix="/vulnerabilities", tags=["Vulnerabilities"])

@router.get("/", response_model=List[VulnerabilityResponse])
def get_all_vulnerabilities(db: Session = Depends(get_db)):
    """Get all OWASP vulnerabilities"""
    return db.query(Vulnerability).all()

@router.get("/{vuln_id}", response_model=VulnerabilityResponse)
def get_vulnerability(vuln_id: int, db: Session = Depends(get_db)):
    """Get vulnerability by ID"""
    vuln = db.query(Vulnerability).filter(Vulnerability.id == vuln_id).first()
    if not vuln:
        raise HTTPException(status_code=404, detail="Vulnerability not found")
    return vuln