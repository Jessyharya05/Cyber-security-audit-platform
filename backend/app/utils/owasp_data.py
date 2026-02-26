# app/utils/owasp_data.py

OWASP_VULNERABILITIES = [
    # Injection
    {
        "name": "SQL Injection",
        "category": "Injection",
        "description": "Attacker can execute arbitrary SQL queries",
        "likelihood_default": "High",
        "impact_default": "Critical",
        "cvss_score": 9.0,
        "nist_function": "Protect"
    },
    {
        "name": "Command Injection",
        "category": "Injection",
        "description": "Attacker can execute system commands",
        "likelihood_default": "Medium",
        "impact_default": "Critical",
        "cvss_score": 8.5,
        "nist_function": "Protect"
    },
    {
        "name": "LDAP Injection",
        "category": "Injection",
        "description": "Attacker can manipulate LDAP queries",
        "likelihood_default": "Low",
        "impact_default": "High",
        "cvss_score": 6.5,
        "nist_function": "Protect"
    },
    
    # Broken Authentication
    {
        "name": "Weak Password Policy",
        "category": "Broken Authentication",
        "description": "Passwords do not meet complexity requirements",
        "likelihood_default": "High",
        "impact_default": "High",
        "cvss_score": 7.5,
        "nist_function": "Protect"
    },
    {
        "name": "No Account Lockout",
        "category": "Broken Authentication",
        "description": "No protection against brute force",
        "likelihood_default": "High",
        "impact_default": "Medium",
        "cvss_score": 6.5,
        "nist_function": "Protect"
    },
    {
        "name": "Session Hijacking",
        "category": "Broken Authentication",
        "description": "Session tokens can be stolen",
        "likelihood_default": "Medium",
        "impact_default": "High",
        "cvss_score": 7.0,
        "nist_function": "Protect"
    },
    
    # Sensitive Data Exposure
    {
        "name": "No HTTPS/TLS",
        "category": "Sensitive Data Exposure",
        "description": "Data transmitted in plaintext",
        "likelihood_default": "High",
        "impact_default": "Critical",
        "cvss_score": 8.0,
        "nist_function": "Protect"
    },
    {
        "name": "Weak Encryption",
        "category": "Sensitive Data Exposure",
        "description": "Outdated or weak encryption algorithms",
        "likelihood_default": "Medium",
        "impact_default": "High",
        "cvss_score": 7.5,
        "nist_function": "Protect"
    },
    {
        "name": "Exposed Database Backup",
        "category": "Sensitive Data Exposure",
        "description": "Backup files publicly accessible",
        "likelihood_default": "Low",
        "impact_default": "Critical",
        "cvss_score": 7.0,
        "nist_function": "Protect"
    },
    
    # Access Control Failures
    {
        "name": "IDOR",
        "category": "Access Control Failures",
        "description": "Insecure Direct Object References",
        "likelihood_default": "Medium",
        "impact_default": "High",
        "cvss_score": 6.5,
        "nist_function": "Protect"
    },
    {
        "name": "Privilege Escalation",
        "category": "Access Control Failures",
        "description": "Users can gain higher privileges",
        "likelihood_default": "Low",
        "impact_default": "Critical",
        "cvss_score": 8.0,
        "nist_function": "Protect"
    },
    
    # Security Misconfiguration
    {
        "name": "Default Credentials",
        "category": "Security Misconfiguration",
        "description": "Default usernames/passwords unchanged",
        "likelihood_default": "High",
        "impact_default": "High",
        "cvss_score": 8.5,
        "nist_function": "Protect"
    },
    {
        "name": "Directory Listing Enabled",
        "category": "Security Misconfiguration",
        "description": "Directory contents visible",
        "likelihood_default": "Medium",
        "impact_default": "Low",
        "cvss_score": 4.5,
        "nist_function": "Protect"
    },
    {
        "name": "Exposed Admin Panel",
        "category": "Security Misconfiguration",
        "description": "Admin interface publicly accessible",
        "likelihood_default": "Medium",
        "impact_default": "High",
        "cvss_score": 7.0,
        "nist_function": "Protect"
    },
    {
        "name": "Open Unnecessary Ports",
        "category": "Security Misconfiguration",
        "description": "Unused network ports open",
        "likelihood_default": "Medium",
        "impact_default": "Medium",
        "cvss_score": 5.5,
        "nist_function": "Protect"
    },
    
    # Cross-Site Attacks
    {
        "name": "Cross-Site Scripting (XSS)",
        "category": "Cross-Site Attacks",
        "description": "Malicious scripts injected",
        "likelihood_default": "High",
        "impact_default": "Medium",
        "cvss_score": 6.5,
        "nist_function": "Protect"
    },
    {
        "name": "Cross-Site Request Forgery (CSRF)",
        "category": "Cross-Site Attacks",
        "description": "Unauthorized commands from trusted user",
        "likelihood_default": "Medium",
        "impact_default": "Medium",
        "cvss_score": 6.0,
        "nist_function": "Protect"
    },
    
    # Logging & Monitoring
    {
        "name": "No Audit Logs",
        "category": "Logging & Monitoring",
        "description": "Security events not logged",
        "likelihood_default": "High",
        "impact_default": "Medium",
        "cvss_score": 5.5,
        "nist_function": "Detect"
    },
    
    # Dependency Issues
    {
        "name": "Outdated Server Software",
        "category": "Dependency Issues",
        "description": "Known vulnerabilities in outdated software",
        "likelihood_default": "Medium",
        "impact_default": "High",
        "cvss_score": 7.5,
        "nist_function": "Protect"
    }
]

# Mapping Vulnerability -> Impact (untuk MODUL 4.4)
VULNERABILITY_IMPACT_MAPPING = {
    "SQL Injection": "Database theft",
    "Cross-Site Scripting (XSS)": "Account hijacking",
    "Cross-Site Request Forgery (CSRF)": "Unauthorized transaction",
    "Weak Password Policy": "Account takeover",
    "No Audit Logs": "Incident undetected",
    "Outdated Server Software": "Remote exploit"
}

# Mapping Vulnerability -> NIST Function
VULN_TO_NIST_MAPPING = {
    "SQL Injection": "Protect",
    "Command Injection": "Protect",
    "Weak Password Policy": "Protect",
    "No Account Lockout": "Protect",
    "No HTTPS/TLS": "Protect",
    "Default Credentials": "Protect",
    "Cross-Site Scripting (XSS)": "Protect",
    "No Audit Logs": "Detect",
    "Outdated Server Software": "Protect"
}