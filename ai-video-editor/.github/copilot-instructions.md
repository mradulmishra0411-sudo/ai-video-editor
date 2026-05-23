<!-- GitHub Copilot Custom Instructions for AI Video Editor Project -->

# AI Video Editor - Project Guidelines

## Project Overview
Production-ready AI Video Editor with:
- Next.js frontend (React 18, TypeScript, Tailwind CSS)
- Python FastAPI backend with async processing
- Docker containerization for easy deployment
- PostgreSQL + Redis for data and caching
- Celery workers for background video processing

## Technology Stack

### Frontend
- Next.js 14+ with App Router
- React 18, TypeScript, Tailwind CSS
- Zustand for state management
- React Query for data fetching
- React Hook Form + Zod for validation

### Backend
- Python 3.10+, FastAPI, Uvicorn
- SQLAlchemy ORM, PostgreSQL
- Celery + Redis for async tasks
- Pydantic for data validation

### APIs & Services
- Shotstack API for video rendering
- OpenAI Whisper/Vision for AI features
- Google Gemini for video analysis
- AWS S3 for video storage

## Key Features

1. **Dual Editing Modes**
   - Global Trend: Auto-detect viral pacing
   - Reference Link: Clone style from URL

2. **AI Video Processing**
   - Computer Vision analysis
   - Beat matching and synchronization
   - Automated audio ducking
   - Trending music integration

3. **User Interface**
   - Minimalist dark theme
   - Upload zone with drag-drop
   - Real-time progress tracking
   - Preview player with timeline

## Development Practices

### Code Quality
- Use TypeScript for type safety
- Follow ESLint/Pylint standards
- Test critical paths (API routes, services)
- Document API endpoints in docs/API.md

### Naming Conventions
- Components: PascalCase (UploadZone.tsx)
- Files: kebab-case or PascalCase (matching default)
- Functions: camelCase
- Database tables: snake_case (videos, processing_tasks)
- Constants: UPPER_SNAKE_CASE

### Folder Structure
```
frontend/
├── app/                  # Next.js pages
├── components/           # Reusable React components
├── lib/                  # Utilities, API client, hooks
├── store/                # Zustand stores
└── public/               # Static assets

backend/
├── app/
│   ├── api/routes/       # API endpoints
│   ├── services/         # Business logic
│   ├── models/           # Database schemas & Pydantic models
│   ├── tasks/            # Celery async tasks
│   ├── core/             # Configuration
│   └── db/               # Database setup
├── tests/                # Test files
└── requirements.txt      # Python dependencies
```

### Environment Setup
- Copy `.env.example` to `.env` and fill in API keys
- Use `docker-compose up` for complete stack
- For local dev: run backend, frontend, Redis, PostgreSQL separately

## Common Tasks

### Adding a New API Endpoint
1. Create route in `backend/app/api/routes/` (e.g., `new_feature.py`)
2. Create Pydantic models in `backend/app/models/schemas.py`
3. Add service logic in `backend/app/services/`
4. Include router in `backend/app/main.py`
5. Update API docs in `docs/API.md`
6. Create frontend hook in `frontend/lib/hooks/`

### Adding a New Frontend Page
1. Create directory in `frontend/app/`
2. Create `page.tsx` with route component
3. Create related components in `frontend/components/`
4. Create custom hook if needed in `frontend/lib/hooks/`
5. Import and use in the page

### Starting Background Processing
1. Define Celery task in `backend/app/tasks/`
2. Call task from API route using `.delay()` or `.apply_async()`
3. Update processing task status in database
4. Frontend polls `/api/processing/{task_id}/status`

## Deployment

### Frontend (Vercel)
```bash
vercel login
vercel --prod
```

### Backend (Render/Railway)
- Push to GitHub
- Connect repository
- Set environment variables
- Deploy

### Docker Production
```bash
docker-compose -f docker-compose.yml up -d
```

## Debugging Tips

### Backend Issues
- Check logs: `docker-compose logs -f backend`
- Verify database: `psql -U postgres ai_video_editor`
- Test Celery: `celery -A app.tasks inspect active`

### Frontend Issues
- Clear cache: `rm -rf .next`
- Check Network tab in DevTools
- Verify API_URL matches backend address

### Docker Issues
- Rebuild: `docker-compose build --no-cache`
- Reset data: `docker-compose down -v`
- Shell access: `docker-compose exec backend bash`

## Performance Optimization

- Video compression before processing
- Database indexes on frequently queried fields
- Redis caching for API responses
- Celery workers scaling based on queue
- CDN for frontend assets (Vercel automatic)

## Security Checklist

- [ ] Change SECRET_KEY in production
- [ ] Set ENVIRONMENT=production
- [ ] Use HTTPS/TLS
- [ ] Store API keys in vault (not .env)
- [ ] Enable CORS whitelist (not *)
- [ ] Rate limiting on all endpoints
- [ ] Regular dependency updates

## Testing

```bash
# Backend tests
cd backend && pytest

# Frontend tests
cd frontend && npm run test
```

## Resources

- Docs: [docs/](./docs/)
- API Spec: [docs/API.md](./docs/API.md)
- Setup Guide: [docs/SETUP.md](./docs/SETUP.md)
- Architecture: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## Version Control

- Branch naming: `feature/`, `bugfix/`, `hotfix/`
- Commit messages: Conventional commits (feat:, fix:, docs:, etc.)
- PR reviews required before merge
- Keep main branch stable and deployable
