"""
Feature-specific rules
"""
from typing import List, Dict, Any


class FeatureRules:
    """Detect and classify feature changes"""
    
    @staticmethod
    def detect_feature_additions(old_list: List[str], new_list: List[str]) -> List[Dict]:
        """Detect added features"""
        added = [f for f in new_list if f not in old_list]
        
        results = []
        for feature in added:
            results.append({
                'rule_name': 'FEATURE_ADDED',
                'feature': feature,
                'confidence_boost': 0.10,
                'business_impact': 0.75
            })
        
        return results
    
    @staticmethod
    def detect_feature_removals(old_list: List[str], new_list: List[str]) -> List[Dict]:
        """Detect removed features"""
        removed = [f for f in old_list if f not in new_list]
        
        results = []
        for feature in removed:
            results.append({
                'rule_name': 'FEATURE_REMOVED',
                'feature': feature,
                'confidence_boost': 0.10,
                'business_impact': 0.80
            })
        
        return results
    
    @staticmethod
    def detect_feature_tier_changes(old_features: Dict, new_features: Dict) -> List[Dict]:
        """Detect features moving between tiers"""
        changes = []
        
        for feature in set(list(old_features.keys()) + list(new_features.keys())):
            old_tiers = set(old_features.get(feature, []))
            new_tiers = set(new_features.get(feature, []))
            
            # Feature added to more tiers
            added_tiers = new_tiers - old_tiers
            if added_tiers:
                changes.append({
                    'rule_name': 'FEATURE_ACCESSIBILITY_EXPANDED',
                    'feature': feature,
                    'added_to_tiers': list(added_tiers),
                    'business_impact': 0.70
                })
            
            # Feature removed from tiers
            removed_tiers = old_tiers - new_tiers
            if removed_tiers:
                changes.append({
                    'rule_name': 'FEATURE_ACCESSIBILITY_REDUCED',
                    'feature': feature,
                    'removed_from_tiers': list(removed_tiers),
                    'business_impact': 0.75
                })
        
        return changes
