# API Documentation

## Base URL
- **Development**: `http://localhost:8000`
- **Production**: `https://api.aivideoeditor.com` (to be deployed)

## Authentication
All endpoints require JWT token in the `Authorization` header:
```
Authorization: Bearer {token}
```

---

## Endpoints

### Authentication

#### POST `/api/auth/login`
User login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

#### POST `/api/auth/signup`
User registration.

---

### Projects

#### POST `/api/projects`
Create a new project.

**Request:**
```json
{
  "name": "My Amazing Travel Reel",
  "description": "A cinematic travel video"
}
```

**Response (201):**
```json
{
  "id": "proj_abc123",
  "user_id": "user_123",
  "name": "My Amazing Travel Reel",
  "status": "draft",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

#### GET `/api/projects/{project_id}`
Get project details.

**Response (200):**
```json
{
  "id": "proj_abc123",
  "user_id": "user_123",
  "name": "My Amazing Travel Reel",
  "status": "draft",
  "videos": [
    {
      "id": "vid_123",
      "title": "raw_footage.mp4",
      "duration": 120,
      "status": "uploaded"
    }
  ],
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### GET `/api/projects?skip=0&limit=10`
List all projects with pagination.

---

### Videos

#### POST `/api/videos/upload`
Upload a raw video file.

**Multipart form data:**
- `file`: Video file (MP4, MOV, AVI, MKV)
- `project_id`: (Optional) Project ID to assign video to

**Response (200):**
```json
{
  "videoId": "vid_abc123",
  "projectId": "proj_abc123",
  "filename": "raw_footage.mp4",
  "duration": 120,
  "size": 52428800
}
```

#### GET `/api/videos/{video_id}`
Get video details.

**Response (200):**
```json
{
  "id": "vid_abc123",
  "project_id": "proj_abc123",
  "title": "raw_footage.mp4",
  "url": "https://s3.amazonaws.com/...",
  "duration": 120,
  "status": "uploaded",
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### POST `/api/videos/{video_id}/analyze`
Analyze video content (CV, metadata, motion detection).

**Response (200):**
```json
{
  "videoId": "vid_abc123",
  "analysis": {
    "duration": 120,
    "resolution": {"width": 1920, "height": 1080},
    "fps": 30,
    "is_vertical": false,
    "motion_intensity": 0.75,
    "scene_changes": [...]
  }
}
```

#### GET `/api/videos/{video_id}/download`
Download processed video (only if status is "completed").

---

### Processing

#### POST `/api/processing/start`
Start video processing with AI editing.

**Request:**
```json
{
  "project_id": "proj_abc123",
  "mode": "global",
  "prompt": "Make it a cinematic nature travel reel with upbeat music"
}
```

Or for reference mode:
```json
{
  "project_id": "proj_abc123",
  "mode": "reference",
  "reference_url": "https://www.instagram.com/p/ABC123"
}
```

**Response (200):**
```json
{
  "task_id": "task_abc123",
  "status": "pending",
  "progress": 0,
  "estimated_time": 300
}
```

#### GET `/api/processing/{task_id}/status`
Get processing task status and progress.

**Response (200):**
```json
{
  "task_id": "task_abc123",
  "status": "processing",
  "progress": 45,
  "estimated_time": 120
}
```

Possible status values: `pending`, `processing`, `completed`, `failed`

#### GET `/api/processing/{task_id}/cancel`
Cancel a processing task.

**Response (200):**
```json
{
  "status": "cancelled"
}
```

---

## Error Responses

All errors follow a standard format:

**Response (4xx/5xx):**
```json
{
  "error": "Error message",
  "detail": "Detailed error explanation",
  "status_code": 400
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (missing/invalid token)
- `404`: Not Found
- `500`: Internal Server Error

---

## WebSocket (Real-time Updates)

Connect to WebSocket for real-time processing updates:

```
WS: ws://localhost:8000/ws/processing/{task_id}
```

**Message format:**
```json
{
  "type": "progress_update",
  "task_id": "task_abc123",
  "progress": 50,
  "status": "processing",
  "timestamp": "2024-01-15T10:35:00Z"
}
```

---

## Rate Limiting

- **Free Tier**: 100 requests/hour
- **Pro Tier**: 1000 requests/hour
- **Enterprise**: Unlimited

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1642231200
```

---

## Example Usage

### Complete Workflow

```bash
# 1. Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# 2. Create project
curl -X POST http://localhost:8000/api/projects \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Travel Reel",
    "description": "Cinematic travel video"
  }'

# 3. Upload video
curl -X POST http://localhost:8000/api/videos/upload \
  -H "Authorization: Bearer {token}" \
  -F "file=@raw_footage.mp4" \
  -F "project_id=proj_abc123"

# 4. Start processing
curl -X POST http://localhost:8000/api/processing/start \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "proj_abc123",
    "mode": "global",
    "prompt": "Make it cinematic"
  }'

# 5. Check status
curl -X GET http://localhost:8000/api/processing/task_abc123/status \
  -H "Authorization: Bearer {token}"

# 6. Download when complete
curl -X GET http://localhost:8000/api/videos/vid_abc123/download \
  -H "Authorization: Bearer {token}" \
  -o processed_video.mp4
```
