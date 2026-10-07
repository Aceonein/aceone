'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useGenerateImage } from './useGenerateImage'

export type PickedMedia = { id: string; alt?: string }
type Tab = 'library' | 'upload' | 'ai'
type MediaDoc = { id: string; alt?: string; title?: string; filename?: string; url?: string; thumbnailURL?: string; updatedAt?: string }

const PAGE = 24

type Props = {
  canGenerate: boolean
  initialTab?: Tab
  onClose: () => void
  onPick: (media: PickedMedia) => void
}

export function PickerModal({ canGenerate, initialTab = 'library', onClose, onPick }: Props) {
  const [tab, setTab] = useState<Tab>(initialTab)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const tabs: { key: Tab; label: string }[] = [
    { key: 'library', label: 'Library' },
    { key: 'upload', label: 'Upload' },
    ...(canGenerate ? [{ key: 'ai' as const, label: 'Generate with AI' }] : []),
  ]

  return createPortal(
    <div className="ao-picker" role="dialog" aria-modal="true" aria-label="Choose an image">
      <div className="ao-picker__scrim" onClick={onClose} />
      <div className="ao-picker__panel">
        <header className="ao-picker__head">
          <h2>Choose an image</h2>
          <button type="button" className="ao-picker__close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>
        <div className="ao-picker__tabs" role="tablist">
          {tabs.map((t) => (
            <button key={t.key} type="button" role="tab" aria-selected={tab === t.key} className={tab === t.key ? 'is-active' : ''} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="ao-picker__body">
          {tab === 'library' && <LibraryTab onPick={onPick} />}
          {tab === 'upload' && <UploadTab onPick={onPick} />}
          {tab === 'ai' && <AiTab onPick={onPick} />}
        </div>
      </div>
    </div>,
    document.body,
  )
}

function LibraryTab({ onPick }: { onPick: Props['onPick'] }) {
  const [docs, setDocs] = useState<MediaDoc[]>([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<MediaDoc | null>(null)
  const reqId = useRef(0)

  const load = useCallback(async (q: string, p: number) => {
    const id = ++reqId.current
    setLoading(true)
    const params = new URLSearchParams({ limit: String(PAGE), page: String(p), depth: '0', sort: '-createdAt' })
    if (q.trim()) {
      ;['title', 'alt', 'filename'].forEach((f, i) => params.set(`where[or][${i}][${f}][like]`, q.trim()))
    }
    try {
      const res = await fetch(`/api/media?${params}`)
      const json = await res.json()
      if (id !== reqId.current) return // a newer search superseded this one
      setDocs((prev) => (p === 1 ? json.docs : [...prev, ...json.docs]))
      setHasMore(Boolean(json.hasNextPage))
    } finally {
      if (id === reqId.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    setPage(1)
    const t = setTimeout(() => load(query, 1), query ? 250 : 0)
    return () => clearTimeout(t)
  }, [query, load])

  return (
    <>
      <input className="ao-picker__search" type="search" placeholder="Search by title, alt text or file name" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="ao-picker__grid">
        {docs.map((d) => (
          <button
            key={d.id}
            type="button"
            className={`ao-picker__tile${selected?.id === d.id ? ' is-selected' : ''}`}
            onClick={() => setSelected(d)}
            onDoubleClick={() => onPick({ id: d.id, alt: d.alt })}
            aria-pressed={selected?.id === d.id}
            title={d.title || d.filename}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${d.thumbnailURL || d.url}${d.updatedAt ? `?${encodeURIComponent(d.updatedAt)}` : ''}`} alt={d.alt || ''} loading="lazy" />
            <span>{d.title || d.filename}</span>
          </button>
        ))}
      </div>
      {!loading && docs.length === 0 && <p className="ao-picker__empty">No images found.</p>}
      {loading && <p className="ao-picker__empty">Loading…</p>}
      {hasMore && !loading && (
        <button type="button" className="ao-pill ao-pill--sm ao-picker__more" onClick={() => { setPage(page + 1); load(query, page + 1) }}>
          Load more
        </button>
      )}
      <footer className="ao-picker__foot">
        <span>{selected ? selected.title || selected.filename : 'Select an image'}</span>
        <button type="button" className="ao-pill ao-pill--ink" disabled={!selected} onClick={() => selected && onPick({ id: selected.id, alt: selected.alt })}>
          Use this image
        </button>
      </footer>
    </>
  )
}

function UploadTab({ onPick }: { onPick: Props['onPick'] }) {
  const [file, setFile] = useState<File | null>(null)
  const [alt, setAlt] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [over, setOver] = useState(false)

  async function upload() {
    if (!file) return
    setBusy(true)
    setError('')
    const body = new FormData()
    body.append('file', file)
    body.append('_payload', JSON.stringify({ alt }))
    try {
      const res = await fetch('/api/media', { method: 'POST', body })
      const json = await res.json()
      if (!res.ok) throw new Error(json.errors?.[0]?.message || json.message || 'Upload failed')
      onPick({ id: json.doc.id, alt: json.doc.alt })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
      setBusy(false)
    }
  }

  return (
    <>
      <label
        className={`ao-picker__drop${over ? ' is-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setOver(true) }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); setFile(e.dataTransfer.files[0] ?? null) }}
      >
        <input type="file" accept="image/*" hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <strong>{file ? file.name : 'Drop an image here, or click to browse'}</strong>
        <span>JPG, PNG, WebP, GIF or AVIF. Converted to WebP automatically.</span>
      </label>
      <label className="ao-picker__label">
        Alt text
        <input className="ao-picker__input" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the image. The file is named after this." />
      </label>
      {error && <p className="ao-picker__error">{error}</p>}
      <footer className="ao-picker__foot">
        <span />
        <button type="button" className="ao-pill ao-pill--ink" disabled={!file || busy} onClick={upload}>
          {busy ? 'Uploading…' : 'Upload and use'}
        </button>
      </footer>
    </>
  )
}

function AiTab({ onPick }: { onPick: Props['onPick'] }) {
  const g = useGenerateImage()
  const working = g.state === 'generating' || g.state === 'saving'

  async function use() {
    const id = await g.save()
    if (id) onPick({ id, alt: g.alt || g.revisedPrompt })
  }

  return (
    <>
      <label className="ao-picker__label">
        Describe the image
        <textarea className="ao-picker__input" rows={3} value={g.prompt} disabled={working} onChange={(e) => g.setPrompt(e.target.value)} placeholder="A dark editorial photo of a trading floor, dramatic lighting…" />
      </label>
      <button type="button" className="ao-pill ao-pill--sm" disabled={working || !g.prompt.trim()} onClick={g.generate}>
        {g.state === 'generating' ? 'Generating…' : g.imageData ? 'Generate again' : 'Generate'}
      </button>
      {g.error && <p className="ao-picker__error">{g.error}</p>}
      {g.state === 'generating' && <p className="ao-picker__empty">Takes 10–20 seconds…</p>}
      {g.imageData && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ao-picker__preview" src={`data:image/webp;base64,${g.imageData}`} alt="Generated preview" />
          <label className="ao-picker__label">
            Alt text
            <input className="ao-picker__input" value={g.alt} onChange={(e) => g.setAlt(e.target.value)} disabled={working} />
          </label>
        </>
      )}
      <footer className="ao-picker__foot">
        <span />
        <button type="button" className="ao-pill ao-pill--ink" disabled={!g.imageData || working} onClick={use}>
          {g.state === 'saving' ? 'Saving…' : 'Use this image'}
        </button>
      </footer>
    </>
  )
}
