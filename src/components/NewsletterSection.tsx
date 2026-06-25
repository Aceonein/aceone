'use client'

import React, { useState } from 'react'

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    setState('loading')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent: { newsletter: true } }),
      })
      setState(res.ok ? 'done' : 'error')
    } catch {
      setState('error')
    }
  }

  return (
    <section id="newsletter" style={{ background: 'var(--ao-nl-bg)', padding: '110px 48px', transition: 'background 0.4s' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ marginBottom: 26 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ao-nl-t2)' }}>
            <span style={{ fontSize: 14 }}>—</span> The Aceone Brief
          </span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px,5vw,52px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--ao-nl-t1)', marginBottom: 16, transition: 'color 0.4s' }}>
          Market intelligence, distilled.
        </h2>
        <p style={{ fontSize: 16, fontWeight: 300, color: 'var(--ao-nl-t2)', lineHeight: 1.72, marginBottom: 38, transition: 'color 0.4s' }}>
          Every Sunday — one email, the week&apos;s most important financial decision explained clearly. No jargon. No agenda. Founder voice.
        </p>
        {state === 'done' ? (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--ao-nl-t1)', letterSpacing: '0.04em' }}>✓ You&apos;re in. See you Sunday.</p>
        ) : (
          <form onSubmit={submit} style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              style={{ flex: 1, height: 50, padding: '0 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 100, fontFamily: 'inherit', fontSize: 14, color: 'var(--ao-nl-t1)', outline: 'none', transition: 'border-color 0.2s' }}
            />
            <button
              type="submit"
              disabled={state === 'loading'}
              style={{ padding: '0 26px', height: 50, background: 'var(--ao-nl-t1)', color: 'var(--ao-nl-bg)', fontSize: 14, fontWeight: 600, borderRadius: 100, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', opacity: state === 'loading' ? 0.7 : 1 }}
            >
              {state === 'loading' ? '…' : 'Subscribe →'}
            </button>
          </form>
        )}
        {state === 'error' && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#f87171', marginTop: 8 }}>Something went wrong. Try again.</p>}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.32)', transition: 'color 0.4s' }}>
          Join <strong>1,000+ readers</strong> · No spam · Unsubscribe anytime
        </p>
      </div>
    </section>
  )
}
