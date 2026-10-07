'use client'

import { useEffect } from 'react'

import { trackView } from '@/lib/liveCounts'

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    void trackView(slug)
  }, [slug])

  return null
}
