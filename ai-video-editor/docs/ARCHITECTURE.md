# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Next.js Frontend (React 18, TypeScript, Tailwind CSS)   │   │
│  │  ├─ Dashboard (Upload, Project Management)              │   │
│  │  ├─ Editor (Timeline, Preview, Controls)                │   │
│  │  └─ Real-time Status Updates (Socket.io)               │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            ↓ HTTPS/WS
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                             │
│  (CORS, Rate Limiting, Auth Middleware)                         │
└─────────────────────────────────────────────────────────────────┘
                            ↓ HTTP
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND API LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  FastAPI Server (Python 3.11, Async)                    │   │
│  │  ├─ Auth Routes (Login, Signup, Token)                  │   │
│  │  ├─ Projects Routes (CRUD)                              │   │
│  │  ├─ Videos Routes (Upload, Analyze, Download)          │   │
│  │  └─ Processing Routes (Start, Status, Cancel)          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─ Services Layer ────────────────────────────────────────┐   │
│  │ ├─ VideoAnalyzer (CV, metadata extraction)             │   │
│  │ ├─ StyleDetector (Trend analysis, reference parsing)   │   │
│  │ ├─ BeatMatcher (Audio sync, cut alignment)            │   │
│  │ ├─ ShotstackService (Cloud rendering API)             │   │
│  │ └─ AIService (Claude Vision, Gemini integration)      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                      ↓ Database ↓ Cache
┌─────────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                    │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  PostgreSQL      │  │   Redis Cache    │  │  AWS S3      │  │
│  │  ├─ Users        │  │  ├─ Sessions     │  │  ├─ Videos   │  │
│  │  ├─ Projects     │  │  ├─ Tasks Queue  │  │  ├─ Processed│  │
│  │  ├─ Videos       │  │  └─ Cached Data  │  │  └─ Metadata │  │
│  │  └─ Tasks        │  │                  │  │              │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ↓ Async Tasks
┌─────────────────────────────────────────────────────────────────┐
│              BACKGROUND PROCESSING LAYER                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Celery Workers (Video Processing Jobs)                 │   │
│  │  ├─ Global Trend Processing                             │   │
│  │  ├─ Reference Style Cloning                             │   │
│  │  ├─ Audio Analysis & Beat Detection                     │   │
│  │  └─ Video Rendering & Output                            │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Video Upload & Processing Flow

```
1. USER UPLOADS VIDEO
   │
   ├─→ Frontend validates file (type, size)
   ├─→ POST /api/videos/upload
   └─→ Backend saves to temp storage
        ├─→ Analyzes metadata (duration, resolution, etc.)
        ├─→ Creates Video & Project records
        └─→ Returns videoId & projectId

2. USER INITIATES PROCESSING
   │
   ├─→ Selects editing mode (Global or Reference)
   ├─→ Provides context (prompt or URL)
   ├─→ POST /api/processing/start
   └─→ Backend creates ProcessingTask
        ├─→ Queues Celery job
        └─→ Returns taskId for tracking

3. ASYNC PROCESSING (Celery Worker)
   │
   ├─→ ANALYZE PHASE (10-30%)
   │   ├─→ Extract video metadata (CV)
   │   ├─→ Detect scenes, motion, faces
   │   └─→ Analyze audio (if available)
   │
   ├─→ STYLE DETECTION (30-50%)
   │   ├─→ For Global: Analyze current trends
   │   └─→ For Reference: Download & analyze reference video
   │
   ├─→ BEAT MATCHING (50-70%)
   │   ├─→ Extract beats from audio
   │   ├─→ Align cuts to beat timestamps
   │   └─→ Generate sync points
   │
   ├─→ EDIT GENERATION (70-90%)
   │   ├─→ Create edit instructions
   │   ├─→ Add transitions, effects, text
   │   └─→ Select music & SFX
   │
   └─→ RENDERING (90-100%)
       ├─→ Call Shotstack API OR use FFmpeg
       ├─→ Generate output MP4
       ├─→ Upload to S3
       └─→ Update Video status to "completed"

4. REAL-TIME STATUS UPDATES
   │
   ├─→ WebSocket connection maintains status
   ├─→ Celery task emits progress events
   ├─→ Frontend displays progress bar
   └─→ User notified when complete

5. DOWNLOAD PROCESSED VIDEO
   │
   ├─→ GET /api/videos/{videoId}/download
   └─→ Stream processed MP4 from S3
```

