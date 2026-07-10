import pytest
from datetime import datetime
from llm.shared.schemas.evidence import EvidencePack, EvidenceItem, EvidenceType
from llm.shared.schemas.citation import ClaimType, GroundedClaim
from llm.executive_report.src.schemas.report_schema import ExecutiveReportResult, ReportType
from llm.executive_report.src.validation.report_validator import ExecutiveReportValidator


def test_report_validation_pass():
    pack = EvidencePack(
        pack_id="pack_1",
        workspace_id="ws_1",
        competitor_id="comp_1",
        competitor_name="Competitor X",
        generated_at=datetime.utcnow().isoformat(),
        items=[
            EvidenceItem(
                evidence_id="chg_01",
                workspace_id="ws_1",
                competitor_id="comp_1",
                evidence_type=EvidenceType.CHANGE_DETECTION,
                source_type="WEBSITE_DELTA",
                observed_at=datetime.utcnow().isoformat(),
                content="Enterprise Plan price adjusted from $99 to $129."
            )
        ]
    )

    report = ExecutiveReportResult(
        report_id="rep_1",
        workspace_id="ws_1",
        competitor_id="comp_1",
        report_type=ReportType.WEEKLY_BRIEF,
        title="Weekly Competitor Price Adjustments",
        executive_summary="Competitor X raised prices for enterprise tier.",
        key_developments=[
            GroundedClaim(
                statement="Enterprise Plan pricing raised to $129.",
                claim_type=ClaimType.FACT,
                confidence=0.98,
                evidence_ids=["chg_01"],
                rationale="Observed in web page change logs."
            )
        ],
        strategic_risks=[],
        opportunities=[],
        recommended_actions=[],
        outlook="Expect minor user pushback due to price adjustments."
    )

    validator = ExecutiveReportValidator()
    passed, val_report = validator.validate_report(report, pack)

    assert passed is True
    assert "chg_01" in report.evidence_references
    assert val_report["grounding"]["grounding_rate"] == 1.0
