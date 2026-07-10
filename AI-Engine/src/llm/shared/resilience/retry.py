import time
import asyncio
import logging
from functools import wraps
from typing import Callable, Any, Type, Tuple

logger = logging.getLogger("competilens.ai_engine.llm.resilience.retry")


def retry_with_backoff(
    retries: int = 3,
    backoff_in_seconds: float = 1.0,
    exceptions: Tuple[Type[BaseException], ...] = (Exception,),
) -> Callable:
    """
    Decorator that retries an async or sync function on specified exceptions using exponential backoff.
    """
    def decorator(func: Callable) -> Callable:
        if asyncio.iscoroutinefunction(func):
            @wraps(func)
            async def async_wrapper(*args: Any, **kwargs: Any) -> Any:
                attempt = 0
                delay = backoff_in_seconds
                while attempt < retries:
                    try:
                        return await func(*args, **kwargs)
                    except exceptions as e:
                        attempt += 1
                        if attempt >= retries:
                            logger.error(f"Function {func.__name__} failed after {retries} attempts: {str(e)}")
                            raise e
                        
                        logger.warning(
                            f"Attempt {attempt}/{retries} of {func.__name__} failed: {str(e)}. "
                            f"Retrying in {delay}s..."
                        )
                        await asyncio.sleep(delay)
                        delay *= 2
            return async_wrapper
        else:
            @wraps(func)
            def sync_wrapper(*args: Any, **kwargs: Any) -> Any:
                attempt = 0
                delay = backoff_in_seconds
                while attempt < retries:
                    try:
                        return func(*args, **kwargs)
                    except exceptions as e:
                        attempt += 1
                        if attempt >= retries:
                            logger.error(f"Function {func.__name__} failed after {retries} attempts: {str(e)}")
                            raise e
                        
                        logger.warning(
                            f"Attempt {attempt}/{retries} of {func.__name__} failed: {str(e)}. "
                            f"Retrying in {delay}s..."
                        )
                        time.sleep(delay)
                        delay *= 2
            return sync_wrapper
    return decorator
