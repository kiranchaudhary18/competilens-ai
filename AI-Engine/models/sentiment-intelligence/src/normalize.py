import re
from pathlib import Path
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
INPUT_PATH = ROOT / "data" / "interim" / "normalized.csv"
OUTPUT_PATH = ROOT / "data" / "interim" / "normalized.csv"


def normalize_text(text: str) -> str:
    text = re.sub(r"\s+", " ", str(text)).strip()
    text = re.sub(r"[^\w\s.-]", " ", text)
    return text.strip()


def normalize_examples() -> pd.DataFrame:
    df = pd.read_csv(INPUT_PATH)
    df["text"] = df["text"].apply(normalize_text)
    df = df[df["text"].str.len() > 3].copy()
    df.to_csv(OUTPUT_PATH, index=False)
    return df


if __name__ == "__main__":
    normalize_examples()
    print(f"Normalized examples written to {OUTPUT_PATH}")
