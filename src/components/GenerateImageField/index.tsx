'use client'

import React, { useState } from 'react'
import { useField } from '@payloadcms/ui'

type Props = {
  field?: {
    admin?: {
      custom?: {
        targetField?: string
      }
    }
  }
  targetField?: string // direct prop override
}

type GenState = 'idle' | 'generating' | 'preview' | 'saving' | 'done' | 'error'

const SIZE_OPTIONS = [
  { value: 'landscape', label: 'Landscape', sub: '1792×1024' },
  { value: 'square', label: 'Square', sub: '1024×1024' },
  { value: 'portrait', label: 'Portrait', sub: '1024×1792' },
]

const accent = '#6b6ff0'
const accentDim = 'rgba(107,111,240,0.12)'
const border = 'var(--theme-border-color, #2a2a26)'
const textDim = 'var(--theme-text-dim, #8c8b84)'
const text = 'var(--theme-text, #f0efe9)'

export function GenerateImageField({ field, targetField: targetFieldProp }: Props) {
  const targetField = targetFieldProp ?? field?.admin?.custom?.targetField ?? ''

  const { setValue } = useField<string>({ path: targetField })

  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const size = 'landscape'
  const quality = 'standard'
  const [alt, setAlt] = useState('')
  const [state, setState] = useState<GenState>('idle')
  const [error, setError] = useState('')
  const [imageData, setImageData] = useState<string | null>(null)
  const [revisedPrompt, setRevisedPrompt] = useState('')

  async function handleGenerate() {
    if (!prompt.trim()) return
    setState('generating')
    setError('')
    setImageData(null)
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size, quality }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Generation failed'); setState('error'); return }
      setImageData(json.imageData)
      setRevisedPrompt(json.revisedPrompt)
      if (!alt) setAlt(json.revisedPrompt.slice(0, 120))
      setState('preview')
    } catch {
      setError('Network error')
      setState('error')
    }
  }

  async function handleUse() {
    if (!imageData || !targetField) return
    setState('saving')
    setError('')
    const filename = `ai-${Date.now()}.webp`
    try {
      const res = await fetch('/api/generate-image/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData, alt: alt || revisedPrompt, filename }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Save failed'); setState('preview'); return }
      setValue(json.id)
      setState('done')
      setTimeout(() => {
        setOpen(false)
        setState('idle')
        setImageData(null)
        setPrompt('')
        setAlt('')
        setRevisedPrompt('')
      }, 1200)
    } catch {
      setError('Network error')
      setState('preview')
    }
  }

  const isGenerating = state === 'generating'
  const isSaving = state === 'saving'
  const isDone = state === 'done'
  const hasPreview = ['preview', 'saving', 'done'].includes(state)

  return (
    <div style={{ marginBottom: 8 }}>
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          padding: '7px 14px',
          background: open ? accentDim : 'transparent',
          border: `1px solid ${open ? accent : border}`,
          color: open ? accent : textDim,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          fontFamily: 'inherit',
          borderRadius: 0,
          transition: 'all 150ms',
        }}
      >
        <span style={{ fontSize: 13 }}>✦</span>
        {open ? 'Close Generator' : 'Generate with AI'}
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          marginTop: 12,
          padding: 20,
          border: `1px solid ${accent}40`,
          background: 'rgba(107,111,240,0.04)',
          borderRadius: 0,
        }}>
          {/* Prompt */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: textDim, marginBottom: 6 }}>
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              placeholder="Describe the image you want to generate..."
              rows={3}
              style={{
                width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${border}`, borderRadius: 0, color: text, fontSize: 13,
                fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Generate */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            style={{
              padding: '9px 20px', background: isGenerating || !prompt.trim() ? 'rgba(107,111,240,0.3)' : accent,
              border: 'none', color: isGenerating || !prompt.trim() ? 'rgba(255,255,255,0.4)' : '#fff',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              cursor: isGenerating || !prompt.trim() ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', borderRadius: 0, marginBottom: 16,
            }}
          >
            {isGenerating ? 'Generating…' : 'Generate'}
          </button>

          {/* Error */}
          {error && (
            <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 12, marginBottom: 12 }}>
              {error}
            </div>
          )}

          {/* Done flash */}
          {isDone && (
            <div style={{ padding: '8px 12px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80', fontSize: 12, marginBottom: 12 }}>
              Image set.
            </div>
          )}

          {/* Preview */}
          {isGenerating && (
            <div style={{ padding: '28px 0', textAlign: 'center', color: textDim, fontSize: 12 }}>
              Generating — takes 10–20 seconds…
            </div>
          )}

          {hasPreview && imageData && (
            <div style={{ marginBottom: 14 }}>
              <img
                src={`data:image/webp;base64,${imageData}`}
                alt="Generated preview"
                style={{ maxWidth: '100%', maxHeight: 320, display: 'block', objectFit: 'contain', border: `1px solid ${border}` }}
              />
              {revisedPrompt && revisedPrompt !== prompt && (
                <div style={{ marginTop: 8, fontSize: 11, color: textDim, lineHeight: 1.5 }}>
                  <strong style={{ fontWeight: 700 }}>Revised:</strong> {revisedPrompt}
                </div>
              )}
            </div>
          )}

          {/* Alt + use */}
          {hasPreview && !isDone && (
            <div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: textDim, marginBottom: 6 }}>
                  Alt text
                </label>
                <input
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  disabled={isSaving}
                  style={{
                    width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${border}`, borderRadius: 0, color: text, fontSize: 13,
                    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={handleUse}
                  disabled={isSaving}
                  style={{
                    padding: '8px 18px', background: isSaving ? 'rgba(107,111,240,0.3)' : accent,
                    border: 'none', color: isSaving ? 'rgba(255,255,255,0.4)' : '#fff',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    cursor: isSaving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', borderRadius: 0,
                  }}
                >
                  {isSaving ? 'Saving…' : 'Use this image'}
                </button>
                <button
                  type="button"
                  onClick={() => { setImageData(null); setState('idle') }}
                  disabled={isSaving}
                  style={{
                    padding: '8px 14px', background: 'transparent', border: `1px solid ${border}`,
                    color: textDim, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
                    textTransform: 'uppercase', cursor: isSaving ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit', borderRadius: 0,
                  }}
                >
                  Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default GenerateImageField
