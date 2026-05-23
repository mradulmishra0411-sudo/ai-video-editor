# ✅ Setup Checklist - AI Video Editor

Use this checklist to ensure your development environment is properly configured.

## 📋 Prerequisites

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm/yarn installed (`npm --version`)
- [ ] Python 3.10+ installed (`python --version`)
- [ ] Git installed (`git --version`)
- [ ] Docker installed (optional but recommended) (`docker --version`)
- [ ] PostgreSQL 13+ (if running locally) (`psql --version`)
- [ ] Redis 7+ (if running local dev) (`redis-cli --version`)

## 🗂️ Project Setup

- [ ] Navigate to project: `cd C:\Users\abha7\OneDrive\Desktop\potfolio\ai-video-editor`
- [ ] Project opened in VS Code
- [ ] `.gitignore` file is in place
- [ ] All directories created (checked via file explorer or terminal)

## 🔐 Environment Configuration

### Backend
- [ ] Copied `backend/.env.example` to `backend/.env`
- [ ] Added `SHOTSTACK_API_KEY` (from https://shotstack.io)
- [ ] Added `OPENAI_API_KEY` (from https://platform.openai.com)
- [ ] Added `GOOGLE_API_KEY` (from https://console.cloud.google.com)
- [ ] Added `AWS_S3_BUCKET` details (if using AWS)
- [ ] Set `DATABASE_URL` to PostgreSQL connection string
- [ ] Set `REDIS_URL` to Redis connection
- [ ] Changed `SECRET_KEY` to a random secure string

### Frontend
- [ ] Copied `frontend/.env.example` to `frontend/.env.local`
- [ ] Set `NEXT_PUBLIC_API_URL=http://localhost:8000` (or your backend URL)
- [ ] Verified other environment variables

## 🐳 Docker Setup (If Using Docker)

- [ ] Docker Desktop installed and running
- [ ] `docker-compose.yml` file present and valid
- [ ] Images are building without errors
- [ ] All containers starting successfully

## 💾 Backend Setup (Local Development)

- [ ] Python virtual environment created: `python -m venv venv`
- [ ] Virtual environment activated
- [ ] Dependencies installed: `pip install -r requirements.txt`
- [ ] PostgreSQL database created: `createdb ai_video_editor`
- [ ] Database connection string in `.env` is correct
- [ ] Redis server running (locally or Docker)

## 🎨 Frontend Setup (Local Development)

- [ ] Node dependencies installed: `npm install`
- [ ] No dependency conflicts or warnings
- [ ] `next.config.js` properly configured
- [ ] `tailwind.config.ts` ready
- [ ] PostCSS configuration complete

## 🚀 Server Startup

### Docker Approach
- [ ] Run: `docker-compose up --build`
- [ ] Wait for all services to be healthy
- [ ] No container restart loops

### Local Approach - Frontend
- [ ] Run: `npm run dev` in `frontend/` directory
- [ ] Accessible at http://localhost:3000
- [ ] No build errors in console

### Local Approach - Backend
- [ ] Run: `python -m uvicorn app.main:app --reload`
- [ ] API accessible at http://localhost:8000
- [ ] Swagger UI at http://localhost:8000/docs

### Local Approach - Workers
- [ ] Redis running successfully
- [ ] Celery worker running: `celery -A app.tasks.video_processing worker --loglevel=info`
- [ ] No connection errors

## 🌐 Verification

- [ ] Frontend loads at http://localhost:3000
- [ ] Backend API responds at http://localhost:8000
- [ ] Swagger/OpenAPI docs at http://localhost:8000/docs
- [ ] No CORS errors in browser console
- [ ] API client can communicate with backend

## 📝 Testing

- [ ] Tested `/health` endpoint: `curl http://localhost:8000/health`
- [ ] Created a test project via API
- [ ] Uploaded a test video file
- [ ] Processing endpoints respond correctly
- [ ] No validation errors with test data

## 📚 Documentation

- [ ] Read `QUICKSTART.md` for quick reference
- [ ] Read `PROJECT_COMPLETION.md` for complete overview
- [ ] Reviewed `docs/SETUP.md` for detailed setup steps
- [ ] Reviewed `docs/API.md` for endpoint reference
- [ ] Reviewed `docs/ARCHITECTURE.md` for system design

## 🔧 Configuration Verification

- [ ] Backend `.env` file has all required keys (not in git)
- [ ] Frontend `.env.local` file configured (not in git)
- [ ] All API keys are valid and not expired
- [ ] Database credentials are correct
- [ ] Redis connection is working
- [ ] File upload directory is writable

## 🎯 Development Ready

- [ ] VS Code extensions installed (optional):
  - [ ] ESLint
  - [ ] Prettier
  - [ ] Tailwind CSS Intellisense
  - [ ] Python
  - [ ] Pylance

- [ ] Git initialized (if not already): `git init`
- [ ] Initial commit made: `git add . && git commit -m "Initial commit"`
- [ ] Remote repository connected (if applicable)

## 🚢 Pre-Deployment

- [ ] All sensitive data in `.env` files (not committed)
- [ ] `ENVIRONMENT=development` in `.env` (change to `production` for deploy)
- [ ] `DEBUG=False` in production `.env`
- [ ] Changed `SECRET_KEY` to production-safe value
- [ ] Database backups configured
- [ ] Logging configured for debugging
- [ ] Error tracking (Sentry) configured (optional)

## 📊 Performance & Security

- [ ] CORS properly configured (not allowing all origins in production)
- [ ] Rate limiting implemented
- [ ] Authentication endpoints secured
- [ ] API keys not exposed in client-side code
- [ ] Database queries optimized (indexes created)
- [ ] Redis caching configured

## ✨ Final Checks

- [ ] Run `npm run lint` (frontend)
- [ ] Run `pytest` (backend)
- [ ] Check for console errors/warnings
- [ ] Verify all features work in browser
- [ ] Test on mobile device (responsive design)
- [ ] Performance check: Network tab clean, no 404s

## 🎉 You're Ready!

Once all checkboxes are ticked, your development environment is fully configured!

### Next Steps:
1. **Start coding** - Implement new features
2. **Test thoroughly** - Upload videos, process them
3. **Deploy** - Push to Vercel (frontend) and Render/Railway (backend)
4. **Monitor** - Set up logging and error tracking

---

## 📞 Troubleshooting Checklist

If something isn't working, check these:

### Frontend Issues
- [ ] Node.js version is 18+
- [ ] `node_modules` folder deleted, `npm install` re-run
- [ ] Browser cache cleared
- [ ] API URL in `.env.local` matches backend address
- [ ] No TypeScript compilation errors

### Backend Issues
- [ ] Python version is 3.10+
- [ ] Virtual environment is activated
- [ ] All dependencies installed: `pip install -r requirements.txt`
- [ ] PostgreSQL server running
- [ ] Database exists: `psql -l`
- [ ] Redis server running: `redis-cli ping`

### Docker Issues
- [ ] Docker Desktop running
- [ ] No port conflicts (3000, 8000, 5432, 6379)
- [ ] Volumes mounted correctly
- [ ] Environment files in correct locations
- [ ] `docker-compose down -v` to reset everything

### Database Issues
- [ ] PostgreSQL running and accessible
- [ ] Database created: `ai_video_editor`
- [ ] Connection string correct in `.env`
- [ ] User has proper permissions
- [ ] No migration issues

---

**Mark this checklist complete when all items are verified! ✅**
