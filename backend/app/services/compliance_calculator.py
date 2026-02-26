# app/services/compliance_calculator.py

class ComplianceCalculator:
    
    @classmethod
    def calculate_compliance(cls, audit_results: list) -> float:
        """
        MODUL 8: Compliance % = (Compliant Controls / Total Controls) × 100
        """
        total = len(audit_results)
        if total == 0:
            return 0.0
        
        compliant = 0
        partial = 0
        
        for result in audit_results:
            status = result.get('status')
            if status == 'Compliant':
                compliant += 1
            elif status == 'Partially Compliant':
                partial += 0.5
        
        score = (compliant + partial) / total * 100
        return round(score, 2)
    
    @classmethod
    def get_compliance_level(cls, percentage: float) -> str:
        """
        Tentukan level compliance
        """
        if percentage >= 85:
            return 'Compliant'
        elif percentage >= 60:
            return 'Needs Improvement'
        else:
            return 'Non-Compliant'
    
    @classmethod
    def calculate_per_function(cls, audit_results: list) -> dict:
        """
        Hitung compliance per NIST function
        """
        functions = ['Identify', 'Protect', 'Detect', 'Respond', 'Recover']
        result = {}
        
        for func in functions:
            filtered = [r for r in audit_results if r.get('function_name') == func]
            result[func] = cls.calculate_compliance(filtered)
        
        return result
    
    @classmethod
    def generate_report(cls, audit_results: list) -> dict:
        """
        Generate compliance report lengkap
        """
        overall = cls.calculate_compliance(audit_results)
        
        return {
            'overall': {
                'percentage': overall,
                'level': cls.get_compliance_level(overall)
            },
            'by_function': cls.calculate_per_function(audit_results),
            'stats': {
                'total': len(audit_results),
                'compliant': len([r for r in audit_results if r.get('status') == 'Compliant']),
                'partially': len([r for r in audit_results if r.get('status') == 'Partially Compliant']),
                'non_compliant': len([r for r in audit_results if r.get('status') == 'Non-Compliant']),
                'not_applicable': len([r for r in audit_results if r.get('status') == 'Not Applicable'])
            }
        }