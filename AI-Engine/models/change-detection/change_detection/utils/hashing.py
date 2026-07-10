"""
Utility functions for hashing and deduplication
"""
import hashlib
import json
from typing import Any, Dict


class HashUtil:
    """Utility functions for hashing"""
    
    @staticmethod
    def hash_text(text: str) -> str:
        """Create MD5 hash of text"""
        return hashlib.md5(text.encode()).hexdigest()
    
    @staticmethod
    def hash_dict(data: Dict[str, Any]) -> str:
        """Create hash of dictionary"""
        json_str = json.dumps(data, sort_keys=True)
        return hashlib.md5(json_str.encode()).hexdigest()
    
    @staticmethod
    def hash_pair(old_val: Any, new_val: Any) -> str:
        """Create hash of old/new value pair"""
        combined = f"{old_val}|{new_val}"
        return hashlib.md5(combined.encode()).hexdigest()


class ContentNormalizer:
    """Normalize content for comparison"""
    
    @staticmethod
    def normalize_for_comparison(text: str) -> str:
        """Normalize text for comparison"""
        import re
        
        # Lowercase
        text = text.lower()
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove punctuation
        text = re.sub(r'[^\w\s]', '', text)
        
        return text.strip()
    
    @staticmethod
    def are_semantically_equivalent(text1: str, text2: str) -> bool:
        """Check if two texts are semantically equivalent"""
        norm1 = ContentNormalizer.normalize_for_comparison(text1)
        norm2 = ContentNormalizer.normalize_for_comparison(text2)
        
        return norm1 == norm2
