from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class EvidenceType(str, Enum):
    SIGNAL = "SIGNAL"
    CONTENT_CLASSIFICATION = "CONTENT_CLASSIFICATION"
    SENTIMENT_INTELLIGENCE = "SENTIMENT_INTELLIGENCE"
    CHANGE_DETECTION = "CHANGE_DETECTION"
    HISTORICAL_SNAPSHOT = "HISTORICAL_SNAPSHOT"


class EvidenceItem(BaseModel):
    """
    Unified contract for a single groundable unit of evidence.
    Derived from raw scraper outputs, classifier labels, sentiment, or change records.
    """

    evidence_id: str = Field(..., description="Unique identifier for this evidence item (e.g. sig_123, chg_456)")
    workspace_id: str = Field(..., description="Scope workspace ID")
    competitor_id: str = Field(..., description="Scope competitor ID")
    evidence_type: EvidenceType = Field(..., description="Origin component of this evidence")
    
    # Source context
    source_type: str = Field(..., description="e.g. 'WEBSITE', 'PRICING_PAGE', 'BLOG', 'NEWS', 'G2_REVIEW'")
    source_reference: Optional[str] = Field(None, description="URL, document section, or source title")
    observed_at: str = Field(..., description="ISO 8601 date string when evidence was captured")
    
    # Core text content (crucial for LLM grounding)
    content: str = Field(..., description="Extracted raw text snippet or description representing the event")
    reliability_score: float = Field(default=1.0, ge=0.0, le=1.0, description="Overall reliability score (0-1)")

    # Component-specific structured data
    classifier_label: Optional[str] = Field(None, description="Label from custom ML classifier")
    classifier_confidence: Optional[float] = Field(None, description="Confidence of ML classifier")
    
    sentiment_label: Optional[str] = Field(None, description="Sentiment label (POSITIVE, NEGATIVE, NEUTRAL)")
    sentiment_confidence: Optional[float] = Field(None, description="Confidence of sentiment model")
    
    change_type: Optional[str] = Field(None, description="Change Type from Change Engine")
    change_severity: Optional[str] = Field(None, description="Change Severity level")
    change_confidence: Optional[float] = Field(None, description="Confidence of change detection")
    old_value: Optional[Any] = Field(None, description="Previous value prior to change")
    new_value: Optional[Any] = Field(None, description="New value after change")

    # Extra catch-all custom metadata
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional custom metadata fields")


class EvidencePack(BaseModel):
    """
    A collection of evidence compiled for a specific competitor in a workspace.
    Sent as a complete pack to the LLM to prevent raw-data dump hallucinations.
    """

    pack_id: str = Field(..., description="Unique evidence pack identifier")
    workspace_id: str = Field(..., description="Workspace context ID")
    competitor_id: str = Field(..., description="Competitor context ID")
    competitor_name: str = Field(..., description="Competitor name")
    generated_at: str = Field(..., description="ISO 8601 creation timestamp")
    
    # Items
    items: List[EvidenceItem] = Field(default_factory=list, description="List of evidence items")
    
    # Summary parameters
    total_signals: int = 0
    total_change_events: int = 0
    negative_sentiment_count: int = 0
    positive_sentiment_count: int = 0
    
    def __init__(self, **data):
        super().__init__(**data)
        # Auto-compute counts
        self.total_signals = sum(1 for item in self.items if item.evidence_type == EvidenceType.SIGNAL)
        self.total_change_events = sum(1 for item in self.items if item.evidence_type == EvidenceType.CHANGE_DETECTION)
        self.negative_sentiment_count = sum(1 for item in self.items if item.sentiment_label == "NEGATIVE")
        self.positive_sentiment_count = sum(1 for item in self.items if item.sentiment_label == "POSITIVE")
