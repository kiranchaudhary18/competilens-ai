from pathlib import Path
import pandas as pd
from sklearn.model_selection import train_test_split


ROOT = Path(__file__).resolve().parents[1]
INPUT_PATH = ROOT / "data" / "interim" / "deduplicated.csv"
OUTPUT_DIR = ROOT / "data" / "processed"


def split_examples(test_size: float = 0.1, validation_size: float = 0.1) -> dict[str, pd.DataFrame]:
    df = pd.read_csv(INPUT_PATH)

    try:
        train_df, temp_df = train_test_split(
            df,
            test_size=test_size + validation_size,
            stratify=df["label"],
            random_state=42,
        )
        val_df, test_df = train_test_split(
            temp_df,
            test_size=0.5,
            stratify=temp_df["label"],
            random_state=42,
        )
    except ValueError:
        train_df, temp_df = train_test_split(
            df,
            test_size=test_size + validation_size,
            random_state=42,
        )
        val_df, test_df = train_test_split(
            temp_df,
            test_size=0.5,
            random_state=42,
        )

    train_df.to_csv(OUTPUT_DIR / "train.csv", index=False)
    val_df.to_csv(OUTPUT_DIR / "validation.csv", index=False)
    test_df.to_csv(OUTPUT_DIR / "test.csv", index=False)

    return {
        "train": train_df,
        "validation": val_df,
        "test": test_df,
    }


if __name__ == "__main__":
    split_examples()
    print(f"Split data written to {OUTPUT_DIR}")
