'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/shared/Header'
import UploadZone from '@/components/dashboard/UploadZone'
import ProjectCard from '@/components/dashboard/ProjectCard'

// Demo projects for portfolio showcase
const DEMO_PROJECTS = [
  {
    id: 'demo-1',
    name: 'Cinematic Travel Reel',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&h=360&fit=crop',
    status: 'completed' as const,
    createdAt: '2025-05-15T10:00:00Z',
    duration: 30,
  },
  {
    id: 'demo-2',
    name: 'Product Launch Highlight',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=640&h=360&fit=crop',
    status: 'completed' as const,
    createdAt: '2025-05-12T14:30:00Z',
    duration: 45,
  },
  {
    id: 'demo-3',
    name: 'Music Video Edit',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=640&h=360&fit=crop',
    status: 'completed' as const,
    createdAt: '2025-05-10T08:15:00Z',
    duration: 60,
  },
  {
    id: 'demo-4',
    name: 'Social Media Compilation',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=640&h=360&fit=crop',
    status: 'processing' as const,
    createdAt: '2025-05-18T16:45:00Z',
    duration: 20,
  },
  {
    id: 'demo-5',
    name: 'Wedding Highlights',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=640&h=360&fit=crop',
    status: 'completed' as const,
    createdAt: '2025-05-08T12:00:00Z',
    duration: 90,
  },
  {
    id: 'demo-6',
    name: 'Gaming Montage',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&h=360&fit=crop',
    status: 'failed' as const,
    createdAt: '2025-05-05T09:30:00Z',
    duration: 25,
  },
]

export default function Home() {
  const router = useRouter()
  const [projects] = useState(DEMO_PROJECTS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleUploadComplete = (videoId: string) => {
    // Navigate to editor — video data is stored in localStorage
    router.push(`/editor/${videoId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            AI-Powered Video Editor
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create viral-ready content in minutes with AI-powered trend analysis, beat-matched editing, and automatic transitions
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
              Instagram Reels
            </span>
            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
              YouTube Shorts
            </span>
            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
              TikTok
            </span>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mb-16">
          <UploadZone onUploadComplete={handleUploadComplete} />
        </div>

        {/* Demo Projects */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Demo Projects</h2>
            <span className="text-sm text-muted-foreground">Click any project to explore the editor</span>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-secondary rounded-lg h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
