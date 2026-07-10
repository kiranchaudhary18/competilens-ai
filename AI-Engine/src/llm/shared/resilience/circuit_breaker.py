import time
import logging
from typing import Callable, Any, Type, Tuple

logger = logging.getLogger("competilens.ai_engine.llm.resilience.circuit_breaker")


class CircuitOpenError(Exception):
    """Exception raised when the circuit breaker is open and rejects requests."""
    pass


class CircuitBreaker:
    """
    A Circuit Breaker that wraps calls.
    Transitions between CLOSED, OPEN, and HALF-OPEN states.
    """

    def __init__(
        self,
        failure_threshold: int = 5,
        recovery_time_seconds: float = 60.0,
        exceptions_to_catch: Tuple[Type[BaseException], ...] = (Exception,),
    ):
        self.failure_threshold = failure_threshold
        self.recovery_time_seconds = recovery_time_seconds
        self.exceptions_to_catch = exceptions_to_catch
        
        self.state = "CLOSED"  # CLOSED, OPEN, HALF-OPEN
        self.failure_count = 0
        self.last_failure_time = 0.0

    def call(self, func: Callable, *args: Any, **kwargs: Any) -> Any:
        """
        Executes sync functions through the circuit breaker.
        """
        self._check_state()
        
        try:
            result = func(*args, **kwargs)
            self._handle_success()
            return result
        except self.exceptions_to_catch as e:
            self._handle_failure(e)
            raise e

    async def call_async(self, func: Callable, *args: Any, **kwargs: Any) -> Any:
        """
        Executes async functions through the circuit breaker.
        """
        self._check_state()
        
        try:
            result = await func(*args, **kwargs)
            self._handle_success()
            return result
        except self.exceptions_to_catch as e:
            self._handle_failure(e)
            raise e

    def _check_state(self):
        current_time = time.time()
        
        if self.state == "OPEN":
            # Check if recovery window has passed
            if current_time - self.last_failure_time > self.recovery_time_seconds:
                logger.info("Circuit Breaker transitioning from OPEN to HALF-OPEN.")
                self.state = "HALF-OPEN"
            else:
                raise CircuitOpenError("Circuit Breaker is OPEN. Request rejected.")

    def _handle_success(self):
        self.failure_count = 0
        if self.state == "HALF-OPEN":
            logger.info("Circuit Breaker transitioning from HALF-OPEN to CLOSED.")
            self.state = "CLOSED"

    def _handle_failure(self, exception: BaseException):
        self.failure_count += 1
        self.last_failure_time = time.time()
        logger.warning(
            f"Circuit Breaker failure detected ({self.failure_count}/{self.failure_threshold}): {str(exception)}"
        )
        
        if self.state in ["CLOSED", "HALF-OPEN"] and self.failure_count >= self.failure_threshold:
            logger.error(
                f"Circuit Breaker failure threshold reached. Tripping circuit to OPEN for {self.recovery_time_seconds}s."
            )
            self.state = "OPEN"
