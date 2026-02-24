# backend/app/services/nist_csf_service.py

class NISTCSFService:
    """Service untuk menangani NIST Cybersecurity Framework"""
    
    FUNCTIONS = {
        "identify": {
            "name": "Identify",
            "categories": [
                "Asset Management",
                "Business Environment",
                "Governance",
                "Risk Assessment",
                "Risk Management Strategy"
            ]
        },
        "protect": {
            "name": "Protect",
            "categories": [
                "Access Control",
                "Awareness and Training",
                "Data Security",
                "Information Protection Processes and Procedures",
                "Maintenance",
                "Protective Technology"
            ]
        },
        "detect": {
            "name": "Detect",
            "categories": [
                "Anomalies and Events",
                "Security Continuous Monitoring",
                "Detection Processes"
            ]
        },
        "respond": {
            "name": "Respond",
            "categories": [
                "Response Planning",
                "Communications",
                "Analysis",
                "Mitigation",
                "Improvements"
            ]
        },
        "recover": {
            "name": "Recover",
            "categories": [
                "Recovery Planning",
                "Improvements",
                "Communications"
            ]
        }
    }
    
    @classmethod
    def get_framework(cls):
        return cls.FUNCTIONS
    
    @classmethod
    def get_function(cls, function_name):
        return cls.FUNCTIONS.get(function_name.lower())
    
    @classmethod
    def calculate_compliance(cls, assessment_data):
        """Calculate compliance percentage based on assessment"""
        total_controls = 0
        compliant_controls = 0
        
        for function in cls.FUNCTIONS.values():
            for category in function["categories"]:
                total_controls += 1
                if assessment_data.get(category, False):
                    compliant_controls += 1
        
        if total_controls == 0:
            return 0
        
        return round((compliant_controls / total_controls) * 100, 2)
