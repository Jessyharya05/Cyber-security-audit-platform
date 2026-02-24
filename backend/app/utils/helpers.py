# backend/app/utils/helpers.py

import re
from datetime import datetime
from typing import Optional

def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password: str) -> tuple:
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters"
    
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one number"
    
    return True, "Password is strong"

def format_date(date_str: Optional[str]) -> str:
    """Format date string"""
    if not date_str:
        return ""
    try:
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
        return date_obj.strftime("%d %B %Y")
    except:
        return date_str

def calculate_risk_score(likelihood: str, impact: str) -> str:
    """Calculate risk score based on likelihood and impact"""
    likelihood_map = {"Low": 1, "Medium": 2, "High": 3, "Critical": 4}
    impact_map = {"Low": 1, "Medium": 2, "High": 3, "Critical": 4}
    
    l_score = likelihood_map.get(likelihood, 2)
    i_score = impact_map.get(impact, 2)
    
    total_score = l_score * i_score
    
    if total_score >= 12:
        return "Critical"
    elif total_score >= 8:
        return "High"
    elif total_score >= 4:
        return "Medium"
    else:
        return "Low"
