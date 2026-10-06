import React from 'react'

// One badge vocabulary for every status field in the admin (posts, briefs, subscribers).
const META: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'var(--theme-elevation-500)' },
  review: { label: 'In review', color: 'var(--ao-amber)' },
  approved: { label: 'Approved', color: 'var(--ao-violet)' },
  published: { label: 'Published', color: 'var(--ao-green)' },
  scheduled: { label: 'Scheduled', color: 'var(--ao-amber)' },
  sent: { label: 'Sent', color: 'var(--ao-green)' },
  active: { label: 'Active', color: 'var(--ao-green)' },
  unsubscribed: { label: 'Unsubscribed', color: 'var(--theme-elevation-500)' },
  bounced: { label: 'Bounced', color: 'var(--ao-red)' },
}

export default function StatusCell({ cellData }: { cellData?: unknown }) {
  const key = typeof cellData === 'string' ? cellData : ''
  if (!key) return <span className="ao-muted">—</span>
  const meta = META[key] ?? { label: key, color: 'var(--theme-elevation-500)' }
  return (
    <span className="ao-badge" style={{ ['--b' as any]: meta.color }}>
      {meta.label}
    </span>
  )
}
