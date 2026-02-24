# backend/app/routes/assets.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..models import SessionLocal, Asset, Company
from .auth import get_current_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/assets", tags=["Assets"])

# Pydantic models
class AssetBase(BaseModel):
    name: str
    owner: str
    location: str
    type: str
    cia: str

class AssetCreate(AssetBase):
    company_id: int

class AssetUpdate(AssetBase):
    pass

class AssetResponse(AssetBase):
    id: int
    company_id: int
    criticality: float
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

def calculate_criticality(cia: str) -> float:
    values = {"Low": 1, "Medium": 2, "High": 3, "Critical": 4}
    score = values.get(cia, 2) * 2.5
    return round(score, 1)

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
    
    # Calculate criticality
    criticality = calculate_criticality(asset.cia)
    
    new_asset = Asset(
        **asset.dict(),
        criticality=criticality,
        status="active"
    )
    
    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)
    
    return new_asset

@router.put("/{asset_id}", response_model=AssetResponse)
async def update_asset(asset_id: int, asset: AssetUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    db_asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not db_asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    # Recalculate criticality if CIA changed
    criticality = calculate_criticality(asset.cia)
    
    for key, value in asset.dict().items():
        setattr(db_asset, key, value)
    db_asset.criticality = criticality
    
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
