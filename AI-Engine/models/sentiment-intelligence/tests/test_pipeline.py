from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
SRC_ROOT = ROOT / "src"

sys.path.insert(0, str(SRC_ROOT))

from ingest import ingest_examples
from normalize import normalize_examples
from validate import validate_examples
from deduplicate import deduplicate_examples
from split import split_examples


def test_sentiment_pipeline_creates_expected_outputs():
    ingest_examples()
    normalize_examples()
    validate_examples()
    deduplicated = deduplicate_examples()
    splits = split_examples()

    assert not deduplicated.empty
    assert {"train", "validation", "test"}.issubset(set(splits.keys()))
    assert all(not frame.empty for frame in splits.values())
