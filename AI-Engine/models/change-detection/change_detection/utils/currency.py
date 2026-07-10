"""
Currency and number utilities
"""
import re
from typing import Optional, Tuple, Dict, Any


class CurrencyUtil:
    """Currency-related utilities"""
    
    CURRENCY_MAP = {
        '$': 'USD',
        '€': 'EUR', 'EUR': 'EUR',
        '£': 'GBP', 'GBP': 'GBP',
        '¥': 'JPY', 'JPY': 'JPY',
        '₹': 'INR', 'INR': 'INR',
        '₽': 'RUB', 'RUB': 'RUB',
        '₩': 'KRW', 'KRW': 'KRW',
        'C$': 'CAD', 'CAD': 'CAD',
        'A$': 'AUD', 'AUD': 'AUD',
        'CHF': 'CHF',
        'SGD': 'SGD',
        'HKD': 'HKD',
        'MXN': 'MXN',
        'BRL': 'BRL',
    }
    
    @staticmethod
    def normalize_currency(currency_str: str) -> str:
        """Normalize currency code"""
        currency_str = currency_str.upper()
        return CurrencyUtil.CURRENCY_MAP.get(currency_str, currency_str)
    
    @staticmethod
    def extract_currency_and_amount(text: str) -> Optional[Tuple[str, float, str]]:
        """
        Extract currency, amount, and period from text
        
        Returns:
            Tuple of (currency_code, amount, period) or None
        """
        # Try to match various price formats
        patterns = [
            r'([$€£¥₹₽₩]|[A-Z]{3})\s*(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:/([a-z]+))?',
            r'(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(USD|EUR|GBP|JPY|INR|RUB|KRW|CAD|AUD|CHF|SGD|HKD|MXN|BRL)\s*(?:/([a-z]+))?'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                if pattern == patterns[0]:
                    currency_sym = match.group(1)
                    amount_str = match.group(2)
                    period = match.group(3) or 'month'
                else:
                    amount_str = match.group(1)
                    currency_sym = match.group(2)
                    period = match.group(3) or 'month'
                
                try:
                    amount = float(amount_str.replace(',', ''))
                    currency = CurrencyUtil.normalize_currency(currency_sym)
                    return (currency, amount, period)
                except (ValueError, AttributeError):
                    pass
        
        return None


class NumberUtil:
    """Number-related utilities"""
    
    @staticmethod
    def extract_numbers(text: str) -> list:
        """Extract all numbers from text"""
        pattern = r'-?\d+(?:,\d{3})*(?:\.\d+)?'
        matches = re.findall(pattern, text)
        
        numbers = []
        for match in matches:
            try:
                num = float(match.replace(',', ''))
                numbers.append(num)
            except ValueError:
                pass
        
        return numbers
    
    @staticmethod
    def is_percentage(text: str) -> bool:
        """Check if text contains a percentage"""
        return bool(re.search(r'\d+(?:\.\d+)?\s*%', text))
    
    @staticmethod
    def extract_percentage(text: str) -> Optional[float]:
        """Extract percentage value"""
        match = re.search(r'(\d+(?:\.\d+)?)\s*%', text)
        if match:
            try:
                return float(match.group(1))
            except ValueError:
                pass
        return None
    
    @staticmethod
    def calculate_percent_change(old_val: float, new_val: float) -> float:
        """Calculate percentage change"""
        if old_val == 0:
            return 0.0
        
        return ((new_val - old_val) / abs(old_val)) * 100
    
    @staticmethod
    def format_number(num: float, decimals: int = 2) -> str:
        """Format number for display"""
        if isinstance(num, int):
            return f"{num:,}"
        else:
            return f"{num:,.{decimals}f}"
