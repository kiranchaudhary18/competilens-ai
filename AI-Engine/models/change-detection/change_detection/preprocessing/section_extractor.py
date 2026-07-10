"""
Section extraction and structuring
"""
import re
from typing import Dict, List, Tuple


class SectionExtractor:
    """Extract and structure content into sections"""
    
    SECTION_KEYWORDS = {
        'pricing': [
            'pricing', 'price', 'plans', 'subscription', 'rates', 'costs', 'fees',
            'billing', 'payment', 'packages'
        ],
        'features': [
            'features', 'capabilities', 'functionality', 'benefits', 'what you get',
            'services', 'tools', 'integrations'
        ],
        'security': [
            'security', 'compliance', 'privacy', 'sso', 'saml', 'oauth', 'mfa',
            'encryption', 'certifications', 'soc2', 'iso', 'gdpr', 'hipaa'
        ],
        'support': [
            'support', 'help', 'support plans', 'customer support', 'sla',
            'training', 'onboarding', 'documentation'
        ],
        'hiring': [
            'careers', 'jobs', 'join us', 'hiring', 'work with us', 'open positions',
            'team'
        ],
        'product': [
            'products', 'solutions', 'use cases', 'industries', 'customers'
        ],
        'integrations': [
            'integrations', 'partners', 'api', 'webhooks', 'zapier', 'stripe',
            'third party', 'connect'
        ],
        'about': [
            'about', 'about us', 'company', 'team', 'story', 'mission', 'vision'
        ]
    }
    
    @staticmethod
    def detect_sections(text: str) -> Dict[str, List[str]]:
        """
        Detect sections in text based on keywords
        
        Returns:
            Dictionary mapping section names to line ranges
        """
        lines = text.split('\n')
        sections = {key: [] for key in SectionExtractor.SECTION_KEYWORDS.keys()}
        
        current_section = None
        
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            
            # Check if line starts a new section
            for section_name, keywords in SectionExtractor.SECTION_KEYWORDS.items():
                for keyword in keywords:
                    if keyword in line_lower and len(line_lower) < 100:
                        current_section = section_name
                        break
            
            if current_section:
                sections[current_section].append(line)
        
        # Clean up - convert lists of strings to single strings
        result = {}
        for section, lines_list in sections.items():
            if lines_list:
                result[section] = '\n'.join(lines_list)
        
        return result
    
    @staticmethod
    def extract_pricing_section(text: str) -> Dict[str, str]:
        """Extract pricing information from text"""
        pricing_data = {}
        
        # Look for patterns like "Plan: Price"
        lines = text.split('\n')
        
        for i, line in enumerate(lines):
            # Match "Pro Plan: $29/month"
            match = re.search(
                r'([A-Za-z\s]+)[\:]*\s*\$?([\d,.]+)(?:/([a-z]+))?',
                line
            )
            if match:
                plan_name = match.group(1).strip()
                price = match.group(2).strip()
                period = match.group(3) or 'month'
                
                if len(plan_name) < 50 and len(plan_name) > 2:
                    pricing_data[plan_name] = f"${price}/{period}"
        
        return pricing_data
    
    @staticmethod
    def extract_feature_list(text: str) -> List[str]:
        """Extract feature list from text"""
        lines = text.split('\n')
        features = []
        
        for line in lines:
            line = line.strip()
            
            # Match bullet points or numbered items
            if re.match(r'^[•\-\*\d+\.]\s+', line):
                # Remove leading markers
                clean_line = re.sub(r'^[•\-\*\d+\.]+\s+', '', line)
                if len(clean_line) > 3 and len(clean_line) < 300:
                    features.append(clean_line)
            # Also match lines that look like features without bullets
            elif (line and 
                  not line.endswith(':') and 
                  not line[0].isupper() == line[1].isupper() and
                  len(line) > 5 and len(line) < 200):
                # This is a heuristic, might need refinement
                pass
        
        return features
    
    @staticmethod
    def extract_hiring_info(text: str) -> Dict[str, any]:
        """Extract hiring information"""
        info = {
            'open_positions': 0,
            'departments': [],
            'raw_text': text[:500]  # First 500 chars
        }
        
        # Extract numbers that might be job counts
        numbers = re.findall(r'\d+', text)
        if numbers:
            info['open_positions'] = int(numbers[0])
        
        # Extract department/role mentions
        role_patterns = [
            r'(?:engineering|developer|sales|marketing|support|success)',
            r'(?:product|design|data|infrastructure|devops)',
        ]
        
        for pattern in role_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            info['departments'].extend(set(matches))
        
        return info
