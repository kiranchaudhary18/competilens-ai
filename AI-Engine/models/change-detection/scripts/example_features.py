"""
Example 2: Feature changes and semantic matching
"""
import yaml
from change_detection.pipeline.detector import HybridChangeDetector

with open('configs/base.yaml', 'r') as f:
    config = yaml.safe_load(f)

detector = HybridChangeDetector(config)

# Figma feature changes
old_snapshot = {
    'competitor_id': 'figma',
    'snapshot_id': 'snap_v23',
    'url': 'https://figma.com/features',
    'raw_data': {
        'design_tools': [
            'Vector editing',
            'Prototyping with 5 interactive states',
            'Export to PNG, SVG, PDF'
        ],
        'collaboration': [
            'Collaborate with up to 10 team members',
            'View-only comments',
            'Basic permissions'
        ],
        'security': [
            'Single Sign-On (SSO) with Okta',
            'Basic audit logs'
        ]
    }
}

new_snapshot = {
    'competitor_id': 'figma',
    'snapshot_id': 'snap_v24',
    'url': 'https://figma.com/features',
    'raw_data': {
        'design_tools': [
            'Advanced vector editing with AI assistance',  # Enhanced
            'Prototyping with unlimited interactive states',  # Upgraded
            'Export to PNG, SVG, PDF, CODE'  # Enhanced
        ],
        'collaboration': [
            'Unlimited teammates in workspaces',  # Upgraded
            'Threaded comments with AI summarization',  # Enhanced
            'Advanced permissions & role-based access'  # Enhanced
        ],
        'security': [
            'Single Sign-On (SSO) with Okta and Azure AD',  # Enhanced
            'SSO with MFA enforcement',  # Added
            'Comprehensive audit logs with retention',  # Enhanced
            'SOC 2 Type II compliance'  # Added
        ]
    }
}

result = detector.detect(old_snapshot, new_snapshot)

print(f"=== Figma Feature Changes ===")
print(f"Total changes detected: {result['total_changes']}")
print()

for change in result['changes']:
    if change['importance_score'] >= 0.60:  # Only HIGH importance
        print(f"🔴 {change['change_type']}")
        print(f"   Old: {change['old_value']}")
        print(f"   New: {change['new_value']}")
        print(f"   Importance: {change['importance_score']:.2f}")
        print()
