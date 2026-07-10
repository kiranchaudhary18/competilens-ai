import pytest
from datetime import datetime
from llm.shared.schemas.evidence import EvidencePack, EvidenceItem, EvidenceType
from llm.shared.schemas.citation import ClaimType, GroundedClaim
from llm.shared.validation.grounding_validator import GroundingValidator
from llm.strategic_analysis.src.schemas.strategic_schema import StrategicAnalysisResult, SwotAnalysis
from llm.strategic_analysis.src.evidence.aggregation import EvidenceAggregator
from llm.strategic_analysis.src.validation.strategic_validator import StrategicValidator


def test_evidence_aggregation():
    raw_signals = [
        {
            "id": "sig_001",
            "type": "PRICING",
            "url": "http://example.com/pricing",
            "publishedAt": datetime.utcnow(),
            "summary": "Pro plan increased from $29 to $39.",
            "classifier_label": "PRICING",
            "classifier_confidence": 0.95,
            "sentiment_label": "NEGATIVE",
            "sentiment_confidence": 0.85
        }
    ]

    pack = EvidenceAggregator.build_evidence_pack(
        workspace_id="ws_123",
        competitor_id="comp_abc",
        competitor_name="Competitor X",
        raw_signals=raw_signals
    )

    assert pack.competitor_name == "Competitor X"
    assert len(pack.items) == 1
    assert pack.items[0].evidence_id == "sig_001"
    assert pack.items[0].sentiment_label == "NEGATIVE"


def test_grounding_validator_pass():
    pack = EvidencePack(
        pack_id="pack_1",
        workspace_id="ws_1",
        competitor_id="comp_1",
        competitor_name="Comp",
        generated_at=datetime.utcnow().isoformat(),
        items=[
            EvidenceItem(
                evidence_id="sig_1",
                workspace_id="ws_1",
                competitor_id="comp_1",
                evidence_type=EvidenceType.SIGNAL,
                source_type="WEBSITE",
                observed_at=datetime.utcnow().isoformat(),
                content="Competitor added enterprise SSO support."
            )
        ]
    )

    claims = [
        GroundedClaim(
            statement="Added SSO capability for enterprise users.",
            claim_type=ClaimType.FACT,
            confidence=0.95,
            evidence_ids=["sig_1"],
            rationale="SSO feature mentioned in signal."
        )
    ]

    passed, report = GroundingValidator.validate_grounding(claims, pack)
    assert passed is True
    assert report["grounding_rate"] == 1.0
    assert report["evidence_coverage_rate"] == 1.0


def test_grounding_validator_fail_hallucination():
    pack = EvidencePack(
        pack_id="pack_1",
        workspace_id="ws_1",
        competitor_id="comp_1",
        competitor_name="Comp",
        generated_at=datetime.utcnow().isoformat(),
        items=[
            EvidenceItem(
                evidence_id="sig_1",
                workspace_id="ws_1",
                competitor_id="comp_1",
                evidence_type=EvidenceType.SIGNAL,
                source_type="WEBSITE",
                observed_at=datetime.utcnow().isoformat(),
                content="Added pricing details."
            )
        ]
    )

    # Citing an ID that does not exist in the pack
    claims = [
        GroundedClaim(
            statement="Pricing increased by 50%.",
            claim_type=ClaimType.FACT,
            confidence=0.9,
            evidence_ids=["sig_999"],
            rationale="Hallucinated evidence reference."
        )
    ]

    passed, report = GroundingValidator.validate_grounding(claims, pack)
    assert passed is False
    assert len(report["hallucinated_citations"]) == 1
    assert report["hallucinated_citations"][0]["invalid_evidence_ids"] == ["sig_999"]
