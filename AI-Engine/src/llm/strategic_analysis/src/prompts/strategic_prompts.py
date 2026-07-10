import json
from typing import Dict, Any
from llm.shared.schemas.evidence import EvidencePack, EvidenceItem


class StrategicPromptBuilder:
    """
    Constructs and serializes parameters specifically for Strategic Analysis prompts.
    """

    @staticmethod
    def serialize_evidence_pack(pack: EvidencePack) -> str:
        """
        Convert evidence pack items into a structured text layout for injection into prompts.
        This provides clear structure, making it easy for the LLM to cross-reference evidence_ids.
        """
        lines = []
        for idx, item in enumerate(pack.items):
            meta_details = []
            if item.classifier_label:
                meta_details.append(f"Class: {item.classifier_label} (Conf: {item.classifier_confidence})")
            if item.sentiment_label:
                meta_details.append(f"Sentiment: {item.sentiment_label} (Conf: {item.sentiment_confidence})")
            if item.change_type:
                meta_details.append(f"Change: {item.change_type} (Severity: {item.change_severity})")
                
            meta_str = " | ".join(meta_details)
            meta_prefix = f" [{meta_str}]" if meta_details else ""

            lines.append(
                f"--- EVIDENCE ITEM {idx + 1} ---\n"
                f"Evidence ID: {item.evidence_id}\n"
                f"Source Type: {item.source_type}\n"
                f"Source Ref: {item.source_reference or 'N/A'}\n"
                f"Observed Date: {item.observed_at}\n"
                f"Context Info:{meta_prefix}\n"
                f"Text Content: {item.content.strip()}\n"
            )
            
        return "\n".join(lines)

    @staticmethod
    def build_variables(pack: EvidencePack) -> Dict[str, Any]:
        """
        Build the dictionary of variables used to render the templates in PromptRegistry.
        """
        return {
            "competitor_name": pack.competitor_name,
            "workspace_id": pack.workspace_id,
            "competitor_id": pack.competitor_id,
            "evidence_items_serialized": StrategicPromptBuilder.serialize_evidence_pack(pack),
        }
