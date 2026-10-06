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

const accent = 'var(--ao-ink)'
const accentDim = 'var(--ao-surface-2)'
const border = 'var(--ao-line)'
const textDim = 'var(--ao-muted)'
const text = 'var(--theme-text)'

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
      <button type="button" className="ao-pill ao-pill--sm" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span aria-hidden="true" style={{ color: 'var(--ao-violet)' }}>✦</span>
        {open ? 'Close generator' : 'Generate with AI'}
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          marginTop: 12,
          padding: 20,
          border: `1px solid ${accent}40`,
          background: 'var(--ao-surface-2)',
          borderRadius: 14,
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
                width: '100%', padding: '10px 12px', background: 'var(--ao-surface-2)',
                border: `1px solid ${border}`, borderRadius: 14, color: text, fontSize: 13,
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
              padding: '9px 20px', background: isGenerating || !prompt.trim() ? 'var(--theme-elevation-200)' : accent,
              border: 'none', color: isGenerating || !prompt.trim() ? 'var(--ao-muted)' : 'var(--ao-on-ink)',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              cursor: isGenerating || !prompt.trim() ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', borderRadius: 14, marginBottom: 16,
            }}
          >
            {isGenerating ? 'Generating…' : 'Generate'}
          </button>

          {/* Error */}
          {error && (
            <div style={{ padding: '8px 12px', background: 'color-mix(in srgb, var(--ao-red) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--ao-red) 35%, transparent)', color: 'var(--ao-red)', fontSize: 12, marginBottom: 12 }}>
              {error}
            </div>
          )}

          {/* Done flash */}
          {isDone && (
            <div style={{ padding: '8px 12px', background: 'color-mix(in srgb, var(--ao-green) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--ao-green) 35%, transparent)', color: 'var(--ao-green)', fontSize: 12, marginBottom: 12 }}>
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
                    width: '100%', padding: '8px 12px', background: 'var(--ao-surface-2)',
                    border: `1px solid ${border}`, borderRadius: 14, color: text, fontSize: 13,
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
                    padding: '8px 18px', background: isSaving ? 'var(--theme-elevation-200)' : accent,
                    border: 'none', color: isSaving ? 'var(--ao-muted)' : 'var(--ao-on-ink)',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    cursor: isSaving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', borderRadius: 14,
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
                    fontFamily: 'inherit', borderRadius: 14,
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
