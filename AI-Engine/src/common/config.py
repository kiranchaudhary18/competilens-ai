import os
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


def get_env(name: str, default: str | None = None) -> str | None:
    return os.getenv(name, default)


def get_project_root() -> Path:
    return ROOT
