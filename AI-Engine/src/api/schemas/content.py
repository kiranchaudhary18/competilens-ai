from pydantic import BaseModel


class ContentClassificationRequest(BaseModel):
    text: str


class ContentClassificationResponse(BaseModel):
    label: str
    confidence: float
    model_version: str = "1.0.0"
