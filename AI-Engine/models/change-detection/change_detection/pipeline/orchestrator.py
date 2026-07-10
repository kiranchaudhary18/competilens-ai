"""
Main change detection orchestrator
"""
import logging
import time
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
import uuid

logger = logging.getLogger(__name__)


class ChangeDetectionOrchestrator:
    """
    Main orchestrator for hybrid change detection
    
    Coordinates all components:
    1. Preprocessing
    2. Exact diff
    3. Semantic matching
    4. Rule engine
    5. Scoring
    6. Noise filtering
    """
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize orchestrator
        
        Args:
            config: Configuration dict with all settings
        """
        self.config = config
        self.start_time = None
        
        logger.info("Initializing Change Detection Orchestrator")
        self._initialize_components()
    
    def _initialize_components(self):
        """Initialize all sub-components"""
        try:
            from ..semantic.embedding_provider import EmbeddingProvider
            from ..rules.rule_engine import RuleEngine
            from ..scoring.importance import ImportanceScorer
            from ..scoring.confidence import ConfidenceScorer
            from ..noise.dynamic_content import DynamicContentFilter
            from ..noise.duplicate_filter import DuplicateFilter
            from ..noise.false_positive_filter import FalsePositiveFilter
            from ..preprocessing.html_cleaner import HTMLCleaner, TextExtractor
            from ..preprocessing.text_normalizer import TextNormalizer, PriceNormalizer
            from ..preprocessing.boilerplate_filter import BoilerplateFilter, DuplicateFilter as BoilerplateDuplicateFilter
            from ..preprocessing.section_extractor import SectionExtractor
            from ..diff.exact_diff import ExactDiff, StructuralDiff
            from ..diff.numeric_diff import NumericDiff, CurrencyDiff, PercentageDiff, VersionDiff
            from ..semantic.alignment import SemanticMatcher, TextAlignment
            from ..semantic.sentence_matcher import SentenceMatcher
            
            # Initialize embedding provider
            embedding_config = self.config.get('embedding', {})
            self.embedding_provider = EmbeddingProvider(
                model_name=embedding_config.get('model_name', 'sentence-transformers/all-MiniLM-L6-v2'),
                cache_dir=embedding_config.get('cache_dir')
            )
            
            # Initialize rule engine
            rules_config_path = self.config.get('rules', {}).get('rules_config_path')
            self.rule_engine = RuleEngine(rules_config_path)
            
            # Initialize scorers
            self.importance_scorer = ImportanceScorer(
                self.config.get('scoring', {}).get('importance', {})
            )
            self.confidence_scorer = ConfidenceScorer(
                self.config.get('scoring', {}).get('confidence', {})
            )
            
            # Initialize filters
            self.dynamic_filter = DynamicContentFilter()
            self.duplicate_filter = DuplicateFilter()
            self.false_positive_filter = FalsePositiveFilter()
            
            # Initialize preprocessing
            self.html_cleaner = HTMLCleaner()
            self.text_extractor = TextExtractor()
            self.text_normalizer = TextNormalizer()
            self.price_normalizer = PriceNormalizer()
            self.boilerplate_filter = BoilerplateFilter()
            self.section_extractor = SectionExtractor()
            
            # Initialize diff engines
            self.exact_diff = ExactDiff()
            self.structural_diff = StructuralDiff()
            self.numeric_diff = NumericDiff()
            self.currency_diff = CurrencyDiff()
            self.percentage_diff = PercentageDiff()
            self.version_diff = VersionDiff()
            
            # Initialize semantic matchers
            thresholds = self.config.get('thresholds', {})
            self.semantic_matcher = SemanticMatcher(self.embedding_provider, thresholds)
            self.text_alignment = TextAlignment(self.embedding_provider, thresholds)
            self.sentence_matcher = SentenceMatcher(self.embedding_provider, thresholds)
            
            logger.info("All components initialized successfully")
        
        except Exception as e:
            logger.error(f"Failed to initialize components: {e}")
            raise
    
    def detect_changes(self, old_snapshot: Dict[str, Any], new_snapshot: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main method: Detect all changes between two snapshots
        
        Args:
            old_snapshot: Old snapshot dict with 'raw_data' key
            new_snapshot: New snapshot dict with 'raw_data' key
            
        Returns:
            ChangeDetectionResult dict
        """
        self.start_time = time.time()
        result_id = str(uuid.uuid4())
        
        try:
            logger.info(f"Starting change detection: {result_id}")
            
            # 1. PREPROCESSING
            old_data = self._preprocess(old_snapshot)
            new_data = self._preprocess(new_snapshot)
            
            # 2. EXACT DIFF
            exact_changes = self._run_exact_diff(old_data, new_data)
            logger.debug(f"Found {len(exact_changes)} exact changes")
            
            # 3. SEMANTIC MATCHING
            semantic_changes = self._run_semantic_matching(old_data, new_data)
            logger.debug(f"Found {len(semantic_changes)} semantic changes")
            
            # 4. RULE ENGINE
            rule_matches = self._run_rules(old_data, new_data)
            logger.debug(f"Found {len(rule_matches)} rule matches")
            
            # 5. COMBINE AND SCORE
            combined_changes = self._combine_changes(exact_changes, semantic_changes, rule_matches)
            scored_changes = self._score_changes(combined_changes)
            logger.debug(f"Scored {len(scored_changes)} changes")
            
            # 6. NOISE FILTERING
            filtered_changes = self._filter_noise(scored_changes)
            logger.debug(f"After filtering: {len(filtered_changes)} changes")
            
            # 7. DEDUPLICATION
            final_changes, removed_dupes = self.duplicate_filter.deduplicate_changes(filtered_changes)
            logger.debug(f"After dedup: {len(final_changes)} changes (removed {removed_dupes})")
            
            # Build result
            processing_time = (time.time() - self.start_time) * 1000  # milliseconds
            
            result = {
                'result_id': result_id,
                'competitor_id': old_snapshot.get('competitor_id', ''),
                'old_snapshot_id': old_snapshot.get('snapshot_id', ''),
                'new_snapshot_id': new_snapshot.get('snapshot_id', ''),
                'change_detected': len(final_changes) > 0,
                'total_changes': len(final_changes),
                'changes': final_changes,
                'processing_time_ms': processing_time,
                'detection_methods_used': ['EXACT_DIFF', 'SEMANTIC_MATCHING', 'RULE_ENGINE'],
                'noise_removed_count': len(scored_changes) - len(filtered_changes),
                'duplicate_removed_count': removed_dupes,
                'created_at': datetime.utcnow().isoformat(),
                'severity_summary': self._summarize_severity(final_changes)
            }
            
            logger.info(f"Change detection completed: {result_id} ({len(final_changes)} changes in {processing_time:.1f}ms)")
            
            return result
        
        except Exception as e:
            logger.error(f"Change detection failed: {e}", exc_info=True)
            return {
                'result_id': result_id,
                'error': str(e),
                'change_detected': False,
                'total_changes': 0,
                'changes': []
            }
    
    def _preprocess(self, snapshot: Dict[str, Any]) -> Dict[str, Any]:
        """Preprocess snapshot data"""
        raw_data = snapshot.get('raw_data', {})
        
        if not raw_data:
            return {}
        
        # Clean and normalize
        if isinstance(raw_data, dict):
            processed = {}
            for key, value in raw_data.items():
                if isinstance(value, str):
                    # Normalize text
                    value = self.text_normalizer.normalize(value)
                processed[key] = value
            return processed
        
        return raw_data
    
    def _run_exact_diff(self, old_data: Dict, new_data: Dict) -> List[Dict]:
        """Run exact diff detection"""
        changes = []
        
        try:
            diff_result = self.exact_diff.compare_json(old_data, new_data)
            
            for diff_item in diff_result:
                if diff_item['operation'] != 'unchanged':
                    change = {
                        'change_type': 'EXACT_CHANGE',
                        'old_value': diff_item.get('old_value'),
                        'new_value': diff_item.get('new_value'),
                        'semantic_similarity': 0.0 if diff_item['operation'] != 'modified' else 1.0,
                        'detection_method': 'EXACT_DIFF',
                        'entity': diff_item.get('path'),
                        'matched_rules': []
                    }
                    changes.append(change)
        
        except Exception as e:
            logger.error(f"Error in exact diff: {e}")
        
        return changes
    
    def _run_semantic_matching(self, old_data: Dict, new_data: Dict) -> List[Dict]:
        """Run semantic matching"""
        changes = []
        
        try:
            # Extract text items for semantic comparison
            old_texts = self._extract_text_items(old_data)
            new_texts = self._extract_text_items(new_data)
            
            if old_texts and new_texts:
                matches = self.semantic_matcher.match_items(old_texts, new_texts)
                
                for match in matches:
                    if match['similarity'] < 0.88:  # Only report as change if not highly similar
                        change = {
                            'change_type': 'SEMANTIC_CHANGE',
                            'old_value': match['old_item'],
                            'new_value': match['new_item'],
                            'semantic_similarity': match['similarity'],
                            'detection_method': 'SEMANTIC_MATCHING',
                            'entity': f"Item {match['old_index']}→{match['new_index']}",
                            'matched_rules': []
                        }
                        changes.append(change)
        
        except Exception as e:
            logger.error(f"Error in semantic matching: {e}")
        
        return changes
    
    def _run_rules(self, old_data: Dict, new_data: Dict) -> List[Dict]:
        """Run rule engine"""
        matches = []
        
        try:
            # Evaluate rules for each field
            for key in set(list(old_data.keys()) + list(new_data.keys())):
                old_value = old_data.get(key)
                new_value = new_data.get(key)
                
                change_info = {
                    'old_value': old_value,
                    'new_value': new_value,
                    'change_type': key.upper()
                }
                
                rule_matches = self.rule_engine.evaluate_rules(change_info)
                for rm in rule_matches:
                    rm['field_key'] = key
                matches.extend(rule_matches)
        
        except Exception as e:
            logger.error(f"Error in rule engine: {e}")
        
        return matches
    
    def _combine_changes(self, exact: List, semantic: List, rules: List) -> List[Dict]:
        """Combine changes from different detection methods"""
        combined = exact + semantic
        
        # Map rules to changes
        for rule in rules:
            field_key = rule.get('field_key')
            if not field_key:
                continue
            
            # Find matching changes
            for change in combined:
                entity = str(change.get('entity', '')).strip('/').lower()
                # Check if the field_key matches the change's entity path
                if entity == field_key.lower() or field_key.lower() in entity:
                    # Update change type to the rule's name (e.g., PRICE_INCREASE)
                    change['change_type'] = rule['rule_name']
                    
                    # Add to matched_rules
                    if 'matched_rules' not in change:
                        change['matched_rules'] = []
                    if rule['rule_name'] not in change['matched_rules']:
                        change['matched_rules'].append(rule['rule_name'])
                    
                    # Add to rule_confidence_boosts
                    if 'rule_confidence_boosts' not in change:
                        change['rule_confidence_boosts'] = []
                    change['rule_confidence_boosts'].append(rule.get('confidence_boost', 0.0))
                    
                    # Update other properties if appropriate
                    if 'percent_change' in rule:
                        change['percent_change'] = rule['percent_change']
        
        return combined
    
    def _score_changes(self, changes: List[Dict]) -> List[Dict]:
        """Score all changes"""
        for change in changes:
            # Importance
            importance = self.importance_scorer.calculate_importance(change)
            change['importance_score'] = importance
            
            # Confidence
            confidence = self.confidence_scorer.calculate_confidence(change)
            change['confidence_score'] = confidence
            
            # Severity
            from ..scoring.severity import SeverityCalculator
            severity = SeverityCalculator.calculate_severity(importance, confidence)
            change['severity'] = severity
        
        return changes
    
    def _filter_noise(self, changes: List[Dict]) -> List[Dict]:
        """Apply noise filters"""
        filtered = []
        
        for change in changes:
            # Check dynamic content
            if self.dynamic_filter.filter_dynamic_changes(change):
                continue
            
            # Check false positives
            if self.false_positive_filter.is_likely_false_positive(change):
                continue
            
            filtered.append(change)
        
        return filtered
    
    def _extract_text_items(self, data: Dict) -> List[str]:
        """Extract text items from data dict"""
        items = []
        
        for value in data.values():
            if isinstance(value, str) and len(value) > 5:
                items.append(value)
            elif isinstance(value, list):
                for item in value:
                    if isinstance(item, str) and len(item) > 5:
                        items.append(item)
        
        return items
    
    def _summarize_severity(self, changes: List[Dict]) -> Dict[str, int]:
        """Summarize changes by severity"""
        summary = {
            'CRITICAL': 0,
            'HIGH': 0,
            'MEDIUM': 0,
            'LOW': 0,
            'INFO': 0
        }
        
        for change in changes:
            severity = change.get('severity', 'INFO')
            summary[severity] = summary.get(severity, 0) + 1
        
        return summary
