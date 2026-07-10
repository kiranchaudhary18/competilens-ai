from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
CONTENT_CLASSIFIER_ROOT = ROOT / ".." / "models" / "content-classifier" / "src"
SENTIMENT_ROOT = ROOT / ".." / "models" / "sentiment-intelligence" / "src"

sys.path.insert(0, str(ROOT.resolve()))
sys.path.insert(0, str(CONTENT_CLASSIFIER_ROOT.resolve()))
sys.path.insert(0, str(SENTIMENT_ROOT.resolve()))
