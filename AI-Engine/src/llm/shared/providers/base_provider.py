from abc import ABC, abstractmethod
from typing import Any, Dict, Type
from pydantic import BaseModel


class BaseLLMProvider(ABC):
    """
    Abstract Base Class for LLM Providers.
    Defines the standard interface for generating structured outputs,
    checking health, and tracking usage.
    """

    @abstractmethod
    async def generate_structured(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Type[BaseModel],
        temperature: float = 0.1,
        max_tokens: int = 4096,
    ) -> BaseModel:
        """
        Generate structured output from the LLM based on a schema.
        
        Args:
            system_prompt: System context/instructions for the model
            user_prompt: User input prompt
            response_schema: A Pydantic model type to validate and structure the response
            temperature: Sampling temperature
            max_tokens: Maximum number of tokens to generate
            
        Returns:
            An instance of the response_schema BaseModel
        """
        pass

    @abstractmethod
    async def health_check(self) -> bool:
        """
        Check if the LLM provider is healthy and responsive.
        """
        pass

    @abstractmethod
    def get_usage(self) -> Dict[str, Any]:
        """
        Get current usage statistics (tokens, costs, latency) for this provider.
        """
        pass
