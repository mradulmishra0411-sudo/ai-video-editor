"""Projects API routes"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
from datetime import datetime

from app.db.database import get_db
from app.models.schemas import (
    ProjectCreate,
    ProjectResponse,
)

router = APIRouter()


@router.post("", response_model=ProjectResponse)
async def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
):
    """Create a new project"""
    from app.models.schemas import Project
    
    new_project = Project(
        id=str(uuid.uuid4()),
        user_id="user_default",  # TODO: Get from auth
        name=project.name,
        description=project.description,
        status="draft",
        created_at=datetime.utcnow(),
    )
    
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    return new_project


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str,
    db: Session = Depends(get_db),
):
    """Get project by ID"""
    from app.models.schemas import Project
    
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return project


@router.get("", response_model=list[ProjectResponse])
async def list_projects(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 10,
):
    """List all projects"""
    from app.models.schemas import Project
    
    projects = db.query(Project).offset(skip).limit(limit).all()
    return projects
