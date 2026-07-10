from pathlib import Path
import shutil


ROOT = Path(__file__).resolve().parents[1]
CHECKPOINT_DIR = ROOT / "artifacts" / "checkpoints"
BEST_MODEL_DIR = ROOT / "artifacts" / "best-model"


def export_best_model() -> Path:
    if not CHECKPOINT_DIR.exists():
        raise FileNotFoundError("No checkpoint directory found")

    BEST_MODEL_DIR.mkdir(parents=True, exist_ok=True)
    for child in CHECKPOINT_DIR.iterdir():
        if child.is_dir():
            shutil.copytree(child, BEST_MODEL_DIR / child.name, dirs_exist_ok=True)
            break
    return BEST_MODEL_DIR


if __name__ == "__main__":
    export_best_model()
    print(f"Exported model to {BEST_MODEL_DIR}")