## Technology Stack Details

### Frontend (Next.js)

**Key Libraries:**
- React 18.2 - UI framework
- Next.js 14 - Full-stack framework with App Router
- TypeScript - Type safety
- Tailwind CSS - Styling
- Zustand - State management (lightweight)
- React Hook Form + Zod - Form validation
- React Query (@tanstack/react-query) - Data fetching & caching
- Socket.io-client - Real-time updates
- Axios - HTTP client

**Architecture:**
- App Router structure (pages, api routes)
- Component-based UI
- Centralized state management
- API client abstraction layer
- Custom hooks for reusability

### Backend (FastAPI)

**Key Libraries:**
- FastAPI - Async web framework
- Uvicorn - ASGI server
- SQLAlchemy - ORM
- Pydantic - Data validation & serialization
- Celery - Distributed task queue
- Redis - Message broker & cache
- Python-jose - JWT token generation

**Architecture:**
- RESTful API design
- Dependency injection (FastAPI)
- Async handlers for I/O operations
- Service layer for business logic
- Celery workers for background jobs
- SQLAlchemy ORM for database

### Video Processing

**Computer Vision:**
- OpenCV (cv2) - Video analysis, frame extraction
- librosa - Audio analysis, beat detection
- scikit-learn - Motion detection, clustering

**AI Integration:**
- OpenAI Whisper API - Speech-to-text for captions
- Claude Vision API - Scene understanding
- Google Gemini Pro Video - Video analysis

**Video Editing:**
- Shotstack API - Cloud-based rendering (primary)
- FFmpeg - Local video encoding (fallback)
- librosa + soundfile - Audio processing

### Database Schema

```sql
-- Users
users {
  id: UUID (PK),
  email: VARCHAR (UNIQUE),
  username: VARCHAR (UNIQUE),
  hashed_password: VARCHAR,
  is_active: BOOLEAN,
  created_at: TIMESTAMP
}

-- Projects
projects {
  id: UUID (PK),
  user_id: UUID (FK → users),
  name: VARCHAR,
  description: TEXT,
  status: VARCHAR (draft, editing, completed),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}

-- Videos
videos {
  id: UUID (PK),
  project_id: UUID (FK → projects),
  title: VARCHAR,
  description: TEXT,
  url: VARCHAR (S3 path),
  thumbnail_url: VARCHAR,
  duration: INTEGER (seconds),
  size: INTEGER (bytes),
  status: VARCHAR (uploaded, processing, completed, failed),
  metadata: JSON,
  created_at: TIMESTAMP
}

-- Processing Tasks
processing_tasks {
  id: UUID (PK),
  project_id: UUID (FK → projects),
  video_id: UUID (FK → videos),
  task_type: VARCHAR (global_trend, reference_clone),
  status: ENUM (pending, processing, completed, failed),
  progress: INTEGER (0-100),
  result_url: VARCHAR (S3 path to output),
  error_message: TEXT,
  parameters: JSON (prompt or reference_url),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

## Scalability Considerations

### Horizontal Scaling
- **Frontend**: Deploy to Vercel (global CDN)
- **Backend**: Multiple FastAPI instances behind load balancer
- **Workers**: Scale Celery workers based on queue depth
- **Database**: Read replicas for analytics queries
- **Cache**: Redis cluster for high availability

### Performance Optimizations
- Video compression before processing
- Chunked uploads for large files
- CDN caching for static assets
- Database query optimization with indexes
- Async processing to avoid blocking

### Monitoring & Observability
- Sentry for error tracking
- LogRocket for frontend monitoring
- Prometheus for metrics
- ELK Stack for centralized logging
- APM for performance tracing
