'use client'

import { useState } from 'react'

export default function EffectsPanel() {
  const [activeEffect, setActiveEffect] = useState<string | null>(null)
  const [intensity, setIntensity] = useState(50)

  const effects = [
    { id: 'fade', name: 'Fade', icon: '✨', description: 'Smooth transitions between clips' },
    { id: 'zoom', name: 'Zoom', icon: '🔍', description: 'Ken Burns style zoom effect' },
    { id: 'blur', name: 'Blur', icon: '💨', description: 'Background blur effect' },
    { id: 'color_grade', name: 'Color Grade', icon: '🎨', description: 'AI-powered color grading' },
    { id: 'text_overlay', name: 'Text Overlay', icon: '📝', description: 'Auto-generated captions' },
    { id: 'transition', name: 'Transitions', icon: '➡️', description: 'Scene transition effects' },
    { id: 'speed', name: 'Speed Ramp', icon: '⚡', description: 'Variable speed effects' },
    { id: 'glitch', name: 'Glitch', icon: '💥', description: 'Trendy glitch effects' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Effects</h3>
        <div className="grid grid-cols-2 gap-2">
          {effects.map((effect) => (
            <button
              key={effect.id}
              onClick={() => setActiveEffect(activeEffect === effect.id ? null : effect.id)}
              className={`p-3 border rounded-lg transition-all text-center ${
                activeEffect === effect.id
                  ? 'border-accent bg-accent/10 shadow-sm shadow-accent/20'
                  : 'border-muted hover:border-muted-foreground hover:bg-muted/50'
              }`}
            >
              <div className="text-2xl mb-1">{effect.icon}</div>
              <div className="text-xs font-medium text-foreground">{effect.name}</div>
              {activeEffect === effect.id && (
                <div className="text-[10px] text-accent mt-1">Active</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Effect Settings */}
      {activeEffect && (
        <div className="space-y-4 bg-muted/30 rounded-lg p-4 border border-muted">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">
              {effects.find(e => e.id === activeEffect)?.name} Settings
            </h4>
            <button
              onClick={() => setActiveEffect(null)}
              className="text-xs text-muted-foreground hover:text-foreground transition"
            >
              Clear
            </button>
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground flex justify-between mb-1">
              <span>Intensity</span>
              <span>{intensity}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              className="w-full h-1.5 bg-secondary rounded-full appearance-none cursor-pointer accent-accent"
            />
          </div>
          
          <p className="text-xs text-muted-foreground">
            {effects.find(e => e.id === activeEffect)?.description}
          </p>
        </div>
      )}
    </div>
  )
}
