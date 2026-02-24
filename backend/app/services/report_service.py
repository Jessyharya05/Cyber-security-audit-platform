# backend/app/services/report_service.py

from datetime import datetime
import json
from typing import Dict, Any

class ReportService:
    """Service untuk generate reports"""
    
    @staticmethod
    def generate_compliance_report(companies_data: list) -> Dict[str, Any]:
        """Generate compliance report"""
        total_companies = len(companies_data)
        avg_compliance = sum(c.get('compliance', 0) for c in companies_data) / total_companies if total_companies > 0 else 0
        
        return {
            "report_id": f"CR-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "report_type": "Compliance Report",
            "generated": datetime.now().isoformat(),
            "total_companies": total_companies,
            "average_compliance": round(avg_compliance, 2),
            "companies": companies_data
        }
    
    @staticmethod
    def generate_audit_summary(audit_data: list) -> Dict[str, Any]:
        """Generate audit summary report"""
        total_audits = len(audit_data)
        completed = len([a for a in audit_data if a.get('status') == 'completed'])
        in_progress = len([a for a in audit_data if a.get('status') == 'in-progress'])
        pending = len([a for a in audit_data if a.get('status') == 'pending'])
        
        total_findings = sum(a.get('findings', 0) for a in audit_data)
        critical_findings = sum(a.get('criticalFindings', 0) for a in audit_data)
        
        return {
            "report_id": f"AS-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "report_type": "Audit Summary",
            "generated": datetime.now().isoformat(),
            "total_audits": total_audits,
            "status_breakdown": {
                "completed": completed,
                "in_progress": in_progress,
                "pending": pending
            },
            "findings_summary": {
                "total": total_findings,
                "critical": critical_findings
            }
        }
    
    @staticmethod
    def generate_findings_report(findings_data: list) -> Dict[str, Any]:
        """Generate findings report"""
        severity_counts = {
            "critical": 0,
            "high": 0,
            "medium": 0,
            "low": 0
        }
        
        status_counts = {
            "open": 0,
            "in-progress": 0,
            "closed": 0
        }
        
        for finding in findings_data:
            severity_counts[finding.get('severity', 'low')] += 1
            status_counts[finding.get('status', 'open')] += 1
        
        return {
            "report_id": f"FR-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "report_type": "Findings Report",
            "generated": datetime.now().isoformat(),
            "total_findings": len(findings_data),
            "by_severity": severity_counts,
            "by_status": status_counts
        }
