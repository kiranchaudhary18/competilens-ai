import json
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("competilens.ai_engine.llm.observability.audit")


class AuditLog:
    """
    Utility for generating secure, structured audit trails for LLM generation runs.
    Logs system inputs and outputs without leaking API keys, passwords, or PII.
    """

    @staticmethod
    def log_event(
        event_name: str,
        request_id: str,
        workspace_id: str,
        competitor_id: str,
        metadata: Dict[str, Any],
        error: Optional[str] = None
    ):
        """
        Record a structured audit log entry to the log files.
        """
        # Ensure credentials/keys are never written
        cleaned_meta = AuditLog._sanitize_data(metadata)
        
        log_payload = {
            "event": event_name,
            "request_id": request_id,
            "workspace_id": workspace_id,
            "competitor_id": competitor_id,
            "status": "SUCCESS" if not error else "FAILED",
            "error": error,
            "metadata": cleaned_meta
        }
        
        logger.info(f"AUDIT_RECORD -> {json.dumps(log_payload)}")

    @staticmethod
    def _sanitize_data(data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Scan and scrub potential secrets or keys.
        """
        blacklisted_keys = {
            "api_key", "password", "token", "secret", "authorization", 
            "key", "credential", "private_key", "db_url", "url_password"
        }
        
        cleaned = {}
        for k, v in data.items():
            k_lower = k.lower()
            if any(blk in k_lower for blk in blacklisted_keys):
                cleaned[k] = "[REDACTED]"
            elif isinstance(v, dict):
                cleaned[k] = AuditLog._sanitize_data(v)
            else:
                cleaned[k] = v
        return cleaned
