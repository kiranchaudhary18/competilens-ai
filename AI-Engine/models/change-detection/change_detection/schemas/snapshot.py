"""
Schema definitions for snapshot data
"""
from typing import Any, Dict, Optional, List
from pydantic import BaseModel, Field
from datetime import datetime


class Snapshot(BaseModel):
    """Raw snapshot from a competitor website"""
    
    competitor_id: str
    snapshot_id: str
    url: str
    timestamp: datetime
    html_content: Optional[str] = None
    raw_data: Dict[str, Any]
    source_type: str = "web"  # web, api, crawl
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        json_schema_extra = {
            "example": {
                "competitor_id": "comp_123",
                "snapshot_id": "snap_456",
                "url": "https://example.com/pricing",
                "timestamp": "2026-07-09T10:30:00Z",
                "raw_data": {
                    "pricing": {"pro": "$29/month"},
                    "features": ["10 team members"]
                }
            }
        }


class NormalizedSnapshot(BaseModel):
    """Normalized and preprocessed snapshot"""
    
    snapshot_id: str
    competitor_id: str
    timestamp: datetime
    normalized_data: Dict[str, Any]
    sections: Dict[str, str]  # {"pricing": "...", "features": "...", etc}
    preprocessed_text: str
    removed_boilerplate: List[str] = Field(default_factory=list)
    
    class Config:
        json_schema_extra = {
            "example": {
                "snapshot_id": "snap_456",
                "competitor_id": "comp_123",
                "normalized_data": {
                    "pricing": {"pro": 29},
                    "features": ["unlimited_team_members"]
                }
            }
        }
