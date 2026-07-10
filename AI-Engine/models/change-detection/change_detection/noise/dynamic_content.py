"""
Dynamic content filtering (timestamps, counters, etc)
"""
import re
import logging
from typing import List, Dict, Tuple

logger = logging.getLogger(__name__)


class DynamicContentFilter:
    """Filter out dynamic/temporal content"""
    
    def __init__(self):
        self.dynamic_patterns = [
            # Timestamps and dates
            (r'\d{4}-\d{2}-\d{2}', 'date'),
            (r'\d{1,2}[:h]\d{2}([:m]\d{2})?', 'time'),
            (r'(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}', 'date'),
            (r'\d{1,2}/\d{1,2}/\d{4}', 'date'),
            
            # Counters and metrics
            (r'(?:viewed?|clicked?|viewed?\s+(\d+)\s+times?)', 'counter'),
            (r'(?:impressions?|page\s+views?|visits?):\s*\d+', 'counter'),
            (r'\d+\s+(?:visitors?|users?|members?)\s+(?:online|active)', 'counter'),
            
            # Real-time updates
            (r'(?:updated?|last updated?):\s+(?:just now|moments ago|\d+\s+(?:seconds?|minutes?|hours?|days?)\s+ago)', 'temporal'),
            (r'(?:in stock|out of stock).*\(\d+.*\)', 'inventory'),
            
            # Session/tracking IDs
            (r'(?:session|user|id)=[\w\d\-]+', 'session_id'),
            (r'(?:token|auth)[:=]\s*[\w\d\-]+', 'token'),
            
            # Random numbers (often ad networks)
            (r'ad\d{5,}', 'ad_network'),
        ]
    
    def is_dynamic_content(self, text: str) -> Tuple[bool, str]:
        """
        Check if text is likely dynamic/temporal content
        
        Returns:
            Tuple of (is_dynamic, reason)
        """
        for pattern, reason in self.dynamic_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                return True, reason
        
        return False, ""
    
    def filter_dynamic_changes(self, change_info: Dict) -> bool:
        """
        Should this change be filtered out as dynamic content?
        
        Returns:
            True if should be filtered, False if should keep
        """
        old_text = str(change_info.get('old_value', ''))
        new_text = str(change_info.get('new_value', ''))
        
        # Check if both values are dynamic
        old_is_dynamic, old_reason = self.is_dynamic_content(old_text)
        new_is_dynamic, new_reason = self.is_dynamic_content(new_text)
        
        if old_is_dynamic and new_is_dynamic and old_reason == new_reason:
            # Both are same type of dynamic content - filter it
            logger.debug(f"Filtering dynamic content change: {old_reason}")
            return True
        
        return False


class InventoryFilter:
    """Filter out inventory/stock status changes"""
    
    @staticmethod
    def is_inventory_change(text: str) -> bool:
        """Check if text is inventory/stock related"""
        stock_keywords = [
            'in stock', 'out of stock', 'available', 'inventory',
            'stock level', 'units available', 'qty', 'quantity',
            'limited stock', 'back order', 'pre-order'
        ]
        
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in stock_keywords)
    
    @staticmethod
    def filter_inventory_changes(old_value: str, new_value: str) -> bool:
        """Should this inventory change be filtered?"""
        return (InventoryFilter.is_inventory_change(str(old_value)) and 
                InventoryFilter.is_inventory_change(str(new_value)))


class AnalyticsFilter:
    """Filter analytics and tracking related changes"""
    
    @staticmethod
    def is_analytics_content(text: str) -> bool:
        """Check if text is analytics related"""
        analytics_keywords = [
            'pageview', 'impression', 'click', 'bounce rate',
            'session', 'user agent', 'referrer', 'utm_',
            'google analytics', 'facebook pixel', 'mixpanel'
        ]
        
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in analytics_keywords)
    
    @staticmethod
    def filter_analytics_changes(old_value: str, new_value: str) -> bool:
        """Should this analytics change be filtered?"""
        return (AnalyticsFilter.is_analytics_content(str(old_value)) and 
                AnalyticsFilter.is_analytics_content(str(new_value)))
