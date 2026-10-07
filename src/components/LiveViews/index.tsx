'use client'

import { useEffect, useState } from 'react'

import { getLiveCounts } from '@/lib/liveCounts'

export const formatViews = (n: number) => (n > 999 ? `${(n / 1000).toFixed(1)}k` : String(n))

// Renders the server-rendered count immediately, then swaps in the live one.
export function LiveViews({ slug, initial }: { slug: string; initial: number }) {
  const [views, setViews] = useState(initial)

  useEffect(() => {
    let alive = true
    getLiveCounts(slug).then((c) => {
      if (alive && c.views != null) setViews(c.views)
    })
    return () => {
      alive = false
    }
  }, [slug])

  return <>{formatViews(views)}</>
}
