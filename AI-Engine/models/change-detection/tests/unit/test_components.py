"""
Unit tests for change detection components
"""
import pytest
from change_detection.diff.numeric_diff import NumericDiff, CurrencyDiff
from change_detection.preprocessing.text_normalizer import TextNormalizer, PriceNormalizer
from change_detection.scoring.importance import ImportanceScorer
from change_detection.scoring.confidence import ConfidenceScorer
from change_detection.scoring.severity import SeverityCalculator


class TestNumericDiff:
    """Test numeric diff detection"""
    
    def test_price_increase(self):
        """Test price increase detection"""
        result = NumericDiff.compare_numbers(29, 39)
        assert result['changed'] == True
        assert result['change_direction'] == 'increase'
        assert abs(result['percent_change'] - 34.48) < 0.1  # ~34.48%
    
    def test_price_decrease(self):
        """Test price decrease detection"""
        result = NumericDiff.compare_numbers(39, 29)
        assert result['changed'] == True
        assert result['change_direction'] == 'decrease'
    
    def test_no_change(self):
        """Test when numbers are same"""
        result = NumericDiff.compare_numbers(29, 29)
        assert result['changed'] == False


class TestCurrencyDiff:
    """Test currency diff detection"""
    
    def test_price_extraction(self):
        """Test price extraction from text"""
        price = CurrencyDiff.extract_price("$29.99/month")
        assert price['amount'] == 29.99
        assert price['currency'] == 'USD'
        assert price['period'] == 'month'
    
    def test_price_comparison(self):
        """Test price comparison"""
        result = CurrencyDiff.compare_prices("$29/month", "$39/month")
        assert result['comparable'] == True
        assert result['change_direction'] == 'increase'
        assert abs(result['percent_change'] - 34.48) < 0.1


class TestTextNormalizer:
    """Test text normalization"""
    
    def test_whitespace_normalization(self):
        """Test whitespace normalization"""
        text = "Hello    \n\n   world"
        normalized = TextNormalizer.normalize_whitespace(text)
        assert '\n\n' not in normalized
        assert '    ' not in normalized
    
    def test_case_normalization(self):
        """Test case normalization"""
        text = "API Integration with SSO"
        normalized = TextNormalizer.normalize_case(text, preserve_acronyms=True)
        assert 'api' in normalized or 'API' in normalized


class TestScoring:
    """Test scoring components"""
    
    def test_importance_high_impact(self):
        """Test importance scoring for high-impact changes"""
        change_info = {
            'change_type': 'PRICE_INCREASE',
            'old_value': 29,
            'new_value': 39,
            'semantic_similarity': 0.0,
            'detection_method': 'EXACT_DIFF',
            'observation_count': 2
        }
        
        scorer = ImportanceScorer()
        importance = scorer.calculate_importance(change_info)
        assert importance > 0.75  # Should be high
    
    def test_confidence_exact_evidence(self):
        """Test confidence scoring with exact evidence"""
        change_info = {
            'change_type': 'PRICE_INCREASE',
            'old_value': 29,
            'new_value': 39,
            'semantic_similarity': 0.99,
            'detection_method': 'EXACT_DIFF',
            'source_type': 'api',
            'observation_count': 1
        }
        
        scorer = ConfidenceScorer()
        confidence = scorer.calculate_confidence(change_info)
        assert confidence > 0.80  # Should be high
    
    def test_severity_calculation(self):
        """Test severity calculation"""
        severity = SeverityCalculator.calculate_severity(0.90, 0.95)
        assert severity == 'CRITICAL'
        
        severity = SeverityCalculator.calculate_severity(0.65, 0.75)
        assert severity in ['HIGH', 'MEDIUM']


class TestFiltering:
    """Test noise filtering"""
    
    def test_dynamic_content_filter(self):
        """Test dynamic content detection"""
        from change_detection.noise.dynamic_content import DynamicContentFilter
        
        filter = DynamicContentFilter()
        
        # Should filter timestamps
        change = {
            'old_value': '2024-01-01 10:30:00',
            'new_value': '2024-01-01 10:31:00'
        }
        assert filter.filter_dynamic_changes(change) == True
    
    def test_false_positive_filter(self):
        """Test false positive detection"""
        from change_detection.noise.false_positive_filter import FalsePositiveFilter
        
        change = {
            'confidence_score': 0.95,
            'importance_score': 0.10
        }
        
        # High confidence but low importance = likely false positive
        assert FalsePositiveFilter.is_likely_false_positive(change) == True


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
