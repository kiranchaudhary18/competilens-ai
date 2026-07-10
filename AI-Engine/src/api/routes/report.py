from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from llm.shared.schemas.evidence import EvidencePack
from llm.strategic_analysis.src.schemas.strategic_schema import StrategicAnalysisResult
from llm.executive_report.src.schemas.report_schema import ExecutiveReportResult
from llm.executive_report.src.service.report_service import ExecutiveReportService

router = APIRouter(prefix="/v1", tags=["report"])


class ExecutiveReportRequest(BaseModel):
    workspace_id: str
    competitor_name: str
    strategic_analysis: StrategicAnalysisResult
    evidence_pack: EvidencePack
    report_type: str = "WEEKLY_BRIEF"
    provider: str = "gemini"
    model: str = "gemini-1.5-flash"
    prompt_version: str = "1.0.0"


class ExecutiveReportResponse(BaseModel):
    status: str
    report: Optional[ExecutiveReportResult] = None
    validation: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


@router.post("/generate-report", response_model=ExecutiveReportResponse)
async def generate_report(
    payload: ExecutiveReportRequest
) -> ExecutiveReportResponse:
    """
    Generate a formatted, grounded executive report or briefing.
    """
    result = await ExecutiveReportService.run_report(
        workspace_id=payload.workspace_id,
        competitor_name=payload.competitor_name,
        strategic_analysis=payload.strategic_analysis,
        evidence_pack=payload.evidence_pack,
        report_type=payload.report_type,
        provider=payload.provider,
        model=payload.model,
        prompt_version=payload.prompt_version
    )
    
    if result.get("status") == "failed":
        raise HTTPException(status_code=500, detail=result.get("error"))
        
    return ExecutiveReportResponse(
        status="success",
        report=result.get("report"),
        validation=result.get("validation")
    )
