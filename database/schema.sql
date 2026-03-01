-- database/schema.sql (PostgreSQL version)

-- Create database (jalankan di pgAdmin)
CREATE DATABASE cyberguard_db;

-- Connect to database
\c cyberguard_db;

-- Users table (for all roles)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    fullName VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'auditor', 'auditee')) NOT NULL,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Companies table (for auditee)
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    sector VARCHAR(50),
    employees INTEGER,
    system_type VARCHAR(100),
    exposure_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assets table
CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    owner VARCHAR(100),
    location VARCHAR(100),
    type VARCHAR(50),
    cia VARCHAR(20),
    criticality DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Auditors table
CREATE TABLE auditors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    specialization VARCHAR(100),
    certifications TEXT,
    assigned INTEGER DEFAULT 0,
    completed INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    joinDate DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audits table
CREATE TABLE audits (
    id SERIAL PRIMARY KEY,
    companyId INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    auditorId INTEGER NOT NULL REFERENCES auditors(id) ON DELETE CASCADE,
    scope VARCHAR(200),
    startDate DATE,
    endDate DATE,
    status VARCHAR(20) DEFAULT 'pending',
    progress INTEGER DEFAULT 0,
    findings INTEGER DEFAULT 0,
    criticalFindings INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Findings table
CREATE TABLE findings (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    severity VARCHAR(20) CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    asset VARCHAR(100),
    status VARCHAR(20) DEFAULT 'open',
    discovered DATE,
    due_date DATE,
    auditor VARCHAR(100),
    recommendation TEXT,
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Evidence table
CREATE TABLE evidence (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    control VARCHAR(200) NOT NULL,
    description TEXT,
    asset VARCHAR(100),
    due_date DATE,
    status VARCHAR(20) DEFAULT 'pending',
    priority VARCHAR(20),
    filename VARCHAR(255),
    filesize VARCHAR(50),
    uploaded_by VARCHAR(100),
    uploaded_at DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (fullName, email, password, role) VALUES 
('Admin User', 'admin@cyberguard.com', 'admin123', 'admin'),
('Auditor User', 'auditor@cyberguard.com', 'auditor123', 'auditor'),
('Tech Solutions Inc', 'company@tech.com', 'company123', 'auditee');

-- Note: Password di atas belum di-hash. Untuk production, hash dulu dengan bcrypt.
-- Tapi untuk development/testing, nanti akan di-hash oleh aplikasi.

-- ============================================
-- MODULE 4: OWASP Vulnerability Library
-- ============================================
CREATE TABLE vulnerabilities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    likelihood_default VARCHAR(10) CHECK (likelihood_default IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
    impact_default VARCHAR(10) CHECK (impact_default IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Medium',
    cvss_score DECIMAL(3,1),
    nist_function VARCHAR(20) CHECK (nist_function IN ('Identify', 'Protect', 'Detect', 'Respond', 'Recover')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert OWASP Top 10
INSERT INTO vulnerabilities (name, category, description, likelihood_default, impact_default, cvss_score, nist_function) VALUES
('SQL Injection', 'Injection', 'Attacker can execute arbitrary SQL queries', 'High', 'Critical', 9.0, 'Protect'),
('Broken Authentication', 'Authentication', 'Authentication mechanisms are vulnerable', 'High', 'Critical', 8.5, 'Protect'),
('Sensitive Data Exposure', 'Data Exposure', 'Sensitive data not properly protected', 'Medium', 'Critical', 7.5, 'Protect'),
('XML External Entities (XXE)', 'Injection', 'XML processors vulnerable to XXE attacks', 'Medium', 'High', 7.0, 'Detect'),
('Broken Access Control', 'Access Control', 'Users can access unauthorized functions', 'High', 'Critical', 8.0, 'Protect'),
('Security Misconfiguration', 'Configuration', 'Security settings not properly configured', 'High', 'Medium', 6.5, 'Protect'),
('Cross-Site Scripting (XSS)', 'XSS', 'Malicious scripts injected into web pages', 'High', 'Medium', 7.0, 'Protect'),
('Insecure Deserialization', 'Deserialization', 'Untrusted data deserialization', 'Medium', 'High', 7.5, 'Detect'),
('Using Components with Known Vulnerabilities', 'Dependencies', 'Using outdated libraries with known vulnerabilities', 'High', 'Medium', 6.0, 'Identify'),
('Insufficient Logging & Monitoring', 'Logging', 'Security events not properly logged', 'Medium', 'Medium', 5.5, 'Detect');

-- ============================================
-- MODULE 4 & 5: Asset-Vulnerability Mapping (Risk Assessment)
-- ============================================
CREATE TABLE asset_vulnerabilities (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    vulnerability_id INTEGER NOT NULL REFERENCES vulnerabilities(id) ON DELETE CASCADE,
    likelihood VARCHAR(10) CHECK (likelihood IN ('Low', 'Medium', 'High')),
    impact VARCHAR(10) CHECK (impact IN ('Low', 'Medium', 'High', 'Critical')),
    risk_score DECIMAL(5,2),
    risk_level VARCHAR(10) CHECK (risk_level IN ('Low', 'Medium', 'High', 'Critical')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(asset_id, vulnerability_id)
);

-- ============================================
-- MODULE 6: NIST CSF Checklist
-- ============================================
CREATE TABLE nist_checklist (
    id SERIAL PRIMARY KEY,
    control_id VARCHAR(20) NOT NULL,
    control_name VARCHAR(200) NOT NULL,
    function_name VARCHAR(20) CHECK (function_name IN ('Identify', 'Protect', 'Detect', 'Respond', 'Recover')),
    category VARCHAR(100),
    description TEXT,
    audit_procedure TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert NIST CSF controls
INSERT INTO nist_checklist (control_id, control_name, function_name, category, description, audit_procedure) VALUES
('ID.AM-1', 'Asset Management', 'Identify', 'Asset Management', 'Physical devices and systems within the organization are inventoried', 'Verify asset inventory exists and is up to date'),
('ID.AM-2', 'Asset Management', 'Identify', 'Asset Management', 'Software platforms and applications within the organization are inventoried', 'Check software inventory'),
('ID.RA-1', 'Risk Assessment', 'Identify', 'Risk Assessment', 'Asset vulnerabilities are identified and documented', 'Review vulnerability scans'),
('PR.AC-1', 'Access Control', 'Protect', 'Access Control', 'Identities and credentials are managed', 'Check password policy and MFA'),
('PR.AC-3', 'Access Control', 'Protect', 'Access Control', 'Remote access is managed', 'Review remote access controls'),
('PR.DS-1', 'Data Security', 'Protect', 'Data Security', 'Data-at-rest is protected', 'Verify encryption at rest'),
('DE.CM-1', 'Continuous Monitoring', 'Detect', 'Continuous Monitoring', 'The network is monitored', 'Check network monitoring tools'),
('RS.RP-1', 'Response Planning', 'Respond', 'Response Planning', 'Response plan is executed', 'Review incident response plan'),
('RC.RP-1', 'Recovery Planning', 'Recover', 'Recovery Planning', 'Recovery plan is executed', 'Review disaster recovery plan');

-- ============================================
-- MODULE 8 & 9: Audit Results & Findings
-- ============================================
CREATE TABLE audit_results (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER REFERENCES assets(id) ON DELETE CASCADE,
    checklist_id INTEGER REFERENCES nist_checklist(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('Compliant', 'Partially Compliant', 'Non-Compliant', 'Not Applicable')),
    auditor_id INTEGER REFERENCES users(id),
    audit_date DATE DEFAULT CURRENT_DATE,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE findings (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    asset_id INTEGER REFERENCES assets(id) ON DELETE SET NULL,
    vulnerability_id INTEGER REFERENCES vulnerabilities(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    risk_level VARCHAR(10) CHECK (risk_level IN ('Low', 'Medium', 'High', 'Critical')),
    recommendation TEXT,
    status VARCHAR(20) CHECK (status IN ('Open', 'In Progress', 'Closed')) DEFAULT 'Open',
    discovered DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);