"""Videos API routes"""

from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import uuid
import os
from datetime import datetime

from app.db.database import get_db
from app.core.config import settings
from app.models.schemas import VideoResponse, Video, Project
from app.services.video_analyzer import VideoAnalyzer

router = APIRouter()


@router.post("/upload", response_model=dict)
async def upload_video(
    file: UploadFile = File(...),
    project_id: str = None,
    db: Session = Depends(get_db),
):
    """Upload a video file"""
    
    # Validate file type
    if file.content_type not in ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Supported: MP4, MOV, AVI, MKV"
        )
    
    try:
        # Save file temporarily
        os.makedirs(settings.TEMP_UPLOAD_DIR, exist_ok=True)
        temp_file_path = f"{settings.TEMP_UPLOAD_DIR}/{file.filename}"
        
        with open(temp_file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Analyze video
        analyzer = VideoAnalyzer()
        video_metadata = analyzer.analyze(temp_file_path)
        
        # Create or use existing project
        if not project_id:
            project = Project(
                id=str(uuid.uuid4()),
                user_id="user_default",
                name=file.filename.replace('.mp4', ''),
                status="draft",
                created_at=datetime.utcnow(),
            )
            db.add(project)
            db.commit()
            project_id = project.id
        
        # Create video record
        video = Video(
            id=str(uuid.uuid4()),
            project_id=project_id,
            title=file.filename,
            url=temp_file_path,  # TODO: Upload to S3
            duration=video_metadata.get("duration", 0),
            size=len(content),
            status="uploaded",
            metadata=str(video_metadata),
            created_at=datetime.utcnow(),
        )
        
        db.add(video)
        db.commit()
        
        return {
            "videoId": video.id,
            "projectId": project_id,
            "filename": file.filename,
            "duration": video.duration,
            "size": video.size,
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {str(e)}"
        )


@router.get("/{video_id}", response_model=VideoResponse)
async def get_video(
    video_id: str,
    db: Session = Depends(get_db),
):
    """Get video by ID"""
    
    video = db.query(Video).filter(Video.id == video_id).first()
    
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found"
        )
    
    return video


@router.post("/{video_id}/analyze")
async def analyze_video(
    video_id: str,
    db: Session = Depends(get_db),
):
    """Analyze video content"""
    
    video = db.query(Video).filter(Video.id == video_id).first()
    
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found"
        )
    
    analyzer = VideoAnalyzer()
    analysis_result = analyzer.analyze(video.url)
    
    return {
        "videoId": video_id,
        "analysis": analysis_result,
    }


@router.get("/{video_id}/download")
async def download_video(
    video_id: str,
    db: Session = Depends(get_db),
):
    """Download processed video"""
    
    video = db.query(Video).filter(Video.id == video_id).first()
    
    if not video or video.status != "completed":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found or not ready"
        )
    
    return FileResponse(
        video.url,
        media_type="video/mp4",
        filename=f"{video.title}_edited.mp4"
    )
