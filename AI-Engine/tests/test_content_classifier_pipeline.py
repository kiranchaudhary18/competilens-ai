from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
CONTENT_CLASSIFIER_ROOT = ROOT / "models" / "content-classifier"
SRC_ROOT = CONTENT_CLASSIFIER_ROOT / "src"

sys.path.append(str(SRC_ROOT))

from collect_data import collect_examples
from validate_data import validate_examples
from clean_data import clean_examples
from deduplicate import deduplicate_examples
from split_data import split_examples


def test_pipeline_creates_expected_outputs():
    collect_examples()
    validate_examples()
    clean_examples()
    deduplicated = deduplicate_examples()
    splits = split_examples()

    assert not deduplicated.empty
    assert {"train", "validation", "test"}.issubset(set(splits.keys()))
    assert all(not frame.empty for frame in splits.values())
