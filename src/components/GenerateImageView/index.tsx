'use client'

import React, { useState } from 'react'

type GenerateState = 'idle' | 'generating' | 'preview' | 'saving' | 'saved' | 'error'

const s = {
  page: {
    padding: '32px 40px',
    maxWidth: 900,
    fontFamily: 'var(--font-sans, "Space Grotesk", sans-serif)',
  } as React.CSSProperties,

  heading: {
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--theme-text, #f0efe9)',
    margin: '0 0 4px',
    letterSpacing: '-0.01em',
  } as React.CSSProperties,

  subheading: {
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: 'var(--theme-text-dim, #8c8b84)',
    margin: '0 0 32px',
  },

  label: {
    display: 'block',
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'var(--theme-text-dim, #8c8b84)',
    marginBottom: 8,
  } as React.CSSProperties,

  textarea: {
    width: '100%',
    minHeight: 100,
    padding: '12px 14px',
    background: 'var(--theme-input-bg, rgba(255,255,255,0.04))',
    border: '1px solid var(--theme-border-color, #2a2a26)',
    borderRadius: 0,
    color: 'var(--theme-text, #f0efe9)',
    fontSize: 14,
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    outline: 'none',
    boxSizing: 'border-box' as const,
  },

  input: {
    width: '100%',
    padding: '10px 14px',
    background: 'var(--theme-input-bg, rgba(255,255,255,0.04))',
    border: '1px solid var(--theme-border-color, #2a2a26)',
    borderRadius: 0,
    color: 'var(--theme-text, #f0efe9)',
    fontSize: 14,
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box' as const,
  } as React.CSSProperties,

  row: { display: 'flex', gap: 16, marginBottom: 24 } as React.CSSProperties,

  optionGroup: { display: 'flex', gap: 8, flexWrap: 'wrap' as const },

  optionBtn: (selected: boolean) => ({
    padding: '10px 16px',
    border: selected ? '1px solid #6b6ff0' : '1px solid var(--theme-border-color, #2a2a26)',
    background: selected ? 'rgba(107,111,240,0.12)' : 'rgba(255,255,255,0.02)',
    color: selected ? '#8387f4' : 'var(--theme-text-dim, #8c8b84)',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
    fontFamily: 'inherit',
    borderRadius: 0,
    transition: 'all 150ms',
    textAlign: 'left' as const,
  } as React.CSSProperties),

  optionSub: {
    fontSize: 10,
    opacity: 0.7,
    display: 'block',
    marginTop: 2,
    fontWeight: 400,
  } as React.CSSProperties,

  primaryBtn: (disabled: boolean) => ({
    padding: '12px 28px',
    background: disabled ? 'rgba(107,111,240,0.3)' : '#6b6ff0',
    border: 'none',
    color: disabled ? 'rgba(255,255,255,0.4)' : '#fff',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
    borderRadius: 0,
    transition: 'opacity 150ms',
  } as React.CSSProperties),

  secondaryBtn: (disabled: boolean) => ({
    padding: '12px 24px',
    background: 'transparent',
    border: '1px solid var(--theme-border-color, #2a2a26)',
    color: disabled ? 'rgba(255,255,255,0.3)' : 'var(--theme-text-dim, #8c8b84)',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
    borderRadius: 0,
  } as React.CSSProperties),

  previewBox: {
    border: '1px solid var(--theme-border-color, #2a2a26)',
    background: 'rgba(255,255,255,0.02)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    minHeight: 280,
  } as React.CSSProperties,

  placeholder: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 12,
    color: 'var(--theme-text-dim, #8c8b84)',
    padding: 48,
  },

  error: {
    padding: '12px 16px',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171',
    fontSize: 13,
    marginBottom: 20,
    borderRadius: 0,
  } as React.CSSProperties,

  success: {
    padding: '14px 18px',
    background: 'rgba(34,197,94,0.08)',
    border: '1px solid rgba(34,197,94,0.25)',
    color: '#4ade80',
    fontSize: 13,
    marginBottom: 20,
    borderRadius: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  } as React.CSSProperties,

  divider: {
    border: 'none',
    borderTop: '1px solid var(--theme-border-color, #2a2a26)',
    margin: '28px 0',
  } as React.CSSProperties,
}

