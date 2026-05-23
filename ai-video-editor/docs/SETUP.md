# Setup & Installation Guide

## Prerequisites

- **Node.js**: 18+ and npm
- **Python**: 3.10+
- **Docker & Docker Compose**: Latest version
- **PostgreSQL**: 13+ (if running locally)
- **Redis**: 7+ (if running locally)
- **Git**: Latest version

## Quick Start (Docker Recommended)

### 1. Clone & Navigate
```bash
cd ai-video-editor
```

### 2. Create Environment Files

**Backend (.env):**
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and fill in API keys:
```
SHOTSTACK_API_KEY=your_key
OPENAI_API_KEY=your_key
GOOGLE_API_KEY=your_key
AWS_S3_BUCKET=your_bucket
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_key
```

**Frontend (.env.local):**
```bash
cp frontend/.env.example frontend/.env.local
```

### 3. Build & Run with Docker
```bash
# Install frontend dependencies
cd frontend
npm install
cd ..

# Start all services
docker-compose up --build
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Swagger UI: http://localhost:8000/redoc

---

## Local Development (Without Docker)

### Backend Setup

#### 1. Python Environment
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 2. Database Setup
```bash
# Create PostgreSQL database
createdb ai_video_editor

# Set DATABASE_URL in .env
DATABASE_URL=postgresql://username:password@localhost:5432/ai_video_editor
```

#### 3. Redis Setup
```bash
# Start Redis (macOS with Homebrew)
brew services start redis

# Or with Docker:
docker run -d -p 6379:6379 redis:7
```

#### 4. Run FastAPI Server
```bash
# From backend directory
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at: http://localhost:8000

#### 5. Run Celery Worker (in another terminal)
```bash
# From backend directory
celery -A app.tasks.video_processing worker --loglevel=info
```

---

### Frontend Setup

#### 1. Install Dependencies
```bash
cd frontend
npm install
```

#### 2. Run Development Server
```bash
npm run dev
```

Frontend will be available at: http://localhost:3000

#### 3. Build for Production
```bash
npm run build
npm start
```

---

## Configuration

### API Keys Required

1. **Shotstack** (Video Rendering)
   - Get API key: https://shotstack.io
   - Set: `SHOTSTACK_API_KEY`

2. **OpenAI** (Whisper, Vision)
   - Get API key: https://platform.openai.com
   - Set: `OPENAI_API_KEY`

3. **Google** (Gemini, YouTube API)
   - Get API key: https://console.cloud.google.com
   - Set: `GOOGLE_API_KEY`

4. **AWS S3** (Video Storage)
   - Create S3 bucket
   - Create IAM user with S3 permissions
   - Set: `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`

### Environment Variables

#### Backend (.env)
```
# App
ENVIRONMENT=development
DEBUG=True

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/ai_video_editor

# Redis
REDIS_URL=redis://localhost:6379/0

# API Keys
SHOTSTACK_API_KEY=your_key
OPENAI_API_KEY=your_key
GOOGLE_API_KEY=your_key

# AWS S3
AWS_S3_BUCKET=your_bucket
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_key
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=AI Video Editor
```

---

## Database Migrations

### Using Alembic

```bash
cd backend

# Create initial migration
alembic init migrations

# Auto-generate migration
alembic revision --autogenerate -m "Initial schema"

# Apply migrations
alembic upgrade head

# Rollback to previous version
alembic downgrade -1
```

---

## Testing

### Backend Tests
```bash
cd backend
pytest --verbose
pytest --cov=app  # With coverage
```

### Frontend Tests
```bash
cd frontend
npm run test
npm run test:watch  # Watch mode
```

---

## Docker Commands

```bash
# Build services
docker-compose build

# Start services (foreground)
docker-compose up

# Start services (background)
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f celery_worker

# Stop services
docker-compose down

# Remove volumes (reset database)
docker-compose down -v

# Enter container shell
docker-compose exec backend bash
docker-compose exec frontend sh
```

---

## Troubleshooting

### Backend Issues

**ModuleNotFoundError: No module named 'app'**
```bash
# Ensure you're in the backend directory
cd backend
# And using the venv
source venv/bin/activate
```

**PostgreSQL Connection Error**
```bash
# Check PostgreSQL is running
psql --version
# Update DATABASE_URL with correct credentials
```

**Redis Connection Error**
```bash
# Check Redis is running
redis-cli ping
# Should return: PONG
```

### Frontend Issues

**Port 3000 Already in Use**
```bash
npm run dev -- -p 3001  # Use different port
```

**Next.js Build Issues**
```bash
rm -rf .next
npm install
npm run build
```

### Docker Issues

**Container fails to start**
```bash
docker-compose logs backend  # View error logs
docker-compose down -v       # Reset volumes
docker-compose up --build    # Rebuild
```

---

## Deployment

### Frontend (Vercel)

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Backend (Render/Railway)

1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

```bash
# Example for Railway
railway up
```

---

## Performance Optimization

### Frontend
- Enable code splitting: Next.js does this automatically
- Optimize images with `next/image`
- Use dynamic imports for large components
- Implement proper caching headers

### Backend
- Use database query optimization (indexes)
- Cache frequently accessed data in Redis
- Implement rate limiting
- Use connection pooling for PostgreSQL

### Video Processing
- Compress videos before processing
- Use appropriate resolution (720p for short-form)
- Cache intermediate results
- Parallel processing with multiple workers

---

## Security Checklist

- [ ] Change `SECRET_KEY` in production
- [ ] Set `ENVIRONMENT=production`
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS properly
- [ ] Use strong database passwords
- [ ] Store API keys in secure vaults (AWS Secrets Manager, etc.)
- [ ] Enable rate limiting
- [ ] Implement proper authentication/authorization
- [ ] Use environment variables for sensitive data
- [ ] Regular security audits and dependency updates
