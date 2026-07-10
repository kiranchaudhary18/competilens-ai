"""
Boilerplate removal and content filtering
"""
import re
from typing import Set, List, Tuple


class BoilerplateFilter:
    """Identify and filter boilerplate content"""
    
    def __init__(self):
        self.common_boilerplate_patterns = [
            # Navigation
            r'(?:home|about|contact|privacy|terms|help|support|login|sign\s*up)',
            # Footer
            r'(?:copyright|©|\d{4}|all\s*rights?\s*reserved)',
            # Legal
            r'(?:privacy\s*policy|terms\s*of\s*service|cookie\s*policy)',
            # Navigation items
            r'(?:back to top|scroll to top|previous|next)',
            # Tracking/Analytics markers
            r'(?:google\s*analytics|mixpanel|amplitude|tracking)',
            # Social media follow buttons
            r'(?:follow\s*us|like\s*us|subscribe|twitter|facebook|linkedin)',
            # Ads
            r'(?:advertisement|ad\s*choices|sponsored|promotional)',
        ]
    
    def is_boilerplate(self, text: str, threshold: float = 0.3) -> bool:
        """
        Check if text is likely boilerplate
        
        Args:
            text: Text to check
            threshold: Percentage of boilerplate patterns needed to classify
        """
        if not text or len(text) < 10:
            return True
        
        text_lower = text.lower()
        matches = 0
        
        for pattern in self.common_boilerplate_patterns:
            if re.search(pattern, text_lower):
                matches += 1
        
        ratio = matches / len(self.common_boilerplate_patterns)
        return ratio >= threshold
    
    def remove_boilerplate(self, text: str) -> Tuple[str, List[str]]:
        """
        Remove boilerplate lines from text
        
        Returns:
            Tuple of (cleaned_text, removed_lines)
        """
        lines = text.split('\n')
        cleaned_lines = []
        removed_lines = []
        
        for line in lines:
            if not self.is_boilerplate(line):
                cleaned_lines.append(line)
            else:
                removed_lines.append(line)
        
        return '\n'.join(cleaned_lines), removed_lines


class DuplicateFilter:
    """Identify and filter duplicate content"""
    
    @staticmethod
    def find_duplicate_lines(text: str) -> Tuple[str, List[str]]:
        """Remove duplicate lines from text"""
        lines = text.split('\n')
        seen = set()
        unique_lines = []
        duplicates = []
        
        for line in lines:
            line_lower = line.lower().strip()
            if line_lower and len(line_lower) > 5:  # Ignore short lines
                if line_lower in seen:
                    duplicates.append(line)
                else:
                    seen.add(line_lower)
                    unique_lines.append(line)
            elif not line_lower:
                # Keep empty lines for formatting
                unique_lines.append(line)
            else:
                unique_lines.append(line)
        
        return '\n'.join(unique_lines), duplicates
    
    @staticmethod
    def find_fuzzy_duplicates(lines: List[str], similarity_threshold: float = 0.95) -> dict:
        """Find fuzzy duplicate lines using basic string similarity"""
        from difflib import SequenceMatcher
        
        duplicates = {}
        
        for i, line1 in enumerate(lines):
            for j, line2 in enumerate(lines):
                if i >= j or len(line1) < 5 or len(line2) < 5:
                    continue
                
                ratio = SequenceMatcher(None, line1.lower(), line2.lower()).ratio()
                
                if ratio >= similarity_threshold:
                    key = (i, j)
                    duplicates[key] = ratio
        
        return duplicates


class ContentFilter:
    """Advanced content filtering"""
    
    @staticmethod
    def is_empty_or_whitespace(text: str) -> bool:
        """Check if text is empty or only whitespace"""
        return not text or not text.strip()
    
    @staticmethod
    def is_too_short(text: str, min_length: int = 5) -> bool:
        """Check if text is too short to be meaningful"""
        return len(text.strip()) < min_length
    
    @staticmethod
    def is_too_long_for_feature(text: str, max_length: int = 500) -> bool:
        """Check if text is too long to be a feature description"""
        return len(text) > max_length
    
    @staticmethod
    def has_mostly_special_chars(text: str, threshold: float = 0.5) -> bool:
        """Check if text is mostly special characters"""
        if not text:
            return True
        
        special_count = sum(1 for c in text if not c.isalnum() and not c.isspace())
        ratio = special_count / len(text)
        
        return ratio > threshold
    
    @staticmethod
    def is_repeated_char(text: str, threshold: int = 5) -> bool:
        """Check if text has too many repeated characters"""
        for char in set(text):
            if text.count(char * threshold) > 0:
                return True
        return False
    
    @staticmethod
    def filter_content(text: str) -> Tuple[bool, str]:
        """
        Apply comprehensive content filtering
        
        Returns:
            Tuple of (is_valid, reason_if_invalid)
        """
        if ContentFilter.is_empty_or_whitespace(text):
            return False, "empty_or_whitespace"
        
        if ContentFilter.is_too_short(text):
            return False, "too_short"
        
        if ContentFilter.has_mostly_special_chars(text):
            return False, "mostly_special_chars"
        
        if ContentFilter.is_repeated_char(text):
            return False, "repeated_characters"
        
        return True, ""
