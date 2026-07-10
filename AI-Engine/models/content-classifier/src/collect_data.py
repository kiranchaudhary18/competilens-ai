import json
from pathlib import Path
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "data" / "raw"
OUTPUT = ROOT / "data" / "interim" / "collected.csv"


def collect_examples() -> pd.DataFrame:
    """Load the raw examples shipped with the scaffold."""
    raw_path = RAW_DIR / "collected.csv"
    if not raw_path.exists():
        raise FileNotFoundError(f"Missing raw dataset at {raw_path}")

    df = pd.read_csv(raw_path)
    df.to_csv(OUTPUT, index=False)
    return df


if __name__ == "__main__":
    collect_examples()
    print(f"Collected examples written to {OUTPUT}")
