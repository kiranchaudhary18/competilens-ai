from typing import List
from pydantic import BaseModel, Field, ConfigDict
from llm.shared.schemas.citation import GroundedClaim


class SwotAnalysis(BaseModel):
    """
    SWOT Categorization of Grounded Claims.
    """
    strengths: List[GroundedClaim] = Field(
        default_factory=list, description="Direct internal strategic advantages of the competitor"
    )
    weaknesses: List[GroundedClaim] = Field(
        default_factory=list, description="Direct internal vulnerabilities or deficiencies of the competitor"
    )
    opportunities: List[GroundedClaim] = Field(
        default_factory=list, description="External avenues of growth or expansion the competitor can exploit"
    )
    threats: List[GroundedClaim] = Field(
        default_factory=list, description="External risks or market shifts posing danger to the competitor"
    )


class StrategicAnalysisResult(BaseModel):
    """
    The final output schema returned by the Strategic Analysis Intelligence Module.
    Successfully parsed, validated, and grounded against an Evidence Pack.
    """
    analysis_id: str = Field(..., description="Unique generated analysis run ID")
    workspace_id: str = Field(..., description="Scope workspace ID")
    competitor_id: str = Field(..., description="Scope competitor ID")
    
    # Core Analysis Sections
    swot: SwotAnalysis = Field(..., description="SWOT analysis containing grounded claims")
    market_gaps: List[GroundedClaim] = Field(
        default_factory=list, description="Identified voids in competitor product offerings or capabilities"
    )
    recommended_actions: List[GroundedClaim] = Field(
        default_factory=list,
        description="Prescriptive strategic suggestions for the user's company (type must be RECOMMENDATION)",
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "analysis_id": "an_999",
                "workspace_id": "ws_123",
                "competitor_id": "comp_456",
                "swot": {
                    "strengths": [
                        {
                            "statement": "Strong enterprise integration ecosystem",
                            "claim_type": "FACT",
                            "confidence": 0.88,
                            "evidence_ids": ["sig_12", "chg_44"],
                            "rationale": "Observed multiple integration launches and partnerships."
                        }
                    ],
                    "weaknesses": [
                        {
                            "statement": "Increasing pricing dissatisfaction",
                            "claim_type": "INFERENCE",
                            "confidence": 0.91,
                            "evidence_ids": ["sent_31", "chg_52"],
                            "rationale": "High volume of negative social sentiment following recent price adjustments."
                        }
                    ],
                    "opportunities": [],
                    "threats": []
                },
                "market_gaps": [],
                "recommended_actions": []
            }
        }
    )
