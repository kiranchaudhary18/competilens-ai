"""
Schema definitions for detected changes
"""
from typing import Any, Optional, List, Dict
from pydantic import BaseModel, Field
from enum import Enum


class ChangeType(str, Enum):
    """Types of changes that can be detected"""
    
    # Exact/Numeric changes
    PRICE_INCREASE = "PRICE_INCREASE"
    PRICE_DECREASE = "PRICE_DECREASE"
    NUMERIC_INCREASE = "NUMERIC_INCREASE"
    NUMERIC_DECREASE = "NUMERIC_DECREASE"
    PERCENTAGE_CHANGE = "PERCENTAGE_CHANGE"
    VERSION_CHANGE = "VERSION_CHANGE"
    
    # Feature changes
    FEATURE_ADDED = "FEATURE_ADDED"
    FEATURE_REMOVED = "FEATURE_REMOVED"
    FEATURE_MODIFIED = "FEATURE_MODIFIED"
    FEATURE_UPGRADED = "FEATURE_UPGRADED"
    
    # Pricing tier changes
    PRICING_TIER_CHANGE = "PRICING_TIER_CHANGE"
    PRICING_TIER_ADDED = "PRICING_TIER_ADDED"
    PRICING_TIER_REMOVED = "PRICING_TIER_REMOVED"
    
    # Security changes
    SECURITY_CAPABILITY_ADDED = "SECURITY_CAPABILITY_ADDED"
    SECURITY_CAPABILITY_REMOVED = "SECURITY_CAPABILITY_REMOVED"
    
    # Hiring changes
    HIRING_SURGE = "HIRING_SURGE"
    HIRING_REDUCTION = "HIRING_REDUCTION"
    
    # Product changes
    NEW_PRODUCT_LAUNCH = "NEW_PRODUCT_LAUNCH"
    PRODUCT_DEPRECATION = "PRODUCT_DEPRECATION"
    
    # Integration changes
    INTEGRATION_ADDED = "INTEGRATION_ADDED"
    INTEGRATION_REMOVED = "INTEGRATION_REMOVED"
    
    # Content changes
    TEXT_MODIFIED = "TEXT_MODIFIED"
    SEMANTIC_SHIFT = "SEMANTIC_SHIFT"
    SENTIMENT_SHIFT = "SENTIMENT_SHIFT"


class Severity(str, Enum):
    """Severity levels of changes"""
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    INFO = "INFO"


class ChangeDetectionMethod(str, Enum):
    """How the change was detected"""
    EXACT_DIFF = "EXACT_DIFF"
    SEMANTIC_MATCHING = "SEMANTIC_MATCHING"
    RULE_ENGINE = "RULE_ENGINE"
    CUSTOM_MODEL = "CUSTOM_MODEL"
    HYBRID = "HYBRID"


class SingleChange(BaseModel):
    """A single detected change"""
    
    change_id: str = Field(description="Unique change identifier")
    change_type: ChangeType
    entity: Optional[str] = Field(default=None, description="What changed (e.g., 'Pro Plan', 'Feature X')")
    
    # Values
    old_value: Any = Field(default=None, description="Previous value")
    new_value: Any = Field(default=None, description="New value")
    
    # Scoring
    semantic_similarity: float = Field(ge=0.0, le=1.0, description="How similar old and new are semantically")
    importance_score: float = Field(ge=0.0, le=1.0, description="How important is this change")
    confidence_score: float = Field(ge=0.0, le=1.0, description="How confident are we")
    severity: Severity
    
    # Metadata
    detection_method: ChangeDetectionMethod
    matched_rules: List[str] = Field(default_factory=list, description="Rules that matched this change")
    business_impact_score: float = Field(ge=0.0, le=1.0, description="Business impact 0-1")
    magnitude: float = Field(ge=0.0, default=0.0, description="Magnitude of change (0-1 normalized)")
    
    # Source
    source_text_old: Optional[str] = None
    source_text_new: Optional[str] = None
    section: Optional[str] = None  # pricing, features, security, etc
    
    class Config:
        json_schema_extra = {
            "example": {
                "change_id": "chg_789",
                "change_type": "PRICE_INCREASE",
                "entity": "Pro Plan",
                "old_value": "$29/month",
                "new_value": "$39/month",
                "semantic_similarity": 0.96,
                "importance_score": 0.91,
                "confidence_score": 0.97,
                "severity": "HIGH",
                "detection_method": "EXACT_DIFF"
            }
        }


class ChangeDetectionResult(BaseModel):
    """Final result of change detection between two snapshots"""
    
    result_id: str
    competitor_id: str
    
    old_snapshot_id: str
    new_snapshot_id: str
    
    change_detected: bool
    total_changes: int
    
    # Changes grouped by type
    changes: List[SingleChange] = Field(default_factory=list)
    
    # Summary stats
    critical_changes: int = 0
    high_changes: int = 0
    medium_changes: int = 0
    low_changes: int = 0
    
    # Processing metadata
    processing_time_ms: float = 0.0
    detection_methods_used: List[ChangeDetectionMethod] = Field(default_factory=list)
    noise_removed_count: int = 0
    duplicate_removed_count: int = 0
    
    # Timestamps
    created_at: str
    
    def __post_init__(self):
        """Update summary stats"""
        severity_counts = {}
        for change in self.changes:
            severity_counts[change.severity] = severity_counts.get(change.severity, 0) + 1
        
        self.critical_changes = severity_counts.get(Severity.CRITICAL, 0)
        self.high_changes = severity_counts.get(Severity.HIGH, 0)
        self.medium_changes = severity_counts.get(Severity.MEDIUM, 0)
        self.low_changes = severity_counts.get(Severity.LOW, 0)
    
    class Config:
        json_schema_extra = {
            "example": {
                "result_id": "res_111",
                "competitor_id": "comp_123",
                "change_detected": True,
                "total_changes": 2,
                "changes": []
            }
        }
