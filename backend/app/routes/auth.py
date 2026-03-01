# backend/app/routes/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, date
from jose import JWTError, jwt
from passlib.context import CryptContext
from typing import Optional

from ..models import SessionLocal, User, Company, Auditor, Audit
from ..config import Config
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

# ─────────────────────────────────────────────
# Pydantic models
# ─────────────────────────────────────────────
class UserCreate(BaseModel):
    fullname: str
    email: str
    password: str
    role: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class CompanyProfile(BaseModel):
    companyName: Optional[str] = None
    sector: Optional[str] = None
    employees: Optional[int] = None
    systemType: Optional[str] = None

# ─────────────────────────────────────────────
# DB Dependency
# ─────────────────────────────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ─────────────────────────────────────────────
# Helper functions
# ─────────────────────────────────────────────
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, Config.SECRET_KEY, algorithm=Config.ALGORITHM)

def calculate_exposure_level(sector: str, employees: int, system_type: str) -> str:
    score = 0
    if sector in ['Finance', 'Healthcare', 'Government']:
        score += 3
    elif sector == 'Technology':
        score += 2
    else:
        score += 1

    if employees > 1000:
        score += 3
    elif employees > 100:
        score += 2
    else:
        score += 1

    if system_type and 'cloud' in system_type.lower():
        score += 3
    else:
        score += 1

    if score >= 8: return 'High'
    elif score >= 5: return 'Medium'
    else: return 'Low'


# ─────────────────────────────────────────────
# ✅ DEPENDENCY FUNCTIONS — bisa dipakai Depends() di semua route
# Kedua nama ini sengaja dibuat sama fungsinya supaya backward compatible
# ─────────────────────────────────────────────
async def get_current_user_dependency(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Dependency utama untuk autentikasi.
    Dipakai di semua route: Depends(get_current_user_dependency)
    """
    try:
        payload = jwt.decode(token, Config.SECRET_KEY, algorithms=[Config.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user


# ✅ Alias — supaya file lain yang masih pakai get_current_user tidak error
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Alias dari get_current_user_dependency.
    Dipakai di route lama yang import: from .auth import get_current_user
    """
    return await get_current_user_dependency(token=token, db=db)


# ─────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────

@router.post("/register")
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    print("="*50)
    print(f"REGISTER: {user_data.fullname} | {user_data.email} | {user_data.role}")
    print("="*50)

    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    try:
        hashed_password = get_password_hash(user_data.password)
        new_user = User(
            fullname=user_data.fullname,
            email=user_data.email,
            password=hashed_password,
            role=user_data.role
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print(f"✅ User created: {new_user.id} - {new_user.email}")

        # ── AUDITEE ──
        if user_data.role == 'auditee':
            company = Company(
                user_id=new_user.id,
                name=f"{user_data.fullname}'s Company",
                sector='Technology',
                employees=0,
                system_type='',
                exposure_level='Low'
            )
            db.add(company)
            db.commit()
            print(f"✅ Company created: {company.name}")

        # ── AUDITOR ──
        elif user_data.role == 'auditor':
            auditor = Auditor(
                name=user_data.fullname,
                email=user_data.email,
                phone='',
                specialization='General',
                certifications='',
                assigned=0,
                completed=0,
                rating=0,
                status='active',
                joinDate=date.today()
            )
            db.add(auditor)
            db.commit()
            db.refresh(auditor)
            print(f"✅ Auditor created: {auditor.name} (id={auditor.id})")

            all_companies = db.query(Company).all()
            for company in all_companies:
                db.add(Audit(
                    companyId=company.id,
                    auditorId=auditor.id,
                    scope='Initial Security Audit',
                    status='pending',
                    progress=0,
                    findings=0,
                    criticalFindings=0
                ))
            db.commit()
            print(f"✅ Created {len(all_companies)} audits for {auditor.name}")

        access_token = create_access_token(
            data={"sub": new_user.email, "role": new_user.role},
            expires_delta=timedelta(minutes=Config.ACCESS_TOKEN_EXPIRE_MINUTES)
        )

        return {
            "success": True,
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": new_user.id,
                "name": new_user.fullname,
                "email": new_user.email,
                "role": new_user.role
            }
        }

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    print(f"🔐 Login: {user_data.email}")

    user = authenticate_user(db, user_data.email, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user.last_login = datetime.utcnow()
    db.commit()

    if user.role == 'auditor':
        auditor = db.query(Auditor).filter(Auditor.email == user.email).first()

        if not auditor:
            auditor = Auditor(
                name=user.fullname,
                email=user.email,
                phone='',
                specialization='General',
                certifications='',
                assigned=0,
                completed=0,
                rating=0,
                status='active',
                joinDate=date.today()
            )
            db.add(auditor)
            db.commit()
            db.refresh(auditor)
            print(f"✅ Created missing auditor: {auditor.name} (id={auditor.id})")

        existing_audits = db.query(Audit).filter(Audit.auditorId == auditor.id).count()
        if existing_audits == 0:
            all_companies = db.query(Company).all()
            for company in all_companies:
                db.add(Audit(
                    companyId=company.id,
                    auditorId=auditor.id,
                    scope='Initial Security Audit',
                    status='pending',
                    progress=0,
                    findings=0,
                    criticalFindings=0
                ))
            db.commit()
            print(f"✅ Created {len(all_companies)} audits on login for {auditor.name}")

    access_token = create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=timedelta(minutes=Config.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    print(f"✅ Login success: {user.email}")

    return {
        "success": True,
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.fullname,
            "email": user.email,
            "role": user.role
        }
    }


@router.post("/token")
async def login_oauth2(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Endpoint untuk OAuth2 flow (Swagger Authorize)"""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=timedelta(minutes=Config.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
async def logout():
    return {"success": True, "message": "Logged out successfully"}


# ✅ /auth/me — sekarang pakai get_current_user_dependency yang benar
@router.get("/me")
async def get_me(current_user = Depends(get_current_user_dependency)):
    return {
        "id": current_user.id,
        "name": current_user.fullname,
        "email": current_user.email,
        "role": current_user.role
    }