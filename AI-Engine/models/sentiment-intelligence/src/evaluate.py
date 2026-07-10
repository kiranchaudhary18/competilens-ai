from pathlib import Path
import json
import pandas as pd
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score


ROOT = Path(__file__).resolve().parents[1]
TEST_PATH = ROOT / "data" / "processed" / "test.csv"
METRICS_PATH = ROOT / "artifacts" / "metrics" / "metrics.json"
MODEL_PATH = ROOT / "artifacts" / "best-model"


def evaluate_predictions(y_true: list[str], y_pred: list[str]) -> dict[str, float]:
    return {
        "accuracy": accuracy_score(y_true, y_pred),
        "macro_f1": f1_score(y_true, y_pred, average="macro"),
        "weighted_f1": f1_score(y_true, y_pred, average="weighted"),
        "macro_precision": precision_score(y_true, y_pred, average="macro", zero_division=0),
        "macro_recall": recall_score(y_true, y_pred, average="macro", zero_division=0),
    }


def save_metrics(metrics: dict[str, float]) -> None:
    METRICS_PATH.parent.mkdir(parents=True, exist_ok=True)
    with METRICS_PATH.open("w", encoding="utf-8") as handle:
        json.dump(metrics, handle, indent=2)


if __name__ == "__main__":
    df = pd.read_csv(TEST_PATH)
    if not MODEL_PATH.exists():
        raise FileNotFoundError("No trained model artifact found. Run training first.")

    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
    model.eval()

    predictions = []
    with torch.no_grad():
        for text in df["text"].tolist():
            encoded = tokenizer(text, truncation=True, padding="max_length", max_length=256, return_tensors="pt")
            outputs = model(**encoded)
            pred_id = int(torch.argmax(outputs.logits, dim=-1).item())
            predictions.append(pred_id)

    labels = ["POSITIVE", "NEGATIVE", "NEUTRAL"]
    y_true = df["label"].tolist()
    y_pred = [labels[pred] for pred in predictions]
    metrics = evaluate_predictions(y_true, y_pred)
    save_metrics(metrics)
    print(json.dumps(metrics, indent=2))
