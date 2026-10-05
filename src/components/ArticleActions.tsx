'use client'
import React, { useEffect, useState } from 'react'

const mono = 'var(--font-mono)'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function UpvoteButton({ slug, initial, compact, bar, fullWidth }: { slug: string; initial: number; compact?: boolean; bar?: boolean; fullWidth?: boolean }) {
  const [count, setCount] = useState(initial)
  const [voted, setVoted] = useState(false)
  const [loading, setLoading] = useState(false)
  const storageKey = `ao:upvoted:${slug}`

  useEffect(() => {
    try { if (localStorage.getItem(storageKey)) setVoted(true) } catch {}
  }, [storageKey])

  const remember = (v: boolean) => {
    try { v ? localStorage.setItem(storageKey, '1') : localStorage.removeItem(storageKey) } catch {}
  }

  const toggle = async () => {
    if (loading) return
    setLoading(true)
    const action = voted ? 'remove' : 'add'
    try {
      const res = await fetch(`/api/posts/${slug}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (res.ok) {
        const data = await res.json()
        setCount(data.upvotes)
        setVoted(!voted)
        remember(!voted)
      } else {
        const { error } = await res.json().catch(() => ({ error: '' }))
        if (error === 'Already upvoted') { setVoted(true); remember(true) }
        else if (error === 'Not upvoted') { setVoted(false); remember(false) }
      }
    } catch {}
    setLoading(false)
  }

  if (bar) {
    return (
      <button
        onClick={toggle}
        disabled={loading}
        aria-label={voted ? 'Remove upvote' : 'Upvote'}
        aria-pressed={voted}
        style={{
          height: 44, padding: '0 16px',
          width: fullWidth ? '100%' : undefined,
          display: fullWidth ? 'flex' : 'inline-flex', alignItems: 'center', gap: 10,
          background: voted ? 'var(--ao-t1)' : 'transparent',
          border: `1px solid ${voted ? 'var(--ao-t1)' : 'var(--ao-border-2)'}`,
          color: voted ? 'var(--ao-bg)' : 'var(--ao-t1)',
          fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1,
          transition: 'background .18s ease, color .18s ease, border-color .18s ease',
        }}
      >
        <svg viewBox="0 0 16 16" fill="currentColor" width={12} height={12} aria-hidden="true">
          <path d="M8 2L2 9h4v5h4V9h4L8 2z" />
        </svg>
        <span style={{ flex: fullWidth ? 1 : undefined, textAlign: 'left' }}>{voted ? 'Upvoted' : 'Upvote'}</span>
        <span style={{ paddingLeft: 10, borderLeft: `1px solid ${voted ? 'var(--ao-bg)' : 'var(--ao-border-2)'}`, fontVariantNumeric: 'tabular-nums' }}>{count}</span>
      </button>
    )
  }

  if (compact) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0 }}>
        <button
          onClick={toggle}
          disabled={loading}
          aria-label="Upvote"
          style={{
            width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: voted ? 'var(--ao-t1)' : 'var(--ao-bg-2)',
            border: '1px solid var(--ao-border)',
            cursor: 'pointer',
            color: voted ? 'var(--ao-bg)' : 'var(--ao-t3)',
            transition: 'all 0.2s',
          }}
        >
          <svg viewBox="0 0 16 16" fill="currentColor" width={12} height={12}>
            <path d="M8 2L2 9h4v5h4V9h4L8 2z" />
          </svg>
        </button>
        <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, color: 'var(--ao-t1)', lineHeight: 1, textAlign: 'center', width: 34 }}>{count}</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, paddingBottom: 20, borderBottom: '1px solid var(--ao-border)' }}>
      <button
        onClick={toggle}
        disabled={loading}
        aria-label="Upvote"
        style={{
          width: 44, height: 44,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: voted ? 'var(--ao-t1)' : 'var(--ao-bg-2)',
          border: '1px solid var(--ao-border)',
          cursor: 'pointer',
          color: voted ? 'var(--ao-bg)' : 'var(--ao-t3)',
          transition: 'all 0.2s',
        }}
      >
        <svg viewBox="0 0 16 16" fill="currentColor" width={14} height={14}>
          <path d="M8 2L2 9h4v5h4V9h4L8 2z" />
        </svg>
      </button>
      <div style={{ fontFamily: mono, fontSize: 18, fontWeight: 700, color: 'var(--ao-t1)', lineHeight: 1 }}>{count}</div>
      <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ao-t3)' }}>Upvotes</div>
    </div>
  )
}

export function ShareButtons({ url, title, horizontal }: { url: string; title: string; horizontal?: boolean }) {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const nativeShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title, url }).catch(() => {})
    }
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`

  const items = [
    {
      label: 'Twitter / X',
      onClick: () => window.open(twitterUrl, '_blank'),
      icon: (
        <svg viewBox="0 0 16 16" fill="currentColor" width={12} height={12}>
          <path d="M12.6 2h2.4L9.8 7.4 16 14h-3.8l-3.8-5-4.4 5H1.6l5.5-6.3L1 2h3.9l3.5 4.6L12.6 2z" />
        </svg>
      ),
    },
    {
      label: copied ? 'Copied!' : 'Copy Link',
      onClick: copyLink,
      icon: (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} width={12} height={12}>
          <rect x="5" y="5" width="9" height="9" rx="1" />
          <path d="M11 5V3a1 1 0 00-1-1H3a1 1 0 00-1 1v7a1 1 0 001 1h2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: 'Share',
      onClick: nativeShare,
      icon: (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} width={12} height={12}>
          <path d="M8 2v8M5 5l3-3 3 3M3 11v2a1 1 0 001 1h8a1 1 0 001-1v-2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: horizontal ? 'row' : 'column', flexWrap: horizontal ? 'wrap' : undefined, gap: horizontal ? 4 : 0 }}>
      {items.map(({ label, onClick, icon }) => (
        <button
          key={label}
          onClick={onClick}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: horizontal ? '7px 12px' : '10px 0',
            background: horizontal ? 'var(--ao-bg-2)' : 'none',
            border: horizontal ? '1px solid var(--ao-border)' : 'none',
            borderBottom: horizontal ? '1px solid var(--ao-border)' : '1px solid var(--ao-border)',
            cursor: 'pointer', textAlign: 'left',
            fontFamily: mono, fontSize: 10, color: 'var(--ao-t2)',
            letterSpacing: '0.04em',
          }}
        >
          <span style={{ color: 'var(--ao-t3)' }}>{icon}</span>
          {label}
        </button>
      ))}
    </div>
  )
}

export function TOCClient({ items }: { items: { label: string; id: string }[] }) {
  if (!items.length) return null
  return (
    <div>
      <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ao-t3)', marginBottom: 14 }}>In this article</div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map(({ label, id }) => (
          <a
            key={id}
            href={`#${id}`}
            style={{ fontFamily: mono, fontSize: 11, color: 'var(--ao-t2)', textDecoration: 'none', padding: '7px 0', borderBottom: '1px solid var(--ao-border)', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span style={{ color: 'var(--ao-t3)', fontSize: 10 }}>/</span> {label}
          </a>
        ))}
      </div>
    </div>
  )
}
