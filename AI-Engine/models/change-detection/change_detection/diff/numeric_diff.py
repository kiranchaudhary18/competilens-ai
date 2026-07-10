"""
Numeric diff detection
"""
import re
from typing import Tuple, Dict, Any, Optional


class NumericDiff:
    """Detect numeric changes"""
    
    @staticmethod
    def extract_numbers(text: str) -> list:
        """Extract all numbers from text"""
        pattern = r'-?\d+(?:,\d{3})*(?:\.\d+)?'
        matches = re.findall(pattern, text)
        numbers = []
        
        for match in matches:
            try:
                # Remove commas and convert
                num = float(match.replace(',', ''))
                numbers.append(num)
            except ValueError:
                pass
        
        return numbers
    
    @staticmethod
    def compare_numbers(old_val: Any, new_val: Any) -> Optional[Dict[str, Any]]:
        """Compare two numeric values"""
        
        try:
            old_num = float(old_val) if old_val is not None else None
            new_num = float(new_val) if new_val is not None else None
        except (ValueError, TypeError):
            return None
        
        if old_num is None or new_num is None:
            return None
        
        if old_num == new_num:
            return {
                'changed': False,
                'old_value': old_num,
                'new_value': new_num,
                'change_type': 'no_change'
            }
        
        absolute_change = new_num - old_num
        
        if old_num != 0:
            percent_change = (absolute_change / old_num) * 100
        else:
            percent_change = float('inf') if new_num != 0 else 0
        
        change_direction = 'increase' if absolute_change > 0 else 'decrease'
        
        return {
            'changed': True,
            'old_value': old_num,
            'new_value': new_num,
            'absolute_change': absolute_change,
            'percent_change': percent_change,
            'change_direction': change_direction,
            'change_type': f'numeric_{change_direction}',
            'magnitude': abs(percent_change) / 100  # Normalized 0-1 scale
        }


class CurrencyDiff:
    """Detect currency/pricing changes"""
    
    CURRENCY_SYMBOLS = {
        '$': 'USD',
        '€': 'EUR',
        '£': 'GBP',
        '¥': 'JPY',
        '₹': 'INR',
        '₽': 'RUB',
        '₩': 'KRW',
        'C$': 'CAD',
        'A$': 'AUD'
    }
    
    @staticmethod
    def extract_price(text: str) -> Optional[Dict[str, Any]]:
        """
        Extract price from text
        
        Returns:
            {
                'amount': float,
                'currency': str,
                'raw': str,
                'period': str  # month, year, etc
            }
        """
        # Pattern: $29.99/month or 29.99 USD/year
        pattern = r'([$€£¥₹₽₩]|[A-Z]{3})?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:USD|EUR|GBP|JPY|INR|RUB|KRW|CAD|AUD)?\s*(?:/([a-z]+))?'
        
        match = re.search(pattern, text, re.IGNORECASE)
        if not match:
            return None
        
        currency_symbol = match.group(1) or '$'
        amount_str = match.group(2).replace(',', '')
        period = match.group(3) or 'month'
        
        try:
            amount = float(amount_str)
        except ValueError:
            return None
        
        currency = CurrencyDiff.CURRENCY_SYMBOLS.get(currency_symbol, 'USD')
        
        return {
            'amount': amount,
            'currency': currency,
            'period': period,
            'raw': match.group(0)
        }
    
    @staticmethod
    def compare_prices(old_price_text: str, new_price_text: str) -> Optional[Dict[str, Any]]:
        """Compare two prices"""
        
        old_price = CurrencyDiff.extract_price(old_price_text)
        new_price = CurrencyDiff.extract_price(new_price_text)
        
        if not old_price or not new_price:
            return None
        
        # Only compare same currency and period
        if old_price['currency'] != new_price['currency']:
            return {
                'comparable': False,
                'reason': 'different_currency'
            }
        
        if old_price['period'] != new_price['period']:
            return {
                'comparable': False,
                'reason': 'different_period'
            }
        
        amount_change = new_price['amount'] - old_price['amount']
        
        if old_price['amount'] != 0:
            percent_change = (amount_change / old_price['amount']) * 100
        else:
            percent_change = 0
        
        return {
            'comparable': True,
            'old_amount': old_price['amount'],
            'new_amount': new_price['amount'],
            'currency': old_price['currency'],
            'period': old_price['period'],
            'absolute_change': amount_change,
            'percent_change': percent_change,
            'change_direction': 'increase' if amount_change > 0 else 'decrease' if amount_change < 0 else 'no_change',
            'change_type': 'price_increase' if amount_change > 0 else 'price_decrease' if amount_change < 0 else 'price_no_change'
        }


class PercentageDiff:
    """Detect percentage/ratio changes"""
    
    @staticmethod
    def extract_percentage(text: str) -> Optional[float]:
        """Extract percentage from text"""
        match = re.search(r'(\d+(?:\.\d+)?)\s*%', text)
        if match:
            try:
                return float(match.group(1))
            except ValueError:
                pass
        return None
    
    @staticmethod
    def compare_percentages(old_text: str, new_text: str) -> Optional[Dict[str, Any]]:
        """Compare two percentages"""
        
        old_pct = PercentageDiff.extract_percentage(old_text)
        new_pct = PercentageDiff.extract_percentage(new_text)
        
        if old_pct is None or new_pct is None:
            return None
        
        absolute_change = new_pct - old_pct
        
        if old_pct != 0:
            percent_change_of_percent = (absolute_change / old_pct) * 100
        else:
            percent_change_of_percent = 0
        
        return {
            'old_percentage': old_pct,
            'new_percentage': new_pct,
            'absolute_change': absolute_change,
            'percent_change_of_percent': percent_change_of_percent,
            'change_type': 'percentage_increase' if absolute_change > 0 else 'percentage_decrease' if absolute_change < 0 else 'no_change'
        }


class VersionDiff:
    """Detect version changes"""
    
    @staticmethod
    def parse_version(text: str) -> Optional[Tuple[int, int, int]]:
        """Parse semantic version from text"""
        # Match X.Y.Z pattern
        match = re.search(r'v?(\d+)\.(\d+)\.(\d+)', text)
        if match:
            return (int(match.group(1)), int(match.group(2)), int(match.group(3)))
        return None
    
    @staticmethod
    def compare_versions(old_version: str, new_version: str) -> Optional[Dict[str, Any]]:
        """Compare two versions"""
        
        old_v = VersionDiff.parse_version(old_version)
        new_v = VersionDiff.parse_version(new_version)
        
        if not old_v or not new_v:
            return None
        
        old_major, old_minor, old_patch = old_v
        new_major, new_minor, new_patch = new_v
        
        if new_major > old_major:
            change_type = 'major_version_upgrade'
        elif new_minor > old_minor:
            change_type = 'minor_version_upgrade'
        elif new_patch > old_patch:
            change_type = 'patch_version_upgrade'
        elif (new_major, new_minor, new_patch) < (old_major, old_minor, old_patch):
            change_type = 'version_downgrade'
        else:
            change_type = 'no_version_change'
        
        return {
            'old_version': old_version,
            'new_version': new_version,
            'old_parsed': old_v,
            'new_parsed': new_v,
            'change_type': change_type,
            'upgraded': (new_major, new_minor, new_patch) > (old_major, old_minor, old_patch)
        }
