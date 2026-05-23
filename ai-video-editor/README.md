# AI Video Editor - Production-Ready Web Application

An intelligent, automated video editing platform that leverages AI to analyze trending content, apply viral editing styles, sync audio to beat patterns, and generate engaging short-form videos optimized for Instagram Reels and YouTube Shorts.

## 🚀 Features

- **Dual Editing Modes**
  - Mode A: Global Trend Analysis - Auto-detect current viral pacing and transitions
  - Mode B: Reference Link - Clone the style of any Instagram Reel or YouTube Shorts video

- **AI-Powered Processing Pipeline**
  - Computer Vision analysis of raw footage
  - Smart B-roll cutting and beat-matching synchronization
  - Automated audio ducking and sound effect integration
  - Trending background music matching

- **Modern UI**
  - Minimalist dark-themed dashboard
  - Intuitive video upload zone
  - Context-aware prompt input (e.g., "Make it a cinematic travel reel")
  - Real-time video preview player

## 📋 Tech Stack

### Frontend
- **Next.js 14+** (React 18, TypeScript, App Router)
- **Tailwind CSS** + Shadcn/ui components
- **Zustand** for state management
- **React Hook Form** + Zod for validation
- **HLS.js** for video playback

### Backend
- **Python FastAPI** - High-performance async API
- **SQLAlchemy** - ORM for PostgreSQL
- **Celery + Redis** - Async task queue
- **Pydantic** - Data validation

### Video Processing
- **Shotstack API** - Cloud video rendering
- **FFmpeg** - Local video encoding
- **librosa** - Audio analysis & beat detection
- **Claude Vision / Gemini Pro Video** - Scene analysis & style detection

### Database & Storage
- **PostgreSQL** - Structured data
- **Redis** - Caching & task queue
- **AWS S3 / Cloudflare R2** - Video storage

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **Vercel** (Frontend) / **Render/Railway** (Backend) - Hosting

## 📁 Project Structure

```
ai-video-editor/
├── frontend/                 # Next.js application
├── backend/                  # FastAPI server
├── shared/                   # Shared types & utilities
├── docs/                     # Documentation
├── docker-compose.yml        # Local development orchestration
└── README.md
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- Docker & Docker Compose
- PostgreSQL 13+
- Redis

### Quick Start with Docker

```bash
# Install dependencies for frontend
cd frontend && npm install && cd ..

# Build and run entire stack
docker-compose up --build
```

**Frontend**: http://localhost:3000  
**Backend API**: http://localhost:8000  
**API Docs**: http://localhost:8000/docs

### Development Setup (Without Docker)

#### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Setup environment
cp .env.example .env

# Run migrations (if using Alembic)
# alembic upgrade head

# Start FastAPI server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 📚 Documentation

- [API Documentation](./docs/API.md) - Complete API endpoints reference
- [Architecture Overview](./docs/ARCHITECTURE.md) - System design and data flow
- [Setup Guide](./docs/SETUP.md) - Detailed installation and configuration

## 🔌 Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=AI Video Editor
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/ai_video_editor
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
SHOTSTACK_API_KEY=your-shotstack-key
OPENAI_API_KEY=your-openai-key
AWS_S3_BUCKET=your-bucket-name
```

## 🏗️ API Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects` | Create new project |
| POST | `/api/videos/upload` | Upload raw video |
| POST | `/api/videos/{id}/analyze` | Analyze video content |
| POST | `/api/processing/start` | Start video processing |
| GET | `/api/processing/{task_id}/status` | Check processing status |
| GET | `/api/videos/{id}/download` | Download processed video |

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd ../frontend
npm run test
```

## 🐳 Docker Commands

```bash
# Build services
docker-compose build

# Start services
docker-compose up

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Remove volumes (reset database)
docker-compose down -v
```

## 📊 Database Schema

Key tables:
- `users` - User accounts and auth
- `projects` - Video editing projects
- `videos` - Raw video uploads
- `processing_tasks` - Async job tracking
- `styles` - Trending edit styles

## 🔐 Security

- JWT-based authentication with OAuth2
- API rate limiting
- Input validation with Pydantic
- CORS configuration for frontend
- Environment-based secrets

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm install -g vercel
vercel
```

### Backend (Render/Railway)
1. Connect GitHub repository
2. Set environment variables
3. Deploy

## 📝 License

MIT

## 👥 Contributing

This is a production-ready reference implementation. Modifications welcome!

## 📞 Support

For issues and questions, refer to the documentation or create an issue in the repository.
