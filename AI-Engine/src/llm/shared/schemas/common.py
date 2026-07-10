from typing import Dict, Any, Optional
from pydantic import BaseModel, Field


class LLMConfig(BaseModel):
    """
    Configuration parameters for LLM generations.
    """
    provider: str = Field("gemini", description="LLM provider name (e.g. gemini, openai)")
    model_name: str = Field("gemini-1.5-flash", description="Model name to call")
    temperature: float = Field(0.1, description="Sampling temperature (lower = more deterministic)")
    max_tokens: int = Field(4096, description="Maximum tokens to generate")
    timeout_seconds: int = Field(30, description="Network timeout threshold")
    retry_count: int = Field(3, description="Number of retries on transient errors")


class ObservabilityRecord(BaseModel):
    """
    Unified record representing metadata logged for audits and tracking.
    """
    request_id: str
    analysis_id: Optional[str] = None
    provider: str
    model_name: str
    latency_ms: float
    prompt_tokens: int
    completion_tokens: int
    estimated_cost_usd: float
    validation_passed: bool
    retry_count: int
    evidence_count: int
    timestamp: str
