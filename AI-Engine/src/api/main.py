from fastapi import FastAPI
from .routes.health import router as health_router
from .routes.classify import router as classify_router
from .routes.sentiment import router as sentiment_router
from .routes.strategic import router as strategic_router
from .routes.report import router as report_router
from .routes.change_detection import router as change_detection_router


app = FastAPI(title="CompetiLens AI Engine")
app.include_router(health_router)
app.include_router(classify_router)
app.include_router(sentiment_router)
app.include_router(strategic_router)
app.include_router(report_router)
app.include_router(change_detection_router)

