"""
Utility schemas and common models
"""
from typing import Dict, Any, Optional, List
from pydantic import BaseModel


class EmbeddingResult(BaseModel):
    """Result of embedding text"""
    text: str
    embedding: List[float]
    text_hash: str
    
    class Config:
        arbitrary_types_allowed = True


class BatchEmbeddingResult(BaseModel):
    """Batch embedding results"""
    texts: List[str]
    embeddings: List[List[float]]
    hashes: List[str]
    
    class Config:
        arbitrary_types_allowed = True


class SimilarityMatch(BaseModel):
    """A similarity match between two texts"""
    old_text: str
    new_text: str
    similarity_score: float
    old_index: int
    new_index: int
    
    class Config:
        json_schema_extra = {
            "example": {
                "old_text": "Collaborate with 10 team members",
                "new_text": "Invite unlimited teammates",
                "similarity_score": 0.87,
                "old_index": 0,
                "new_index": 0
            }
        }


class RuleMatch(BaseModel):
    """Result of rule engine match"""
    rule_name: str
    change_type: str
    confidence_boost: float
    business_impact: float
    triggered: bool
    matched_keywords: List[str] = []
    matched_conditions: List[str] = []


class DiffItem(BaseModel):
    """An item from structural diff"""
    operation: str  # added, removed, modified, unchanged
    path: str  # JSON path to the item
    old_value: Optional[Any] = None
    new_value: Optional[Any] = None
    diff_type: str  # numeric, text, structural, etc
