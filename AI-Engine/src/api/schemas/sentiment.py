from pydantic import BaseModel


class SentimentRequest(BaseModel):
    text: str


class SentimentResponse(BaseModel):
    sentiment: str
    confidence: float
    model_version: str = "1.0.0"
