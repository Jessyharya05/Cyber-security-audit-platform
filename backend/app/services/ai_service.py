# backend/app/services/ai_service.py

import random
from typing import Dict, List

class AIService:
    """Service untuk AI Control Recommendations"""
    
    # Knowledge base untuk rekomendasi kontrol
    KNOWLEDGE_BASE = {
        "sql injection": {
            "title": "SQL Injection Prevention",
            "risk": "Critical",
            "recommendations": [
                "Use parameterized queries / prepared statements",
                "Implement input validation and sanitization",
                "Use stored procedures",
                "Apply least privilege principle for database accounts",
                "Implement Web Application Firewall (WAF)",
                "Regular security testing and code review"
            ],
            "implementation_steps": [
                "Replace dynamic SQL with parameterized queries",
                "Configure WAF rules to block SQL injection patterns",
                "Implement input validation on all user inputs",
                "Review and restrict database permissions"
            ]
        },
        "xss": {
            "title": "Cross-Site Scripting Prevention",
            "risk": "High",
            "recommendations": [
                "Implement Content Security Policy (CSP)",
                "Use output encoding/escaping",
                "Validate and sanitize all user inputs",
                "Set HttpOnly and Secure flags for cookies",
                "Use X-XSS-Protection header"
            ],
            "implementation_steps": [
                "Implement CSP headers",
                "Use framework escaping functions",
                "Sanitize HTML input",
                "Enable browser XSS protection"
            ]
        },
        "weak password": {
            "title": "Strengthen Password Security",
            "risk": "High",
            "recommendations": [
                "Enforce minimum 12-character passwords",
                "Require complexity (uppercase, lowercase, numbers, special)",
                "Implement multi-factor authentication (MFA)",
                "Set account lockout after 5 failed attempts",
                "Prevent password reuse (last 10 passwords)",
                "Use breached password detection"
            ],
            "implementation_steps": [
                "Configure password policy in IAM",
                "Enable MFA for all users",
                "Implement account lockout policy",
                "Deploy password filter for breached passwords"
            ]
        },
        "mfa": {
            "title": "Enable Multi-Factor Authentication",
            "risk": "Critical",
            "recommendations": [
                "Implement MFA for all administrative access",
                "Enable MFA for all users",
                "Support multiple MFA methods (TOTP, SMS, biometric)",
                "Implement backup codes for recovery",
                "Use adaptive authentication based on risk"
            ],
            "implementation_steps": [
                "Choose MFA solution (Google Authenticator, Duo, etc.)",
                "Integrate with existing IAM system",
                "Configure MFA policies",
                "Deploy to users with training"
            ]
        },
        "encryption": {
            "title": "Implement Data Encryption",
            "risk": "Critical",
            "recommendations": [
                "Use TLS 1.3 for all communications",
                "Implement HTTPS everywhere",
                "Encrypt sensitive data at rest",
                "Use strong algorithms: AES-256, RSA-2048",
                "Proper key management",
                "Regular certificate rotation"
            ],
            "implementation_steps": [
                "Obtain SSL/TLS certificates from trusted CA",
                "Configure web server for HTTPS",
                "Set up automatic redirect HTTP → HTTPS",
                "Implement HSTS header",
                "Encrypt database backups"
            ]
        },
        "ransomware": {
            "title": "Ransomware Prevention",
            "risk": "Critical",
            "recommendations": [
                "Regular backups (3-2-1 rule)",
                "Patch management",
                "Email filtering",
                "User awareness training",
                "Application whitelisting",
                "Network segmentation"
            ],
            "implementation_steps": [
                "Implement automated backups",
                "Test restoration regularly",
                "Keep systems updated",
                "Train users to identify phishing",
                "Segment networks to limit spread"
            ]
        },
        "incident response": {
            "title": "Establish Incident Response",
            "risk": "High",
            "recommendations": [
                "Create incident response plan",
                "Define incident classification",
                "Establish response team",
                "Conduct regular drills",
                "Implement communication plan",
                "Document lessons learned"
            ],
            "implementation_steps": [
                "Develop incident response policy",
                "Form incident response team",
                "Create playbooks for common incidents",
                "Conduct tabletop exercises"
            ]
        }
    }
    
    @classmethod
    def get_recommendations(cls, query: str) -> Dict:
        """Get control recommendations based on query"""
        query_lower = query.lower()
        
        # Check knowledge base for keywords
        for key, value in cls.KNOWLEDGE_BASE.items():
            if key in query_lower:
                return value
        
        # Default response
        return {
            "title": "General Security Recommendations",
            "risk": "Varies",
            "recommendations": [
                "Implement strong password policy with MFA",
                "Enable account lockout after 5 failed attempts",
                "Regular security awareness training",
                "Keep all systems patched and updated",
                "Implement network segmentation",
                "Regular backups with 3-2-1 rule"
            ],
            "implementation_steps": [
                "Assess current security posture",
                "Prioritize risks based on impact",
                "Implement controls gradually",
                "Monitor and measure effectiveness",
                "Continuously improve security"
            ]
        }
    
    @classmethod
    def explain_vulnerability(cls, vulnerability: str) -> str:
        """Explain vulnerability in simple terms"""
        explanations = {
            "sql injection": "SQL Injection is an attack where malicious SQL statements are inserted into application inputs to manipulate the database. Attackers can bypass authentication, steal data, or destroy databases.",
            "xss": "Cross-Site Scripting (XSS) allows attackers to inject malicious scripts into web pages viewed by other users. This can lead to session hijacking, defacement, and credential theft.",
            "csrf": "Cross-Site Request Forgery (CSRF) tricks users into executing unwanted actions on web applications where they are authenticated.",
            "weak password": "Weak passwords are easily guessable or crackable, allowing attackers to gain unauthorized access to accounts.",
            "mfa": "Multi-Factor Authentication adds an extra layer of security by requiring multiple verification factors to access accounts."
        }
        
        for key, explanation in explanations.items():
            if key in vulnerability.lower():
                return explanation
        
        return f"{vulnerability} is a security vulnerability that could be exploited by attackers. Implement appropriate security controls to mitigate the risk."
