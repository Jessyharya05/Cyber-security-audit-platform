-- ============================================
-- CYBERGUARD DATABASE SCHEMA
-- Untuk Backend Developer C (Risk Assessment)
-- ============================================

CREATE DATABASE IF NOT EXISTS cyberguard_db;
USE cyberguard_db;

-- ============================================
-- MODULE 4: OWASP Vulnerability Library
-- ============================================
CREATE TABLE IF NOT EXISTS vulnerabilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    likelihood_default ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    impact_default ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    cvss_score DECIMAL(3,1),
    nist_function VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSERT OWASP Top 10 (PRE-POPULATE)
INSERT INTO vulnerabilities (name, category, description, likelihood_default, impact_default, cvss_score, nist_function) VALUES
-- Injection
('SQL Injection', 'Injection', 'Attacker can execute arbitrary SQL queries', 'High', 'Critical', 9.0, 'Protect'),
('Command Injection', 'Injection', 'Attacker can execute system commands', 'Medium', 'Critical', 8.5, 'Protect'),
('LDAP Injection', 'Injection', 'Attacker can manipulate LDAP queries', 'Low', 'High', 6.5, 'Protect'),

-- Broken Authentication
('Weak Password Policy', 'Broken Authentication', 'Passwords do not meet complexity requirements', 'High', 'High', 7.5, 'Protect'),
('No Account Lockout', 'Broken Authentication', 'No protection against brute force', 'High', 'Medium', 6.5, 'Protect'),
('Session Hijacking', 'Broken Authentication', 'Session tokens can be stolen', 'Medium', 'High', 7.0, 'Protect'),

-- Sensitive Data Exposure
('No HTTPS/TLS', 'Sensitive Data Exposure', 'Data transmitted in plaintext', 'High', 'Critical', 8.0, 'Protect'),
('Weak Encryption', 'Sensitive Data Exposure', 'Outdated or weak encryption algorithms', 'Medium', 'High', 7.5, 'Protect'),
('Exposed Database Backup', 'Sensitive Data Exposure', 'Backup files publicly accessible', 'Low', 'Critical', 7.0, 'Protect'),

-- Access Control Failures
('IDOR', 'Access Control Failures', 'Insecure Direct Object References', 'Medium', 'High', 6.5, 'Protect'),
('Privilege Escalation', 'Access Control Failures', 'Users can gain higher privileges', 'Low', 'Critical', 8.0, 'Protect'),

-- Security Misconfiguration
('Default Credentials', 'Security Misconfiguration', 'Default usernames/passwords unchanged', 'High', 'High', 8.5, 'Protect'),
('Directory Listing Enabled', 'Security Misconfiguration', 'Directory contents visible', 'Medium', 'Low', 4.5, 'Protect'),
('Exposed Admin Panel', 'Security Misconfiguration', 'Admin interface publicly accessible', 'Medium', 'High', 7.0, 'Protect'),
('Open Unnecessary Ports', 'Security Misconfiguration', 'Unused network ports open', 'Medium', 'Medium', 5.5, 'Protect'),

-- Cross-Site Attacks
('Cross-Site Scripting (XSS)', 'Cross-Site Attacks', 'Malicious scripts injected', 'High', 'Medium', 6.5, 'Protect'),
('Cross-Site Request Forgery (CSRF)', 'Cross-Site Attacks', 'Unauthorized commands from trusted user', 'Medium', 'Medium', 6.0, 'Protect'),

-- Logging & Monitoring
('No Audit Logs', 'Logging & Monitoring', 'Security events not logged', 'High', 'Medium', 5.5, 'Detect'),

-- Dependency Issues
('Outdated Server Software', 'Dependency Issues', 'Known vulnerabilities in outdated software', 'Medium', 'High', 7.5, 'Protect');

-- ============================================
-- Mapping Vulnerability ke Impact (untuk MODUL 4.4)
-- ============================================
CREATE TABLE IF NOT EXISTS vulnerability_impact_mapping (
    vulnerability_name VARCHAR(100) PRIMARY KEY,
    impact_example TEXT NOT NULL
);

INSERT INTO vulnerability_impact_mapping (vulnerability_name, impact_example) VALUES
('SQL Injection', 'Database theft'),
('Cross-Site Scripting (XSS)', 'Account hijacking'),
('Cross-Site Request Forgery (CSRF)', 'Unauthorized transaction'),
('Weak Password Policy', 'Account takeover'),
('No Audit Logs', 'Incident undetected'),
('Outdated Server Software', 'Remote exploit');

-- ============================================
-- Asset-Vulnerability Mapping (MODUL 5)
-- ============================================
CREATE TABLE IF NOT EXISTS asset_vulnerabilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    vulnerability_id INT NOT NULL,
    likelihood ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    impact ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    risk_score DECIMAL(5,2),
    risk_level ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vulnerability_id) REFERENCES vulnerabilities(id) ON DELETE CASCADE
);

-- ============================================
-- NIST CSF Checklist (MODUL 6)
-- ============================================
CREATE TABLE IF NOT EXISTS nist_checklist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    control_id VARCHAR(20) NOT NULL,
    control_name VARCHAR(200) NOT NULL,
    function_name ENUM('Identify', 'Protect', 'Detect', 'Respond', 'Recover') NOT NULL,
    category VARCHAR(100),
    description TEXT,
    audit_procedure TEXT
);

