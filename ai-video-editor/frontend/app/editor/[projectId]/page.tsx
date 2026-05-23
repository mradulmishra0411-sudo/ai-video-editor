'use client'

import { useState, useEffect, useRef } from 'react'
import Editor from '@/components/editor/TimelineEditor'
import PreviewPlayer from '@/components/editor/PreviewPlayer'
import EffectsPanel from '@/components/editor/EffectsPanel'
import StylePicker from '@/components/editor/StylePicker'
import Header from '@/components/shared/Header'

// Demo video URL for portfolio showcase (w3schools - reliable & publicly accessible)
const DEMO_VIDEO_URL = 'https://www.w3schools.com/html/mov_bbb.mp4'

const PROJECT_NAMES: Record<string, string> = {
  'demo-1': 'Cinematic Travel Reel',
  'demo-2': 'Product Launch Highlight',
  'demo-3': 'Music Video Edit',
  'demo-4': 'Social Media Compilation',
  'demo-5': 'Wedding Highlights',
  'demo-6': 'Gaming Montage',
}

export default function EditorPage({
  params,
}: {
  params: { projectId: string }
}) {
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [isProcessed, setIsProcessed] = useState(false)
  const [videoName, setVideoName] = useState('')
  const originalVideoRef = useRef('')
  const projectName = PROJECT_NAMES[params.projectId] || videoName || 'Untitled Project'
  const [activeTab, setActiveTab] = useState<'editor' | 'effects' | 'styles'>('editor')

  useEffect(() => {
    // Check for user-uploaded video in localStorage
    const uploadedVideos = JSON.parse(localStorage.getItem('uploadedVideos') || '{}')
    const stored = uploadedVideos[params.projectId]
    if (stored?.url) {
      setVideoUrl(stored.url)
      setVideoName(stored.name)
      originalVideoRef.current = stored.url
      return
    }
    
    // Fall back to demo video
    setVideoUrl(DEMO_VIDEO_URL)
    originalVideoRef.current = DEMO_VIDEO_URL
  }, [params.projectId])

  const handleProcessingComplete = () => {
    // Keep the same video but mark as processed — PreviewPlayer applies CSS effects
    setIsProcessed(true)
    setActiveTab('editor')
  }

  const handleNewEdit = () => {
    setIsProcessed(false)
    // Restore the original video (user's upload or demo)
    setVideoUrl(originalVideoRef.current || DEMO_VIDEO_URL)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Project Header */}
      <div className="border-b border-muted bg-secondary/50">
        <div className="max-w-full mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-foreground">{projectName}</h1>
            <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full">AI-Powered</span>
            {isProcessed && (
              <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/30">
                ✅ Edited
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs ${isProcessed ? 'text-green-400' : 'text-muted-foreground'}`}>
              {isProcessed ? 'Edited with AI' : 'Ready to Edit'}
            </span>
            <span className={`w-2 h-2 rounded-full ${isProcessed ? 'bg-green-500' : 'bg-green-500'} animate-pulse`} />
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-1 px-6">
          {[
            { id: 'editor' as const, label: 'Editor', icon: '✂️' },
            { id: 'effects' as const, label: 'Effects', icon: '✨' },
            { id: 'styles' as const, label: 'Styles', icon: '🎨' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
                activeTab === tab.id
                  ? 'bg-background text-foreground border-t border-l border-r border-muted'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content - Video Player */}
        <div className="flex-1 p-6 overflow-y-auto">
          <PreviewPlayer videoUrl={videoUrl} isProcessed={isProcessed} />
        </div>

        {/* Side Panel */}
        <div className="w-[380px] bg-secondary border-l border-muted overflow-y-auto">
          <div className="p-6">
            {activeTab === 'editor' && (
              <Editor
                projectId={params.projectId}
                onProcessingComplete={handleProcessingComplete}
                onStartNewEdit={handleNewEdit}
              />
            )}
            {activeTab === 'effects' && <EffectsPanel />}
            {activeTab === 'styles' && <StylePicker />}
          </div>
        </div>
      </div>
    </div>
  )
}
