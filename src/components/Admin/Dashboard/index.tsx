import type { AdminViewServerProps, Where } from 'payload'
import Link from 'next/link'
import React from 'react'

const PAGE_SIZE = 5

const STATUSES = [
  { key: 'draft', label: 'Draft', color: 'var(--theme-elevation-500)' },
  { key: 'review', label: 'In review', color: 'var(--ao-amber)' },
  { key: 'approved', label: 'Approved', color: 'var(--ao-violet)' },
  { key: 'published', label: 'Published', color: 'var(--ao-green)' },
] as const

type StatusKey = (typeof STATUSES)[number]['key']

const statusMeta = (key: string) => STATUSES.find((s) => s.key === key)

const fmtDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

function href(status: string, page: number) {
  const q = new URLSearchParams()
  if (status !== 'all') q.set('status', status)
  if (page > 1) q.set('page', String(page))
  const s = q.toString()
  return `/admin${s ? `?${s}` : ''}`
}

function pageWindow(current: number, total: number): Array<number | '…'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const set = new Set([1, total, current - 1, current, current + 1])
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)
  const out: Array<number | '…'> = []
  nums.forEach((n, i) => {
    if (i > 0 && n - (nums[i - 1] as number) > 1) out.push('…')
    out.push(n)
  })
  return out
}

