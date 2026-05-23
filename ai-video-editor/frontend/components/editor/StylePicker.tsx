'use client'

import { useState } from 'react'

export default function StylePicker() {
  const [selectedStyle, setSelectedStyle] = useState<string | null>('cinematic')

  const styles = [
    { 
      id: 'fast_paced', 
      name: 'Fast-Paced Action', 
      bpm: 120, 
      description: 'Quick cuts, energetic transitions',
      gradient: 'from-red-500/20 to-orange-500/20',
      border: 'border-red-500/30',
    },
    { 
      id: 'cinematic', 
      name: 'Cinematic Travel', 
      bpm: 80, 
      description: 'Smooth fades, wide landscapes',
      gradient: 'from-blue-500/20 to-purple-500/20',
      border: 'border-blue-500/30',
    },
    { 
      id: 'viral_dance', 
      name: 'Viral Dance', 
      bpm: 128, 
      description: 'Beat-synced edits, bold text',
      gradient: 'from-pink-500/20 to-yellow-500/20',
      border: 'border-pink-500/30',
    },
    { 
      id: 'emotional', 
      name: 'Emotional Story', 
      bpm: 60, 
      description: 'Slow motion, soft transitions',
      gradient: 'from-teal-500/20 to-emerald-500/20',
      border: 'border-teal-500/30',
    },
    { 
      id: 'vlog', 
      name: 'Vlog Style', 
      bpm: 100, 
      description: 'Casual cuts, natural feel',
      gradient: 'from-amber-500/20 to-yellow-500/20',
      border: 'border-amber-500/30',
    },
    { 
      id: 'gaming', 
      name: 'Gaming Montage', 
      bpm: 140, 
      description: 'High energy, rapid transitions',
      gradient: 'from-violet-500/20 to-indigo-500/20',
      border: 'border-violet-500/30',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Style Presets</h3>
        {selectedStyle && (
          <span className="text-xs text-accent">Selected</span>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground">
        Choose an AI editing style to automatically apply to your video
      </p>

      <div className="space-y-2">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => setSelectedStyle(style.id)}
            className={`w-full p-3 bg-gradient-to-r ${style.gradient} border rounded-lg transition-all text-left ${
              selectedStyle === style.id
                ? `${style.border} shadow-sm`
                : 'border-transparent hover:border-muted-foreground/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="font-medium text-foreground">{style.name}</div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                  {style.bpm} BPM
                </span>
                {selectedStyle === style.id && (
                  <span className="text-accent">✓</span>
                )}
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{style.description}</div>
          </button>
        ))}
      </div>

      {selectedStyle && (
        <div className="bg-muted/30 rounded-lg p-3 border border-muted">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-accent">💡</span>
            Style will be applied when processing starts
          </div>
        </div>
      )}
    </div>
  )
}
