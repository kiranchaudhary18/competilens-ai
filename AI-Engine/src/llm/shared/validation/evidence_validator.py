import logging
from typing import List, Tuple
from ..schemas.evidence import EvidencePack, EvidenceItem

logger = logging.getLogger("competilens.ai_engine.llm.validation.evidence")


class EvidenceValidator:
    """
    Validates evidence packs before they are dispatched to prompt construction.
    Prevents corrupt, malformed, or blank records from polluting prompt contexts.
    """

    @staticmethod
    def validate_pack(pack: EvidencePack) -> Tuple[bool, List[str]]:
        """
        Validate an evidence pack's metadata and items.
        Returns:
            Tuple of (is_valid, list of warning/error messages)
        """
        errors = []

        if not pack.pack_id:
            errors.append("Evidence pack is missing 'pack_id'.")
        if not pack.workspace_id:
            errors.append("Evidence pack is missing 'workspace_id'.")
        if not pack.competitor_id:
            errors.append("Evidence pack is missing 'competitor_id'.")
        if not pack.items:
            errors.append("Evidence pack has empty items list. Strategic module requires evidence.")

        # Validate individual items
        seen_ids = set()
        for idx, item in enumerate(pack.items):
            item_errors = EvidenceValidator.validate_item(item, idx)
            errors.extend(item_errors)
            
            if item.evidence_id:
                if item.evidence_id in seen_ids:
                    errors.append(f"Duplicate evidence ID found: '{item.evidence_id}'")
                seen_ids.add(item.evidence_id)

        is_valid = len(errors) == 0
        if not is_valid:
            logger.error(f"Evidence validation failed with {len(errors)} errors: {errors}")
            
        return is_valid, errors

    @staticmethod
    def validate_item(item: EvidenceItem, index: int) -> List[str]:
        """
        Validate single evidence item.
        """
        errors = []
        prefix = f"Item[{index}] (ID: {item.evidence_id or 'unknown'}):"

        if not item.evidence_id:
            errors.append(f"{prefix} missing 'evidence_id'.")
        if not item.content or not item.content.strip():
            errors.append(f"{prefix} text 'content' is empty.")
        if not item.observed_at:
            errors.append(f"{prefix} missing timestamp 'observed_at'.")
        if not item.source_type:
            errors.append(f"{prefix} missing 'source_type'.")
        if item.reliability_score < 0.0 or item.reliability_score > 1.0:
            errors.append(f"{prefix} reliability_score must be between 0.0 and 1.0.")
            
        return errors
