# backend/app/routes/findings.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime
from sqlalchemy import text

from ..models import SessionLocal, Finding, Company, Audit, Auditor
from .auth import get_current_user_dependency
from pydantic import BaseModel

router = APIRouter(prefix="/findings", tags=["Findings"])

# ─────────────────────────────────────────────
# Pydantic models
# ─────────────────────────────────────────────
class FindingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    asset: Optional[str] = None
    cvss: Optional[float] = None
    severity: Optional[str] = "medium"
    status: Optional[str] = "open"
    discovered: Optional[date] = None
    due_date: Optional[date] = None
    likelihood: Optional[str] = None
    impact: Optional[str] = None
    recommendation: Optional[str] = None
    company_id: Optional[int] = None
    progress: Optional[int] = 0

class FindingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    asset: Optional[str] = None
    cvss: Optional[float] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    likelihood: Optional[str] = None
    impact: Optional[str] = None
    recommendation: Optional[str] = None
    progress: Optional[int] = None

class FindingResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    asset: Optional[str] = None
    cvss: Optional[float] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    discovered: Optional[date] = None
    due_date: Optional[date] = None
    likelihood: Optional[str] = None
    impact: Optional[str] = None
    recommendation: Optional[str] = None
    company_id: Optional[int] = None
    progress: Optional[int] = 0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ─────────────────────────────────────────────
# Dependency & Helpers
# ─────────────────────────────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_auditor_from_user(current_user, db: Session):
    return db.query(Auditor).filter(Auditor.email == current_user.email).first()

def query_findings_safe(db: Session, company_ids: list) -> list:
    """
    Query findings dengan raw SQL — pakai nama kolom yang benar sesuai DB.
    Kolom di DB: id, company_id, title, description, severity, asset,
                 status, discovered, due_date, auditor, recommendation,
                 progress, created_at
    """
    if not company_ids:
        return []

    placeholders = ', '.join([f':id{i}' for i in range(len(company_ids))])
    params = {f'id{i}': cid for i, cid in enumerate(company_ids)}

    sql = text(f"""
        SELECT
            id, company_id, title, description,
            severity, asset,
            recommendation, status, discovered, due_date,
            auditor, progress, created_at
        FROM findings
        WHERE company_id IN ({placeholders})
        ORDER BY created_at DESC
    """)

    rows = db.execute(sql, params).fetchall()

    return [
        {
            "id": r.id,
            "title": r.title,
            "description": r.description,
            "category": None,
            "asset": r.asset,
            "cvss": None,
            "severity": r.severity,
            "status": r.status,
            "discovered": r.discovered,
            "due_date": r.due_date,
            "likelihood": None,
            "impact": None,
            "recommendation": r.recommendation,
            "company_id": r.company_id,
            "progress": r.progress or 0,
            "created_at": r.created_at
        }
        for r in rows
    ]


# ─────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────

