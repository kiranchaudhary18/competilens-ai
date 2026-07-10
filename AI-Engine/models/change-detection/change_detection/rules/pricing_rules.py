"""
Category-specific pricing rules
"""
from typing import Dict, Any, List


class PricingRules:
    """Detect and classify pricing changes"""
    
    @staticmethod
    def classify_price_change(old_amount: float, new_amount: float) -> Dict[str, Any]:
        """Classify price change significance"""
        
        if old_amount == new_amount:
            return {
                'change_type': 'NO_CHANGE',
                'business_impact': 0.0,
                'confidence_boost': 0.0
            }
        
        absolute_change = new_amount - old_amount
        percent_change = (absolute_change / old_amount * 100) if old_amount != 0 else 0
        
        # Categorize by magnitude
        if abs(percent_change) < 5:
            severity = 'MINOR'
            business_impact = 0.30
        elif abs(percent_change) < 15:
            severity = 'MODERATE'
            business_impact = 0.60
        elif abs(percent_change) < 50:
            severity = 'SIGNIFICANT'
            business_impact = 0.85
        else:
            severity = 'MAJOR'
            business_impact = 0.95
        
        change_direction = 'INCREASE' if absolute_change > 0 else 'DECREASE'
        
        return {
            'change_type': f'PRICE_{change_direction}',
            'severity': severity,
            'absolute_change': absolute_change,
            'percent_change': percent_change,
            'business_impact': business_impact,
            'confidence_boost': 0.15
        }
    
    @staticmethod
    def is_price_tier_change(old_tier: str, new_tier: str) -> bool:
        """Detect if pricing tier changed"""
        tier_hierarchy = {
            'free': 1,
            'starter': 2,
            'basic': 2,
            'pro': 3,
            'premium': 3,
            'business': 4,
            'enterprise': 5
        }
        
        old_level = tier_hierarchy.get(old_tier.lower(), 0)
        new_level = tier_hierarchy.get(new_tier.lower(), 0)
        
        return old_level != new_level
    
    @staticmethod
    def detect_pricing_surge(old_data: Dict, new_data: Dict) -> List[Dict]:
        """Detect sudden pricing surges across plans"""
        surges = []
        
        # Check for price increases across multiple tiers
        increased_tiers = []
        
        for plan_name in new_data:
            if plan_name in old_data:
                try:
                    old_price = float(old_data[plan_name])
                    new_price = float(new_data[plan_name])
                    
                    if new_price > old_price:
                        increased_tiers.append(plan_name)
                except (ValueError, TypeError):
                    pass
        
        if len(increased_tiers) >= 2:
            surges.append({
                'rule_name': 'PRICING_SURGE_DETECTED',
                'affected_plans': increased_tiers,
                'confidence_boost': 0.20,
                'business_impact': 0.95
            })
        
        return surges
