# backend/app/routes/users.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ..models import SessionLocal, User, Company
from .auth import get_current_user_dependency
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["Users"])

# Pydantic models
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    status: str
    lastLogin: Optional[datetime] = None
    company: Optional[str] = None
    
    class Config:
        from_attributes = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[UserResponse])
async def get_all_users(
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user_dependency)
):
    """Get all users (admin only)"""
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Only admin can view all users")
    
    users = db.query(User).all()
    
    result = []
    for u in users:
        company_name = None
        if u.role == 'auditee' and u.company:
            company_name = u.company.name
        
        result.append({
            "id": u.id,
            "name": u.fullname,
            "email": u.email,
            "role": u.role,
            "status": "active",
            "lastLogin": u.last_login,
            "company": company_name
        })
    
    return result

@router.get("/{user_id}")
async def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    """Get specific user by ID"""
    if current_user.role != 'admin' and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    company_name = None
    if user.role == 'auditee' and user.company:
        company_name = user.company.name
    
    return {
        "id": user.id,
        "name": user.fullname,
        "email": user.email,
        "role": user.role,
        "status": "active",
        "lastLogin": user.last_login,
        "company": company_name
    }