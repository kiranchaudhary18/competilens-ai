import os
from typing import Dict, Any, Optional

from .base_provider import BaseLLMProvider
from .gemini_provider import GeminiProvider


class LLMProviderFactory:
    """
    Factory to retrieve configured LLM providers.
    Supports easy switching of providers (Gemini, OpenAI, Mock, etc.).
    """

    _cached_providers: Dict[str, BaseLLMProvider] = {}

    @classmethod
    def get_provider(
        self,
        provider_name: Optional[str] = None,
        model_name: Optional[str] = None,
        api_key: Optional[str] = None,
        use_mock: Optional[bool] = None,
        force_recreate: bool = False,
    ) -> BaseLLMProvider:
        """
        Get or create a cached instance of an LLM provider.
        """
        provider_name = (provider_name or os.getenv("LLM_PROVIDER", "gemini")).lower()
        model_name = model_name or os.getenv("LLM_MODEL_NAME")
        
        # Determine fallback default model names
        if not model_name:
            if provider_name == "gemini":
                model_name = "gemini-1.5-flash"
            else:
                model_name = "default"

        cache_key = f"{provider_name}:{model_name}"

        if cache_key in self._cached_providers and not force_recreate:
            return self._cached_providers[cache_key]

        # Determine mock status
        if use_mock is None:
            # Auto-detect mock if key is missing
            has_key = api_key is not None or (
                os.getenv("GEMINI_API_KEY") if provider_name == "gemini" else False
            )
            use_mock = not has_key

        if provider_name == "gemini":
            provider = GeminiProvider(
                api_key=api_key,
                model_name=model_name,
                use_mock=use_mock
            )
        else:
            raise ValueError(f"Unsupported LLM provider requested: {provider_name}")

        self._cached_providers[cache_key] = provider
        return provider
