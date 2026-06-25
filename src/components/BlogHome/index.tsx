'use client'

import Link from 'next/link'
import React, { useRef, useState } from 'react'

type Post = {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  publishedAt?: string | null
  readTime?: number | null
  views?: number | null
  upvotes?: number | null
  featuredImage?: { url?: string | null; alt?: string | null } | string | null
  categories?: Array<{ title?: string | null; id?: string | null } | string> | null
  author?: { name?: string | null } | string | null
}

type Category = { id: string; title?: string | null; slug?: string | null }

function fmtDate(iso?: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function fmtViews(v: number) {
  return v > 999 ? `${(v / 1000).toFixed(1)}k` : String(v)
}

function fmtMonthYear(iso?: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()
}

function catSlug(title?: string | null) {
  return (title ?? '').toLowerCase().replace(/\s+/g, '-')
}

const mono = 'var(--font-mono)'
const sans = 'var(--font-sans)'

function PostCard({ post, featured }: { post: Post; featured?: boolean }) {
  const cat = typeof post.categories?.[0] === 'object' ? post.categories[0] : null
  const author = typeof post.author === 'object' ? post.author : null
  const img = typeof post.featuredImage === 'object' ? post.featuredImage : null

  return (
    <Link href={`/posts/${post.slug}`} style={{
      display: 'block', textDecoration: 'none',
      borderRight: '1px solid var(--ao-border)',
      borderBottom: '1px solid var(--ao-border)',
      padding: 28,
      gridColumn: featured ? 'span 2' : undefined,
      background: 'transparent',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--ao-bg-2)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      <div style={{
        width: '100%', aspectRatio: featured ? '16/7' : '16/9',
        background: 'var(--ao-bg-2)',
        border: '1px solid var(--ao-border)',
        marginBottom: 20, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {img?.url
          ? <img src={img.url} alt={img.alt ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontFamily: mono, fontSize: 9, color: 'var(--ao-t3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Cover Image</span>
        }
      </div>

      {cat?.title && (
        <div style={{
          fontFamily: mono, fontSize: 9, fontWeight: 700,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'var(--ao-accent)', marginBottom: 12,
        }}>
          {cat.title}
        </div>
      )}

      <div style={{
        fontFamily: sans,
        fontSize: featured ? 24 : 17, fontWeight: 600, lineHeight: 1.25,
        letterSpacing: '-0.015em',
        color: 'var(--ao-t1)', marginBottom: 10,
      }}>
        {post.title}
      </div>

      {post.excerpt && (
        <div style={{
          fontFamily: sans, fontSize: 13, fontWeight: 300, lineHeight: 1.6,
          color: 'var(--ao-t2)', marginBottom: 18,
          display: '-webkit-box', WebkitLineClamp: featured ? 3 : 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {post.excerpt}
        </div>
      )}

      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        paddingTop: 14, borderTop: '1px solid var(--ao-border)',
        fontFamily: mono, fontSize: 9, letterSpacing: '0.06em',
        textTransform: 'uppercase', color: 'var(--ao-t3)',
      }}>
        <span>{author?.name ?? 'Aceone'}</span>
        {post.publishedAt && <><span style={{ color: 'var(--ao-border)' }}>/</span><span>{fmtDate(post.publishedAt)}</span></>}
        {post.readTime && <><span style={{ color: 'var(--ao-border)' }}>/</span><span>{post.readTime} min</span></>}
        {post.views != null && <span style={{ marginLeft: 'auto' }}>{fmtViews(post.views)} views</span>}
      </div>
    </Link>
  )
}

function PostListItem({ post, index }: { post: Post; index: number }) {
  const cat = typeof post.categories?.[0] === 'object' ? post.categories[0] : null
  const author = typeof post.author === 'object' ? post.author : null

  return (
    <Link href={`/posts/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '80px 1fr auto',
        alignItems: 'stretch', gap: 0,
        borderBottom: '1px solid var(--ao-border)',
        background: 'transparent',
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--ao-bg-2)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: mono, fontSize: 11, color: 'var(--ao-t3)',
          borderRight: '1px solid var(--ao-border)',
          padding: '20px 0',
        }}>
          {String(index + 1).padStart(2, '0')}
        </div>

        <div style={{ padding: '20px 24px' }}>
          {cat?.title && (
            <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ao-t3)', marginBottom: 6 }}>
              {cat.title}
            </div>
          )}
          <div style={{ fontFamily: sans, fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.35, color: 'var(--ao-t1)', marginBottom: 6 }}>
            {post.title}
          </div>
          {post.excerpt && (
            <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 300, lineHeight: 1.55, color: 'var(--ao-t2)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {post.excerpt}
            </div>
          )}
        </div>

        <div style={{
          padding: '20px 0',
          borderLeft: '1px solid var(--ao-border)',
          minWidth: 120,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          fontFamily: mono, fontSize: 9, color: 'var(--ao-t3)',
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          {post.readTime && <span>{post.readTime} min</span>}
          {post.views != null && <span>{fmtViews(post.views)} views</span>}
          {post.publishedAt && <span>{fmtDate(post.publishedAt)}</span>}
          {author?.name && <span>{author.name}</span>}
        </div>
      </div>
    </Link>
  )
}

export function BlogHome({ posts, categories, featuredPost }: { posts: Post[]; categories: Category[]; featuredPost: Post | null }) {
  const [activecat, setActivecat] = useState('all')
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'card' | 'list'>('card')
  const filterRef = useRef<HTMLDivElement>(null)

  const filtered = posts.filter(p => {
    const catMatch = activecat === 'all' || (p.categories ?? []).some(c => {
      const t = (typeof c === 'object' ? c.title : '') ?? ''
      return catSlug(t) === activecat
    })
    const qMatch = !query || p.title.toLowerCase().includes(query.toLowerCase()) || (p.excerpt ?? '').toLowerCase().includes(query.toLowerCase())
    return catMatch && qMatch
  })

  const catTabs = [
    { cat: 'all', label: 'All' },
    ...(categories.length > 0
      ? categories.map(c => ({ cat: catSlug(c.title), label: c.title ?? '' }))
      : [
          { cat: 'personal-finance', label: 'Personal Finance' },
          { cat: 'investing', label: 'Investing' },
          { cat: 'markets', label: 'Markets' },
          { cat: 'policy', label: 'Policy' },
          { cat: 'crypto', label: 'Crypto' },
          { cat: 'deep-dives', label: 'Deep Dives' },
        ]
    ),
  ]

  const eyebrow = featuredPost?.publishedAt
    ? `COVER STORY · ${fmtMonthYear(featuredPost.publishedAt)}`
    : 'ACEONE / BLOG — FINANCIAL INTELLIGENCE FOR YOUNG INDIA'

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section style={{
        marginTop: 'var(--ao-nav-h)',
        borderBottom: '1px solid var(--ao-border)',
        minHeight: '58vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto', width: '100%',
          padding: '56px 32px 48px',
          boxSizing: 'border-box',
        }}>
          {/* Eyebrow with leading line */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 32,
          }}>
            <span style={{ width: 28, height: 1, background: 'var(--ao-border-2)', display: 'block', flexShrink: 0 }} />
            <span style={{
              fontFamily: mono, fontSize: 10, fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'var(--ao-t3)',
            }}>
              {eyebrow}
            </span>
          </div>

          {featuredPost ? (
            <>
              <h1 style={{
                fontFamily: sans,
                fontSize: 'clamp(40px,5.2vw,72px)', fontWeight: 700,
                lineHeight: 1.0, letterSpacing: '-0.03em',
                color: 'var(--ao-t1)', marginBottom: 24, maxWidth: 860,
              }}>
                {featuredPost.title}
              </h1>
              {featuredPost.excerpt && (
                <p style={{
                  fontFamily: sans, fontSize: 15, fontWeight: 300, lineHeight: 1.7,
                  color: 'var(--ao-t2)', maxWidth: 440, marginBottom: 40,
                }}>
                  {featuredPost.excerpt}
                </p>
              )}
              <Link href={`/posts/${featuredPost.slug}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                fontFamily: mono, fontSize: 11, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--ao-bg)', background: 'var(--ao-t1)',
                padding: '12px 24px', textDecoration: 'none',
              }}>
                Read cover story →
              </Link>
            </>
          ) : (
            <h1 style={{
              fontFamily: sans,
              fontSize: 'clamp(40px,5.2vw,72px)', fontWeight: 700,
              lineHeight: 1.0, letterSpacing: '-0.03em',
              color: 'var(--ao-t1)', maxWidth: 860,
            }}>
              The smart money blog<br />for young India
            </h1>
          )}
        </div>
      </section>

      {/* ── Filter bar ───────────────────────────────────────────── */}
      <div ref={filterRef} style={{
        position: 'sticky', top: 'var(--ao-nav-h)', zIndex: 100,
        background: 'var(--ao-bg)',
        borderBottom: '1px solid var(--ao-border)',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'flex', alignItems: 'stretch', height: 44,
        }}>
          {/* Category tabs */}
          <div style={{ display: 'flex', alignItems: 'stretch', flex: 1, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {catTabs.map(({ cat, label }) => (
              <button key={cat} onClick={() => setActivecat(cat)} style={{
                flexShrink: 0, display: 'flex', alignItems: 'center',
                padding: '0 18px', height: '100%',
                fontFamily: mono, fontSize: 10, fontWeight: 400,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: activecat === cat ? 'var(--ao-t1)' : 'var(--ao-t3)',
                background: activecat === cat ? 'var(--ao-bg-2)' : 'none',
                border: 'none',
                borderRight: '1px solid var(--ao-border)',
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}>{label}</button>
            ))}
          </div>

          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '0 16px', borderLeft: '1px solid var(--ao-border)',
            minWidth: 180,
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={13} height={13} color="var(--ao-t3)">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search articles..."
              style={{
                background: 'none', border: 'none', outline: 'none',
                color: 'var(--ao-t1)', fontFamily: mono, fontSize: 11,
                letterSpacing: '0.04em', width: '100%',
              }}
            />
          </div>

          {/* View toggle */}
          <div style={{ display: 'flex', alignItems: 'stretch', borderLeft: '1px solid var(--ao-border)' }}>
            {(['card', 'list'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                width: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: v === view ? 'var(--ao-bg-2)' : 'none',
                border: 'none',
                borderLeft: v === 'list' ? '1px solid var(--ao-border)' : 'none',
                cursor: 'pointer',
                color: v === view ? 'var(--ao-t1)' : 'var(--ao-t3)',
              }}>
                {v === 'card'
                  ? <svg viewBox="0 0 16 16" fill="currentColor" width={14} height={14}><rect x="1" y="1" width="6" height="6" /><rect x="9" y="1" width="6" height="6" /><rect x="1" y="9" width="6" height="6" /><rect x="9" y="9" width="6" height="6" /></svg>
                  : <svg viewBox="0 0 16 16" fill="currentColor" width={14} height={14}><rect x="1" y="2" width="14" height="1.5" /><rect x="1" y="7" width="14" height="1.5" /><rect x="1" y="12" width="14" height="1.5" /></svg>
                }
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section header ───────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 0', borderBottom: '1px solid var(--ao-border)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            fontFamily: mono, fontSize: 10, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--ao-t3)',
          }}>
            <span style={{ width: 20, height: 1, background: 'var(--ao-border-2)', display: 'block' }} />
            Latest Articles
          </div>
          <span style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)', letterSpacing: '0.06em' }}>
            {filtered.length} articles
          </span>
        </div>
      </div>

      {/* ── Posts grid / list ────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {filtered.length === 0 ? (
          <p style={{ fontFamily: mono, fontSize: 12, color: 'var(--ao-t3)', padding: '60px 32px', textAlign: 'center' }}>
            No posts found.
          </p>
        ) : view === 'card' ? (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
            borderLeft: '1px solid var(--ao-border)',
          }}>
            {filtered.map((p, i) => (
              <PostCard key={p.id} post={p} featured={i === 0 && filtered.length >= 3} />
            ))}
          </div>
        ) : (
          <div>
            {filtered.map((p, i) => <PostListItem key={p.id} post={p} index={i} />)}
          </div>
        )}
      </div>
    </>
  )
}
