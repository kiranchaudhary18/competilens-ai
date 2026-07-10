import logging
from typing import Dict, Any, List, Optional
from llm.shared.schemas.evidence import EvidencePack
from llm.strategic_analysis.src.schemas.strategic_schema import StrategicAnalysisResult
from ..pipeline.report_pipeline import ExecutiveReportPipeline

logger = logging.getLogger("competilens.ai_engine.llm.report.service")


class ExecutiveReportService:
    """
    Service layer providing entry point for triggering executive briefs and reports.
    """

    @staticmethod
    async def run_report(
        workspace_id: str,
        competitor_name: str,
        strategic_analysis: StrategicAnalysisResult,
        evidence_pack: EvidencePack,
        report_type: str = "WEEKLY_BRIEF",
        provider: str = "gemini",
        model: str = "gemini-1.5-flash",
        prompt_version: str = "1.0.0",
        request_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Execute report generation and return serialized output with validation status.
        """
        pipeline = ExecutiveReportPipeline(provider_name=provider, model_name=model)
        
        try:
            report_result, val_report = await pipeline.execute(
                workspace_id=workspace_id,
                competitor_name=competitor_name,
                strategic_analysis=strategic_analysis,
                evidence_pack=evidence_pack,
                report_type=report_type,
                prompt_version=prompt_version,
                request_id=request_id
            )
            
            return {
                "status": "success",
                "report": report_result.model_dump(),
                "validation": val_report
            }
            
        except Exception as e:
            logger.error(f"Executive report service run failed: {str(e)}")
            return {
                "status": "failed",
                "error": str(e)
            }