INSERT INTO nist_checklist (control_id, control_name, function_name, category, description, audit_procedure) VALUES
-- IDENTIFY
('ID.AM-1', 'Physical devices inventory', 'Identify', 'Asset Management', 'Physical devices and systems within the organization are inventoried', 'Verify hardware inventory list exists and is updated'),
('ID.AM-2', 'Software platforms inventory', 'Identify', 'Asset Management', 'Software platforms and applications within the organization are inventoried', 'Check software inventory list'),
('ID.RA-1', 'Vulnerability assessment', 'Identify', 'Risk Assessment', 'Asset vulnerabilities are identified and documented', 'Review vulnerability scan reports'),

-- PROTECT
('PR.AC-1', 'Identity and credential management', 'Protect', 'Access Control', 'Identities and credentials are managed for authorized devices and users', 'Verify password policy enforces minimum 8 characters and complexity'),
('PR.AC-4', 'Access permissions', 'Protect', 'Access Control', 'Access permissions are managed with least privilege', 'Review user permissions and access rights'),
('PR.DS-1', 'Data-at-rest protection', 'Protect', 'Data Security', 'Data-at-rest is protected', 'Check encryption at rest implementation'),
('PR.DS-2', 'Data-in-transit protection', 'Protect', 'Data Security', 'Data-in-transit is protected', 'Verify TLS certificate installed and HTTPS enforced'),
('PR.IP-4', 'Backup policy', 'Protect', 'Information Protection', 'Backup policies and procedures are maintained', 'Check backup logs and restoration tests'),

-- DETECT
('DE.CM-1', 'Network monitoring', 'Detect', 'Continuous Monitoring', 'The network is monitored to detect potential cybersecurity events', 'Check monitoring tools and alerts'),
('DE.CM-7', 'Monitoring for unauthorized activity', 'Detect', 'Continuous Monitoring', 'Monitoring for unauthorized personnel, connections, devices, and software is performed', 'Review access logs and anomaly detection'),

-- RESPOND
('RS.RP-1', 'Response plan', 'Respond', 'Response Planning', 'Response plan is executed during or after an incident', 'Review incident response procedures'),
('RS.MI-1', 'Incident mitigation', 'Respond', 'Mitigation', 'Incidents are contained and mitigated', 'Test incident response capabilities'),

-- RECOVER
('RC.RP-1', 'Recovery plan', 'Recover', 'Recovery Planning', 'Recovery plan is executed during or after an incident', 'Test backup restoration procedures'),
('RC.IM-2', 'Recovery improvements', 'Recover', 'Improvements', 'Recovery strategies are updated', 'Review lessons learned from recovery tests');

-- ============================================
-- Audit Results (MODUL 8)
-- ============================================
CREATE TABLE IF NOT EXISTS audit_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    checklist_id INT NOT NULL,
    status ENUM('Compliant', 'Partially Compliant', 'Non-Compliant', 'Not Applicable') DEFAULT 'Non-Compliant',
    auditor_id INT,
    audit_date DATE,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (checklist_id) REFERENCES nist_checklist(id) ON DELETE CASCADE
);

-- ============================================
-- Audit Findings (MODUL 9)
-- ============================================
CREATE TABLE IF NOT EXISTS findings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    vulnerability_id INT,
    checklist_id INT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    risk_level ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    recommendation TEXT,
    status ENUM('Open', 'In Progress', 'Closed') DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Mapping Vulnerability ke NIST Function (untuk MODUL 4)
-- ============================================
CREATE TABLE IF NOT EXISTS vuln_to_nist_mapping (
    vulnerability_name VARCHAR(100) PRIMARY KEY,
    nist_function VARCHAR(20) NOT NULL,
    recommendation TEXT
);

INSERT INTO vuln_to_nist_mapping (vulnerability_name, nist_function, recommendation) VALUES
('SQL Injection', 'Protect', 'Implement parameterized queries and input validation'),
('Command Injection', 'Protect', 'Use safe APIs and input sanitization'),
('Weak Password Policy', 'Protect', 'Enforce minimum 8 characters with complexity, enable MFA'),
('No Account Lockout', 'Protect', 'Set account lockout after 5 failed attempts'),
('No HTTPS/TLS', 'Protect', 'Install TLS certificate and enforce HTTPS'),
('Default Credentials', 'Protect', 'Change all default credentials'),
('Directory Listing', 'Protect', 'Disable directory listing in web server config'),
('XSS', 'Protect', 'Implement Content Security Policy and output encoding'),
('No Audit Logs', 'Detect', 'Enable comprehensive audit logging and monitoring'),
('Outdated Server', 'Protect', 'Implement patch management and regular updates');

-- TAMBAHKAN INDEX untuk performa
CREATE INDEX idx_vulnerability_category ON vulnerabilities(category);
CREATE INDEX idx_vulnerability_nist ON vulnerabilities(nist_function);
CREATE INDEX idx_asset_vuln_asset ON asset_vulnerabilities(asset_id);
CREATE INDEX idx_audit_results_asset ON audit_results(asset_id);
CREATE INDEX idx_findings_asset ON findings(asset_id);
CREATE INDEX idx_findings_status ON findings(status);