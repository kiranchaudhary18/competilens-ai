from pathlib import Path
import pandas as pd
import torch
from torch.utils.data import Dataset
from transformers import Trainer, TrainingArguments

from dataset import SentimentDataset
from model import build_model


ROOT = Path(__file__).resolve().parents[1]


class TextClassificationDataset(Dataset):
    def __init__(self, dataframe: pd.DataFrame, tokenizer, max_length: int = 256) -> None:
        self.data = dataframe.reset_index(drop=True)
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self) -> int:
        return len(self.data)

    def __getitem__(self, idx: int) -> dict[str, torch.Tensor]:
        row = self.data.iloc[idx]
        encoded = self.tokenizer(
            row["text"],
            truncation=True,
            padding="max_length",
            max_length=self.max_length,
            return_tensors="pt",
        )
        labels = int(row["label_id"])
        return {
            "input_ids": encoded["input_ids"].squeeze(0),
            "attention_mask": encoded["attention_mask"].squeeze(0),
            "labels": torch.tensor(labels, dtype=torch.long),
        }


def prepare_dataset(dataset: SentimentDataset, split_name: str) -> pd.DataFrame:
    df = dataset.load_split(split_name)
    df = df.copy()
    df["label_id"] = df["label"].map(dataset.label_to_id)
    return df


def train_model() -> None:
    dataset = SentimentDataset(
        train_path=ROOT / "data" / "processed" / "train.csv",
        validation_path=ROOT / "data" / "processed" / "validation.csv",
        test_path=ROOT / "data" / "processed" / "test.csv",
    )
    train_df = prepare_dataset(dataset, "train")
    eval_df = prepare_dataset(dataset, "validation")

    train_dataset = TextClassificationDataset(train_df, dataset.tokenizer, max_length=dataset.max_length)
    eval_dataset = TextClassificationDataset(eval_df, dataset.tokenizer, max_length=dataset.max_length)

    model = build_model(model_name=dataset.model_name, num_labels=len(dataset.label_to_id))

    training_args = TrainingArguments(
        output_dir=str(ROOT / "artifacts" / "checkpoints"),
        eval_strategy="epoch",
        save_strategy="epoch",
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
        learning_rate=2e-5,
        num_train_epochs=1,
        weight_decay=0.01,
        logging_dir=str(ROOT / "artifacts" / "metrics"),
        report_to=[],
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=eval_dataset,
    )
    trainer.train()
    trainer.save_model(str(ROOT / "artifacts" / "best-model"))
    dataset.tokenizer.save_pretrained(str(ROOT / "artifacts" / "best-model"))


if __name__ == "__main__":
    train_model()
