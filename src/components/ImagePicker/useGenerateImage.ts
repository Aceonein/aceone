'use client'

import { useState } from 'react'

export type GenState = 'idle' | 'generating' | 'preview' | 'saving' | 'saved'

// Shared by the picker's AI tab and the standalone Generate Image page.
export function useGenerateImage() {
  const [prompt, setPrompt] = useState('')
  const [alt, setAlt] = useState('')
  const [state, setState] = useState<GenState>('idle')
  const [error, setError] = useState('')
  const [imageData, setImageData] = useState<string | null>(null)
  const [revisedPrompt, setRevisedPrompt] = useState('')

  async function generate() {
    if (!prompt.trim()) return
    setState('generating')
    setError('')
    setImageData(null)
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size: 'landscape', quality: 'standard' }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Generation failed')
      setImageData(json.imageData)
      setRevisedPrompt(json.revisedPrompt)
      if (!alt) setAlt(json.revisedPrompt.slice(0, 120))
      setState('preview')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error. Try again.')
      setState(imageData ? 'preview' : 'idle')
    }
  }

  /** Saves the preview to the media library and returns the new media id (null on failure). */
  async function save(): Promise<string | null> {
    if (!imageData) return null
    setState('saving')
    setError('')
    try {
      const res = await fetch('/api/generate-image/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData, alt: alt || revisedPrompt, filename: `ai-${Date.now()}.webp` }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
      setState('saved')
      return json.id as string
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error. Try again.')
      setState('preview')
      return null
    }
  }

  function reset() {
    setImageData(null)
    setRevisedPrompt('')
    setError('')
    setState('idle')
  }

  return { prompt, setPrompt, alt, setAlt, state, error, imageData, revisedPrompt, generate, save, reset }
}
