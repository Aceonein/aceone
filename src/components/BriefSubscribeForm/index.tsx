'use client'

import React, { useState } from 'react'

const mono = 'var(--font-mono)'

export const BriefSubscribeForm: React.FC<{ readers: number }> = ({ readers }) => {
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

  if (state === 'done') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ao-accent)' }}>
          ✓ You're in
        </div>
        <p style={{ fontFamily: mono, fontSize: 12, color: 'var(--ao-t2)', lineHeight: 1.7, letterSpacing: '0.03em' }}>
          First issue lands Sunday. Check your inbox.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ao-t3)', marginBottom: 6 }}>
        Subscribe to The Brief
      </div>
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        disabled={state === 'loading'}
        style={{
          width: '100%', padding: '13px 16px', boxSizing: 'border-box',
          background: 'var(--ao-bg)', border: '1px solid var(--ao-border-2)',
          fontFamily: mono, fontSize: 13, color: 'var(--ao-t1)',
          outline: 'none', display: 'block',
        }}
      />
      <button
        type="submit"
        disabled={state === 'loading'}
        className="ao-cta"
        style={{
          display: 'block', width: '100%', padding: '13px 0', cursor: 'pointer',
          background: 'var(--ao-t1)', color: 'var(--ao-bg)',
          fontFamily: mono, fontSize: 11, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          textDecoration: 'none', border: 'none',
          opacity: state === 'loading' ? 0.6 : 1,
        }}
      >
        {state === 'loading' ? 'Subscribing…' : 'Subscribe →'}
      </button>
      {state === 'error' && (
        <p style={{ fontFamily: mono, fontSize: 10, color: '#e05c5c', letterSpacing: '0.04em' }}>
          Something went wrong. Try again.
        </p>
      )}
      <p style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)', lineHeight: 1.7, letterSpacing: '0.04em', marginTop: 4 }}>
        Join {readers.toLocaleString()}+ readers · No spam · Unsubscribe anytime
      </p>
    </form>
  )
}
