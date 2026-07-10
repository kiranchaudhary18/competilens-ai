from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1] / "src"))

from clean_data import normalize_text


def test_normalize_text_removes_excess_whitespace():
    text = "  We   launched   a new product  "
    assert normalize_text(text) == "We launched a new product"
