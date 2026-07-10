import json
from pathlib import Path
from typing import Any
from transformers import pipeline


ROOT = Path(__file__).resolve().parents[1]
MODEL_DIR = ROOT / "artifacts" / "best-model"
LABELS_PATH = ROOT / "configs" / "labels.json"


def load_labels() -> list[str]:
    with LABELS_PATH.open("r", encoding="utf-8") as handle:
        payload = json.load(handle)
    return payload["labels"]


def predict_text(text: str) -> dict[str, Any]:
    if not MODEL_DIR.exists():
        raise FileNotFoundError("Trained model artifact not found. Run training first.")

    classifier = pipeline("text-classification", model=str(MODEL_DIR), tokenizer=str(MODEL_DIR))
    result = classifier(text, truncation=True)[0]
    labels = load_labels()
    predicted_label = result["label"]
    confidence = float(result["score"])

    return {
        "sentiment": predicted_label if predicted_label in labels else "NEUTRAL",
        "confidence": round(confidence, 3),
        "model_version": "1.0.0",
    }


if __name__ == "__main__":
    sample_text = "The software is powerful but the pricing is ridiculously expensive."
    print(json.dumps(predict_text(sample_text), indent=2))
