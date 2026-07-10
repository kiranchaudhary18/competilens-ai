from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
import sys

module_path = Path(__file__).resolve().parents[1] / "src" / "dataset.py"
spec = spec_from_file_location("sentiment_dataset", module_path)
dataset_module = module_from_spec(spec)
sys.modules.pop("dataset", None)
spec.loader.exec_module(dataset_module)
SentimentDataset = dataset_module.SentimentDataset


def test_sentiment_dataset_tokenizes_and_returns_expected_keys():
    dataset = SentimentDataset(
        train_path=Path(__file__).resolve().parents[1] / "data" / "processed" / "train.csv",
        validation_path=Path(__file__).resolve().parents[1] / "data" / "processed" / "validation.csv",
        test_path=Path(__file__).resolve().parents[1] / "data" / "processed" / "test.csv",
    )

    train_df = dataset.load_split("train")
    inputs = dataset.tokenize(train_df["text"].tolist()[:2], [0, 1])

    assert "input_ids" in inputs
    assert "attention_mask" in inputs
    assert "labels" in inputs
