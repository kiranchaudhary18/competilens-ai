import uuid
import time
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple

from llm.shared.providers.provider_factory import LLMProviderFactory
from llm.shared.prompts.registry import PromptRegistry
from llm.shared.validation.evidence_validator import EvidenceValidator
from llm.shared.resilience.retry import retry_with_backoff
from llm.shared.resilience.timeout import timeout_limit
from llm.shared.resilience.circuit_breaker import CircuitBreaker, CircuitOpenError
from llm.shared.observability.usage import UsageTracker
from llm.shared.observability.latency import LatencyTracker
from llm.shared.observability.audit import AuditLog

from ..schemas.strategic_schema import StrategicAnalysisResult
from ..evidence.aggregation import EvidenceAggregator
from ..prompts.strategic_prompts import StrategicPromptBuilder
from ..validation.strategic_validator import StrategicValidator

logger = logging.getLogger("competilens.ai_engine.llm.strategic.pipeline")

# Initialize a circuit breaker specifically for the Strategic LLM pipeline
strategic_circuit_breaker = CircuitBreaker(failure_threshold=5, recovery_time_seconds=60)


class StrategicAnalysisPipeline:
    """
    Orchestration pipeline that transforms evidence inputs into validated,
    grounded strategic analysis reports.
    """

    def __init__(self, provider_name: str = "gemini", model_name: str = "gemini-1.5-flash"):
        self.provider_name = provider_name
        self.model_name = model_name
        self.provider = LLMProviderFactory.get_provider(provider_name, model_name)
        self.validator = StrategicValidator()
        self.usage_tracker = UsageTracker()

    async def execute(
        self,
        workspace_id: str,
        competitor_id: str,
        competitor_name: str,
        raw_signals: List[Dict[str, Any]],
        change_detection_results: Optional[List[Dict[str, Any]]] = None,
        sentiment_metrics: Optional[List[Dict[str, Any]]] = None,
        prompt_version: str = "1.0.0",
        request_id: Optional[str] = None
    ) -> Tuple[StrategicAnalysisResult, Dict[str, Any]]:
        """
        Runs the full Strategic Analysis pipeline.
        """
        request_id = request_id or f"req_{uuid.uuid4().hex[:12]}"
        analysis_id = f"an_{uuid.uuid4().hex[:12]}"
        start_time = time.time()

        # Step 1: Aggregation
        logger.info(f"[{request_id}] Compiling evidence pack for competitor {competitor_name}...")
        evidence_pack = EvidenceAggregator.build_evidence_pack(
            workspace_id=workspace_id,
            competitor_id=competitor_id,
            competitor_name=competitor_name,
            raw_signals=raw_signals,
            change_detection_results=change_detection_results,
            sentiment_metrics=sentiment_metrics
        )

        # Step 2: Evidence Pre-Validation
        ev_ok, ev_errors = EvidenceValidator.validate_pack(evidence_pack)
        if not ev_ok:
            err_msg = f"Evidence pre-validation failed: {ev_errors}"
            AuditLog.log_event("STRATEGIC_PIPELINE", request_id, workspace_id, competitor_id, {}, error=err_msg)
            raise ValueError(err_msg)

        # Step 3: Render templates
        variables = StrategicPromptBuilder.build_variables(evidence_pack)
        system_prompt, user_prompt = PromptRegistry.render(
            module="strategic_analysis",
            version=prompt_version,
            **variables
        )

        # Step 4: Run LLM invocation with resilience wrapping
        logger.info(f"[{request_id}] Dispatching prompt to LLM ({self.provider_name}/{self.model_name})...")
        
        @retry_with_backoff(retries=3, backoff_in_seconds=1.0)
        @timeout_limit(seconds=30)
        async def call_llm():
            # Invoke LLM using the circuit breaker to prevent cascading faults
            return await strategic_circuit_breaker.call_async(
                self.provider.generate_structured,
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                response_schema=StrategicAnalysisResult
            )

        try:
            with LatencyTracker("Strategic_LLM_Call") as tracker:
                # LLM execution
                analysis_result: StrategicAnalysisResult = await call_llm()
            
            # Inject ids for correlation
            analysis_result.analysis_id = analysis_id
            analysis_result.workspace_id = workspace_id
            analysis_result.competitor_id = competitor_id

        except CircuitOpenError as e:
            logger.error(f"[{request_id}] Strategic LLM rejected due to OPEN Circuit Breaker.")
            AuditLog.log_event("STRATEGIC_PIPELINE", request_id, workspace_id, competitor_id, {}, error=str(e))
            raise e
        except Exception as e:
            logger.error(f"[{request_id}] Pipeline LLM generation failure: {str(e)}")
            AuditLog.log_event("STRATEGIC_PIPELINE", request_id, workspace_id, competitor_id, {}, error=str(e))
            raise e

        # Step 5: Post-generation Grounding and Quality Audits
        logger.info(f"[{request_id}] Auditing grounding validation and confidence limits...")
        val_passed, val_report = self.validator.validate_analysis(analysis_result, evidence_pack)
        
        # Step 6: Log usage and audit data
        latency_ms = (time.time() - start_time) * 1000
        provider_usage = self.provider.get_usage()
        
        # Log to global singleton tracker
        self.usage_tracker.log_call(
            provider=self.provider_name,
            model=self.model_name,
            prompt_tokens=int(provider_usage.get("prompt_tokens", 0) / max(1, provider_usage.get("total_calls", 1))),
            completion_tokens=int(provider_usage.get("completion_tokens", 0) / max(1, provider_usage.get("total_calls", 1)))
        )

        metadata = {
            "prompt_version": prompt_version,
            "latency_ms": latency_ms,
            "validation_report": val_report,
            "evidence_count": len(evidence_pack.items),
            "usage": provider_usage
        }
        
        AuditLog.log_event(
            event_name="STRATEGIC_PIPELINE",
            request_id=request_id,
            workspace_id=workspace_id,
            competitor_id=competitor_id,
            metadata=metadata,
            error=None if val_passed else f"Validation warnings: {val_report.get('warnings')}"
        )

        return analysis_result, val_report
