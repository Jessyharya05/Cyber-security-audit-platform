# backend/app/models.py

from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, Text, DECIMAL, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime

from .config import Config

engine = create_engine(Config.SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Users Table (untuk semua role)
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    fullName = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)  # admin, auditor, auditee
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="user", uselist=False)

# Companies Table (untuk auditee)
class Company(Base):
    __tablename__ = "companies"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    name = Column(String(100), nullable=False)
    sector = Column(String(50))
    employees = Column(Integer)
    system_type = Column(String(100))
    exposure_level = Column(String(20))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="company")
    assets = relationship("Asset", back_populates="company", cascade="all, delete-orphan")
    findings = relationship("Finding", back_populates="company", cascade="all, delete-orphan")
    evidence = relationship("Evidence", back_populates="company", cascade="all, delete-orphan")

# Assets Table
class Asset(Base):
    __tablename__ = "assets"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(100), nullable=False)
    owner = Column(String(100))
    location = Column(String(100))
    type = Column(String(50))
    cia = Column(String(20))
    criticality = Column(DECIMAL(5,2))
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="assets")

# Auditors Table
class Auditor(Base):
    __tablename__ = "auditors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20))
    specialization = Column(String(100))
    certifications = Column(Text)  # Comma-separated
    assigned = Column(Integer, default=0)
    completed = Column(Integer, default=0)
    rating = Column(DECIMAL(2,1), default=0)
    status = Column(String(20), default="active")
    joinDate = Column(Date)
    created_at = Column(DateTime, default=datetime.utcnow)

# Audits Table
class Audit(Base):
    __tablename__ = "audits"
    
    id = Column(Integer, primary_key=True, index=True)
    companyId = Column(Integer, ForeignKey("companies.id"), nullable=False)
    auditorId = Column(Integer, ForeignKey("auditors.id"), nullable=False)
    scope = Column(String(200))
    startDate = Column(Date)
    endDate = Column(Date)
    status = Column(String(20), default="pending")
    progress = Column(Integer, default=0)
    findings = Column(Integer, default=0)
    criticalFindings = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

# Findings Table
class Finding(Base):
    __tablename__ = "findings"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    severity = Column(String(20))  # critical, high, medium, low
    asset = Column(String(100))
    status = Column(String(20), default="open")
    discovered = Column(Date)
    due_date = Column(Date)
    auditor = Column(String(100))
    recommendation = Column(Text)
    progress = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="findings")

# Evidence Table
class Evidence(Base):
    __tablename__ = "evidence"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    control = Column(String(200), nullable=False)
    description = Column(Text)
    asset = Column(String(100))
    due_date = Column(Date)
    status = Column(String(20), default="pending")
    priority = Column(String(20))
    filename = Column(String(255))
    filesize = Column(String(50))
    uploaded_by = Column(String(100))
    uploaded_at = Column(Date)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="evidence")

# Create tables
def init_db():
    Base.metadata.create_all(bind=engine)
