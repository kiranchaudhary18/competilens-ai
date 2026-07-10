import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from llm.shared.schemas.evidence import EvidencePack, EvidenceItem, EvidenceType


class EvidenceAggregator:
    """
    Service responsible for building the Evidence Pack from database extracts.
    Integrates results from content classifier, sentiment analyzer, and change engine.
    """

    @staticmethod
    def build_evidence_pack(
        workspace_id: str,
        competitor_id: str,
        competitor_name: str,
        raw_signals: List[Dict[str, Any]],
        change_detection_results: Optional[List[Dict[str, Any]]] = None,
        sentiment_metrics: Optional[List[Dict[str, Any]]] = None,
    ) -> EvidencePack:
        """
        Aggregates upstream ML labels and logs into a single structured EvidencePack.
        """
        items: List[EvidenceItem] = []
        
        # 1. Process Raw Signals (with Classifier output)
        for sig in raw_signals:
            meta = sig.get("metadata") or {}
            
            # Extract classifier labels
            classifier_label = sig.get("classifier_label") or meta.get("classifier_label")
            classifier_conf = sig.get("classifier_confidence") or meta.get("classifier_confidence")
            
            # Extract sentiment labels if attached
            sent_label = sig.get("sentiment_label") or meta.get("sentiment_label")
            sent_conf = sig.get("sentiment_confidence") or meta.get("sentiment_confidence")
            
            # Format observed date
            published_or_captured = sig.get("publishedAt") or sig.get("capturedAt")
            if isinstance(published_or_captured, datetime):
                observed_str = published_or_captured.isoformat()
            else:
                observed_str = str(published_or_captured or datetime.utcnow().isoformat())

            # Text content
            content_text = sig.get("summary") or sig.get("title") or sig.get("content") or ""
            
            items.append(
                EvidenceItem(
                    evidence_id=sig.get("id") or f"sig_{uuid.uuid4().hex[:8]}",
                    workspace_id=workspace_id,
                    competitor_id=competitor_id,
                    evidence_type=EvidenceType.SIGNAL,
                    source_type=str(sig.get("type", "WEBSITE")),
                    source_reference=sig.get("url") or sig.get("source"),
                    observed_at=observed_str,
                    content=content_text,
                    reliability_score=1.0,
                    classifier_label=classifier_label,
                    classifier_confidence=classifier_conf,
                    sentiment_label=sent_label,
                    sentiment_confidence=sent_conf
                )
            )

        # 2. Process Change Detection Events
        if change_detection_results:
            for chg in change_detection_results:
                observed_str = chg.get("created_at") or datetime.utcnow().isoformat()
                
                # Check for single changes list or top-level properties
                changes_list = chg.get("changes") or []
                if not changes_list and "change_id" in chg:
                    # Single change representation
                    changes_list = [chg]
                    
                for single_chg in changes_list:
                    items.append(
                        EvidenceItem(
                            evidence_id=single_chg.get("change_id") or f"chg_{uuid.uuid4().hex[:8]}",
                            workspace_id=workspace_id,
                            competitor_id=competitor_id,
                            evidence_type=EvidenceType.CHANGE_DETECTION,
                            source_type="WEBSITE_DELTA",
                            source_reference=single_chg.get("section") or "Web Page",
                            observed_at=observed_str,
                            content=f"Detected change in {single_chg.get('entity', 'component')}: "
                                    f"Previous: {single_chg.get('old_value')}, New: {single_chg.get('new_value')}",
                            reliability_score=float(single_chg.get("confidence_score", 1.0)),
                            change_type=single_chg.get("change_type"),
                            change_severity=single_chg.get("severity"),
                            change_confidence=float(single_chg.get("confidence_score", 1.0)),
                            old_value=single_chg.get("old_value"),
                            new_value=single_chg.get("new_value")
                        )
                    )

        # 3. Process Custom Sentiment Metrics
        if sentiment_metrics:
            for sent in sentiment_metrics:
                observed_str = sent.get("observed_at") or datetime.utcnow().isoformat()
                items.append(
                    EvidenceItem(
                        evidence_id=sent.get("id") or f"sent_{uuid.uuid4().hex[:8]}",
                        workspace_id=workspace_id,
                        competitor_id=competitor_id,
                        evidence_type=EvidenceType.SENTIMENT_INTELLIGENCE,
                        source_type=sent.get("source_type", "AGGREGATED_REVIEW"),
                        source_reference=sent.get("source"),
                        observed_at=observed_str,
                        content=sent.get("summary") or f"Aggregated sentiment report: {sent.get('sentiment')}",
                        reliability_score=1.0,
                        sentiment_label=sent.get("sentiment"),
                        sentiment_confidence=sent.get("confidence")
                    )
                )

        pack_id = f"evpack_{uuid.uuid4().hex[:12]}"
        
        return EvidencePack(
            pack_id=pack_id,
            workspace_id=workspace_id,
            competitor_id=competitor_id,
            competitor_name=competitor_name,
            generated_at=datetime.utcnow().isoformat(),
            items=items
        )
