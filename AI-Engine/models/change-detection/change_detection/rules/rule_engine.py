"""
Business rule engine for change classification
"""
import re
import logging
from typing import List, Dict, Any, Optional
import yaml

logger = logging.getLogger(__name__)


class RuleEngine:
    """Apply business rules to detect and classify changes"""
    
    def __init__(self, rules_config_path: Optional[str] = None):
        """
        Initialize rule engine
        
        Args:
            rules_config_path: Path to rules YAML config file
        """
        self.rules = {}
        self.rule_configs = {}
        
        if rules_config_path:
            self._load_rules_from_config(rules_config_path)
    
    def _load_rules_from_config(self, config_path: str):
        """Load rules from YAML config"""
        try:
            with open(config_path, 'r') as f:
                config = yaml.safe_load(f)
            
            # Load pricing rules
            if 'pricing_rules' in config:
                for rule in config['pricing_rules']:
                    self.register_rule(rule)
            
            # Load feature rules
            if 'feature_rules' in config:
                for rule in config['feature_rules']:
                    self.register_rule(rule)
            
            # Load security rules
            if 'security_rules' in config:
                for rule in config['security_rules']:
                    self.register_rule(rule)
            
            # Load other rule categories
            for category in ['hiring_rules', 'product_rules', 'integration_rules']:
                if category in config:
                    for rule in config[category]:
                        self.register_rule(rule)
            
            logger.info(f"Loaded {len(self.rules)} rules from config")
        except Exception as e:
            logger.error(f"Failed to load rules config: {e}")
    
    def register_rule(self, rule: Dict[str, Any]):
        """Register a new rule"""
        rule_name = rule.get('name')
        if rule_name:
            self.rules[rule_name] = rule
            logger.debug(f"Registered rule: {rule_name}")
    
    def match_pricing_rules(self, old_value: Any, new_value: Any) -> List[Dict]:
        """Match pricing-related rules"""
        matches = []
        
        from ..preprocessing.text_normalizer import PriceNormalizer
        
        try:
            old_num = PriceNormalizer.extract_amount(str(old_value)) if old_value is not None else None
            new_num = PriceNormalizer.extract_amount(str(new_value)) if new_value is not None else None
        except (ValueError, TypeError):
            return matches
        
        if old_num is None or new_num is None or old_num == 0.0 or new_num == 0.0:
            return matches
        
        # PRICE_INCREASE
        if new_num > old_num:
            matches.append({
                'rule_name': 'PRICE_INCREASE',
                'triggered': True,
                'confidence_boost': 0.15,
                'business_impact': 0.95,
                'matched_keywords': [],
                'percent_change': ((new_num - old_num) / old_num) * 100
            })
        
        # PRICE_DECREASE
        elif new_num < old_num:
            matches.append({
                'rule_name': 'PRICE_DECREASE',
                'triggered': True,
                'confidence_boost': 0.15,
                'business_impact': 0.90,
                'matched_keywords': [],
                'percent_change': ((old_num - new_num) / old_num) * 100
            })
        
        return matches
    
    def match_keyword_rules(self, text: str, rule_category: str = 'all') -> List[Dict]:
        """
        Match rules based on keywords in text
        
        Args:
            text: Text to check
            rule_category: 'security', 'hiring', 'product', 'integration', or 'all'
        """
        matches = []
        text_lower = text.lower()
        
        # Security rules
        if rule_category in ['security', 'all']:
            security_keywords = [
                r'\b(sso|saml|oauth|mfa|2fa|two-factor)\b',
                r'\b(encryption|ssl|tls|https)\b',
                r'\b(audit|compliance|soc2|iso)\b'
            ]
            
            for keyword_pattern in security_keywords:
                if re.search(keyword_pattern, text_lower, re.IGNORECASE):
                    if 'added' in text_lower or 'new' in text_lower:
                        matches.append({
                            'rule_name': 'SECURITY_CAPABILITY_ADDED',
                            'triggered': True,
                            'confidence_boost': 0.20,
                            'business_impact': 0.98,
                            'matched_keywords': re.findall(keyword_pattern, text_lower, re.IGNORECASE)
                        })
                    elif 'removed' in text_lower or 'deprecated' in text_lower:
                        matches.append({
                            'rule_name': 'SECURITY_CAPABILITY_REMOVED',
                            'triggered': True,
                            'confidence_boost': 0.20,
                            'business_impact': 0.95,
                            'matched_keywords': re.findall(keyword_pattern, text_lower, re.IGNORECASE)
                        })
        
        # Hiring rules
        if rule_category in ['hiring', 'all']:
            hiring_keywords = [
                r'\b(open positions?|jobs?|hiring|careers?|roles?)\b',
            ]
            
            for keyword_pattern in hiring_keywords:
                if re.search(keyword_pattern, text_lower, re.IGNORECASE):
                    matches.append({
                        'rule_name': 'HIRING_ACTIVITY_DETECTED',
                        'triggered': True,
                        'confidence_boost': 0.10,
                        'business_impact': 0.70,
                        'matched_keywords': re.findall(keyword_pattern, text_lower, re.IGNORECASE)
                    })
        
        # Product rules
        if rule_category in ['product', 'all']:
            deprecation_keywords = r'\b(deprecated|discontin|sunset|retire|legacy)\b'
            
            if re.search(deprecation_keywords, text_lower, re.IGNORECASE):
                matches.append({
                    'rule_name': 'PRODUCT_DEPRECATION',
                    'triggered': True,
                    'confidence_boost': 0.18,
                    'business_impact': 0.80,
                    'matched_keywords': re.findall(deprecation_keywords, text_lower, re.IGNORECASE)
                })
        
        # Integration rules
        if rule_category in ['integration', 'all']:
            integration_keywords = r'\b(integration|api|webhook|zapier|stripe|slack)\b'
            
            if re.search(integration_keywords, text_lower, re.IGNORECASE):
                matches.append({
                    'rule_name': 'INTEGRATION_MENTIONED',
                    'triggered': True,
                    'confidence_boost': 0.12,
                    'business_impact': 0.65,
                    'matched_keywords': re.findall(integration_keywords, text_lower, re.IGNORECASE)
                })
        
        return matches
    
    def match_feature_rules(self, old_text: str, new_text: str) -> List[Dict]:
        """Match feature-related rules"""
        matches = []
        
        old_lower = old_text.lower() if old_text else ""
        new_lower = new_text.lower() if new_text else ""
        
        # Check for feature additions
        if new_lower and not old_lower:
            matches.append({
                'rule_name': 'FEATURE_ADDED',
                'triggered': True,
                'confidence_boost': 0.10,
                'business_impact': 0.75,
                'matched_keywords': [],
            })
        
        # Check for feature removals
        elif old_lower and not new_lower:
            matches.append({
                'rule_name': 'FEATURE_REMOVED',
                'triggered': True,
                'confidence_boost': 0.10,
                'business_impact': 0.80,
                'matched_keywords': [],
            })
        
        # Check for upgrades (new has more than old)
        elif new_lower and old_lower:
            try:
                old_val = float(old_text)
                new_val = float(new_text)
                
                if new_val > old_val:
                    matches.append({
                        'rule_name': 'FEATURE_UPGRADED',
                        'triggered': True,
                        'confidence_boost': 0.12,
                        'business_impact': 0.85,
                        'matched_keywords': [],
                        'upgrade_factor': new_val / old_val if old_val > 0 else 0
                    })
            except (ValueError, TypeError):
                # Not numeric, just check text length
                if len(new_text) > len(old_text) * 1.5:
                    matches.append({
                        'rule_name': 'FEATURE_ENHANCED',
                        'triggered': True,
                        'confidence_boost': 0.08,
                        'business_impact': 0.70,
                        'matched_keywords': [],
                    })
        
        return matches
    
    def evaluate_rules(self, change_info: Dict[str, Any]) -> List[Dict]:
        """
        Evaluate all applicable rules for a change
        
        Args:
            change_info: Dict containing change information
        """
        all_matches = []
        
        old_value = change_info.get('old_value')
        new_value = change_info.get('new_value')
        old_text = str(old_value) if old_value else ""
        new_text = str(new_value) if new_value else ""
        change_type = change_info.get('change_type', '')
        
        # Pricing rules
        if 'price' in change_type.lower() or 'pricing' in change_type.lower():
            all_matches.extend(self.match_pricing_rules(old_value, new_value))
        
        # Feature rules
        if 'feature' in change_type.lower():
            all_matches.extend(self.match_feature_rules(old_text, new_text))
        
        # Keyword-based rules
        combined_text = old_text + " " + new_text
        all_matches.extend(self.match_keyword_rules(combined_text))
        
        return all_matches
