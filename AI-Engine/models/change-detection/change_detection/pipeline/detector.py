"""
Detector class - simplified interface to the orchestrator
"""
import logging
from typing import Dict, Any
from .orchestrator import ChangeDetectionOrchestrator

logger = logging.getLogger(__name__)


class HybridChangeDetector:
    """
    Simple interface to hybrid change detection engine
    
    Usage:
        detector = HybridChangeDetector(config)
        result = detector.detect(old_snapshot, new_snapshot)
    """
    
    def __init__(self, config: Dict[str, Any]):
        """Initialize detector with config"""
        self.orchestrator = ChangeDetectionOrchestrator(config)
    
    def detect(self, old_snapshot: Dict[str, Any], new_snapshot: Dict[str, Any]) -> Dict[str, Any]:
        """
        Detect changes between two snapshots
        
        Args:
            old_snapshot: Previous snapshot
            new_snapshot: Current snapshot
            
        Returns:
            Change detection result
        """
        return self.orchestrator.detect_changes(old_snapshot, new_snapshot)
    
    def batch_detect(self, snapshot_pairs: list) -> list:
        """
        Detect changes for multiple snapshot pairs
        
        Args:
            snapshot_pairs: List of (old_snapshot, new_snapshot) tuples
            
        Returns:
            List of results
        """
        results = []
        
        for old_snapshot, new_snapshot in snapshot_pairs:
            result = self.detect(old_snapshot, new_snapshot)
            results.append(result)
        
        return results
