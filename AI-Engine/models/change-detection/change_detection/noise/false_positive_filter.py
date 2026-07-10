"""
False positive filtering
"""
import logging
from typing import List, Dict

logger = logging.getLogger(__name__)


class FalsePositiveFilter:
    """Identify and filter false positive detections"""
    
    @staticmethod
    def is_likely_false_positive(change_info: Dict) -> bool:
        """
        Determine if a change is likely a false positive
        
        False positive indicators:
        - Very low confidence
        - Very low importance
        - Dynamic content detected
        - Conflicting evidence
        """
        confidence = change_info.get('confidence_score', 0.5)
        importance = change_info.get('importance_score', 0.5)
        
        # Very low scores = likely false positive
        if confidence < 0.40 and importance < 0.30:
            logger.debug("Filtering due to very low confidence and importance")
            return True
        
        # High confidence but very low importance = false positive
        if confidence >= 0.80 and importance < 0.15:
            logger.debug("Filtering due to high confidence but negligible importance")
            return True
        
        # Check for conflicting rule matches
        matched_rules = change_info.get('matched_rules', [])
        if len(matched_rules) > 3:
            # Too many rules matched = possibly false positive
            logger.debug("Filtering due to conflicting rule matches")
            return True
        
        return False
    
    @staticmethod
    def filter_false_positives(changes: List[Dict]) -> tuple:
        """
        Filter false positives from change list
        
        Returns:
            Tuple of (filtered_changes, removed_count)
        """
        filtered = []
        removed_count = 0
        
        for change in changes:
            if not FalsePositiveFilter.is_likely_false_positive(change):
                filtered.append(change)
            else:
                removed_count += 1
        
        if removed_count > 0:
            logger.info(f"Filtered {removed_count} likely false positives")
        
        return filtered, removed_count


class ContextualValidator:
    """Validate changes in context"""
    
    @staticmethod
    def validate_price_change(old_price: float, new_price: float) -> bool:
        """Validate if price change is realistic"""
        if old_price <= 0 or new_price <= 0:
            return False
        
        # Don't flag extremely small changes
        percent_change = abs(new_price - old_price) / old_price
        if percent_change < 0.01:  # Less than 1% change
            return False
        
        # Flag unrealistic changes (> 10x)
        ratio = new_price / old_price
        if ratio > 10 or ratio < 0.1:
            return False
        
        return True
    
    @staticmethod
    def validate_feature_count_change(old_count: int, new_count: int) -> bool:
        """Validate if feature count change is realistic"""
        if old_count < 0 or new_count < 0:
            return False
        
        # Adding/removing single features is normal
        if abs(new_count - old_count) <= 5:
            return True
        
        # Large swings might be parsing errors
        if old_count == 0:
            return new_count <= 100
        
        ratio = new_count / old_count
        # Flag if more than 5x change
        return 0.2 <= ratio <= 5
    
    @staticmethod
    def validate_text_change(old_text: str, new_text: str) -> bool:
        """Validate if text change is realistic"""
        old_len = len(old_text)
        new_len = len(new_text)
        
        if old_len == 0 or new_len == 0:
            return True
        
        ratio = new_len / old_len
        
        # Flag if more than 10x size change (likely parsing error)
        if ratio > 10 or ratio < 0.1:
            return False
        
        return True
