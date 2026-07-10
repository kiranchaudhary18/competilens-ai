"""
Integration test: Full pipeline
"""
import pytest
import yaml
from change_detection.pipeline.detector import HybridChangeDetector


class TestFullPipeline:
    """Test complete change detection pipeline"""
    
    @pytest.fixture
    def detector(self):
        """Load detector with config"""
        with open('configs/base.yaml', 'r') as f:
            config = yaml.safe_load(f)
        return HybridChangeDetector(config)
    
    def test_pricing_detection(self, detector):
        """Test pricing change detection"""
        old = {
            'competitor_id': 'test_comp',
            'snapshot_id': 'old',
            'raw_data': {'price': '$29/month', 'features': 10}
        }
        
        new = {
            'competitor_id': 'test_comp',
            'snapshot_id': 'new',
            'raw_data': {'price': '$39/month', 'features': 10}
        }
        
        result = detector.detect(old, new)
        
        # Should detect the price change
        assert result['change_detected'] == True
        assert result['total_changes'] > 0
        assert any('PRICE' in str(c['change_type']) for c in result['changes'])
    
    def test_feature_detection(self, detector):
        """Test feature change detection"""
        old = {
            'competitor_id': 'test_comp',
            'snapshot_id': 'old',
            'raw_data': {
                'features': ['Basic analytics', 'Email support']
            }
        }
        
        new = {
            'competitor_id': 'test_comp',
            'snapshot_id': 'new',
            'raw_data': {
                'features': ['Basic analytics', 'Advanced analytics', 'Email support', 'Phone support']
            }
        }
        
        result = detector.detect(old, new)
        
        # Should detect added features
        assert result['change_detected'] == True
        assert result['total_changes'] >= 2  # At least 2 new features
    
    def test_no_false_changes(self, detector):
        """Test that identical snapshots produce no changes"""
        snapshot = {
            'competitor_id': 'test_comp',
            'snapshot_id': 'same',
            'raw_data': {'price': '$29/month', 'features': 10}
        }
        
        result = detector.detect(snapshot, snapshot)
        
        # Should not detect any changes
        assert result['change_detected'] == False
        assert result['total_changes'] == 0


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
