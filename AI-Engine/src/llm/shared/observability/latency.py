import time
import logging
import asyncio
from functools import wraps
from typing import Callable, Any

logger = logging.getLogger("competilens.ai_engine.llm.observability.latency")


class LatencyTracker:
    """
    Context manager to record function/block execution duration in milliseconds.
    """

    def __init__(self, operation_name: str):
        self.operation_name = operation_name
        self.start_time = 0.0
        self.duration_ms = 0.0

    def __enter__(self):
        self.start_time = time.time()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        end_time = time.time()
        self.duration_ms = (end_time - self.start_time) * 1000
        logger.info(f"Latency -> Operation '{self.operation_name}' completed in {self.duration_ms:.2f} ms")


def track_latency(operation_name: str) -> Callable:
    """
    Decorator to wrap async or sync functions for automatic duration logging.
    """
    def decorator(func: Callable) -> Callable:
        if asyncio.iscoroutinefunction(func):
            @wraps(func)
            async def async_wrapper(*args: Any, **kwargs: Any) -> Any:
                start = time.time()
                try:
                    return await func(*args, **kwargs)
                finally:
                    duration = (time.time() - start) * 1000
                    logger.info(f"Latency -> async {func.__name__} ({operation_name}) took {duration:.2f} ms")
            return async_wrapper
        else:
            @wraps(func)
            def sync_wrapper(*args: Any, **kwargs: Any) -> Any:
                start = time.time()
                try:
                    return func(*args, **kwargs)
                finally:
                    duration = (time.time() - start) * 1000
                    logger.info(f"Latency -> sync {func.__name__} ({operation_name}) took {duration:.2f} ms")
            return sync_wrapper
    return decorator
