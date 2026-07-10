import logging
from typing import Dict, Any

logger = logging.getLogger("competilens.ai_engine.llm.observability.usage")


class UsageTracker:
    """
    Singleton-based utility to log global token counts, model calls, and cost estimations.
    """

    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(UsageTracker, cls).__new__(cls, *args, **kwargs)
            cls._instance._init_tracker()
        return cls._instance

    def _init_tracker(self):
        self.call_stats: Dict[str, Dict[str, Any]] = {}

    def log_call(self, provider: str, model: str, prompt_tokens: int, completion_tokens: int):
        """
        Record token usage for a specific provider and model.
        """
        key = f"{provider}:{model}"
        if key not in self.call_stats:
            self.call_stats[key] = {
                "calls": 0,
                "prompt_tokens": 0,
                "completion_tokens": 0,
                "estimated_cost_usd": 0.0
            }
            
        stats = self.call_stats[key]
        stats["calls"] += 1
        stats["prompt_tokens"] += prompt_tokens
        stats["completion_tokens"] += completion_tokens
        
        # Simple pricing estimation
        cost = 0.0
        if "gemini" in provider:
            cost = (prompt_tokens * 0.000000075) + (completion_tokens * 0.00000030)
        elif "openai" in provider:
            cost = (prompt_tokens * 0.000005) + (completion_tokens * 0.000015)
            
        stats["estimated_cost_usd"] = round(stats["estimated_cost_usd"] + cost, 6)
        
        logger.info(
            f"Usage Log -> Provider: {provider}, Model: {model}. "
            f"Prompt: {prompt_tokens} tokens, Completion: {completion_tokens} tokens. Est Cost: ${cost:.6f}"
        )

    def get_summary(self) -> Dict[str, Any]:
        """
        Get aggregated summary of LLM operations.
        """
        total_calls = 0
        total_cost = 0.0
        for stats in self.call_stats.values():
            total_calls += stats["calls"]
            total_cost += stats["estimated_cost_usd"]
            
        return {
            "total_calls": total_calls,
            "total_estimated_cost_usd": round(total_cost, 6),
            "breakdown": self.call_stats
        }