export default async function Dashboard({ initPageResult, searchParams }: AdminViewServerProps) {
  const { req } = initPageResult
  const { payload } = req
  const user = req.user as any
  const role: string = user?.role ?? 'author'
  const isAuthor = role === 'author'

  // Authors only ever see their own posts; admins and moderators see everything.
  const scope: Where | undefined = isAuthor ? { createdBy: { equals: user.id } } : undefined
  const withScope = (w: Where): Where => (scope ? { and: [scope, w] } : w)

  const sp = searchParams ?? {}
  const rawStatus = Array.isArray(sp.status) ? sp.status[0] : sp.status
  const defaultStatus = role === 'moderator' ? 'review' : 'all'
  const status = rawStatus && (rawStatus === 'all' || STATUSES.some((s) => s.key === rawStatus)) ? rawStatus : defaultStatus
  const requestedPage = Math.max(1, parseInt(String(Array.isArray(sp.page) ? sp.page[0] : sp.page ?? '1'), 10) || 1)

  const countFor = (key: StatusKey) =>
    payload
      .count({ collection: 'posts', where: withScope({ status: { equals: key } }), req, overrideAccess: false })
      .then((r) => r.totalDocs)
      .catch(() => 0)

  const counts = await Promise.all(STATUSES.map((s) => countFor(s.key)))
  const byStatusCount = Object.fromEntries(STATUSES.map((s, i) => [s.key, counts[i] ?? 0])) as Record<StatusKey, number>
  const allCount = counts.reduce((a, b) => a + b, 0)

  // Clamp before querying so a page past the end shows the last page, not an empty list.
  const listTotal = status === 'all' ? allCount : (byStatusCount[status as StatusKey] ?? 0)
  const page = Math.min(requestedPage, Math.max(1, Math.ceil(listTotal / PAGE_SIZE)))

  const listPage = await payload.find({
    collection: 'posts',
    where: withScope(status === 'all' ? {} : { status: { equals: status } }),
    sort: '-updatedAt',
    limit: PAGE_SIZE,
    page,
    depth: 1,
    select: { title: true, status: true, updatedAt: true, author: true, featuredImage: true } as any,
    req,
    overrideAccess: false,
  })

  const byStatus = byStatusCount
  const total = allCount

  // The one bucket that is waiting on this person.
  const attention: StatusKey | null = role === 'moderator' ? 'review' : role === 'admin' ? 'approved' : null
  const attentionHint = (key: StatusKey) =>
    key === 'review' ? 'Waiting for your review' : key === 'approved' ? 'Ready to publish' : key === 'draft' ? 'Work in progress' : 'Live on the site'

  const first = listPage.totalDocs === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const last = Math.min(page * PAGE_SIZE, listPage.totalDocs)
  const firstName = String(user?.name ?? user?.email ?? '').split(' ')[0]

  const tabs = [{ key: 'all', label: 'All', n: total }, ...STATUSES.map((s) => ({ key: s.key, label: s.label, n: byStatus[s.key] }))]

  const shortcuts = [
    { label: 'All posts', href: '/admin/collections/posts' },
    { label: 'Media library', href: '/admin/collections/media' },
    ...(isAuthor
      ? []
      : [
          { label: 'The Brief', href: '/admin/collections/aceone-briefs' },
          { label: 'Subscribers', href: '/admin/collections/newsletter-subscribers' },
          { label: 'Authors', href: '/admin/collections/authors' },
        ]),
  ]

  return (
    <div className="ao-dash">
      <div className="ao-dash__head">
        <div>
          <div className="ao-dash__kicker">{role === 'admin' ? 'Content overview' : role === 'moderator' ? 'Review queue' : 'Your posts'}</div>
          <h1 className="ao-dash__title">Welcome back{firstName ? `, ${firstName}` : ''}</h1>
        </div>
        <div className="ao-dash__actions">
          <Link className="ao-pill" href="/admin/collections/media">
            Upload media
          </Link>
          <Link className="ao-pill ao-pill--ink" href="/admin/collections/posts/create">
            + New post
          </Link>
        </div>
      </div>

      <div className="ao-stats">
        {STATUSES.map((s) => (
          <Link
            key={s.key}
            href={href(s.key, 1)}
            className={`ao-stat${attention === s.key && byStatus[s.key] > 0 ? ' ao-stat--accent' : ''}`}
            style={{ ['--dot' as any]: s.color }}
          >
            <span className="ao-stat__label">
              <i className="ao-stat__dot" />
              {s.label}
            </span>
            <span className="ao-stat__num">{byStatus[s.key]}</span>
            <span className="ao-stat__hint">{attentionHint(s.key)}</span>
          </Link>
        ))}
      </div>

      <div className="ao-dash__grid">
        <section className="ao-card" aria-labelledby="ao-recent">
          <div className="ao-card__head">
            <h2 className="ao-card__title" id="ao-recent">
              Recent posts
            </h2>
            <nav className="ao-tabs" aria-label="Filter posts by status">
              {tabs.map((t) => (
                <Link key={t.key} className="ao-tab" href={href(t.key, 1)} aria-current={status === t.key ? 'true' : undefined}>
                  {t.label} <span>{t.n}</span>
                </Link>
              ))}
            </nav>
          </div>

          {listPage.docs.length === 0 ? (
            <div className="ao-empty">
              <strong>No posts here yet</strong>
              {status === 'all' ? 'Create your first post to get started.' : 'Nothing is in this status right now.'}
            </div>
          ) : (
            <ul className="ao-list">
              {listPage.docs.map((post: any) => {
                const meta = statusMeta(post.status)
                const img = typeof post.featuredImage === 'object' ? post.featuredImage : null
                const thumb = img?.sizes?.thumbnail?.url ?? img?.url
                const authorName = typeof post.author === 'object' ? post.author?.name : null
                return (
                  <li key={post.id}>
                    <Link className="ao-row" href={`/admin/collections/posts/${post.id}`}>
                      {thumb ? <img className="ao-thumb" src={thumb} alt="" /> : <span className="ao-thumb" />}
                      <span>
                        <div className="ao-row__title">{post.title || '(Untitled)'}</div>
                        {authorName && !isAuthor && <div className="ao-row__meta">{authorName}</div>}
                      </span>
                      <span className="ao-badge" style={{ ['--b' as any]: meta?.color }}>
                        {meta?.label ?? post.status}
                      </span>
                      <span className="ao-row__date">{fmtDate(post.updatedAt)}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}

          {listPage.totalPages > 1 && (
            <div className="ao-pager">
              <span className="ao-pager__info">
                {first}–{last} of {listPage.totalDocs}
              </span>
              <nav className="ao-pager__nav" aria-label="Pagination">
                <Link className="ao-pager__btn" href={href(status, page - 1)} aria-disabled={page <= 1} aria-label="Previous page">
                  ←
                </Link>
                {pageWindow(page, listPage.totalPages).map((n, i) =>
                  n === '…' ? (
                    <span key={`gap-${i}`} className="ao-pager__info">
                      …
                    </span>
                  ) : (
                    <Link key={n} className="ao-pager__btn" href={href(status, n)} aria-current={n === page ? 'page' : undefined}>
                      {n}
                    </Link>
                  ),
                )}
                <Link className="ao-pager__btn" href={href(status, page + 1)} aria-disabled={page >= listPage.totalPages} aria-label="Next page">
                  →
                </Link>
              </nav>
            </div>
          )}
        </section>

        <aside className="ao-card" aria-labelledby="ao-shortcuts">
          <div className="ao-card__head">
            <h2 className="ao-card__title" id="ao-shortcuts">
              Shortcuts
            </h2>
          </div>
          <div className="ao-shortcuts">
            {shortcuts.map((s) => (
              <Link key={s.href} className="ao-shortcut" href={s.href}>
                {s.label} <span>→</span>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
