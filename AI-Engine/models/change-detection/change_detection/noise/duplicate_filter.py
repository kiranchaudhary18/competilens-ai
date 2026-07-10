"""
Duplicate and deduplication filtering
"""
import logging
from typing import List, Dict, Tuple
from difflib import SequenceMatcher

logger = logging.getLogger(__name__)


class DuplicateFilter:
    """Identify and filter duplicate changes"""
    
    @staticmethod
    def are_duplicates(change1: Dict, change2: Dict, threshold: float = 0.95) -> bool:
        """
        Check if two changes are duplicates
        
        Args:
            change1, change2: Change info dicts
            threshold: Similarity threshold (0-1)
        """
        # Same change type
        if change1.get('change_type') != change2.get('change_type'):
            return False
        
        # Same entity
        if change1.get('entity') != change2.get('entity'):
            return False
        
        # Compare values
        old1 = str(change1.get('old_value', ''))
        new1 = str(change1.get('new_value', ''))
        old2 = str(change2.get('old_value', ''))
        new2 = str(change2.get('new_value', ''))
        
        # Calculate similarity
        old_sim = SequenceMatcher(None, old1, old2).ratio()
        new_sim = SequenceMatcher(None, new1, new2).ratio()
        
        avg_sim = (old_sim + new_sim) / 2
        
        return avg_sim >= threshold
    
    @staticmethod
    def deduplicate_changes(changes: List[Dict]) -> Tuple[List[Dict], int]:
        """
        Remove duplicate changes from list
        
        Returns:
            Tuple of (deduplicated_changes, removed_count)
        """
        if not changes:
            return [], 0
        
        unique_changes = [changes[0]]
        removed_count = 0
        
        for change in changes[1:]:
            is_duplicate = False
            
            for unique_change in unique_changes:
                if DuplicateFilter.are_duplicates(change, unique_change):
                    is_duplicate = True
                    removed_count += 1
                    break
            
            if not is_duplicate:
                unique_changes.append(change)
        
        logger.info(f"Removed {removed_count} duplicate changes")
        return unique_changes, removed_count


class FuzzyDuplicateFinder:
    """Find fuzzy duplicates using semantic similarity"""
    
    @staticmethod
    def find_fuzzy_duplicates(changes: List[Dict], similarity_threshold: float = 0.90) -> List[Tuple[int, int, float]]:
        """
        Find fuzzy duplicate pairs
        
        Returns:
            List of (index1, index2, similarity_score) tuples
        """
        duplicates = []
        
        for i in range(len(changes)):
            for j in range(i + 1, len(changes)):
                change1 = changes[i]
                change2 = changes[j]
                
                # Quick pre-filters
                if change1.get('change_type') != change2.get('change_type'):
                    continue
                
                # Calculate similarity
                values1 = f"{change1.get('old_value', '')} {change1.get('new_value', '')}"
                values2 = f"{change2.get('old_value', '')} {change2.get('new_value', '')}"
                
                sim = SequenceMatcher(None, values1.lower(), values2.lower()).ratio()
                
                if sim >= similarity_threshold:
                    duplicates.append((i, j, sim))
        
        return duplicates
