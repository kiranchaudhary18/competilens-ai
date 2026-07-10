from pathlib import Path
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
RAW_PATH = ROOT / "data" / "raw" / "custom" / "sample_sentiment.csv"
OUTPUT_PATH = ROOT / "data" / "interim" / "normalized.csv"


def ingest_examples() -> pd.DataFrame:
    if not RAW_PATH.exists():
        sample = pd.DataFrame(
            [
                {"id": 1, "text": "The software is powerful and easy to use", "label": "POSITIVE", "source": "custom"},
                {"id": 2, "text": "The dashboard is intuitive and fast", "label": "POSITIVE", "source": "custom"},
                {"id": 3, "text": "The pricing is too expensive for our team", "label": "NEGATIVE", "source": "custom"},
                {"id": 4, "text": "Support response was slow and frustrating", "label": "NEGATIVE", "source": "custom"},
                {"id": 5, "text": "The release is fine but not transformative", "label": "NEUTRAL", "source": "custom"},
                {"id": 6, "text": "The update feels average and predictable", "label": "NEUTRAL", "source": "custom"},
            ]
        )
        sample.to_csv(RAW_PATH, index=False)

    df = pd.read_csv(RAW_PATH)
    df.to_csv(OUTPUT_PATH, index=False)
    return df


if __name__ == "__main__":
    ingest_examples()
    print(f"Ingested examples written to {OUTPUT_PATH}")
