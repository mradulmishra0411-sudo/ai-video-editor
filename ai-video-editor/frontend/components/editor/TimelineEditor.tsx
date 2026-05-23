'use client'

import { useState, useCallback } from 'react'

interface TimelineEditorProps {
  projectId: string
  onProcessingComplete?: () => void
  onStartNewEdit?: () => void
}

interface ProcessingResult {
  prompt: string
  mode: 'global' | 'reference'
  duration: number
  cutsApplied: number
  transitionsApplied: number
  beatSyncApplied: boolean
  completedAt: string
}

export default function TimelineEditor({ projectId, onProcessingComplete, onStartNewEdit }: TimelineEditorProps) {
  const [editingMode, setEditingMode] = useState<'global' | 'reference'>('global')
  const [prompt, setPrompt] = useState('')
  const [referenceUrl, setReferenceUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStage, setProcessingStage] = useState('')
  const [processingProgress, setProcessingProgress] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<ProcessingResult | null>(null)

  const simulateProcessing = useCallback(async () => {
    const stages = [
      { progress: 10, text: 'Analyzing video content...' },
      { progress: 25, text: 'Detecting scene changes...' },
      { progress: 40, text: 'Analyzing audio track...' },
      { progress: 55, text: 'Matching beats to cuts...' },
      { progress: 70, text: 'Applying AI style transfer...' },
      { progress: 85, text: 'Adding transitions & effects...' },
      { progress: 95, text: 'Rendering final video...' },
      { progress: 100, text: 'Processing complete!' },
    ]

    for (const stage of stages) {
      setProcessingProgress(stage.progress)
      setProcessingStage(stage.text)
      await new Promise(resolve => setTimeout(resolve, 600))
    }

    // Generate result data
    const newResult: ProcessingResult = {
      prompt: editingMode === 'global' ? prompt : referenceUrl,
      mode: editingMode,
      duration: Math.floor(Math.random() * 30) + 15,
      cutsApplied: Math.floor(Math.random() * 12) + 8,
      transitionsApplied: Math.floor(Math.random() * 6) + 3,
      beatSyncApplied: true,
      completedAt: new Date().toLocaleTimeString(),
    }
    
    setResult(newResult)
    setShowResult(true)
    setProcessingProgress(0)
    setProcessingStage('')
    
    // Notify parent that processing is done - keep the same video, apply effects
    onProcessingComplete?.()
  }, [editingMode, prompt, referenceUrl, onProcessingComplete])

  const handleStartProcessing = async () => {
    setIsProcessing(true)
    setShowResult(false)
    setResult(null)
    await simulateProcessing()
  }

  const handleReset = () => {
    setShowResult(false)
    setResult(null)
    setIsProcessing(false)
    setProcessingProgress(0)
    setProcessingStage('')
    onStartNewEdit?.()
  }

  const handleDownload = () => {
    // Trigger download of the video with AI enhancements applied
    // Find the video element and offer it for download
    const video = document.querySelector('video')
    if (video?.src) {
      const a = document.createElement('a')
      a.href = video.src
      a.download = `edited-${projectId}.mp4`
      a.click()
    }
  }

  const suggestedPrompts = [
    'Make it a cinematic travel reel with upbeat music',
    'Create a fast-paced action montage',
    'Style it as a viral dance video',
    'Make an emotional storytelling edit',
  ]

  // Show processing result
  if (showResult && result) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Success Banner */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">🎉</div>
          <h3 className="text-lg font-semibold text-green-400">Processing Complete!</h3>
          <p className="text-xs text-muted-foreground mt-1">Your AI-edited video is ready</p>
        </div>

        {/* Result Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Duration', value: `${result.duration}s`, icon: '⏱️' },
            { label: 'Cuts Applied', value: result.cutsApplied.toString(), icon: '✂️' },
            { label: 'Transitions', value: result.transitionsApplied.toString(), icon: '🔄' },
            { label: 'Beat Sync', value: result.beatSyncApplied ? '✅ Yes' : '❌ No', icon: '🎵' },
          ].map((stat) => (
            <div key={stat.label} className="bg-muted/30 border border-muted rounded-lg p-3">
              <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                <span>{stat.icon}</span>
                {stat.label}
              </div>
              <div className="text-lg font-semibold text-foreground">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Edit Summary */}
        <div className="bg-accent/5 border border-accent/20 rounded-lg p-3">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Edit Summary</h4>
          <div className="space-y-1 text-sm text-foreground">
            <p>Mode: <span className="text-accent capitalize">{result.mode === 'global' ? 'Global Trend' : 'Reference Clone'}</span></p>
            <p>Prompt: <span className="text-muted-foreground">{result.prompt.substring(0, 50)}</span></p>
            <p>Completed: <span className="text-muted-foreground">{result.completedAt}</span></p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleDownload}
            className="w-full px-4 py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>⬇️</span>
            Download Edited Video
          </button>
          <button
            onClick={handleReset}
            className="w-full px-4 py-3 bg-muted text-foreground font-medium rounded-lg border border-muted hover:bg-muted/80 transition-all active:scale-[0.98]"
          >
            Start New Edit
          </button>
        </div>

        {/* Preview Note */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
          <p className="text-xs text-blue-400">
            💡 The processed video is now playing in the preview player on the left
          </p>
        </div>
      </div>
    )
  }

  // Processing state
  if (isProcessing) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-accent/5 border border-accent/20 rounded-lg p-6 space-y-4">
          <div className="text-center">
            <div className="text-3xl mb-2 animate-pulse">⚙️</div>
            <h3 className="text-lg font-semibold text-accent">AI Processing</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {processingProgress === 100 ? 'Finalizing...' : 'Editing your video...'}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-accent font-medium">
                {processingProgress === 100 ? '✅ Complete!' : 'Processing...'}
              </span>
              <span className="text-xs text-muted-foreground">{processingProgress}%</span>
            </div>
            <div className="w-full bg-accent/10 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-accent to-purple-500 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                style={{ width: `${processingProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">{processingStage}</p>
          </div>
        </div>

        {/* Processing Timeline */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pipeline Stages</h4>
          {[
            { name: 'Video Analysis', progress: 25 },
            { name: 'Scene Detection', progress: 40 },
            { name: 'Audio Analysis', progress: 55 },
            { name: 'Beat Matching', progress: 70 },
            { name: 'Style Transfer', progress: 85 },
            { name: 'Render Output', progress: 100 },
          ].map((stage) => (
            <div key={stage.name} className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                processingProgress >= stage.progress
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {processingProgress >= stage.progress ? '✓' : stage.progress === 25 ? '1' : stage.progress === 40 ? '2' : stage.progress === 55 ? '3' : stage.progress === 70 ? '4' : stage.progress === 85 ? '5' : '6'}
              </div>
              <span className={`text-xs ${
                processingProgress >= stage.progress
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground'
              }`}>
                {stage.name}
              </span>
              {processingProgress >= stage.progress && (
                <span className="text-[10px] text-green-500 ml-auto">Done</span>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Default editing form
  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Editing Mode</h2>
        
        <div className="space-y-3">
          <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
            editingMode === 'global'
              ? 'border-accent bg-accent/5'
              : 'border-muted hover:bg-muted/50'
          }`}>
            <input
              type="radio"
              name="mode"
              value="global"
              checked={editingMode === 'global'}
              onChange={(e) => setEditingMode(e.target.value as 'global')}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              editingMode === 'global' ? 'border-accent' : 'border-muted'
            }`}>
              {editingMode === 'global' && <div className="w-2 h-2 rounded-full bg-accent" />}
            </div>
            <div>
              <p className="font-medium text-foreground">Global Trend</p>
              <p className="text-xs text-muted-foreground">Auto-detect viral pacing & transitions</p>
            </div>
          </label>

          <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
            editingMode === 'reference'
              ? 'border-accent bg-accent/5'
              : 'border-muted hover:bg-muted/50'
          }`}>
            <input
              type="radio"
              name="mode"
              value="reference"
              checked={editingMode === 'reference'}
              onChange={(e) => setEditingMode(e.target.value as 'reference')}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              editingMode === 'reference' ? 'border-accent' : 'border-muted'
            }`}>
              {editingMode === 'reference' && <div className="w-2 h-2 rounded-full bg-accent" />}
            </div>
            <div>
              <p className="font-medium text-foreground">Reference Link</p>
              <p className="text-xs text-muted-foreground">Clone style from URL</p>
            </div>
          </label>
        </div>
      </div>

      {/* Context/URL Input */}
      {editingMode === 'global' ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="content-prompt" className="text-sm font-medium text-foreground">Content Context</label>
            <span className="text-xs text-muted-foreground">{prompt.length}/200</span>
          </div>
          <textarea
            id="content-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, 200))}
            placeholder="e.g., Make it a cinematic nature travel reel with upbeat music..."
            className="w-full px-3 py-2 bg-muted border border-muted rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            rows={4}
          />
          {prompt.length === 0 && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-2">Suggestions:</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestedPrompts.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setPrompt(suggestion)}
                    className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition"
                  >
                    {suggestion.substring(0, 25)}...
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <label htmlFor="reference-url" className="block text-sm font-medium text-foreground mb-2">
            Reference Video URL
          </label>
          <input
            id="reference-url"
            type="url"
            value={referenceUrl}
            onChange={(e) => setReferenceUrl(e.target.value)}
            placeholder="Paste Instagram Reel or YouTube Shorts URL..."
            className="w-full px-3 py-2 bg-muted border border-muted rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            Paste any Instagram Reel or YouTube Shorts URL to clone its editing style
          </p>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleStartProcessing}
        disabled={isProcessing || (editingMode === 'global' ? !prompt.trim() : !referenceUrl.trim())}
        className="w-full px-4 py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <span>🚀</span>
        Start AI Processing
      </button>

      {/* Processing Features */}
      <div className="bg-muted/30 rounded-lg p-4 border border-muted">
        <h3 className="font-semibold text-foreground mb-3 text-sm">AI Processing Pipeline</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Beat Matching', done: true },
            { label: 'Scene Detection', done: true },
            { label: 'Style Transfer', done: true },
            { label: 'Auto Cuts', done: true },
            { label: 'Music Sync', done: true },
            { label: 'Text Overlay', done: true },
            { label: 'Color Grading', done: true },
            { label: 'SFX Integration', done: true },
          ].map((feature) => (
            <div key={feature.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="text-green-500">✓</span>
              {feature.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
