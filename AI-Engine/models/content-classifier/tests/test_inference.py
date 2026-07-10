import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1] / "src"))

from predict import load_labels


def test_load_labels_returns_expected_label_count():
    labels = load_labels()
    assert len(labels) == 8
    assert "PRICING" in labels
