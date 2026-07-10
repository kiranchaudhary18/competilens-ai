from fastapi import APIRouter
from ..schemas.sentiment import SentimentRequest, SentimentResponse
from ..dependencies import *
from inference.sentiment_service import analyze_sentiment

router = APIRouter(prefix="/v1", tags=["sentiment"])


@router.post("/analyze-sentiment", response_model=SentimentResponse)
def analyze(payload: SentimentRequest) -> SentimentResponse:
    result = analyze_sentiment(payload.text)
    return SentimentResponse(**result)
