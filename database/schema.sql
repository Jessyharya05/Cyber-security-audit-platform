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
