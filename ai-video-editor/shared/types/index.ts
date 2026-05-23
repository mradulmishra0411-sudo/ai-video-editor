/**
 * Shared TypeScript types for AI Video Editor
 * Used across frontend and backend for type safety
 */

// Video types
export interface Video {
  id: string
  projectId: string
  title: string
  url: string
  thumbnailUrl?: string
  duration: number
  size: number
  status: 'uploaded' | 'processing' | 'completed' | 'failed'
  metadata?: Record<string, any>
  createdAt: string
}

export interface VideoAnalysis {
  duration: number
  resolution: {
    width: number
    height: number
  }
  fps: number
  isVertical: boolean
  motionIntensity: number
  sceneChanges: SceneChange[]
}

export interface SceneChange {
  timestamp: number
  confidence: number
}

// Project types
export interface Project {
  id: string
  userId: string
  name: string
  description?: string
  status: 'draft' | 'editing' | 'completed'
  videos: Video[]
  createdAt: string
  updatedAt: string
}

// Processing types
export interface ProcessingTask {
  taskId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  estimatedTime?: number
}

export interface ProcessingRequest {
  projectId: string
  mode: 'global' | 'reference'
  prompt?: string
  referenceUrl?: string
}

export interface StylePreset {
  id: string
  name: string
  bpm: number
  cutFrequency: number
  transitionType: string
  duration: number
}

export interface AudioAnalysis {
  bpm: number
  confidence: number
  timeSignature: string
  beats: number[]
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  error: string
  detail?: string
  statusCode: number
}
