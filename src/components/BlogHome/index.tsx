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

type Category = { id: string; title?: string | null }

function catLabel(title?: string | null) {
  return (title ?? '').toUpperCase()
}

function fmtDate(iso?: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fmtViews(v: number) {
  return v > 999 ? `${(v / 1000).toFixed(1)}k` : String(v)
}

const mono = 'var(--font-mono)'

// ── Card view ─────────────────────────────────────────────────────────────────

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
    }}>
      {/* Image */}
      <div style={{
        width: '100%', aspectRatio: featured ? '21/9' : '16/9',
        background: 'var(--ao-bg-2)',
        borderBottom: '1px solid var(--ao-border)',
        marginBottom: 20, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {img?.url
          ? <img src={img.url} alt={img.alt ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)' }}>No image</span>
        }
      </div>

      {/* Category label */}
      {cat?.title && (
        <div style={{
          fontFamily: mono, fontSize: 10, fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'var(--ao-accent)', marginBottom: 10,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ width: 16, height: 1, background: 'var(--ao-accent)', display: 'inline-block' }} />
          {catLabel(cat.title)}
        </div>
      )}

      <div style={{
        fontSize: featured ? 22 : 16, fontWeight: 600, lineHeight: 1.3,
        color: 'var(--ao-t1)', marginBottom: 10,
      }}>
        {post.title}
      </div>

      {post.excerpt && (
        <div style={{
          fontSize: 13, lineHeight: 1.65, color: 'var(--ao-t2)',
          marginBottom: 16,
          display: '-webkit-box', WebkitLineClamp: featured ? 3 : 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {post.excerpt}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', paddingTop: 14, borderTop: '1px solid var(--ao-border)' }}>
        <span style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)' }}>{author?.name ?? 'Aceone'}</span>
        {post.publishedAt && <span style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)' }}>{fmtDate(post.publishedAt)}</span>}
        {post.readTime && <span style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)' }}>{post.readTime} min</span>}
        {post.views != null && (
          <span style={{ marginLeft: 'auto', fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)' }}>
            {fmtViews(post.views)} reads
          </span>
        )}
      </div>
    </Link>
  )
}

// ── List view ─────────────────────────────────────────────────────────────────

function PostListItem({ post, index }: { post: Post; index: number }) {
  const cat = typeof post.categories?.[0] === 'object' ? post.categories[0] : null
  const author = typeof post.author === 'object' ? post.author : null

  return (
    <Link href={`/posts/${post.slug}`} style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '52px 1fr auto',
        alignItems: 'start', gap: 0,
        borderBottom: '1px solid var(--ao-border)',
        transition: 'background 0.15s',
      }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--ao-bg-2)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        {/* Number */}
        <div style={{
          padding: '20px 0 20px 0', textAlign: 'center',
          fontFamily: mono, fontSize: 11, color: 'var(--ao-t3)',
          borderRight: '1px solid var(--ao-border)',
        }}>
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Body */}
        <div style={{ padding: '18px 24px' }}>
          {cat?.title && (
            <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ao-accent)', marginBottom: 6 }}>
              {catLabel(cat.title)}
            </div>
          )}
          <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35, color: 'var(--ao-t1)', marginBottom: 6 }}>
            {post.title}
          </div>
          {post.excerpt && (
            <div style={{ fontSize: 12.5, lineHeight: 1.6, color: 'var(--ao-t2)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {post.excerpt}
            </div>
          )}
        </div>

        {/* Meta */}
        <div style={{ padding: '18px 20px 18px 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
          <span style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)' }}>{author?.name ?? 'Aceone'}</span>
          {post.publishedAt && <span style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)' }}>{fmtDate(post.publishedAt)}</span>}
          {post.readTime && <span style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)' }}>{post.readTime} min</span>}
          {post.views != null && <span style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)' }}>{fmtViews(post.views)} reads</span>}
        </div>
      </div>
    </Link>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function BlogHome({ posts, categories, featuredPost }: { posts: Post[]; categories: Category[]; featuredPost: Post | null }) {
  const [activecat, setActivecat] = useState('all')
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'card' | 'list'>('card')
  const filterRef = useRef<HTMLDivElement>(null)

  const filtered = posts.filter(p => {
    const catMatch = activecat === 'all' || (p.categories ?? []).some(c => {
      const t = (typeof c === 'object' ? c.title : '') ?? ''
      return t.toLowerCase().replace(/\s+/g, '-') === activecat
    })
    const qMatch = !query || p.title.toLowerCase().includes(query.toLowerCase()) || (p.excerpt ?? '').toLowerCase().includes(query.toLowerCase())
    return catMatch && qMatch
  })

  const catTabs = [
    { cat: 'all', label: 'All' },
    { cat: 'personal-finance', label: 'Personal Finance' },
    { cat: 'investing', label: 'Investing' },
    { cat: 'markets', label: 'Markets' },
    { cat: 'policy', label: 'Policy' },
    { cat: 'crypto', label: 'Crypto' },
    { cat: 'deep-dives', label: 'Deep Dives' },
  ]

  return (
    <>
      {/* Hero */}
      <section style={{
        marginTop: 'var(--ao-nav-h)',
        borderBottom: '1px solid var(--ao-border)',
        padding: '56px 24px',
        background: 'var(--ao-bg)',
        minHeight: '58vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        maxWidth: 1280, margin: 'var(--ao-nav-h) auto 0',
        position: 'relative',
      }}>
        <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ao-t3)', marginBottom: 20 }}>
          Aceone / Blog — Financial intelligence for young India
        </div>
        {featuredPost ? (
          <>
            <h1 style={{ fontSize: 'clamp(32px,5vw,64px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.02em', color: 'var(--ao-t1)', marginBottom: 18, maxWidth: 860 }}>
              {featuredPost.title}
            </h1>
            {featuredPost.excerpt && (
              <p style={{ fontSize: 16, lineHeight: 1.68, color: 'var(--ao-t2)', maxWidth: 600, marginBottom: 32 }}>
                {featuredPost.excerpt}
              </p>
            )}
          </>
        ) : (
          <h1 style={{ fontSize: 'clamp(32px,5vw,64px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.02em', color: 'var(--ao-t1)', marginBottom: 32, maxWidth: 860 }}>
            The smart money blog for young India
          </h1>
        )}

        {/* Stats row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {[
            { value: String(posts.length), label: 'Articles' },
            { value: '1k+', label: 'Brief readers' },
            { value: 'Weekly', label: 'Newsletter' },
          ].map(({ value, label }, i) => (
            <div key={label} style={{
              padding: '12px 24px',
              borderLeft: i > 0 ? '1px solid var(--ao-border)' : undefined,
            }}>
              <div style={{ fontFamily: mono, fontSize: 18, fontWeight: 700, color: 'var(--ao-t1)', lineHeight: 1 }}>{value}</div>
              <div style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
            </div>
          ))}
          {featuredPost && (
            <Link href={`/posts/${featuredPost.slug}`} style={{
              marginLeft: 'auto',
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontFamily: mono, fontSize: 11, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--ao-bg)', background: 'var(--ao-t1)',
              padding: '12px 24px', textDecoration: 'none',
              border: '1px solid var(--ao-t1)',
            }}>
              Read cover story →
            </Link>
          )}
        </div>
      </section>

      {/* Filter bar */}
      <div ref={filterRef} style={{
        position: 'sticky', top: 'var(--ao-nav-h)', zIndex: 100,
        background: 'var(--ao-bg)',
        borderBottom: '1px solid var(--ao-border)',
        maxWidth: 1280, margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'stretch', height: 44, width: '100%' }}>
          {/* Category tabs */}
          <div style={{ display: 'flex', alignItems: 'stretch', flex: 1, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {catTabs.map(({ cat, label }) => (
              <button key={cat} onClick={() => setActivecat(cat)} style={{
                flexShrink: 0, display: 'flex', alignItems: 'center',
                padding: '0 16px', height: '100%',
                fontFamily: mono, fontSize: 10, fontWeight: activecat === cat ? 700 : 400,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: activecat === cat ? 'var(--ao-t1)' : 'var(--ao-t3)',
                background: 'none', border: 'none',
                borderRight: '1px solid var(--ao-border)',
                borderBottom: activecat === cat ? '2px solid var(--ao-accent)' : '2px solid transparent',
                cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'color 0.15s',
              }}>{label}</button>
            ))}
          </div>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', borderLeft: '1px solid var(--ao-border)', minWidth: 200 }}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} width={13} height={13} color="var(--ao-t3)">
              <circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5l3 3" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search…"
              style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--ao-t1)', fontFamily: mono, fontSize: 11, width: '100%' }}
            />
          </div>

          {/* View toggle */}
          <div style={{ display: 'flex', alignItems: 'stretch', borderLeft: '1px solid var(--ao-border)' }}>
            {(['card', 'list'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                width: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: v === view ? 'var(--ao-bg-2)' : 'none',
                border: 'none', borderLeft: v === 'list' ? '1px solid var(--ao-border)' : 'none',
                cursor: 'pointer', color: v === view ? 'var(--ao-t1)' : 'var(--ao-t3)',
              }}>
                {v === 'card'
                  ? <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} width={14} height={14}><rect x="2" y="2" width="5" height="5" /><rect x="9" y="2" width="5" height="5" /><rect x="2" y="9" width="5" height="5" /><rect x="9" y="9" width="5" height="5" /></svg>
                  : <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} width={14} height={14}><path d="M2 4h12M2 8h12M2 12h12" strokeLinecap="round" /></svg>
                }
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts */}
      <div style={{ maxWidth: 1280, margin: '0 auto', background: 'var(--ao-bg)' }}>
        {filtered.length === 0 ? (
          <p style={{ fontFamily: mono, fontSize: 12, color: 'var(--ao-t3)', padding: '60px 24px', textAlign: 'center' }}>No posts found.</p>
        ) : view === 'card' ? (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
            borderLeft: '1px solid var(--ao-border)',
            borderTop: '1px solid var(--ao-border)',
          }}>
            {filtered.map((p, i) => (
              <PostCard key={p.id} post={p} featured={i === 0 && filtered.length >= 3} />
            ))}
          </div>
        ) : (
          <div style={{ borderTop: '1px solid var(--ao-border)' }}>
            {filtered.map((p, i) => <PostListItem key={p.id} post={p} index={i} />)}
          </div>
        )}
      </div>
    </>
  )
}
