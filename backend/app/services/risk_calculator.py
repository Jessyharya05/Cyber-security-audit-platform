# app/services/risk_calculator.py

class RiskCalculator:
    # Mapping nilai untuk perhitungan
    LIKELIHOOD_VALUES = {
        'Low': 1,
        'Medium': 2,
        'High': 3
    }
    
    IMPACT_VALUES = {
        'Low': 1,
        'Medium': 2,
        'High': 3,
        'Critical': 4
    }
    
    @classmethod
    def calculate_risk_score(cls, likelihood: str, impact: str) -> float:
        """
        MODUL 5: Risk = Likelihood × Impact
        """
        l = cls.LIKELIHOOD_VALUES.get(likelihood, 1)
        i = cls.IMPACT_VALUES.get(impact, 1)
        return l * i
    
    @classmethod
    def get_risk_level(cls, score: float) -> str:
        """
        Tentukan risk level berdasarkan score
        """
        if score >= 12:
            return 'Critical'
        elif score >= 8:
            return 'High'
        elif score >= 4:
            return 'Medium'
        else:
            return 'Low'
    
    @classmethod
    def suggest_impact(cls, vulnerability_name: str) -> str:
        """
        MODUL 4: Suggest impact berdasarkan vulnerability
        """
        mapping = {
            'SQL Injection': 'Critical',
            'Command Injection': 'Critical',
            'Weak Password Policy': 'High',
            'No Account Lockout': 'Medium',
            'No HTTPS/TLS': 'Critical',
            'Default Credentials': 'High',
            'Cross-Site Scripting (XSS)': 'Medium',
            'No Audit Logs': 'Medium',
            'Outdated Server Software': 'High'
        }
        return mapping.get(vulnerability_name, 'Medium')
    
    @classmethod
    def suggest_likelihood(cls, vulnerability_name: str) -> str:
        """
        MODUL 4: Suggest likelihood berdasarkan vulnerability
        """
        mapping = {
            'SQL Injection': 'High',
            'Weak Password Policy': 'High',
            'No Account Lockout': 'High',
            'Default Credentials': 'High',
            'Cross-Site Scripting (XSS)': 'High',
            'No Audit Logs': 'High',
            'Outdated Server Software': 'Medium'
        }
        return mapping.get(vulnerability_name, 'Medium')
    
    @classmethod
    def generate_risk_matrix(cls, risks_data: list) -> dict:
        """
        Generate risk matrix (heatmap) dari data risks
        """
        matrix = {
            'High': {'Low': 0, 'Medium': 0, 'High': 0, 'Critical': 0},
            'Medium': {'Low': 0, 'Medium': 0, 'High': 0, 'Critical': 0},
            'Low': {'Low': 0, 'Medium': 0, 'High': 0, 'Critical': 0}
        }
        
        for risk in risks_data:
            l = risk.get('likelihood')
            i = risk.get('impact')
            if l in matrix and i in matrix[l]:
                matrix[l][i] += 1
        
        return matrix