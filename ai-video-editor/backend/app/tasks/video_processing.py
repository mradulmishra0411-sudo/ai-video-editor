"""Async video processing tasks"""

from celery import shared_task
import logging
from datetime import datetime

from app.db.database import SessionLocal
from app.models.schemas import ProcessingTask, ProcessingStatusEnum, Video
from app.services.style_detector import StyleDetector
from app.services.beat_matcher import BeatMatcher
from app.services.video_analyzer import VideoAnalyzer

logger = logging.getLogger(__name__)


@shared_task(bind=True)
def process_video_global(
    self,
    task_id: str,
    project_id: str,
    prompt: str,
):
    """
    Process video with global trend detection
    
    Args:
        task_id: Processing task ID
        project_id: Project ID
        prompt: User's content context
    """
    db = SessionLocal()
    
    try:
        # Update task status
        task = db.query(ProcessingTask).filter(ProcessingTask.id == task_id).first()
        if not task:
            logger.error(f"Task {task_id} not found")
            return
        
        task.status = ProcessingStatusEnum.PROCESSING
        task.progress = 10
        db.commit()
        
        logger.info(f"Starting global trend processing for task {task_id}")
        
        # Step 1: Analyze current trends (20%)
        self.update_state(state='PROGRESS', meta={'current': 20})
        style_detector = StyleDetector()
        trends = style_detector.analyze_trend()
        
        # Step 2: Analyze video (40%)
        self.update_state(state='PROGRESS', meta={'current': 40})
        analyzer = VideoAnalyzer()
        # Get video from database
        video = db.query(Video).filter(Video.project_id == project_id).first()
        if video:
            video_analysis = analyzer.analyze(video.url)
        
        # Step 3: Detect beats and match (60%)
        self.update_state(state='PROGRESS', meta={'current': 60})
        beat_matcher = BeatMatcher()
        # In production, would analyze actual audio
        beats = beat_matcher.detect_beats(video.url if video else "")
        
        # Step 4: Generate edits (80%)
        self.update_state(state='PROGRESS', meta={'current': 80})
        # Mock: Generate edit instructions
        edit_instructions = {
            "trend_style": trends["trending_styles"][0],
            "music": trends["music_moods"][0],
            "effects": ["fade", "zoom", "color_grade"],
            "duration": 15,
        }
        
        # Step 5: Render (100%)
        self.update_state(state='PROGRESS', meta={'current': 100})
        # In production, would call Shotstack API
        output_path = f"/tmp/output_{task_id}.mp4"
        
        # Update task with result
        task.status = ProcessingStatusEnum.COMPLETED
        task.progress = 100
        task.result_url = output_path
        db.commit()
        
        logger.info(f"Completed global trend processing for task {task_id}")
        
        return {
            "status": "completed",
            "task_id": task_id,
            "output_url": output_path,
        }
    
    except Exception as e:
        logger.error(f"Error processing video: {str(e)}")
        task.status = ProcessingStatusEnum.FAILED
        task.error_message = str(e)
        db.commit()
        return {"status": "failed", "error": str(e)}
    
    finally:
        db.close()


@shared_task(bind=True)
def process_video_reference(
    self,
    task_id: str,
    project_id: str,
    reference_url: str,
):
    """
    Process video with reference style cloning
    
    Args:
        task_id: Processing task ID
        project_id: Project ID
        reference_url: URL to reference video
    """
    db = SessionLocal()
    
    try:
        task = db.query(ProcessingTask).filter(ProcessingTask.id == task_id).first()
        if not task:
            return
        
        task.status = ProcessingStatusEnum.PROCESSING
        task.progress = 10
        db.commit()
        
        logger.info(f"Starting reference clone processing for task {task_id}")
        
        # Step 1: Download and analyze reference (30%)
        self.update_state(state='PROGRESS', meta={'current': 30})
        style_detector = StyleDetector()
        reference_style = style_detector.extract_style_from_url(reference_url)
        
        # Step 2: Analyze user's video (50%)
        self.update_state(state='PROGRESS', meta={'current': 50})
        analyzer = VideoAnalyzer()
        video = db.query(Video).filter(Video.project_id == project_id).first()
        if video:
            user_video_analysis = analyzer.analyze(video.url)
        
        # Step 3: Apply reference style (80%)
        self.update_state(state='PROGRESS', meta={'current': 80})
        # Mock: Apply style parameters
        edit_instructions = {
            "reference_style": reference_style,
            "bpm": reference_style.get("estimated_bpm"),
            "color_grading": reference_style.get("color_grading"),
        }
        
        # Step 4: Render (100%)
        self.update_state(state='PROGRESS', meta={'current': 100})
        output_path = f"/tmp/output_{task_id}.mp4"
        
        task.status = ProcessingStatusEnum.COMPLETED
        task.progress = 100
        task.result_url = output_path
        db.commit()
        
        logger.info(f"Completed reference clone processing for task {task_id}")
        
        return {
            "status": "completed",
            "task_id": task_id,
            "output_url": output_path,
        }
    
    except Exception as e:
        logger.error(f"Error processing video: {str(e)}")
        task.status = ProcessingStatusEnum.FAILED
        task.error_message = str(e)
        db.commit()
        return {"status": "failed", "error": str(e)}
    
    finally:
        db.close()
