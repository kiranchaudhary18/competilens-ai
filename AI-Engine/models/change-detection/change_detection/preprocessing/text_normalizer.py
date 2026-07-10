"""
Text normalization and standardization
"""
import re
from typing import Dict, Any
import unicodedata


class TextNormalizer:
    """Normalize text for comparison"""
    
    @staticmethod
    def normalize_whitespace(text: str) -> str:
        """Normalize all types of whitespace"""
        # Replace multiple spaces with single space
        text = re.sub(r' +', ' ', text)
        # Replace multiple newlines with single newline
        text = re.sub(r'\n+', '\n', text)
        # Replace tabs with spaces
        text = re.sub(r'\t+', ' ', text)
        # Strip leading/trailing whitespace from each line
        lines = [line.strip() for line in text.split('\n')]
        return '\n'.join(lines).strip()
    
    @staticmethod
    def normalize_case(text: str, preserve_acronyms: bool = False) -> str:
        """
        Normalize case - lowercase except acronyms
        
        Args:
            text: Text to normalize
            preserve_acronyms: If True, keep uppercase acronyms like API, SSO
        """
        if preserve_acronyms:
            # Keep sequences of 2+ uppercase letters as acronyms
            def preserve_case(match):
                word = match.group(0)
                if len(word) >= 2 and word.isupper():
                    return word
                return word.lower()
            return re.sub(r'\b\w+\b', preserve_case, text)
        else:
            return text.lower()
    
    @staticmethod
    def normalize_unicode(text: str) -> str:
        """Normalize unicode characters"""
        # NFD normalization
        text = unicodedata.normalize('NFD', text)
        # Remove combining marks
        text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
        return text
    
    @staticmethod
    def normalize_punctuation(text: str) -> str:
        """Normalize punctuation"""
        # Replace smart quotes with regular quotes
        text = re.sub(r'[“”"\'‘’]', '"', text)
        # Replace en-dash and em-dash with hyphen
        text = re.sub(r'[–—]', '-', text)
        # Remove extra punctuation
        text = re.sub(r'[\.]{2,}', '...', text)
        return text
    
    @staticmethod
    def normalize_numbers(text: str) -> str:
        """Normalize number representations"""
        # Remove commas from numbers: 1,000 -> 1000
        text = re.sub(r'(\d),(\d)', r'\1\2', text)
        # Normalize currency: $29 USD -> $29
        text = re.sub(r'\$\s*', '$', text)
        text = re.sub(r'(USD|dollars?|€|GBP|₹)\s*', '', text, flags=re.IGNORECASE)
        # Normalize percentages: 50 % -> 50%
        text = re.sub(r'(\d+)\s*%', r'\1%', text)
        return text
    
    @staticmethod
    def normalize_whitespace_in_words(text: str) -> str:
        """Remove spaces within compound words"""
        # team members -> teamembers (for matching)
        # Though we might want to keep some variations...
        # Actually, let's be conservative and only do this for obvious cases
        text = re.sub(r'([Tt])eam\s+members', r'\1eammembers', text)
        text = re.sub(r'([Ss]ingle\s+sign)[- ]?on', r'\1on', text)
        return text
    
    @staticmethod
    def remove_stopwords(text: str, language: str = 'english') -> str:
        """Remove common stopwords"""
        # Basic stopwords - can expand
        stopwords = {
            'english': [
                'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
                'of', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
                'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
                'can', 'could', 'may', 'might', 'must', 'shall'
            ]
        }
        
        if language not in stopwords:
            return text
        
        words = text.split()
        filtered = [w for w in words if w.lower() not in stopwords[language]]
        return ' '.join(filtered)
    
    @staticmethod
    def normalize(text: str, full_normalize: bool = False) -> str:
        """
        Apply standard normalization pipeline
        
        Args:
            text: Text to normalize
            full_normalize: If True, apply aggressive normalization
        """
        # Always apply these
        text = TextNormalizer.normalize_unicode(text)
        text = TextNormalizer.normalize_whitespace(text)
        text = TextNormalizer.normalize_punctuation(text)
        text = TextNormalizer.normalize_numbers(text)
        
        if full_normalize:
            text = TextNormalizer.normalize_case(text)
        
        return text


class PriceNormalizer:
    """Normalize prices for comparison"""
    
    @staticmethod
    def extract_amount(price_str: str) -> float:
        """Extract numeric amount from price string"""
        # Remove currency symbols and text
        price_str = re.sub(r'[^\d.]', '', price_str)
        try:
            return float(price_str) if price_str else 0.0
        except ValueError:
            return 0.0
    
    @staticmethod
    def are_prices_equivalent(price1: str, price2: str, tolerance: float = 0.01) -> bool:
        """Check if two prices are equivalent"""
        amount1 = PriceNormalizer.extract_amount(price1)
        amount2 = PriceNormalizer.extract_amount(price2)
        return abs(amount1 - amount2) <= tolerance
    
    @staticmethod
    def calculate_price_change(old_price: str, new_price: str) -> Dict[str, Any]:
        """Calculate price change percentage"""
        old_amount = PriceNormalizer.extract_amount(old_price)
        new_amount = PriceNormalizer.extract_amount(new_price)
        
        if old_amount == 0:
            return {
                'old_amount': old_amount,
                'new_amount': new_amount,
                'absolute_change': new_amount,
                'percent_change': 0.0 if new_amount == 0 else float('inf')
            }
        
        absolute_change = new_amount - old_amount
        percent_change = (absolute_change / old_amount) * 100
        
        return {
            'old_amount': old_amount,
            'new_amount': new_amount,
            'absolute_change': absolute_change,
            'percent_change': percent_change
        }