export default function GenerateImageView() {
  const [prompt, setPrompt] = useState('')
  const size = 'landscape'
  const quality = 'standard'
  const [alt, setAlt] = useState('')
  const [state, setState] = useState<GenerateState>('idle')
  const [error, setError] = useState('')
  const [imageData, setImageData] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [revisedPrompt, setRevisedPrompt] = useState('')

  const filename = `ai-${Date.now()}.webp`

  async function handleGenerate() {
    if (!prompt.trim()) return
    setState('generating')
    setError('')
    setImageData(null)
    setSavedId(null)

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size, quality }),
      })
      const json = await res.json()

      if (!res.ok) {
        setError(json.error || 'Generation failed')
        setState('error')
        return
      }

      setImageData(json.imageData)
      setRevisedPrompt(json.revisedPrompt)
      if (!alt) setAlt(json.revisedPrompt.slice(0, 120))
      setState('preview')
    } catch {
      setError('Network error. Try again.')
      setState('error')
    }
  }

  async function handleSave() {
    if (!imageData) return
    setState('saving')
    setError('')

    try {
      const res = await fetch('/api/generate-image/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData, alt: alt || revisedPrompt, filename }),
      })
      const json = await res.json()

      if (!res.ok) {
        setError(json.error || 'Save failed')
        setState('preview')
        return
      }

      setSavedId(json.id)
      setState('saved')
    } catch {
      setError('Network error. Try again.')
      setState('preview')
    }
  }

  function handleReset() {
    setImageData(null)
    setSavedId(null)
    setError('')
    setRevisedPrompt('')
    setState('idle')
  }

  const isGenerating = state === 'generating'
  const isSaving = state === 'saving'
  const hasPreview = state === 'preview' || state === 'saving' || state === 'saved'

  return (
    <div style={s.page}>
      <p style={s.subheading}>Media</p>
      <h1 style={s.heading}>Generate Image</h1>
      <p style={{ fontSize: 13, color: 'var(--theme-text-dim, #8c8b84)', margin: '0 0 32px' }}>
        Generate images with AI. Images are converted to WebP and saved to the media library.
      </p>

      <hr style={s.divider} />

      {/* Prompt */}
      <div style={{ marginBottom: 24 }}>
        <label style={s.label}>Prompt</label>
        <textarea
          style={s.textarea}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A dark editorial photo of a stock market trading floor, dramatic lighting, black and white with a single accent color..."
          disabled={isGenerating}
          rows={4}
        />
      </div>

      {/* Generate button */}
      <div style={{ marginBottom: 32 }}>
        <button
          style={s.primaryBtn(isGenerating || !prompt.trim())}
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? 'Generating…' : 'Generate Image'}
        </button>
      </div>

      <hr style={s.divider} />

      {/* Error */}
      {error && <div style={s.error}>{error}</div>}

      {/* Success */}
      {state === 'saved' && savedId && (
        <div style={s.success}>
          <span>Image saved to media library.</span>
          <a
            href={`/admin/collections/media/${savedId}`}
            style={{ marginLeft: 'auto', color: '#4ade80', textDecoration: 'none', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}
          >
            Open in Media →
          </a>
        </div>
      )}

      {/* Preview */}
      <div>
        <label style={s.label}>Preview</label>
        <div style={s.previewBox}>
          {hasPreview && imageData ? (
            <img
              src={`data:image/webp;base64,${imageData}`}
              alt="Generated preview"
              style={{ maxWidth: '100%', maxHeight: 500, display: 'block', objectFit: 'contain' }}
            />
          ) : isGenerating ? (
            <div style={s.placeholder}>
              <div style={{ fontSize: 28 }}>⏳</div>
              <div style={{ fontSize: 13 }}>Generating — this takes 10–20 seconds…</div>
            </div>
          ) : (
            <div style={s.placeholder}>
              <div style={{ fontSize: 32, opacity: 0.3 }}>⬛</div>
              <div style={{ fontSize: 13 }}>Image will appear here</div>
            </div>
          )}
        </div>
      </div>

      {/* Revised prompt (shown after generation) */}
      {revisedPrompt && revisedPrompt !== prompt && (
        <div style={{ marginBottom: 20, padding: '12px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--theme-border-color, #2a2a26)', fontSize: 12, color: 'var(--theme-text-dim, #8c8b84)', lineHeight: 1.6 }}>
          <span style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 10 }}>
            Revised prompt:{' '}
          </span>
          {revisedPrompt}
        </div>
      )}

      {/* Alt text + save */}
      {hasPreview && (
        <>
          <div style={{ marginBottom: 20 }}>
            <label style={s.label}>Alt text</label>
            <input
              style={s.input}
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Describe the image for accessibility..."
              disabled={isSaving || state === 'saved'}
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            {state !== 'saved' && (
              <button
                style={s.primaryBtn(isSaving)}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving…' : 'Save to Media Library'}
              </button>
            )}
            <button
              style={s.secondaryBtn(isSaving)}
              onClick={handleReset}
              disabled={isSaving}
            >
              {state === 'saved' ? 'Generate Another' : 'Discard'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
