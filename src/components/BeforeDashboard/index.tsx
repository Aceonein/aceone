'use client'

import { useAuth } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

type Post = {
  id: string
  title: string
  status: string
  updatedAt: string
  author?: { name?: string } | null
}

type StatusCounts = Record<string, number>

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  review: 'In Review',
  approved: 'Approved',
  published: 'Published',
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  draft: { bg: 'rgba(255,255,255,0.06)', color: '#6b7296' },
  review: { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24' },
  approved: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  published: { bg: 'rgba(72,120,232,0.15)', color: '#6fa0f8' },
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status] ?? { bg: 'rgba(255,255,255,0.06)', color: '#6b7296' }
  return (
    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 100, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, background: s.bg, color: s.color, whiteSpace: 'nowrap' as const }}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

function StatCard({ label, count, status }: { label: string; count: number; status: string }) {
  const s = STATUS_COLORS[status] ?? { bg: 'rgba(255,255,255,0.06)', color: '#6b7296' }
  return (
    <div style={{ padding: '20px 24px', border: `1px solid ${s.color}30`, borderRadius: 10, background: s.bg, display: 'flex', flexDirection: 'column' as const, gap: 6, minWidth: 110 }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: s.color, lineHeight: 1 }}>{count}</div>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: s.color, opacity: 0.75 }}>{label}</div>
    </div>
  )
}

const BeforeDashboard: React.FC = () => {
  const { user } = useAuth()
  const role = (user as any)?.role ?? 'author'
  const userId = user?.id

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    const where = role === 'author' ? `where[createdBy][equals]=${userId}` : ''
    fetch(`/api/posts?limit=200&depth=1&${where}`)
      .then((r) => r.json())
      .then((data) => { setPosts(data?.docs ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [userId, role])

  const counts: StatusCounts = posts.reduce<StatusCounts>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1
    return acc
  }, {})

  const needsAttention =
    role === 'moderator' ? posts.filter((p) => p.status === 'review') :
    role === 'admin' ? posts.filter((p) => p.status === 'approved') : []

  const tablePosts =
    role === 'admin' ? [...posts].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()) :
    role === 'moderator' ? posts.filter((p) => ['review', 'approved', 'draft'].includes(p.status)) :
    posts

  const roleLabel = role === 'admin' ? 'Admin' : role === 'moderator' ? 'Moderator' : 'Author'

  const th = {
    textAlign: 'left' as const,
    padding: '10px 16px',
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'var(--theme-text-dim, #6b7296)',
    whiteSpace: 'nowrap' as const,
  }

  return (
    <div style={{ padding: '8px 0 32px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'var(--theme-text-dim, #6b7296)', marginBottom: 6 }}>
          {roleLabel} Dashboard
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--theme-text, #d8dae6)', margin: 0 }}>
          {role === 'admin' ? 'Content Overview' : role === 'moderator' ? 'Review Queue' : 'Your Posts'}
        </h2>
      </div>

      {loading ? (
        <div style={{ fontSize: 13, color: 'var(--theme-text-dim, #6b7296)', padding: '12px 0' }}>Loading…</div>
      ) : (
        <>
          {/* Stat cards */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const, marginBottom: 28 }}>
            {(['draft', 'review', 'approved', 'published'] as const).map((s) =>
              counts[s] !== undefined ? <StatCard key={s} label={STATUS_LABELS[s]!} count={counts[s]!} status={s} /> : null
            )}
            {Object.keys(counts).length === 0 && (
              <div style={{ fontSize: 13, color: 'var(--theme-text-dim, #6b7296)' }}>No posts yet.</div>
            )}
          </div>

          {/* Attention banner */}
          {needsAttention.length > 0 && (
            <div style={{ marginBottom: 24, padding: '14px 18px', borderRadius: 8, border: '1px solid rgba(251,191,36,0.25)', background: 'rgba(251,191,36,0.07)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <span style={{ fontSize: 13, color: '#fbbf24', fontWeight: 500 }}>
                {role === 'moderator'
                  ? `${needsAttention.length} post${needsAttention.length > 1 ? 's' : ''} waiting for your review`
                  : `${needsAttention.length} post${needsAttention.length > 1 ? 's' : ''} approved — ready to publish`}
              </span>
              <a href="/admin/collections/posts" style={{ marginLeft: 'auto', fontSize: 11, color: '#fbbf24', textDecoration: 'none', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const }}>
                Go to Posts →
              </a>
            </div>
          )}

          {/* Table */}
          {tablePosts.length > 0 ? (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'var(--theme-text-dim, #6b7296)', marginBottom: 12 }}>
                {role === 'admin' ? 'All Posts' : role === 'moderator' ? 'Posts to Review' : 'Your Posts'}
              </div>
              <div style={{ border: '1px solid var(--theme-border-color, rgba(255,255,255,0.06))', borderRadius: 10, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--theme-border-color, rgba(255,255,255,0.06))', background: 'rgba(255,255,255,0.02)' }}>
                      <th style={th}>Title</th>
                      <th style={th}>Status</th>
                      {role !== 'author' && <th style={th}>Author</th>}
                      <th style={th}>Updated</th>
                      <th style={{ padding: '10px 16px' }} />
                    </tr>
                  </thead>
                  <tbody>
                    {tablePosts.slice(0, 20).map((post, i) => (
                      <tr key={post.id} style={{ borderBottom: i < Math.min(tablePosts.length, 20) - 1 ? '1px solid var(--theme-border-color, rgba(255,255,255,0.06))' : 'none' }}>
                        <td style={{ padding: '12px 16px', color: 'var(--theme-text, #d8dae6)', maxWidth: 340, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                          {post.title || '(No title)'}
                        </td>
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' as const }}>
                          <StatusBadge status={post.status} />
                        </td>
                        {role !== 'author' && (
                          <td style={{ padding: '12px 16px', color: 'var(--theme-text-dim, #6b7296)', whiteSpace: 'nowrap' as const, fontSize: 12 }}>
                            {(post.author as any)?.name || '—'}
                          </td>
                        )}
                        <td style={{ padding: '12px 16px', color: 'var(--theme-text-dim, #6b7296)', whiteSpace: 'nowrap' as const, fontSize: 12 }}>
                          {fmtDate(post.updatedAt)}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' as const }}>
                          <a href={`/admin/collections/posts/${post.id}`} style={{ fontSize: 11, color: '#6fa0f8', textDecoration: 'none', fontWeight: 600, letterSpacing: '0.06em', whiteSpace: 'nowrap' as const }}>
                            Open →
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {tablePosts.length > 20 && (
                  <div style={{ padding: '10px 16px', borderTop: '1px solid var(--theme-border-color, rgba(255,255,255,0.06))', fontSize: 12, color: 'var(--theme-text-dim, #6b7296)' }}>
                    Showing 20 of {tablePosts.length} —{' '}
                    <a href="/admin/collections/posts" style={{ color: '#6fa0f8', textDecoration: 'none' }}>view all</a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ padding: '32px 0', textAlign: 'center' as const, color: 'var(--theme-text-dim, #6b7296)', fontSize: 13 }}>
              {role === 'author' ? 'No posts yet. ' : 'No posts to show. '}
              <a href="/admin/collections/posts/create" style={{ color: '#6fa0f8', textDecoration: 'none' }}>
                Create your first post →
              </a>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default BeforeDashboard
