import logging
from typing import Dict, Any, List, Optional
from ..pipeline.strategic_pipeline import StrategicAnalysisPipeline

logger = logging.getLogger("competilens.ai_engine.llm.strategic.service")


class StrategicAnalysisService:
    """
    Main service coordinator exposed to API routers.
    Manages pipeline configuration and executes strategic audits.
    """

    @staticmethod
    async def run_analysis(
        workspace_id: str,
        competitor_id: str,
        competitor_name: str,
        raw_signals: List[Dict[str, Any]],
        change_detection_results: Optional[List[Dict[str, Any]]] = None,
        sentiment_metrics: Optional[List[Dict[str, Any]]] = None,
        provider: str = "gemini",
        model: str = "gemini-1.5-flash",
        prompt_version: str = "1.0.0",
        request_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Execute strategic analysis and return serialized output with validation status.
        """
        pipeline = StrategicAnalysisPipeline(provider_name=provider, model_name=model)
        
        try:
            analysis_result, val_report = await pipeline.execute(
                workspace_id=workspace_id,
                competitor_id=competitor_id,
                competitor_name=competitor_name,
                raw_signals=raw_signals,
                change_detection_results=change_detection_results,
                sentiment_metrics=sentiment_metrics,
                prompt_version=prompt_version,
                request_id=request_id
            )
            
            return {
                "status": "success",
                "analysis": analysis_result.model_dump(),
                "validation": val_report
            }
            
        except Exception as e:
            logger.error(f"Strategic analysis service run failed: {str(e)}")
            return {
                "status": "failed",
                "error": str(e)
            }
