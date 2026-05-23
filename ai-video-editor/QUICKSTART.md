# 🚀 Quick Start - AI Video Editor

## Start Here!

### 1️⃣ Navigate to Project
```bash
cd C:\Users\abha7\OneDrive\Desktop\potfolio\ai-video-editor
```

### 2️⃣ Configure Environment (Required!)
```bash
# Backend
copy backend\.env.example backend\.env

# Frontend  
copy frontend\.env.example frontend\.env.local
```

**Edit `backend\.env` and add your API keys:**
```
SHOTSTACK_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
GOOGLE_API_KEY=your_key_here
AWS_S3_BUCKET=your_bucket
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_key
```

### 3️⃣ Start Application

#### Option A: Docker (Easy)
```bash
# Install frontend dependencies
cd frontend && npm install && cd ..

# Start everything
docker-compose up --build
```

#### Option B: Local Development
```bash
# Terminal 1 - Frontend
cd frontend
npm install
npm run dev

# Terminal 2 - Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload

# Terminal 3 - Redis (if not using Docker)
redis-server

# Terminal 4 - Celery Worker
cd backend
celery -A app.tasks.video_processing worker --loglevel=info
```

### 4️⃣ Access Application

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Upload & edit videos |
| **Backend API** | http://localhost:8000 | REST API server |
| **API Docs** | http://localhost:8000/docs | Interactive API testing |

---

## 📖 Documentation

- **Full Setup Guide**: `docs/SETUP.md`
- **API Reference**: `docs/API.md`
- **System Architecture**: `docs/ARCHITECTURE.md`
- **Project Completion**: `PROJECT_COMPLETION.md`

---

## 🎯 Test the Features

### 1. Upload a Video
```
1. Go to http://localhost:3000
2. Drag & drop a video file (MP4, MOV, AVI, MKV)
3. Watch real-time upload progress
```

### 2. Process with Global Trend
```
1. After upload, select "Global Trend" mode
2. Enter prompt: "Make it a cinematic travel reel"
3. Click "Start Processing"
4. Watch progress update in real-time
```

### 3. Test API Directly
```bash
# Get API documentation
curl http://localhost:8000/docs

# Or use Postman/Insomnia with the API spec
```

---

## 🛠️ Common Commands

```bash
# Frontend
cd frontend
npm install        # Install dependencies
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint       # Check code quality
npm run test       # Run tests

# Backend
cd backend
pip install -r requirements.txt    # Install dependencies
python -m uvicorn app.main:app --reload  # Start server
celery -A app.tasks.video_processing worker --loglevel=info  # Start worker
pytest             # Run tests

# Docker
docker-compose up          # Start all services
docker-compose down        # Stop all services
docker-compose logs -f     # View logs
docker-compose build       # Rebuild images
```

---

## 📁 Project Structure at a Glance

```
ai-video-editor/
├── frontend/               # Next.js React application
│   ├── app/               # Pages & layouts
│   ├── components/        # React components
│   ├── lib/              # Utilities, API client, hooks
│   └── store/            # Zustand state management
├── backend/               # Python FastAPI server
│   ├── app/
│   │   ├── api/routes/   # API endpoints
│   │   ├── services/     # Business logic
│   │   ├── tasks/        # Celery async jobs
│   │   └── models/       # Database schemas
│   └── requirements.txt
├── docs/                  # Documentation
├── docker-compose.yml     # Docker orchestration
└── README.md
```

---

## ⚡ API Quick Reference

### Upload Video
```bash
curl -X POST http://localhost:8000/api/videos/upload \
  -F "file=@video.mp4"
```

### Start Processing (Global)
```bash
curl -X POST http://localhost:8000/api/processing/start \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "proj_123",
    "mode": "global",
    "prompt": "cinematic travel reel"
  }'
```

### Check Processing Status
```bash
curl http://localhost:8000/api/processing/task_123/status
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change frontend port
npm run dev -- -p 3001

# Change backend port
python -m uvicorn app.main:app --port 8001
```

### PostgreSQL Connection Error
```bash
# Check if PostgreSQL is running
psql --version

# Or use Docker for database
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:15
```

### Module Not Found
```bash
# Frontend
cd frontend && rm -rf node_modules && npm install

# Backend
cd backend && rm -rf venv && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt
```

### Docker Issues
```bash
# Clear everything and restart
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

---

## 📚 Technology Stack

**Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Zustand  
**Backend**: FastAPI, Python 3.10+, SQLAlchemy, Celery  
**Database**: PostgreSQL, Redis  
**Video APIs**: Shotstack, OpenAI, Google Gemini  
**Storage**: AWS S3  
**Deployment**: Docker, Vercel, Render/Railway  

---

## 🎓 Next Steps

1. ✅ Set up environment variables
2. ✅ Start the application (Docker or local)
3. ✅ Test uploading a video
4. ✅ Try both editing modes
5. ✅ Integrate real API keys
6. ✅ Add authentication
7. ✅ Deploy to production

---

## 📞 Need Help?

- 📖 Check `docs/` folder for detailed guides
- 🔌 View API docs at http://localhost:8000/docs
- 💬 Review code comments in source files
- 🔍 Check `.github/copilot-instructions.md` for coding standards

---

**You're all set! Start building your AI Video Editor! 🎬✨**