@router.get("/my-findings", response_model=List[FindingResponse])
async def get_my_findings(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    if current_user.role != 'auditor':
        raise HTTPException(status_code=403, detail="For auditors only")
    auditor = get_auditor_from_user(current_user, db)
    if not auditor:
        return []
    audits = db.query(Audit).filter(Audit.auditorId == auditor.id).all()
    company_ids = list(set([a.companyId for a in audits]))
    return query_findings_safe(db, company_ids)


@router.get("/company/{company_id}", response_model=List[FindingResponse])
async def get_findings_by_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    return query_findings_safe(db, [company_id])


@router.get("/", response_model=List[FindingResponse])
async def get_findings(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    if current_user.role == 'auditor':
        auditor = get_auditor_from_user(current_user, db)
        if not auditor:
            return []
        audits = db.query(Audit).filter(Audit.auditorId == auditor.id).all()
        company_ids = list(set([a.companyId for a in audits]))
        return query_findings_safe(db, company_ids)

    elif current_user.role == 'auditee':
        company = db.query(Company).filter(Company.user_id == current_user.id).first()
        if not company:
            return []
        return query_findings_safe(db, [company.id])

    else:
        sql = text("""
            SELECT id, company_id, title, description,
                   severity, asset,
                   recommendation, status, discovered, due_date,
                   auditor, progress, created_at
            FROM findings
            ORDER BY created_at DESC
        """)
        rows = db.execute(sql).fetchall()
        return [
            {
                "id": r.id, "title": r.title, "description": r.description,
                "category": None, "asset": r.asset, "cvss": None,
                "severity": r.severity, "status": r.status,
                "discovered": r.discovered, "due_date": r.due_date,
                "likelihood": None, "impact": None,
                "recommendation": r.recommendation,
                "company_id": r.company_id, "progress": r.progress or 0,
                "created_at": r.created_at
            }
            for r in rows
        ]


@router.post("/", response_model=FindingResponse)
async def create_finding(
    finding: FindingCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    company_id = finding.company_id
    if not company_id and current_user.role == 'auditee':
        company = db.query(Company).filter(Company.user_id == current_user.id).first()
        if company:
            company_id = company.id

    if not company_id:
        raise HTTPException(status_code=400, detail="company_id required")

    # Pakai raw SQL insert supaya sesuai kolom DB yang ada
    sql = text("""
        INSERT INTO findings (company_id, title, description, asset, severity,
                              recommendation, status, discovered, due_date,
                              auditor, progress, created_at)
        VALUES (:company_id, :title, :description, :asset, :severity,
                :recommendation, :status, :discovered, :due_date,
                :auditor, :progress, NOW())
        RETURNING id, company_id, title, description, asset, severity,
                  recommendation, status, discovered, due_date,
                  auditor, progress, created_at
    """)

    row = db.execute(sql, {
        "company_id": company_id,
        "title": finding.title,
        "description": finding.description,
        "asset": finding.asset,
        "severity": finding.severity or "medium",
        "recommendation": finding.recommendation,
        "status": finding.status or "open",
        "discovered": finding.discovered or date.today(),
        "due_date": finding.due_date,
        "auditor": getattr(current_user, 'fullname', current_user.email),
        "progress": finding.progress or 0,
    }).fetchone()
    db.commit()

    return {
        "id": row.id,
        "title": row.title,
        "description": row.description,
        "category": finding.category,
        "asset": row.asset,
        "cvss": finding.cvss,
        "severity": row.severity,
        "status": row.status,
        "discovered": row.discovered,
        "due_date": row.due_date,
        "likelihood": finding.likelihood,
        "impact": finding.impact,
        "recommendation": row.recommendation,
        "company_id": row.company_id,
        "progress": row.progress or 0,
        "created_at": row.created_at
    }


@router.get("/{finding_id}", response_model=FindingResponse)
async def get_finding_by_id(
    finding_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    sql = text("""
        SELECT id, company_id, title, description,
               severity, asset,
               recommendation, status, discovered, due_date,
               auditor, progress, created_at
        FROM findings WHERE id = :id
    """)
    row = db.execute(sql, {"id": finding_id}).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Finding not found")
    return {
        "id": row.id, "title": row.title, "description": row.description,
        "category": None, "asset": row.asset, "cvss": None,
        "severity": row.severity, "status": row.status,
        "discovered": row.discovered, "due_date": row.due_date,
        "likelihood": None, "impact": None,
        "recommendation": row.recommendation,
        "company_id": row.company_id, "progress": row.progress or 0,
        "created_at": row.created_at
    }


@router.put("/{finding_id}", response_model=FindingResponse)
async def update_finding(
    finding_id: int,
    data: FindingUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    # Cek finding ada
    check = db.execute(text("SELECT id FROM findings WHERE id = :id"), {"id": finding_id}).fetchone()
    if not check:
        raise HTTPException(status_code=404, detail="Finding not found")

    update_data = data.dict(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")

    # Build SET clause — pakai nama kolom DB langsung
    set_parts = []
    params = {"id": finding_id}
    for key, value in update_data.items():
        if key == 'cvss':
            continue  # kolom tidak ada di DB
        set_parts.append(f"{key} = :{key}")
        params[key] = value

    if not set_parts:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    sql = text(f"""
        UPDATE findings SET {', '.join(set_parts)}
        WHERE id = :id
        RETURNING id, company_id, title, description,
                  severity, asset, recommendation, status,
                  discovered, due_date, auditor, progress, created_at
    """)

    row = db.execute(sql, params).fetchone()
    db.commit()

    return {
        "id": row.id, "title": row.title, "description": row.description,
        "category": None, "asset": row.asset, "cvss": None,
        "severity": row.severity, "status": row.status,
        "discovered": row.discovered, "due_date": row.due_date,
        "likelihood": None, "impact": None,
        "recommendation": row.recommendation,
        "company_id": row.company_id, "progress": row.progress or 0,
        "created_at": row.created_at
    }


@router.delete("/{finding_id}")
async def delete_finding(
    finding_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    check = db.execute(text("SELECT id FROM findings WHERE id = :id"), {"id": finding_id}).fetchone()
    if not check:
        raise HTTPException(status_code=404, detail="Finding not found")
    db.execute(text("DELETE FROM findings WHERE id = :id"), {"id": finding_id})
    db.commit()
    return {"success": True, "message": "Finding deleted"}