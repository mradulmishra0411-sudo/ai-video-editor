"""Video processing API routes"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
from datetime import datetime

from app.db.database import get_db
from app.models.schemas import ProcessingRequest, ProcessingResponse, ProcessingTask
from app.tasks.video_processing import process_video_global, process_video_reference

router = APIRouter()


@router.post("/start", response_model=ProcessingResponse)
async def start_processing(
    request: ProcessingRequest,
    db: Session = Depends(get_db),
):
    """Start video processing"""
    
    # Create processing task record
    task_id = str(uuid.uuid4())
    
    task = ProcessingTask(
        id=task_id,
        project_id=request.project_id,
        task_type="global_trend" if request.mode == "global" else "reference_clone",
        status="pending",
        progress=0,
        parameters=request.prompt or request.reference_url,
        created_at=datetime.utcnow(),
    )
    
    db.add(task)
    db.commit()
    
    # Trigger async processing
    if request.mode == "global":
        process_video_global.delay(
            task_id=task_id,
            project_id=request.project_id,
            prompt=request.prompt,
        )
    else:
        process_video_reference.delay(
            task_id=task_id,
            project_id=request.project_id,
            reference_url=request.reference_url,
        )
    
    return ProcessingResponse(
        task_id=task_id,
        status="pending",
        progress=0,
    )


@router.get("/{task_id}/status", response_model=ProcessingResponse)
async def get_processing_status(
    task_id: str,
    db: Session = Depends(get_db),
):
    """Get processing task status"""
    
    task = db.query(ProcessingTask).filter(ProcessingTask.id == task_id).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Processing task not found"
        )
    
    return ProcessingResponse(
        task_id=task.id,
        status=task.status.value,
        progress=task.progress,
    )


@router.get("/{task_id}/cancel", response_model=dict)
async def cancel_processing(
    task_id: str,
    db: Session = Depends(get_db),
):
    """Cancel processing task"""
    
    task = db.query(ProcessingTask).filter(ProcessingTask.id == task_id).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Processing task not found"
        )
    
    # TODO: Revoke Celery task
    task.status = "cancelled"
    db.commit()
    
    return {"status": "cancelled"}
