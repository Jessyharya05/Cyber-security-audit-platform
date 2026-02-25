# app/routes/evidence.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
from pathlib import Path
from datetime import datetime

from ..models import SessionLocal, Evidence, Company
from .auth import get_current_user_dependency

router = APIRouter(prefix="/evidence", tags=["Evidence"])

from pydantic import BaseModel

class EvidenceResponse(BaseModel):
    id: int
    company_id: int
    control: str
    description: Optional[str]
    asset: Optional[str]
    filename: str
    filesize: str
    uploaded_by: str
    uploaded_at: datetime
    
    class Config:
        from_attributes = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# SETUP UPLOAD FOLDER
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {'.pdf', '.png', '.jpg', '.jpeg', '.doc', '.docx', '.txt'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

@router.post("/upload", response_model=EvidenceResponse)
async def upload_evidence(
    company_id: int = Form(...),
    control: str = Form(...),
    description: Optional[str] = Form(None),
    asset: Optional[str] = Form(None),
    priority: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
   user = Depends(get_current_user_dependency)
):
    """Upload evidence file"""
    
    # Cek company exists
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(404, "Company not found")
    
    # Validasi file type
    file_extension = Path(file.filename).suffix.lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, f"File type not allowed. Allowed: {ALLOWED_EXTENSIONS}")
    
    try:
        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_filename = f"{timestamp}_{file.filename}"
        file_path = UPLOAD_DIR / safe_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        file_size = os.path.getsize(file_path)
        
        # Validate file size
        if file_size > MAX_FILE_SIZE:
            file_path.unlink()
            raise HTTPException(400, f"File too large. Max size: {MAX_FILE_SIZE/1024/1024}MB")
        
        # Format file size
        if file_size < 1024:
            size_str = f"{file_size} B"
        elif file_size < 1024*1024:
            size_str = f"{file_size/1024:.1f} KB"
        else:
            size_str = f"{file_size/(1024*1024):.1f} MB"
        
        # Save ke database - PAKAI MODELS DARI DEV A
        db_evidence = Evidence(
            company_id=company_id,
            control=control,
            description=description,
            asset=asset,
            priority=priority,
            filename=file.filename,
            filesize=size_str,
            uploaded_by=user.fullname,  # Dari token!
            uploaded_at=datetime.now().date()
        )
        
        db.add(db_evidence)
        db.commit()
        db.refresh(db_evidence)
        
        return db_evidence
        
    except Exception as e:
        if 'file_path' in locals() and file_path.exists():
            file_path.unlink()
        raise HTTPException(500, str(e))

@router.get("/company/{company_id}", response_model=List[EvidenceResponse])
async def get_company_evidence(
    company_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user_dependency)
):
    """Get all evidence for a company"""
    evidence = db.query(Evidence).filter(Evidence.company_id == company_id).all()
    return evidence

@router.get("/{evidence_id}", response_model=EvidenceResponse)
async def get_evidence(
    evidence_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user_dependency)
):
    """Get evidence by ID"""
    evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not evidence:
        raise HTTPException(404, "Evidence not found")
    return evidence

@router.delete("/{evidence_id}")
async def delete_evidence(
    evidence_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user_dependency)
):
    """Delete evidence"""
    evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not evidence:
        raise HTTPException(404, "Evidence not found")
    
    # Hapus file (cari berdasarkan pola)
    for f in UPLOAD_DIR.glob(f"*_{evidence.filename}"):
        f.unlink()
        break
    
    db.delete(evidence)
    db.commit()
    
    return {"message": "Evidence deleted successfully"}

# TAMBAHKAN ENDPOINT DOWNLOAD
@router.get("/{evidence_id}/download")
async def download_evidence(
    evidence_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user_dependency)
):
    """Download evidence file"""
    from fastapi.responses import FileResponse
    
    evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not evidence:
        raise HTTPException(404, "Evidence not found")
    
    # Cari file
    for f in UPLOAD_DIR.glob(f"*_{evidence.filename}"):
        return FileResponse(
            path=f,
            filename=evidence.filename,
            media_type='application/octet-stream'
        )
    
    raise HTTPException(404, "File not found")