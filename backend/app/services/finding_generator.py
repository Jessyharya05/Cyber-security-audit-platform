# app/services/finding_generator.py

class FindingGenerator:
    
    # Template findings berdasarkan control
    FINDING_TEMPLATES = {
        'PR.AC-1': {
            'title': 'Weak Authentication Mechanism',
            'risk': 'Unauthorized access to systems and data',
            'recommendation': 'Implement multi-factor authentication and strong password policy. Enforce account lockout after 5 failed attempts.'
        },
        'PR.DS-1': {
            'title': 'Missing Data Encryption',
            'risk': 'Data exposure in case of breach',
            'recommendation': 'Enable encryption for sensitive data at rest using AES-256.'
        },
        'PR.DS-2': {
            'title': 'Insufficient Data-in-Transit Protection',
            'risk': 'Data interception and man-in-the-middle attacks',
            'recommendation': 'Enable TLS 1.3 and enforce HTTPS for all communications.'
        },
        'DE.CM-1': {
            'title': 'Inadequate Security Monitoring',
            'risk': 'Inability to detect security incidents',
            'recommendation': 'Implement centralized logging and SIEM solution. Set up alerts for suspicious activities.'
        },
        'ID.RA-1': {
            'title': 'Missing Vulnerability Assessment',
            'risk': 'Unknown vulnerabilities in systems',
            'recommendation': 'Conduct regular vulnerability scans and penetration testing. Maintain patch management process.'
        },
        'PR.AC-4': {
            'title': 'Excessive User Privileges',
            'risk': 'Privilege escalation and unauthorized data access',
            'recommendation': 'Review and implement principle of least privilege for all users. Regular access reviews.'
        },
        'RC.RP-1': {
            'title': 'Inadequate Backup and Recovery',
            'risk': 'Data loss in case of system failure or ransomware',
            'recommendation': 'Implement automated daily backups with 3-2-1 rule. Test restoration monthly.'
        }
    }
    
    @classmethod
    def generate_from_audit(cls, control: dict, asset_name: str) -> dict:
        """
        MODUL 9: Generate finding dari control yang non-compliant
        """
        control_id = control.get('control_id')
        template = cls.FINDING_TEMPLATES.get(control_id, {
            'title': f'Non-Compliant: {control.get("control_name", "Security Control")}',
            'risk': 'Security control deficiency increases risk exposure',
            'recommendation': 'Review and address the control requirements.'
        })
        
        return {
            'title': template['title'],
            'description': f"Asset '{asset_name}' - {control.get('control_name')} is non-compliant. {control.get('description', '')}",
            'risk': template['risk'],
            'affected_asset': asset_name,
            'recommendation': template['recommendation'],
            'risk_level': 'High'  # Default, bisa disesuaikan
        }
    
    @classmethod
    def generate_from_vulnerability(cls, vuln: dict, asset_name: str, risk_level: str) -> dict:
        """
        Generate finding dari vulnerability dengan risk tinggi
        """
        impact_examples = {
            'SQL Injection': 'Database theft',
            'Cross-Site Scripting (XSS)': 'Account hijacking',
            'Weak Password Policy': 'Account takeover'
        }
        
        impact = impact_examples.get(vuln.get('name'), 'Security breach')
        
        return {
            'title': f'{vuln.get("name")} Vulnerability Detected',
            'description': f"Asset '{asset_name}' is vulnerable to {vuln.get('name')}. {vuln.get('description', '')}",
            'risk': f'{impact} could lead to {risk_level.lower()} impact',
            'affected_asset': asset_name,
            'recommendation': f'Implement mitigations for {vuln.get("name")}. Refer to OWASP guidelines.',
            'risk_level': risk_level
        }
    
    @classmethod
    def generate_batch(cls, asset_id: int, asset_name: str, non_compliant_controls: list) -> list:
        """
        Generate multiple findings sekaligus
        """
        findings = []
        for control in non_compliant_controls:
            finding = cls.generate_from_audit(control, asset_name)
            findings.append(finding)
        return findings