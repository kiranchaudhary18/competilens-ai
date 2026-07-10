import json
from pathlib import Path


def test_label_configuration_contains_expected_labels():
    labels_path = Path(__file__).resolve().parents[1] / "configs" / "labels.json"
    with labels_path.open("r", encoding="utf-8") as handle:
        payload = json.load(handle)

    assert payload["labels"] == [
        "PRICING",
        "FEATURE",
        "PRODUCT_LAUNCH",
        "PARTNERSHIP",
        "INTEGRATION",
        "SECURITY",
        "HIRING",
        "GENERAL_NEWS",
    ]
