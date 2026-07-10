"""
Other domain-specific rules (placeholder modules for extensibility)
"""
from typing import List, Dict, Any


class SecurityRules:
    """Security and compliance related rules"""
    
    @staticmethod
    def detect_security_upgrades(old_security: List[str], new_security: List[str]) -> List[Dict]:
        """Detect new security features"""
        security_keywords = ['mfa', 'sso', 'saml', 'oauth', 'encryption', 'audit', 'compliance']
        
        added = [s for s in new_security if s not in old_security]
        security_related = [s for s in added if any(kw in s.lower() for kw in security_keywords)]
        
        if security_related:
            return [{
                'rule_name': 'SECURITY_CAPABILITY_ADDED',
                'capabilities': security_related,
                'confidence_boost': 0.20,
                'business_impact': 0.98
            }]
        
        return []


class HiringRules:
    """Hiring activity detection"""
    
    @staticmethod
    def detect_hiring_surge(old_openings: int, new_openings: int) -> List[Dict]:
        """Detect hiring surges"""
        
        if old_openings == 0:
            return []
        
        change_percent = ((new_openings - old_openings) / old_openings) * 100
        
        if change_percent > 30:  # More than 30% increase
            return [{
                'rule_name': 'HIRING_SURGE',
                'old_openings': old_openings,
                'new_openings': new_openings,
                'percent_change': change_percent,
                'confidence_boost': 0.15,
                'business_impact': 0.70
            }]
        elif change_percent < -20:  # More than 20% decrease
            return [{
                'rule_name': 'HIRING_REDUCTION',
                'old_openings': old_openings,
                'new_openings': new_openings,
                'percent_change': change_percent,
                'confidence_boost': 0.15,
                'business_impact': 0.75
            }]
        
        return []


class ProductRules:
    """Product launch and deprecation rules"""
    
    @staticmethod
    def detect_product_launch(new_products: List[str]) -> List[Dict]:
        """Detect new product launches"""
        if new_products:
            return [{
                'rule_name': 'NEW_PRODUCT_LAUNCH',
                'products': new_products,
                'confidence_boost': 0.15,
                'business_impact': 0.85
            }]
        return []
    
    @staticmethod
    def detect_product_deprecation(deprecation_text: str) -> List[Dict]:
        """Detect product deprecations"""
        deprecation_keywords = ['deprecated', 'discontinued', 'sunset', 'retire', 'legacy']
        
        if any(kw in deprecation_text.lower() for kw in deprecation_keywords):
            return [{
                'rule_name': 'PRODUCT_DEPRECATION',
                'confidence_boost': 0.18,
                'business_impact': 0.80
            }]
        return []


class IntegrationRules:
    """Integration and partnership detection"""
    
    @staticmethod
    def detect_integration_additions(old_integrations: List[str], new_integrations: List[str]) -> List[Dict]:
        """Detect new integrations"""
        added = [i for i in new_integrations if i not in old_integrations]
        
        if added:
            return [{
                'rule_name': 'INTEGRATION_ADDED',
                'integrations': added,
                'confidence_boost': 0.12,
                'business_impact': 0.65
            }]
        return []
