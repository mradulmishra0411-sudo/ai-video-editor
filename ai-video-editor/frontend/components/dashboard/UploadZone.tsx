'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface UploadZoneProps {
  onUploadComplete: (videoId: string, videoDataUrl?: string) => void
}

export default function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [useMockMode, setUseMockMode] = useState(false)

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const simulateMockUpload = useCallback(async (file: File) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 150))
      setUploadProgress(progress)
    }
    setIsUploading(false)
    
    // Read the actual file and create a data URL
    const dataUrl = await readFileAsDataUrl(file)
    const videoId = `project-${Date.now()}`
    
    // Store the uploaded video in localStorage so the editor can load it
    const uploadedVideos = JSON.parse(localStorage.getItem('uploadedVideos') || '{}')
    uploadedVideos[videoId] = {
      name: file.name.replace(/\.[^/.]+$/, ''),
      url: dataUrl,
      size: file.size,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem('uploadedVideos', JSON.stringify(uploadedVideos))
    
    onUploadComplete(videoId, dataUrl)
  }, [onUploadComplete])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setIsUploading(true)
    setUploadProgress(0)

    if (useMockMode) {
      await simulateMockUpload(file)
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('projectName', file.name.replace(/\.[^/.]+$/, ''))

    try {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100
          setUploadProgress(percentComplete)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          setIsUploading(false)
          onUploadComplete(response.videoId)
        }
      })

      xhr.addEventListener('error', () => {
        // Fallback to mock mode on error
        console.log('Backend unavailable, switching to demo mode')
        setUseMockMode(true)
        simulateMockUpload(file)
      })

      xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL}/api/videos/upload`)
      xhr.send(formData)
    } catch (error) {
      console.error('Upload error:', error)
      // Fallback to mock mode
      await simulateMockUpload(file)
    }
  }, [onUploadComplete, useMockMode, simulateMockUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv'],
    },
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-accent bg-accent/10 scale-[1.02]'
            : 'border-muted hover:border-muted-foreground hover:bg-muted/10'
        }`}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="space-y-4">
            <div className="text-lg font-semibold text-foreground">
              Uploading... {Math.round(uploadProgress)}%
            </div>
            <div className="w-full max-w-md mx-auto bg-secondary rounded-full h-3">
              <div
                className="bg-accent h-3 rounded-full transition-all duration-300 relative overflow-hidden"
                style={{ width: `${uploadProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Processing your video...</p>
          </div>
        ) : (
          <>
            <div className="text-accent text-5xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {isDragActive ? 'Drop your video here' : 'Upload Your Video'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Drag and drop your raw video clip or click to browse. The AI will automatically analyze and edit your content.
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">MP4</span>
              <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">MOV</span>
              <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">AVI</span>
              <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">MKV</span>
              <span className="text-xs text-muted-foreground">Max 1GB</span>
            </div>
            {useMockMode && (
              <p className="text-xs text-accent mt-3">
                Running in demo mode (backend not available)
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
