import uuid
import time
import logging
from typing import Dict, Any, List, Optional, Tuple

from llm.shared.providers.provider_factory import LLMProviderFactory
from llm.shared.prompts.registry import PromptRegistry
from llm.shared.resilience.retry import retry_with_backoff
from llm.shared.resilience.timeout import timeout_limit
from llm.shared.resilience.circuit_breaker import CircuitBreaker, CircuitOpenError
from llm.shared.observability.usage import UsageTracker
from llm.shared.observability.latency import LatencyTracker
from llm.shared.observability.audit import AuditLog
from llm.shared.schemas.evidence import EvidencePack
from llm.strategic_analysis.src.schemas.strategic_schema import StrategicAnalysisResult

from ..schemas.report_schema import ExecutiveReportResult
from ..prompts.report_prompts import ExecutiveReportPromptBuilder
from ..validation.report_validator import ExecutiveReportValidator

logger = logging.getLogger("competilens.ai_engine.llm.report.pipeline")

# Circuit breaker specifically for Executive Reporting LLM calls
report_circuit_breaker = CircuitBreaker(failure_threshold=5, recovery_time_seconds=60)


class ExecutiveReportPipeline:
    """
    Coordinates building structured, verified Executive Reports.
    """

    def __init__(self, provider_name: str = "gemini", model_name: str = "gemini-1.5-flash"):
        self.provider_name = provider_name
        self.model_name = model_name
        self.provider = LLMProviderFactory.get_provider(provider_name, model_name)
        self.validator = ExecutiveReportValidator()
        self.usage_tracker = UsageTracker()

    async def execute(
        self,
        workspace_id: str,
        competitor_name: str,
        strategic_analysis: StrategicAnalysisResult,
        evidence_pack: EvidencePack,
        report_type: str = "WEEKLY_BRIEF",
        prompt_version: str = "1.0.0",
        request_id: Optional[str] = None
    ) -> Tuple[ExecutiveReportResult, Dict[str, Any]]:
        """
        Executes report generation workflow.
        """
        request_id = request_id or f"req_{uuid.uuid4().hex[:12]}"
        report_id = f"rep_{uuid.uuid4().hex[:12]}"
        competitor_id = strategic_analysis.competitor_id
        start_time = time.time()

        # Step 1: Render prompts
        variables = ExecutiveReportPromptBuilder.build_variables(
            report_type=report_type,
            competitor_name=competitor_name,
            workspace_id=workspace_id,
            strategic_analysis=strategic_analysis,
            evidence_pack=evidence_pack
        )
        
        system_prompt, user_prompt = PromptRegistry.render(
            module="executive_report",
            version=prompt_version,
            **variables
        )

        # Step 2: Resilient LLM invocation
        logger.info(f"[{request_id}] Dispatching executive report request to LLM ({self.provider_name})...")

        @retry_with_backoff(retries=3, backoff_in_seconds=1.0)
        @timeout_limit(seconds=30)
        async def call_llm():
            return await report_circuit_breaker.call_async(
                self.provider.generate_structured,
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                response_schema=ExecutiveReportResult
            )

        try:
            with LatencyTracker("Executive_Report_LLM_Call"):
                report_result: ExecutiveReportResult = await call_llm()
            
            # Map ids
            report_result.report_id = report_id
            report_result.workspace_id = workspace_id
            report_result.competitor_id = competitor_id

        except CircuitOpenError as e:
            logger.error(f"[{request_id}] Report LLM rejected due to OPEN Circuit Breaker.")
            AuditLog.log_event("REPORT_PIPELINE", request_id, workspace_id, competitor_id, {}, error=str(e))
            raise e
        except Exception as e:
            logger.error(f"[{request_id}] Report pipeline LLM run failure: {str(e)}")
            AuditLog.log_event("REPORT_PIPELINE", request_id, workspace_id, competitor_id, {}, error=str(e))
            raise e

        # Step 3: Validation checks
        logger.info(f"[{request_id}] Validating report structure and grounding...")
        val_passed, val_report = self.validator.validate_report(report_result, evidence_pack)

        # Step 4: Observability logs
        latency_ms = (time.time() - start_time) * 1000
        provider_usage = self.provider.get_usage()
        
        self.usage_tracker.log_call(
            provider=self.provider_name,
            model=self.model_name,
            prompt_tokens=int(provider_usage.get("prompt_tokens", 0) / max(1, provider_usage.get("total_calls", 1))),
            completion_tokens=int(provider_usage.get("completion_tokens", 0) / max(1, provider_usage.get("total_calls", 1)))
        )

        metadata = {
            "report_type": report_type,
            "prompt_version": prompt_version,
            "latency_ms": latency_ms,
            "validation_report": val_report,
            "usage": provider_usage
        }

        AuditLog.log_event(
            event_name="REPORT_PIPELINE",
            request_id=request_id,
            workspace_id=workspace_id,
            competitor_id=competitor_id or "",
            metadata=metadata,
            error=None if val_passed else f"Validation warnings: {val_report.get('warnings')}"
        )

        return report_result, val_report
