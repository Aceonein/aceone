'use client'

import React, { useState } from 'react'

import { useGenerateImage } from '@/components/ImagePicker/useGenerateImage'

const s = {
  page: {
    padding: '8px 28px 56px',
    maxWidth: 900,
  } as React.CSSProperties,

  heading: {
    fontFamily: 'var(--ao-display)',
    fontSize: 44,
    lineHeight: 1.05,
    fontWeight: 700,
    color: 'var(--theme-text)',
    margin: '0 0 8px',
    letterSpacing: '-0.04em',
  } as React.CSSProperties,

  subheading: {
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--ao-muted)',
    margin: '0 0 6px',
  },

  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--theme-text)',
    marginBottom: 8,
  } as React.CSSProperties,

  textarea: {
    width: '100%',
    minHeight: 100,
    padding: '12px 14px',
    background: 'var(--theme-input-bg)',
    border: '1px solid var(--ao-line)',
    borderRadius: 16,
    color: 'var(--theme-text)',
    fontSize: 14,
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    outline: 'none',
    boxSizing: 'border-box' as const,
  },

  input: {
    width: '100%',
    padding: '10px 14px',
    background: 'var(--theme-input-bg)',
    border: '1px solid var(--ao-line)',
    borderRadius: 14,
    color: 'var(--theme-text)',
    fontSize: 14,
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box' as const,
  } as React.CSSProperties,

  row: { display: 'flex', gap: 16, marginBottom: 24 } as React.CSSProperties,

  optionGroup: { display: 'flex', gap: 8, flexWrap: 'wrap' as const },

  optionBtn: (selected: boolean) => ({
    padding: '10px 16px',
    border: selected ? '1px solid var(--ao-ink)' : '1px solid var(--ao-line)',
    background: selected ? 'var(--ao-surface-2)' : 'var(--ao-surface-2)',
    color: selected ? 'var(--theme-text)' : 'var(--ao-muted)',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
    fontFamily: 'inherit',
    borderRadius: 999,
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
    background: disabled ? 'var(--theme-elevation-200)' : 'var(--ao-ink)',
    border: 'none',
    color: disabled ? 'var(--ao-muted)' : 'var(--ao-on-ink)',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0',
    textTransform: 'none' as const,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
    borderRadius: 999,
    transition: 'opacity 150ms',
  } as React.CSSProperties),

  secondaryBtn: (disabled: boolean) => ({
    padding: '12px 24px',
    background: 'transparent',
    border: '1px solid var(--ao-line)',
    color: disabled ? 'var(--ao-muted)' : 'var(--ao-muted)',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0',
    textTransform: 'none' as const,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
    borderRadius: 999,
  } as React.CSSProperties),

  previewBox: {
    border: '1px solid var(--ao-line)',
    background: 'var(--ao-surface-2)',
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
    color: 'var(--ao-muted)',
    padding: 48,
  },

  error: {
    padding: '12px 16px',
    background: 'color-mix(in srgb, var(--ao-red) 12%, transparent)',
    border: '1px solid color-mix(in srgb, var(--ao-red) 35%, transparent)',
    color: 'var(--ao-red)',
    fontSize: 13,
    marginBottom: 20,
    borderRadius: 14,
  } as React.CSSProperties,

  success: {
    padding: '14px 18px',
    background: 'color-mix(in srgb, var(--ao-green) 12%, transparent)',
    border: '1px solid color-mix(in srgb, var(--ao-green) 35%, transparent)',
    color: 'var(--ao-green)',
    fontSize: 13,
    marginBottom: 20,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  } as React.CSSProperties,

  divider: {
    border: 'none',
    borderTop: '1px solid var(--ao-line)',
    margin: '28px 0',
  } as React.CSSProperties,
}

export default function GenerateImageView() {
  const g = useGenerateImage()
  const [savedId, setSavedId] = useState<string | null>(null)
  const { prompt, setPrompt, alt, setAlt, state, error, imageData, revisedPrompt } = g

  async function handleSave() {
    setSavedId(await g.save())
  }

  function handleReset() {
    setSavedId(null)
    g.reset()
  }

  const handleGenerate = g.generate

  const isGenerating = state === 'generating'
  const isSaving = state === 'saving'
  const hasPreview = state === 'preview' || state === 'saving' || state === 'saved'

  return (
    <div style={s.page}>
      <p style={s.subheading}>Media</p>
      <h1 style={s.heading}>Generate Image</h1>
      <p style={{ fontSize: 13, color: 'var(--ao-muted)', margin: '0 0 32px' }}>
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
            style={{ marginLeft: 'auto', color: 'var(--ao-green)', textDecoration: 'none', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}
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
        <div style={{ marginBottom: 20, padding: '12px 14px', background: 'var(--ao-surface-2)', border: '1px solid var(--ao-line)', fontSize: 12, color: 'var(--ao-muted)', lineHeight: 1.6 }}>
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
