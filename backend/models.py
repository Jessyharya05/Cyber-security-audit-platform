# backend/app/models.py

from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, Text, DECIMAL, Date, Enum, Numeric
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime, date

from .config import Config

engine = create_engine(Config.SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# ============================================
# USERS TABLE (untuk semua role)
# ============================================
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    fullname = Column("fullname", String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="user", uselist=False)
    audit_results = relationship("AuditResult", back_populates="auditor")


# ============================================
# COMPANIES TABLE (untuk auditee)
# ============================================
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


# ============================================
# ASSETS TABLE
# ============================================
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
    risk_level = Column(String(20))
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="assets")
    risks = relationship("AssetVulnerability", back_populates="asset", cascade="all, delete-orphan")
    audit_results = relationship("AuditResult", back_populates="asset")
    findings = relationship("Finding", back_populates="asset")


# ============================================
# AUDITORS TABLE
# ============================================
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


# ============================================
# AUDITS TABLE
# ============================================
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


# ============================================
# EVIDENCE TABLE
# ============================================
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


# ============================================
# MODULE 4: OWASP Vulnerability Library
# ============================================
class Vulnerability(Base):
    __tablename__ = "vulnerabilities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50))
    description = Column(Text)
    likelihood_default = Column(Enum('Low', 'Medium', 'High', name='likelihood_enum'), default='Medium')
    impact_default = Column(Enum('Low', 'Medium', 'High', 'Critical', name='impact_enum'), default='Medium')
    cvss_score = Column(Numeric(3,1))
    nist_function = Column(String(20))  # Identify, Protect, Detect, Respond, Recover
    
    # Relationships
    asset_risks = relationship("AssetVulnerability", back_populates="vulnerability")


# ============================================
# MODULE 4 & 5: Asset-Vulnerability Mapping (Risk Assessment)
# ============================================
class AssetVulnerability(Base):
    __tablename__ = "asset_vulnerabilities"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id", ondelete="CASCADE"))
    vulnerability_id = Column(Integer, ForeignKey("vulnerabilities.id", ondelete="CASCADE"))
    likelihood = Column(Enum('Low', 'Medium', 'High', name='likelihood_enum'))
    impact = Column(Enum('Low', 'Medium', 'High', 'Critical', name='impact_enum'))
    risk_score = Column(Numeric(5,2))
    risk_level = Column(Enum('Low', 'Medium', 'High', 'Critical', name='risk_level_enum'))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    asset = relationship("Asset", back_populates="risks")
    vulnerability = relationship("Vulnerability", back_populates="asset_risks")
    findings = relationship("Finding", back_populates="risk")


# ============================================
# MODULE 6: NIST CSF Checklist
# ============================================
class NistChecklist(Base):
    __tablename__ = "nist_checklist"

    id = Column(Integer, primary_key=True, index=True)
    control_id = Column(String(20), nullable=False)
    control_name = Column(String(200), nullable=False)
    function_name = Column(Enum('Identify', 'Protect', 'Detect', 'Respond', 'Recover', name='nist_function_enum'))
    category = Column(String(100))
    description = Column(Text)
    audit_procedure = Column(Text)

    # Relationships
    audit_results = relationship("AuditResult", back_populates="checklist")
    generated_findings = relationship("Finding", back_populates="checklist")


# ============================================
# MODULE 8: Audit Results (Compliance Scoring)
# ============================================
class AuditResult(Base):
    __tablename__ = "audit_results"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id", ondelete="CASCADE"))
    checklist_id = Column(Integer, ForeignKey("nist_checklist.id", ondelete="CASCADE"))
    status = Column(Enum('Compliant', 'Partially Compliant', 'Non-Compliant', 'Not Applicable', name='audit_status_enum'))
    auditor_id = Column(Integer, ForeignKey("users.id"))
    audit_date = Column(Date, default=date.today)
    comments = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    asset = relationship("Asset", back_populates="audit_results")
    checklist = relationship("NistChecklist", back_populates="audit_results")
    auditor = relationship("User", back_populates="audit_results")


# ============================================
# MODULE 9: Audit Findings (SINGLE DEFINITION)
# ============================================
class Finding(Base):
    __tablename__ = "findings"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    asset_id = Column(Integer, ForeignKey("assets.id", ondelete="CASCADE"), nullable=True)
    risk_id = Column(Integer, ForeignKey("asset_vulnerabilities.id", ondelete="SET NULL"), nullable=True)
    checklist_id = Column(Integer, ForeignKey("nist_checklist.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    risk_level = Column(Enum('Low', 'Medium', 'High', 'Critical', name='risk_level_enum'), default='Medium')
    severity = Column(String(20))  # Untuk backward compatibility
    asset_name = Column(String(100))  # Untuk backward compatibility
    recommendation = Column(Text)
    status = Column(Enum('Open', 'In Progress', 'Closed', name='finding_status_enum'), default='Open')
    discovered = Column(Date, default=date.today)
    due_date = Column(Date, nullable=True)
    auditor = Column(String(100), nullable=True)
    progress = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    closed_at = Column(DateTime, nullable=True)

    # Relationships
    company = relationship("Company", back_populates="findings")
    asset = relationship("Asset", back_populates="findings")
    risk = relationship("AssetVulnerability", back_populates="findings")
    checklist = relationship("NistChecklist", back_populates="generated_findings")


# ============================================
# INIT DATABASE FUNCTION
# ============================================
def init_db():
    """Create all tables in database"""
    Base.metadata.create_all(bind=engine)