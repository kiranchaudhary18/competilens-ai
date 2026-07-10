from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import yaml
from pathlib import Path
from typing import Dict, Any, List, Optional
import sys

# Resolve paths
ROOT = Path(__file__).resolve().parents[3]
CHANGE_DETECTION_DIR = ROOT / "models" / "change-detection"
sys.path.insert(0, str(CHANGE_DETECTION_DIR.resolve()))

from change_detection.pipeline.detector import HybridChangeDetector

router = APIRouter(prefix="/v1", tags=["change-detection"])

# Load config
config_path = ROOT / "models" / "change-detection" / "configs" / "base.yaml"
try:
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
    # Make rules path absolute
    config['rules']['rules_config_path'] = str(ROOT / "models" / "change-detection" / "configs" / "rules.yaml")
    detector = HybridChangeDetector(config)
except Exception as e:
    import logging
    logging.getLogger(__name__).error(f"Failed to initialize HybridChangeDetector: {e}")
    detector = None

class DetectionRequest(BaseModel):
    old_snapshot: Dict[str, Any]
    new_snapshot: Dict[str, Any]

class DetectionResponse(BaseModel):
    result_id: str
    competitor_id: str
    old_snapshot_id: str
    new_snapshot_id: str
    change_detected: bool
    total_changes: int
    changes: List[Dict[str, Any]]
    processing_time_ms: float
    severity_summary: Dict[str, int]
    error: Optional[str] = None

@router.post("/changes/detect", response_model=DetectionResponse)
async def detect_changes(payload: DetectionRequest):
    """
    Detect changes between two competitor snapshots
    """
    if detector is None:
        raise HTTPException(status_code=500, detail="Change detector is not initialized")
    try:
        result = detector.detect(
            payload.old_snapshot,
            payload.new_snapshot
        )
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return DetectionResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
