import asyncio
import logging
from functools import wraps
from typing import Callable, Any

logger = logging.getLogger("competilens.ai_engine.llm.resilience.timeout")


class ExecutionTimeoutError(asyncio.TimeoutError):
    """Exception raised when an operation takes longer than the allowed timeout limit."""
    pass


def timeout_limit(seconds: float) -> Callable:
    """
    Decorator to enforce a execution timeout limit on an asynchronous function.
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            try:
                return await asyncio.wait_for(func(*args, **kwargs), timeout=seconds)
            except asyncio.TimeoutError:
                logger.error(f"Function {func.__name__} timed out after {seconds} seconds.")
                raise ExecutionTimeoutError(f"Function {func.__name__} execution timed out after {seconds} seconds.")
        return wrapper
    return decorator
