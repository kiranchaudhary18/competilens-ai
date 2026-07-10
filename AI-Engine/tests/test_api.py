from fastapi.testclient import TestClient
import sys
from pathlib import Path

# Set up paths so that imports work
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from api.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_classify_content_endpoint():
    response = client.post(
        "/v1/classify-content",
        json={"text": "We are raising our premium pricing tier from $49 to $59 per month."}
    )
    assert response.status_code == 200
    json_data = response.json()
    assert "label" in json_data
    assert "confidence" in json_data


def test_analyze_sentiment_endpoint():
    response = client.post(
        "/v1/analyze-sentiment",
        json={"text": "This new pricing update is absolutely terrible and disappointing."}
    )
    assert response.status_code == 200
    json_data = response.json()
    assert "sentiment" in json_data
    assert "confidence" in json_data


def test_detect_changes_endpoint():
    payload = {
        "old_snapshot": {
            "competitor_id": "test_comp",
            "snapshot_id": "old",
            "raw_data": {"price": "$29/month", "features": 10}
        },
        "new_snapshot": {
            "competitor_id": "test_comp",
            "snapshot_id": "new",
            "raw_data": {"price": "$39/month", "features": 10}
        }
    }
    response = client.post("/v1/changes/detect", json=payload)
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["change_detected"] is True
    assert json_data["total_changes"] > 0
    assert any("PRICE" in str(c["change_type"]) for c in json_data["changes"])


def test_analyze_strategic_endpoint():
    payload = {
        "workspace_id": "ws_123",
        "competitor_id": "comp_abc",
        "competitor_name": "Competitor X",
        "raw_signals": [
            {
                "id": "sig_12",
                "type": "PRICING",
                "url": "http://example.com/pricing",
                "publishedAt": "2026-07-09T16:25:37Z",
                "summary": "Pro plan increased from $29 to $39.",
                "classifier_label": "PRICING",
                "classifier_confidence": 0.95,
                "sentiment_label": "NEGATIVE",
                "sentiment_confidence": 0.85
            }
        ]
    }
    response = client.post("/v1/analyze-strategic", json=payload)
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "success"
    assert "analysis" in json_data
    assert "validation" in json_data


def test_generate_report_endpoint():
    payload = {
        "workspace_id": "ws_123",
        "competitor_name": "Competitor X",
        "strategic_analysis": {
            "analysis_id": "an_999",
            "workspace_id": "ws_123",
            "competitor_id": "comp_456",
            "swot": {
                "strengths": [
                    {
                        "statement": "Strong enterprise integration ecosystem",
                        "claim_type": "FACT",
                        "confidence": 0.88,
                        "evidence_ids": ["sig_12"],
                        "rationale": "Observed multiple integration launches."
                    }
                ],
                "weaknesses": [],
                "opportunities": [],
                "threats": []
            },
            "market_gaps": [],
            "recommended_actions": []
        },
        "evidence_pack": {
            "pack_id": "pack_123",
            "workspace_id": "ws_123",
            "competitor_id": "comp_456",
            "competitor_name": "Competitor X",
            "generated_at": "2026-07-09T16:25:37Z",
            "items": [
                {
                    "evidence_id": "sig_12",
                    "workspace_id": "ws_123",
                    "competitor_id": "comp_456",
                    "evidence_type": "SIGNAL",
                    "source_type": "WEBSITE",
                    "observed_at": "2026-07-09T16:25:37Z",
                    "content": "Strong enterprise integration ecosystem"
                }
            ]
        }
    }
    response = client.post("/v1/generate-report", json=payload)
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "success"
    assert "report" in json_data
    assert "validation" in json_data
