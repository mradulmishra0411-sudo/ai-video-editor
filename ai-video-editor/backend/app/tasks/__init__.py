"""Celery configuration and task definitions"""

from celery import Celery
from app.core.config import settings

# Initialize Celery
celery_app = Celery(
    "ai_video_editor",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)
