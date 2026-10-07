'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useAuth, useField, useForm } from '@payloadcms/ui'

import { mediaImage } from '@/utilities/getMediaUrl'
import { PickerModal, type PickedMedia } from './PickerModal'

type Props = {
  path: string
  field?: { label?: unknown; required?: boolean; admin?: { custom?: { altPath?: string; usedIn?: string } } }
}

/**
 * Single entry point for choosing, uploading, generating, previewing and editing a cover image.
 * Replaces the upload field's default UI; the stored value is still a plain media id.
 */
export default function ImagePicker({ path, field }: Props) {
  const { value, setValue, showError, errorMessage } = useField<string>({ path })
  const { dispatchFields, getDataByPath } = useForm()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [media, setMedia] = useState<any>(null)
  const [usedIn, setUsedIn] = useState(0)

  const altPath = field?.admin?.custom?.altPath
  const usedInCollection = field?.admin?.custom?.usedIn
  const label = typeof field?.label === 'string' ? field.label : 'Image'

  const refresh = useCallback(async () => {
    if (!value) return setMedia(null)
    const res = await fetch(`/api/media/${value}?depth=0`)
    setMedia(res.ok ? await res.json() : null)
  }, [value])

  useEffect(() => { refresh() }, [refresh])

  // Picking up an edit made in the library tab: refresh the preview when the user returns here
  useEffect(() => {
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [refresh])

  useEffect(() => {
    if (!value || !usedInCollection) return setUsedIn(0)
    fetch(`/api/${usedInCollection}?where[${path}][equals]=${value}&limit=0&depth=0`)
      .then((r) => r.json())
      .then((j) => setUsedIn(j.totalDocs ?? 0))
      .catch(() => setUsedIn(0))
  }, [value, usedInCollection, path])

  function pick(m: PickedMedia) {
    setValue(m.id)
    // Fill the post's alt text from the image, but never overwrite what the author already wrote
    if (altPath && m.alt && !getDataByPath(altPath)) dispatchFields({ type: 'UPDATE', path: altPath, value: m.alt })
    setOpen(false)
  }

  const img = media ? mediaImage(media, 'large') : null

  return (
    <div className={`ao-imgfield field-type${showError ? ' error' : ''}`}>
      <div className="ao-imgfield__label">
        {label}
        {field?.required && <span className="required">*</span>}
      </div>

      {img ? (
        <div className="ao-imgfield__card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.src} alt={media.alt || ''} style={{ objectPosition: img.objectPosition }} />
          <div className="ao-imgfield__side">
            <strong>{media.title || media.filename}</strong>
            <span>{media.width} × {media.height}</span>
            {usedIn > 1 && <span className="ao-imgfield__warn">Shared by {usedIn} items. Editing the image changes all of them.</span>}
            <div className="ao-imgfield__actions">
              <button type="button" className="ao-pill ao-pill--sm" onClick={() => setOpen(true)}>Replace</button>
              <a className="ao-pill ao-pill--sm" href={`/admin/collections/media/${value}`} target="_blank" rel="noreferrer">Edit image ↗</a>
              <button type="button" className="ao-pill ao-pill--sm" onClick={() => setValue(null)}>Remove</button>
            </div>
            <small>Crop or reframe in the image editor, save there, then come back. The preview refreshes on return.</small>
          </div>
        </div>
      ) : (
        <button type="button" className="ao-imgfield__empty" onClick={() => setOpen(true)}>
          <strong>Add an image</strong>
          <span>Choose from the library, upload a file{(user as any)?.role === 'admin' ? ' or generate one with AI' : ''}</span>
        </button>
      )}

      {showError && <p className="ao-picker__error">{errorMessage}</p>}
      {open && <PickerModal canGenerate={(user as any)?.role === 'admin'} onClose={() => setOpen(false)} onPick={pick} />}
    </div>
  )
}
