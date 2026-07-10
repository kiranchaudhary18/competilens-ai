import json
from pathlib import Path
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
LABELS_PATH = ROOT / "configs" / "labels.json"
INPUT_PATH = ROOT / "data" / "interim" / "normalized.csv"
OUTPUT_PATH = ROOT / "data" / "interim" / "validated.csv"


def load_labels() -> list[str]:
    with LABELS_PATH.open("r", encoding="utf-8") as handle:
        payload = json.load(handle)
    return payload["labels"]


def validate_examples() -> pd.DataFrame:
    labels = load_labels()
    df = pd.read_csv(INPUT_PATH)
    required_columns = {"id", "text", "label", "source"}
    missing_columns = required_columns.difference(df.columns)
    if missing_columns:
        raise ValueError(f"Missing required columns: {sorted(missing_columns)}")

    invalid_labels = set(df["label"].dropna().astype(str)) - set(labels)
    if invalid_labels:
        raise ValueError(f"Found unexpected labels: {sorted(invalid_labels)}")

    df = df.dropna(subset=["text", "label"]).copy()
    df.to_csv(OUTPUT_PATH, index=False)
    return df


if __name__ == "__main__":
    validate_examples()
    print(f"Validated examples written to {OUTPUT_PATH}")
