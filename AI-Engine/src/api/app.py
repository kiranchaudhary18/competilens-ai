from fastapi import FastAPI
from inference.classifier_service import classify_text


app = FastAPI(title="CompetiLens AI Engine")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/classify")
def classify(payload: dict[str, str]) -> dict[str, object]:
    text = payload.get("text", "")
    return classify_text(text)
