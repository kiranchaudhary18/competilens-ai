import json
from datetime import datetime
from typing import Dict, Any, List, Optional
from llm.shared.schemas.evidence import EvidencePack
from llm.strategic_analysis.src.schemas.strategic_schema import StrategicAnalysisResult


class ExecutiveReportPromptBuilder:
    """
    Constructs and serializes parameters specifically for Executive Report prompts.
    """

    @staticmethod
    def build_variables(
        report_type: str,
        competitor_name: str,
        workspace_id: str,
        strategic_analysis: StrategicAnalysisResult,
        evidence_pack: EvidencePack,
        report_date: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Prepare variables for rendering the Executive Report prompts.
        """
        from llm.strategic_analysis.src.prompts.strategic_prompts import StrategicPromptBuilder
        
        return {
            "report_type": report_type,
            "competitor_name": competitor_name,
            "workspace_id": workspace_id,
            "report_date": report_date or datetime.utcnow().strftime("%Y-%m-%d"),
            "strategic_analysis_serialized": json.dumps(strategic_analysis.model_dump(), indent=2),
            "evidence_items_serialized": StrategicPromptBuilder.serialize_evidence_pack(evidence_pack)
        }
