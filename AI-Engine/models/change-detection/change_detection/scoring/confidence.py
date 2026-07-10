"""
Confidence scoring for changes
"""
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)


class ConfidenceScorer:
    """
    Calculate confidence score for a change
    
    Confidence = how sure are we that this is a real change?
    
    Formula:
    confidence = 0.30 * exact_evidence
               + 0.25 * semantic_alignment
               + 0.20 * rule_strength
               + 0.15 * source_quality
               + 0.10 * repeated_observation
    
    IMPORTANT: Confidence ≠ Importance
    Example: "footer copyright changed" → high confidence, low importance
    """
    
    def __init__(self, weights: Dict[str, float] = None):
        """
        Args:
            weights: Custom weights for scoring components
        """
        self.weights = weights or {
            'exact_evidence': 0.30,
            'semantic_alignment': 0.25,
            'rule_strength': 0.20,
            'source_quality': 0.15,
            'repeated_observation': 0.10
        }
        
        # Validate weights
        total = sum(self.weights.values())
        if abs(total - 1.0) > 0.01:
            logger.warning(f"Confidence score weights sum to {total}, normalizing...")
            for key in self.weights:
                self.weights[key] = self.weights[key] / total
    
    def score_exact_evidence(self, change_info: Dict[str, Any]) -> float:
        """
        Score based on exact/deterministic evidence
        
        Exact diff matches get high scores
        Ambiguous text changes get low scores
        """
        change_type = change_info.get('change_type', '').upper()
        old_value = change_info.get('old_value')
        new_value = change_info.get('new_value')
        
        # Exact match between old and new = very certain
        if old_value == new_value:
            return 0.0  # No change, very certain
        
        # Numeric changes are more certain
        if isinstance(old_value, (int, float)) and isinstance(new_value, (int, float)):
            return 0.95  # Very confident
        
        # Price/currency changes are certain
        if 'PRICE' in change_type:
            return 0.95
        
        # Version changes are certain
        if 'VERSION' in change_type:
            return 0.90
        
        # Text changes are less certain
        return 0.60
    
    def score_semantic_alignment(self, change_info: Dict[str, Any]) -> float:
        """
        Score semantic alignment (0-1)
        
        High semantic similarity → items are likely the same → high confidence in change
        Low semantic similarity → items might not match → lower confidence
        """
        similarity = change_info.get('semantic_similarity', 0.5)
        
        # If items are very similar semantically, high confidence in the change
        if similarity >= 0.88:
            return 0.95
        elif similarity >= 0.72:
            return 0.75
        elif similarity >= 0.50:
            return 0.50
        else:
            return 0.30
    
    def score_rule_strength(self, change_info: Dict[str, Any]) -> float:
        """
        Score based on how strongly rules match
        """
        matched_rules = change_info.get('matched_rules', [])
        rule_confidence_boosts = change_info.get('rule_confidence_boosts', [])
        
        if not matched_rules:
            return 0.5  # No rules, medium confidence
        
        if rule_confidence_boosts:
            # Average of all confidence boosts
            avg_boost = sum(rule_confidence_boosts) / len(rule_confidence_boosts)
            return min(1.0, 0.50 + avg_boost)  # Base 0.5 + boost up to 1.0
        
        # Just having matching rules increases confidence
        return 0.70
    
    def score_source_quality(self, change_info: Dict[str, Any]) -> float:
        """
        Score based on source quality
        
        HTML snapshot vs API data?
        Recent vs old?
        Direct vs indirect observation?
        """
        source_type = change_info.get('source_type', 'web')
        
        # API data is usually higher quality
        if source_type == 'api':
            return 0.95
        # HTML snapshots are decent
        elif source_type == 'web':
            return 0.80
        # Scraped data might have OCR errors, etc
        elif source_type == 'crawl':
            return 0.70
        else:
            return 0.60
    
    def score_repeated_observation(self, change_info: Dict[str, Any]) -> float:
        """
        Score based on repeated observations
        
        Seen once → low score
        Seen multiple times → high score
        Persisting across snapshots → very high score
        """
        observation_count = change_info.get('observation_count', 1)
        is_persistent = change_info.get('is_persistent', False)
        
        if is_persistent:
            return 1.0  # Confirmed in multiple observations
        
        if observation_count >= 3:
            return 0.90
        elif observation_count == 2:
            return 0.70
        else:
            return 0.40  # First observation, less confident
    
    def calculate_confidence(self, change_info: Dict[str, Any]) -> float:
        """
        Calculate overall confidence score
        
        Args:
            change_info: Dict containing change details
        """
        exact_evidence = self.score_exact_evidence(change_info)
        semantic_alignment = self.score_semantic_alignment(change_info)
        rule_strength = self.score_rule_strength(change_info)
        source_quality = self.score_source_quality(change_info)
        repeated_obs = self.score_repeated_observation(change_info)
        
        confidence = (
            self.weights['exact_evidence'] * exact_evidence +
            self.weights['semantic_alignment'] * semantic_alignment +
            self.weights['rule_strength'] * rule_strength +
            self.weights['source_quality'] * source_quality +
            self.weights['repeated_observation'] * repeated_obs
        )
        
        return min(1.0, max(0.0, confidence))


def classify_confidence(score: float) -> str:
    """Classify confidence score into levels"""
    if score >= 0.90:
        return 'VERY_HIGH'
    elif score >= 0.75:
        return 'HIGH'
    elif score >= 0.50:
        return 'MEDIUM'
    else:
        return 'LOW'
