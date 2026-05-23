import axios from 'axios'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Video endpoints
export const videoAPI = {
  upload: (file: File, projectId?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    if (projectId) {
      formData.append('project_id', projectId)
    }
    return api.post('/api/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  
  get: (videoId: string) => api.get(`/api/videos/${videoId}`),
  
  analyze: (videoId: string) => api.post(`/api/videos/${videoId}/analyze`),
  
  download: (videoId: string) => api.get(`/api/videos/${videoId}/download`, {
    responseType: 'blob',
  }),
}

// Project endpoints
export const projectAPI = {
  create: (data: { name: string; description?: string }) =>
    api.post('/api/projects', data),
  
  get: (projectId: string) => api.get(`/api/projects/${projectId}`),
  
  list: (skip: number = 0, limit: number = 10) =>
    api.get('/api/projects', { params: { skip, limit } }),
}

// Processing endpoints
export const processingAPI = {
  start: (data: {
    project_id: string
    mode: 'global' | 'reference'
    prompt?: string
    reference_url?: string
  }) => api.post('/api/processing/start', data),
  
  getStatus: (taskId: string) => api.get(`/api/processing/${taskId}/status`),
  
  cancel: (taskId: string) => api.get(`/api/processing/${taskId}/cancel`),
}

// Auth endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  
  signup: (email: string, password: string) =>
    api.post('/api/auth/signup', { email, password }),
  
  logout: () => api.post('/api/auth/logout'),
}

export default api
