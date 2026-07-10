from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from llm.strategic_analysis.src.schemas.strategic_schema import StrategicAnalysisResult
from llm.strategic_analysis.src.service.strategic_service import StrategicAnalysisService

router = APIRouter(prefix="/v1", tags=["strategic"])


class StrategicAnalysisRequest(BaseModel):
    workspace_id: str
    competitor_id: str
    competitor_name: str
    raw_signals: List[Dict[str, Any]]
    change_detection_results: Optional[List[Dict[str, Any]]] = None
    sentiment_metrics: Optional[List[Dict[str, Any]]] = None
    provider: str = "gemini"
    model: str = "gemini-1.5-flash"
    prompt_version: str = "1.0.0"


class StrategicAnalysisResponse(BaseModel):
    status: str
    analysis: Optional[StrategicAnalysisResult] = None
    validation: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


@router.post("/analyze-strategic", response_model=StrategicAnalysisResponse)
async def analyze_strategic(
    payload: StrategicAnalysisRequest
) -> StrategicAnalysisResponse:
    """
    Trigger a strategic SWOT, gap, and recommendation analysis for a competitor.
    The analysis is fully grounded and validated.
    """
    result = await StrategicAnalysisService.run_analysis(
        workspace_id=payload.workspace_id,
        competitor_id=payload.competitor_id,
        competitor_name=payload.competitor_name,
        raw_signals=payload.raw_signals,
        change_detection_results=payload.change_detection_results,
        sentiment_metrics=payload.sentiment_metrics,
        provider=payload.provider,
        model=payload.model,
        prompt_version=payload.prompt_version
    )
    
    if result.get("status") == "failed":
        raise HTTPException(status_code=500, detail=result.get("error"))
        
    return StrategicAnalysisResponse(
        status="success",
        analysis=result.get("analysis"),
        validation=result.get("validation")
    )
