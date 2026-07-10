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


def main() -> None:
    collect_examples()
    validate_examples()
    clean_examples()
    deduplicate_examples()
    split_examples()
    print("Content classifier pipeline completed successfully.")


if __name__ == "__main__":
    main()
