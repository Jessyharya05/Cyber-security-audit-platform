-- database/schema.sql (PostgreSQL version)

-- Create database
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
    user_id INTEGER UNIQUE,
    name VARCHAR(100) NOT NULL,
    sector VARCHAR(50),
    employees INTEGER,
    system_type VARCHAR(100),
    exposure_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Assets table
CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    owner VARCHAR(100),
    location VARCHAR(100),
    type VARCHAR(50),
    cia VARCHAR(20),
    criticality DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
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
    companyId INTEGER NOT NULL,
    auditorId INTEGER NOT NULL,
    scope VARCHAR(200),
    startDate DATE,
    endDate DATE,
    status VARCHAR(20) DEFAULT 'pending',
    progress INTEGER DEFAULT 0,
    findings INTEGER DEFAULT 0,
    criticalFindings INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (auditorId) REFERENCES auditors(id) ON DELETE CASCADE
);

-- Findings table
CREATE TABLE findings (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL,
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Evidence table
CREATE TABLE evidence (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL,
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO users (fullName, email, password, role) VALUES 
('Admin User', 'admin@cyberguard.com', 'admin123', 'admin'),
('Auditor User', 'auditor@cyberguard.com', 'auditor123', 'auditor'),
('Tech Solutions Inc', 'company@tech.com', 'company123', 'auditee');

INSERT INTO companies (user_id, name, sector, employees, system_type, exposure_level) VALUES
(3, 'Tech Solutions Inc', 'Technology', 150, 'Web & Cloud', 'Medium');

INSERT INTO auditors (name, email, phone, specialization, certifications, assigned, completed, rating, joinDate) VALUES
('Dr. Robert Wilson', 'robert@cyber.com', '+62 812-3456-7890', 'Network Security', 'CISSP,CEH,CISA', 5, 12, 4.8, '2023-01-15'),
('Lisa Anderson', 'lisa@cyber.com', '+62 813-9876-5432', 'Web Security', 'OSCP,CEH,CISSP', 3, 8, 4.9, '2023-03-20');

INSERT INTO assets (company_id, name, owner, location, type, cia, criticality) VALUES
(1, 'Web Server', 'IT Department', 'AWS Cloud', 'Server', 'High', 8.5),
(1, 'Customer Database', 'IT Department', 'On-premise', 'Database', 'Critical', 9.2),
(1, 'HR Application', 'HR Department', 'Cloud', 'Application', 'Medium', 6.8);
