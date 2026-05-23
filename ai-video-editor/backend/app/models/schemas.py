"""Pydantic models and database schemas"""

from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional, List
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, Enum, ForeignKey
from sqlalchemy.orm import relationship
import enum

from app.db.database import Base


# ============== Pydantic Schemas (API) ==============

class VideoBase(BaseModel):
    """Base video schema"""
    title: str
    description: Optional[str] = None


class VideoCreate(VideoBase):
    """Schema for creating videos"""
    pass


class VideoResponse(VideoBase):
    """Schema for video responses"""
    id: str
    project_id: str
    url: str
    duration: float
    size: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class ProjectBase(BaseModel):
    """Base project schema"""
    name: str
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    """Schema for creating projects"""
    pass


class ProjectResponse(ProjectBase):
    """Schema for project responses"""
    id: str
    user_id: str
    status: str
    created_at: datetime
    updated_at: datetime
    videos: List[VideoResponse] = []

    class Config:
        from_attributes = True


class ProcessingRequest(BaseModel):
    """Schema for processing requests"""
    project_id: str
    mode: str = Field(..., description="'global' or 'reference'")
    prompt: Optional[str] = Field(None, description="Context for global mode")
    reference_url: Optional[str] = Field(None, description="URL for reference mode")


class ProcessingResponse(BaseModel):
    """Schema for processing responses"""
    task_id: str
    status: str
    progress: int = 0
    estimated_time: Optional[int] = None


# ============== SQLAlchemy Models (Database) ==============

class ProcessingStatusEnum(str, enum.Enum):
    """Processing status enumeration"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class User(Base):
    """User model"""
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    projects = relationship("Project", back_populates="user")


class Project(Base):
    """Project model"""
    __tablename__ = "projects"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    status = Column(String, default="draft")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="projects")
    videos = relationship("Video", back_populates="project")
    processing_tasks = relationship("ProcessingTask", back_populates="project")


class Video(Base):
    """Video model"""
    __tablename__ = "videos"

    id = Column(String, primary_key=True)
    project_id = Column(String, ForeignKey("projects.id"))
    title = Column(String)
    description = Column(Text, nullable=True)
    url = Column(String)  # S3 or cloud storage URL
    thumbnail_url = Column(String, nullable=True)
    duration = Column(Integer)  # in seconds
    size = Column(Integer)  # in bytes
    status = Column(String, default="uploaded")  # uploaded, processing, completed, failed
    video_metadata = Column(Text, nullable=True)  # JSON metadata
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="videos")


class ProcessingTask(Base):
    """Processing task model"""
    __tablename__ = "processing_tasks"

    id = Column(String, primary_key=True)
    project_id = Column(String, ForeignKey("projects.id"))
    video_id = Column(String, ForeignKey("videos.id"))
    task_type = Column(String)  # "global_trend", "reference_clone"
    status = Column(
        Enum(ProcessingStatusEnum),
        default=ProcessingStatusEnum.PENDING
    )
    progress = Column(Integer, default=0)
    result_url = Column(String, nullable=True)  # Output video URL
    error_message = Column(Text, nullable=True)
    parameters = Column(Text, nullable=True)  # JSON: prompt or reference_url
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project = relationship("Project", back_populates="processing_tasks")


# ============== API Response Models ==============

class ErrorResponse(BaseModel):
    """Error response schema"""
    error: str
    detail: Optional[str] = None
    status_code: int
