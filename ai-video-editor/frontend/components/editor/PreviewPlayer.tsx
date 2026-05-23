'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface PreviewPlayerProps {
  videoUrl: string
  isProcessed?: boolean
}

export default function PreviewPlayer({ videoUrl, isProcessed }: PreviewPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const videoUrlRef = useRef(videoUrl)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Detect URL change and force reload
    if (videoUrlRef.current !== videoUrl) {
      videoUrlRef.current = videoUrl
      setIsPlaying(false)
      setCurrentTime(0)
      setDuration(0)
      video.load() // Forces browser to reload the new source
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      // Auto-play when a new video loads (e.g., after AI processing)
      video.play().catch(() => {
        // Browser may block autoplay, that's okay
      })
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
    }
  }, [videoUrl])

  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying])

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = x / rect.width
      const seekTime = percentage * duration
      videoRef.current.currentTime = seekTime
      setCurrentTime(seekTime)
    }
  }, [duration])

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      videoRef.current.muted = newVolume === 0
    }
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }, [])

  const handleToggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }, [isMuted])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <div className={`bg-black rounded-xl overflow-hidden shadow-2xl relative group ${
        isProcessed ? 'ring-2 ring-purple-500/50' : ''
      }`}>
        {videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              className={`w-full aspect-video object-contain transition-all duration-1000 ${
                isProcessed
                  ? 'saturate-[1.2] contrast-[1.15] brightness-[1.05] hue-rotate-[15deg]'
                  : ''
              }`}
              onClick={handlePlayPause}
              playsInline
            />
            {/* Play button overlay */}
            {/* AI Edit overlay effects */}
            {isProcessed && (
              <>
                {/* Color grade vignette */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-purple-900/20 via-transparent to-cyan-900/20" />
                {/* Film grain overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
              </>
            )}

            {/* Processed badge */}
            {isProcessed && (
              <div className="absolute top-3 right-3 px-2 py-1 bg-purple-600/80 backdrop-blur-sm rounded-md text-xs text-white font-medium">
                ✨ AI Enhanced
              </div>
            )}

            {!isPlaying && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                onClick={handlePlayPause}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform ${
                  isProcessed
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500 shadow-purple-500/50'
                    : 'bg-accent shadow-accent/50'
                }`}>
                  <span className="text-2xl text-white ml-1">▶</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="aspect-video flex items-center justify-center">
            <div className="text-muted-foreground text-center">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-lg">Upload a video to preview</p>
              <p className="text-sm mt-2">AI-powered editing preview will appear here</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {videoUrl && (
        <div className="space-y-3 bg-secondary/50 rounded-xl p-4">
          {/* Progress Bar */}
          <div
            className="w-full bg-secondary rounded-full h-2 cursor-pointer group"
            onClick={handleSeek}
          >
            <div
              className="bg-accent h-2 rounded-full relative"
              style={{
                width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
              }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayPause}
                className="w-10 h-10 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition flex items-center justify-center"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                <span className="text-lg">          {isPlaying ? '⏸' : '▶'}</span>
              </button>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleMute}
                  className="text-muted-foreground hover:text-foreground transition text-lg"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-secondary rounded-full appearance-none cursor-pointer accent-accent"
                />
              </div>

              <span className="text-sm text-muted-foreground font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="text-xs text-muted-foreground">
              {duration > 0 && (
                <span>{(duration - currentTime).toFixed(0)}s remaining</span>
              )}
            </div>
          </div>

          {/* Shortcut Hints */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Space: Play/Pause</span>
            <span>Click anywhere: Seek</span>
          </div>
        </div>
      )}
    </div>
  )
}
