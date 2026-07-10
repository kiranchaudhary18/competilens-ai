"""
Example 1: Basic pricing change detection
"""
import yaml
from change_detection.pipeline.detector import HybridChangeDetector

# Load config
with open('configs/base.yaml', 'r') as f:
    config = yaml.safe_load(f)

# Initialize detector
detector = HybridChangeDetector(config)

# Stripe pricing change example
old_snapshot = {
    'competitor_id': 'stripe_inc',
    'snapshot_id': 'snap_2024_01',
    'url': 'https://stripe.com/pricing',
    'raw_data': {
        'pricing': {
            'pro': '$29/month',
            'standard': '$99/month'
        },
        'features': [
            '10 team members',
            'Basic analytics',
            'Email support'
        ]
    }
}

new_snapshot = {
    'competitor_id': 'stripe_inc',
    'snapshot_id': 'snap_2024_02',
    'url': 'https://stripe.com/pricing',
    'raw_data': {
        'pricing': {
            'pro': '$39/month',  # CHANGED
            'standard': '$129/month'  # CHANGED
        },
        'features': [
            'Unlimited team members',  # CHANGED
            'Advanced analytics',  # CHANGED
            'Email support',
            'Priority phone support'  # ADDED
        ]
    }
}

# Detect changes
result = detector.detect(old_snapshot, new_snapshot)

# Print results
print(f"=== Change Detection Results ===")
print(f"Competitor: {result['competitor_id']}")
print(f"Total changes: {result['total_changes']}")
print(f"Processing time: {result['processing_time_ms']:.1f}ms")
print(f"Severity summary: {result['severity_summary']}")
print()

for i, change in enumerate(result['changes'], 1):
    print(f"Change {i}: {change['change_type']}")
    print(f"  Entity: {change.get('entity', 'N/A')}")
    print(f"  Old: {change['old_value']} → New: {change['new_value']}")
    print(f"  Importance: {change['importance_score']:.2f} ({['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][min(3, int(change['importance_score']*3))]}")
    print(f"  Confidence: {change['confidence_score']:.2f}")
    print(f"  Severity: {change['severity']}")
    print()
