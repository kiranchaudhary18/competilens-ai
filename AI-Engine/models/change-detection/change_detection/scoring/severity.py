"""
Severity calculation for changes
"""
from typing import Dict, Any, Tuple


class SeverityCalculator:
    """Calculate severity level from importance and confidence"""
    
    @staticmethod
    def calculate_severity(importance: float, confidence: float) -> str:
        """
        Determine severity based on importance and confidence
        
        Logic:
        - High importance + High confidence = CRITICAL
        - High importance + Medium confidence = HIGH
        - Medium importance + High confidence = HIGH
        - Medium importance + Medium confidence = MEDIUM
        - Low importance = LOW/INFO
        """
        
        if importance >= 0.85 and confidence >= 0.75:
            return 'CRITICAL'
        elif (importance >= 0.75 and confidence >= 0.50) or \
             (importance >= 0.60 and confidence >= 0.75):
            return 'HIGH'
        elif (importance >= 0.60 and confidence >= 0.50) or \
             (importance >= 0.45 and confidence >= 0.60):
            return 'MEDIUM'
        elif importance >= 0.30:
            return 'LOW'
        else:
            return 'INFO'
    
    @staticmethod
    def severity_to_priority(severity: str) -> int:
        """Convert severity to numeric priority (1-5, higher = more important)"""
        priority_map = {
            'CRITICAL': 5,
            'HIGH': 4,
            'MEDIUM': 3,
            'LOW': 2,
            'INFO': 1
        }
        return priority_map.get(severity, 1)
    
    @staticmethod
    def calculate_urgency(
        severity: str,
        change_type: str,
        time_sensitive: bool = False
    ) -> Dict[str, Any]:
        """
        Calculate urgency for action
        
        Some changes need immediate attention:
        - Security issues
        - Major price changes
        - Feature removals
        """
        
        high_urgency_types = [
            'SECURITY_CAPABILITY_REMOVED',
            'PRICE_INCREASE',
            'FEATURE_REMOVED',
            'PRODUCT_DEPRECATION'
        ]
        
        base_urgency_score = SeverityCalculator.severity_to_priority(severity) / 5.0
        
        if change_type in high_urgency_types:
            urgency_score = min(1.0, base_urgency_score + 0.3)
        else:
            urgency_score = base_urgency_score
        
        if time_sensitive:
            urgency_score = min(1.0, urgency_score + 0.2)
        
        return {
            'urgency_score': urgency_score,
            'requires_immediate_action': urgency_score >= 0.75,
            'recommended_sla_hours': max(1, 48 - int(urgency_score * 48))
        }
