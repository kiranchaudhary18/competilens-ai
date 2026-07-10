import logging
from typing import Dict, Any, Tuple
from pydantic import BaseModel, ValidationError

logger = logging.getLogger("competilens.ai_engine.llm.validation.output")


class OutputValidator:
    """
    Validates output schemas, formatting, and boundary conditions (like confidence thresholds).
    """

    @staticmethod
    def validate_schema(data: Any, schema_class: type) -> Tuple[bool, Any]:
        """
        Validate dynamic output JSON/dictionary against a target Pydantic schema class.
        
        Returns:
            Tuple of (is_valid, parsed_pydantic_object_or_validation_errors)
        """
        try:
            if isinstance(data, dict):
                validated_obj = schema_class.model_validate(data)
                return True, validated_obj
            elif isinstance(data, BaseModel):
                # Already verified
                return True, data
            else:
                return False, "Output is not a dictionary or Pydantic model."
        except ValidationError as e:
            logger.error(f"Schema validation failed: {str(e)}")
            return False, e.errors()

    @staticmethod
    def check_confidence_thresholds(
        data_dict: Dict[str, Any],
        min_confidence: float = 0.5
    ) -> Tuple[bool, list]:
        """
        Scans generated items for confidence fields and ensures they meet minimum quality thresholds.
        Useful for pruning highly speculative claims from strategic reports.
        """
        low_confidence_items = []
        
        def recurse_search(node: Any, path: str = ""):
            if isinstance(node, dict):
                # Check for statement/claim with confidence
                if "confidence" in node and ("statement" in node or "claim" in node):
                    conf = node.get("confidence", 1.0)
                    stmt = node.get("statement") or node.get("claim", "")
                    if isinstance(conf, (int, float)) and conf < min_confidence:
                        low_confidence_items.append({
                            "path": path,
                            "statement": stmt,
                            "confidence": conf
                        })
                for k, v in node.items():
                    recurse_search(v, f"{path}.{k}" if path else k)
            elif isinstance(node, list):
                for idx, item in enumerate(node):
                    recurse_search(item, f"{path}[{idx}]")

        recurse_search(data_dict)
        passed = len(low_confidence_items) == 0
        return passed, low_confidence_items
