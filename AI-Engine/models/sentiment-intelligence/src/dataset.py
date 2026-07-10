from dataclasses import dataclass
from pathlib import Path
import pandas as pd
from transformers import AutoTokenizer


ROOT = Path(__file__).resolve().parents[1]


@dataclass
class SentimentDataset:
    train_path: Path
    validation_path: Path
    test_path: Path
    model_name: str = "distilbert-base-uncased"
    max_length: int = 256

    def __post_init__(self) -> None:
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.label_to_id = self._load_label_map()

    def _load_label_map(self) -> dict[str, int]:
        labels = ["POSITIVE", "NEGATIVE", "NEUTRAL"]
        return {label: idx for idx, label in enumerate(labels)}

    def load_split(self, split: str) -> pd.DataFrame:
        file_name = {
            "train": self.train_path,
            "validation": self.validation_path,
            "test": self.test_path,
        }[split]
        return pd.read_csv(file_name)

    def tokenize(self, texts: list[str], labels: list[int] | None = None) -> dict[str, list[int] | list[list[int]]]:
        encoded = self.tokenizer(
            texts,
            padding=True,
            truncation=True,
            max_length=self.max_length,
            return_tensors="pt",
        )
        if labels is None:
            return encoded
        return {**encoded, "labels": labels}
