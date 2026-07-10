"""
Importance scoring for changes
"""
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)


class ImportanceScorer:
    """
    Calculate importance score for a change
    
    Importance = how much should we care about this change from business perspective
    
    Formula:
    importance = 0.30 * business_impact
               + 0.20 * magnitude
               + 0.20 * semantic_significance
               + 0.15 * source_reliability
               + 0.15 * persistence
    """
    
    def __init__(self, weights: Dict[str, float] = None):
        """
        Args:
            weights: Custom weights for scoring components
        """
        self.weights = weights or {
            'business_impact': 0.30,
            'magnitude': 0.20,
            'semantic_significance': 0.20,
            'source_reliability': 0.15,
            'persistence': 0.15
        }
        
        # Validate weights sum to 1.0
        total = sum(self.weights.values())
        if abs(total - 1.0) > 0.01:
            logger.warning(f"Importance score weights sum to {total}, normalizing...")
            for key in self.weights:
                self.weights[key] = self.weights[key] / total
    
    def score_business_impact(self, change_info: Dict[str, Any]) -> float:
        """
        Score business impact (0-1)
        
        High impact: pricing, security, features
        Medium impact: products, hiring
        Low impact: footer text, minor updates
        """
        change_type = change_info.get('change_type', '').upper()
        
        high_impact_types = [
            'PRICE_INCREASE', 'PRICE_DECREASE', 'PRICING_TIER_CHANGE',
            'SECURITY_CAPABILITY_ADDED', 'SECURITY_CAPABILITY_REMOVED',
            'FEATURE_ADDED', 'FEATURE_REMOVED', 'FEATURE_UPGRADED',
            'NEW_PRODUCT_LAUNCH', 'PRODUCT_DEPRECATION'
        ]
        
        medium_impact_types = [
            'HIRING_SURGE', 'HIRING_REDUCTION',
            'INTEGRATION_ADDED', 'INTEGRATION_REMOVED',
            'POLICY_CHANGE'
        ]
        
        if change_type in high_impact_types:
            return 0.95
        elif change_type in medium_impact_types:
            return 0.65
        else:
            return 0.30
    
    def score_magnitude(self, change_info: Dict[str, Any]) -> float:
        """
        Score magnitude of change (0-1)
        
        Normalize different types of changes to 0-1 scale
        """
        old_value = change_info.get('old_value')
        new_value = change_info.get('new_value')
        
        # Numeric changes
        if isinstance(old_value, (int, float)) and isinstance(new_value, (int, float)):
            if old_value == 0:
                return min(1.0, abs(new_value) / 100)
            
            percent_change = abs(new_value - old_value) / abs(old_value)
            # Normalize: 0% → 0, 100% → 1.0, >100% → 1.0
            return min(1.0, percent_change)
        
        # Text/string changes
        if isinstance(old_value, str) and isinstance(new_value, str):
            old_len = len(old_value)
            new_len = len(new_value)
            
            if old_len == 0:
                return min(1.0, new_len / 500)  # Normalize to 500 chars
            
            length_ratio = abs(new_len - old_len) / old_len
            return min(1.0, length_ratio)
        
        # List changes
        if isinstance(old_value, list) and isinstance(new_value, list):
            if len(old_value) == 0:
                return min(1.0, len(new_value) / 100)
            
            change_count = len(set(new_value) - set(old_value)) + len(set(old_value) - set(new_value))
            total_count = max(len(old_value), len(new_value))
            
            if total_count == 0:
                return 0.0
            
            return min(1.0, change_count / total_count)
        
        # Default for unknown types
        return 0.5
    
    def score_semantic_significance(self, change_info: Dict[str, Any]) -> float:
        """
        Score semantic significance
        
        Based on semantic similarity: low similarity = high significance
        """
        similarity = change_info.get('semantic_similarity', 0.5)
        
        # Inverse relationship: high similarity = low significance
        # similarity 1.0 → significance 0.0
        # similarity 0.0 → significance 1.0
        return 1.0 - similarity
    
    def score_source_reliability(self, detection_method: str) -> float:
        """
        Score reliability based on detection method
        
        Exact diff: most reliable
        Rules: reliable
        Semantic: less reliable
        Custom model: depends on model quality
        """
        method_scores = {
            'EXACT_DIFF': 0.95,
            'RULE_ENGINE': 0.85,
            'SEMANTIC_MATCHING': 0.80,
            'CUSTOM_MODEL': 0.80,
            'HYBRID': 0.85
        }
        
        return method_scores.get(detection_method, 0.50)
    
    def score_persistence(self, observation_count: int = 1, history_support: bool = False) -> float:
        """
        Score persistence (how many times has this change been observed?)
        
        First observation: lower score
        Multiple observations: higher score
        """
        if history_support:
            # Found in historical data too
            return 1.0
        
        if observation_count >= 3:
            return 1.0
        elif observation_count == 2:
            return 0.6
        else:
            return 0.3
    
    def calculate_importance(self, change_info: Dict[str, Any]) -> float:
        """
        Calculate overall importance score
        
        Args:
            change_info: Dict containing change details
        """
        business_impact = self.score_business_impact(change_info)
        magnitude = self.score_magnitude(change_info)
        semantic_sig = self.score_semantic_significance(change_info)
        source_reliability = self.score_source_reliability(
            change_info.get('detection_method', 'HYBRID')
        )
        persistence = self.score_persistence(
            change_info.get('observation_count', 1),
            change_info.get('history_support', False)
        )
        
        importance = (
            self.weights['business_impact'] * business_impact +
            self.weights['magnitude'] * magnitude +
            self.weights['semantic_significance'] * semantic_sig +
            self.weights['source_reliability'] * source_reliability +
            self.weights['persistence'] * persistence
        )
        
        return min(1.0, max(0.0, importance))


def classify_importance(score: float) -> str:
    """Classify importance score into levels"""
    if score >= 0.85:
        return 'CRITICAL'
    elif score >= 0.60:
        return 'HIGH'
    elif score >= 0.30:
        return 'MEDIUM'
    else:
        return 'LOW'
