from fastapi import APIRouter
from ..schemas.content import ContentClassificationRequest, ContentClassificationResponse
from ..dependencies import *
from inference.classifier_service import classify_text

router = APIRouter(prefix="/v1", tags=["classification"])


@router.post("/classify-content", response_model=ContentClassificationResponse)
def classify_content(payload: ContentClassificationRequest) -> ContentClassificationResponse:
    result = classify_text(payload.text)
    return ContentClassificationResponse(**result)
