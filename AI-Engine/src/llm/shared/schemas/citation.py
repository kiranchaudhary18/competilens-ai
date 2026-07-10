from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class ClaimType(str, Enum):
    FACT = "FACT"
    INFERENCE = "INFERENCE"
    RECOMMENDATION = "RECOMMENDATION"


class GroundedClaim(BaseModel):
    """
    A specific claim made by the LLM (e.g. SWOT item, market gap, recommendation).
    Requires a type classification, confidence estimation, and explicit evidence citations.
    """

    statement: str = Field(..., description="The core assertion, SWOT item, or observation")
    claim_type: ClaimType = Field(..., description="Type of the claim: FACT, INFERENCE, or RECOMMENDATION")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Estimated confidence level of the claim (0 to 1)")
    evidence_ids: List[str] = Field(
        ...,
        description="List of evidence_id strings that directly support this claim. MUST NOT be empty for FACT/INFERENCE.",
    )
    rationale: Optional[str] = Field(
        None, description="Explanation linking the evidence_ids to the generated claim"
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "statement": "Pricing increased for the Pro Plan from $29 to $39/month",
                "claim_type": "FACT",
                "confidence": 0.98,
                "evidence_ids": ["chg_789"],
                "rationale": "Directly observed in change detection delta on pricing page snapshot."
            }
        }
    )
