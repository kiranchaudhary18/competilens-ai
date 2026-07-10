from pathlib import Path
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
INPUT_PATH = ROOT / "data" / "interim" / "validated.csv"
OUTPUT_PATH = ROOT / "data" / "interim" / "deduplicated.csv"


def deduplicate_examples() -> pd.DataFrame:
    df = pd.read_csv(INPUT_PATH)
    df = df.drop_duplicates(subset=["text", "label"], keep="first").copy()
    df.to_csv(OUTPUT_PATH, index=False)
    return df


if __name__ == "__main__":
    deduplicate_examples()
    print(f"Deduplicated examples written to {OUTPUT_PATH}")
