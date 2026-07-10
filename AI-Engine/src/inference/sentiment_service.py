import importlib.util
from pathlib import Path
import sys

def _load_predict_module():
    module_path = Path(__file__).resolve().parents[2] / "models" / "sentiment-intelligence" / "src" / "predict.py"
    spec = importlib.util.spec_from_file_location("sentiment_intelligence_predict", str(module_path))
    module = importlib.util.module_from_spec(spec)
    sys.path.insert(0, str(module_path.parent))
    spec.loader.exec_module(module)
    sys.path.pop(0)
    return module

predict_module = _load_predict_module()


def analyze_sentiment(text: str) -> dict[str, object]:
    return predict_module.predict_text(text)
