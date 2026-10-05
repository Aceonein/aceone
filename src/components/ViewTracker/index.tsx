'use client'

import { useEffect } from 'react'

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `ao:viewed:${slug}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {}
    fetch(`/api/posts/${encodeURIComponent(slug)}/view`, { method: 'POST', keepalive: true }).catch(() => {})
  }, [slug])

  return null
}
