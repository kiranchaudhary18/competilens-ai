from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict
from llm.shared.schemas.citation import GroundedClaim


class ReportType(str, Enum):
    WEEKLY_BRIEF = "WEEKLY_BRIEF"
    MONTHLY_REPORT = "MONTHLY_REPORT"
    COMPETITOR_PROFILE = "COMPETITOR_PROFILE"
    CHANGE_ALERT = "CHANGE_ALERT"
    EXECUTIVE_SUMMARY = "EXECUTIVE_SUMMARY"
    STRATEGIC_BRIEF = "STRATEGIC_BRIEF"


class ExecutiveReportResult(BaseModel):
    """
    The final output schema returned by the Executive Report Intelligence Module.
    Designed for C-level readability, fully grounded.
    """
    report_id: str = Field(..., description="Unique generated report ID")
    workspace_id: str = Field(..., description="Scope workspace ID")
    competitor_id: Optional[str] = Field(None, description="Scope competitor ID (if competitor-specific)")
    report_type: ReportType = Field(..., description="Target layout/period style of this report")
    
    title: str = Field(..., description="Title of the report brief")
    executive_summary: str = Field(..., description="High-level paragraph summarizing key takeaways and recommendations")
    
    # Grounded detailed sections
    key_developments: List[GroundedClaim] = Field(
        default_factory=list, description="Primary competitive events and changes observed during the period"
    )
    strategic_risks: List[GroundedClaim] = Field(
        default_factory=list, description="Critical competitive threats, price cuts, or offensive moves identified"
    )
    opportunities: List[GroundedClaim] = Field(
        default_factory=list, description="Avenues our product can leverage to exploit competitor weaknesses"
    )
    recommended_actions: List[GroundedClaim] = Field(
        default_factory=list, description="Prescriptive recommended actions for our business strategy"
    )
    
    outlook: str = Field(..., description="Forward-looking projection of competitor direction (1-3 months)")
    evidence_references: List[str] = Field(
        default_factory=list, description="List of all referenced evidence IDs across all sections of this report"
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "report_id": "rep_123",
                "workspace_id": "ws_1",
                "competitor_id": "comp_1",
                "report_type": "WEEKLY_BRIEF",
                "title": "Weekly Competitive Brief - Competitor X pricing changes",
                "executive_summary": "Competitor X raised pricing by 34% on their core Pro plan and launched SSO. Customers are showing pricing concern.",
                "key_developments": [],
                "strategic_risks": [],
                "opportunities": [],
                "recommended_actions": [],
                "outlook": "Expect competitor X to shift focus to high-value enterprise users over the next quarter.",
                "evidence_references": ["sig_12", "chg_44"]
            }
        }
    )
