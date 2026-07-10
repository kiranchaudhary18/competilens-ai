import os
import json
import time
import logging
from typing import Any, Dict, Type, Optional
from pydantic import BaseModel

from .base_provider import BaseLLMProvider

logger = logging.getLogger("competilens.ai_engine.llm.providers.gemini")

class GeminiProvider(BaseLLMProvider):
    """
    Gemini LLM Provider implementing BaseLLMProvider.
    Uses Google Generative AI (Gemini models) to generate structured outputs.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        model_name: str = "gemini-1.5-flash",
        use_mock: bool = False
    ):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.model_name = model_name
        self.use_mock = use_mock or not self.api_key
        
        # Usage tracking
        self.prompt_tokens = 0
        self.completion_tokens = 0
        self.total_calls = 0
        self.total_errors = 0
        self.latencies = []

        if self.use_mock:
            logger.warning("GeminiProvider initialized in MOCK mode. API calls will be simulated.")
        else:
            logger.info(f"GeminiProvider initialized with model: {self.model_name}")

    async def generate_structured(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Type[BaseModel],
        temperature: float = 0.1,
        max_tokens: int = 4096,
    ) -> BaseModel:
        self.total_calls += 1
        start_time = time.time()

        if self.use_mock:
            latency = 0.15
            time.sleep(latency)  # Simulating network latency
            self.latencies.append(latency)
            logger.info("Generating mock structured response matching schema...")
            # We generate a mock instance of response_schema
            mock_data = self._generate_mock_data(response_schema)
            return response_schema.model_validate(mock_data)

        # Standard REST API call to Gemini (to avoid library dependency issues)
        import urllib.request
        import urllib.error
        
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={self.api_key}"
        
        # Build JSON Schema description from Pydantic
        schema_dict = response_schema.model_json_schema()
        
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": f"System Context:\n{system_prompt}\n\nUser Input:\n{user_prompt}"}]
                }
            ],
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens,
                "responseMimeType": "application/json",
                "responseSchema": self._convert_pydantic_schema_to_gemini_schema(schema_dict)
            }
        }
        
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                resp_data = json.loads(response.read().decode("utf-8"))
                
            latency = time.time() - start_time
            self.latencies.append(latency)
            
            # Extract output text
            candidates = resp_data.get("candidates", [])
            if not candidates:
                raise ValueError("No generation candidates returned from Gemini.")
            
            text_response = candidates[0]["content"]["parts"][0]["text"]
            
            # Parse tokens if provided
            usage = resp_data.get("usageMetadata", {})
            self.prompt_tokens += usage.get("promptTokenCount", 0)
            self.completion_tokens += usage.get("candidatesTokenCount", 0)
            
            # Validate output text against the schema
            parsed_json = json.loads(text_response)
            return response_schema.model_validate(parsed_json)

        except Exception as e:
            self.total_errors += 1
            logger.error(f"Gemini API generation failed: {str(e)}")
            # If the API fails but we want resilience, or if it was validation error, raise it
            raise e

    async def health_check(self) -> bool:
        if self.use_mock:
            return True
        if not self.api_key:
            return False
        
        import urllib.request
        url = f"https://generativelanguage.googleapis.com/v1beta/models?key={self.api_key}"
        try:
            with urllib.request.urlopen(url, timeout=5) as response:
                return response.status == 200
        except Exception:
            return False

    def get_usage(self) -> Dict[str, Any]:
        avg_latency = sum(self.latencies) / len(self.latencies) if self.latencies else 0.0
        # Estimate costs (Gemini 1.5 Flash: $0.075 / 1M input tokens, $0.30 / 1M output tokens)
        estimated_cost = (self.prompt_tokens * 0.000000075) + (self.completion_tokens * 0.00000030)
        return {
            "provider": "gemini",
            "model_name": self.model_name,
            "total_calls": self.total_calls,
            "total_errors": self.total_errors,
            "prompt_tokens": self.prompt_tokens,
            "completion_tokens": self.completion_tokens,
            "estimated_cost_usd": round(estimated_cost, 6),
            "average_latency_seconds": round(avg_latency, 3),
            "mock_mode": self.use_mock
        }

    def _convert_pydantic_schema_to_gemini_schema(self, schema: Dict[str, Any]) -> Dict[str, Any]:
        """
        Convert standard JSON schema (Pydantic format) to Gemini OpenAPI-compatible schema.
        """
        gemini_schema = {}
        
        # Type conversion
        type_val = schema.get("type")
        if type_val:
            gemini_schema["type"] = type_val.upper()
            
        if "description" in schema:
            gemini_schema["description"] = schema["description"]
            
        if "enum" in schema:
            gemini_schema["enum"] = schema["enum"]

        # Handle object properties
        if type_val == "object":
            properties = schema.get("properties", {})
            gemini_properties = {}
            for prop_name, prop_val in properties.items():
                gemini_properties[prop_name] = self._convert_pydantic_schema_to_gemini_schema(prop_val)
            gemini_schema["properties"] = gemini_properties
            if "required" in schema:
                gemini_schema["required"] = schema["required"]

        # Handle array items
        elif type_val == "array":
            items = schema.get("items", {})
            gemini_schema["items"] = self._convert_pydantic_schema_to_gemini_schema(items)

        # Handle definitions/references (simplified, as Gemini schemas should be self-contained)
        elif "$ref" in schema:
            # Pydantic schemas might have $defs. For API stability, we keep schemas simple or resolve them.
            pass

        return gemini_schema

    def _generate_mock_data(self, schema_type: Type[BaseModel]) -> Dict[str, Any]:
        """
        Generates dummy dictionary corresponding to the schema type for mock mode.
        """
        schema_dict = schema_type.model_json_schema()
        return self._generate_mock_from_schema(schema_dict, schema_dict.get("$defs"))

    def _generate_mock_from_schema(self, schema: Dict[str, Any], defs: Optional[Dict[str, Any]] = None) -> Any:
        if defs is None and isinstance(schema, dict):
            defs = schema.get("$defs", schema.get("definitions", {}))

        if not isinstance(schema, dict):
            return None

        if "$ref" in schema:
            ref_path = schema["$ref"]
            ref_name = ref_path.split("/")[-1]
            if defs and ref_name in defs:
                return self._generate_mock_from_schema(defs[ref_name], defs)
            return None

        # Pydantic v2 might wrap things in anyOf/allOf
        if "anyOf" in schema:
            # Try the first non-null type
            for option in schema["anyOf"]:
                if isinstance(option, dict) and option.get("type") != "null":
                    return self._generate_mock_from_schema(option, defs)
            return None

        type_val = schema.get("type")
        if type_val == "object":
            obj = {}
            properties = schema.get("properties", {})
            for prop_name, prop_val in properties.items():
                obj[prop_name] = self._generate_mock_from_schema(prop_val, defs)
            return obj
        elif type_val == "array":
            items = schema.get("items", {})
            return [self._generate_mock_from_schema(items, defs)]
        elif type_val == "string":
            if "enum" in schema:
                return schema["enum"][0]
            return "mock_string"
        elif type_val == "number" or type_val == "float":
            return 0.85
        elif type_val == "integer":
            return 123
        elif type_val == "boolean":
            return True
        return None
