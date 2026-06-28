'use client'

import React, { useEffect, useState } from 'react'

type State = 'idle' | 'loading' | 'done' | 'already' | 'invalid' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SUBSCRIBED_KEY = 'ao_subscribed'

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(SUBSCRIBED_KEY)) setState('done')
  }, [])

  const emailValid = EMAIL_RE.test(email)
  const showInlineError = touched && email.length > 0 && !emailValid

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!emailValid) return
    setState('loading')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent: { newsletter: true } }),
      })
      if (res.ok) { localStorage.setItem(SUBSCRIBED_KEY, '1'); setState('done'); return }
      if (res.status === 409) { setState('already'); return }
      if (res.status === 400) { setState('invalid'); return }
      setState('error')
    } catch {
      setState('error')
    }
  }

  const errorMsg: Record<string, string> = {
    already: 'Already subscribed. Check your inbox for past issues.',
    invalid: 'Invalid email address.',
    error: 'Something went wrong. Try again.',
  }

  return (
    <section id="newsletter" className="ao-nl-section" style={{ background: 'var(--ao-nl-bg)', borderTop: '1px solid var(--ao-border)', padding: '110px 48px', transition: 'background 0.4s' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div className="ao-nl-label" style={{ marginBottom: 26 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ao-nl-t2)' }}>
            <span style={{ fontSize: 14 }}>—</span> The Aceone Brief
          </span>
        </div>
        <h2 className="ao-nl-heading" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(36px,5vw,52px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--ao-nl-t1)', marginBottom: 16, transition: 'color 0.4s' }}>
          Market intelligence, distilled.
        </h2>
        <p className="ao-nl-desc" style={{ fontSize: 16, fontWeight: 300, color: 'var(--ao-nl-t2)', lineHeight: 1.72, marginBottom: 38, transition: 'color 0.4s' }}>
          Every Sunday — one email, the week&apos;s most important financial decision explained clearly. No jargon. No agenda. Founder voice.
        </p>

        {state === 'done' ? (
          <div style={{ padding: '8px 0 24px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ao-accent)', marginBottom: 14 }}>
              ✓ You&apos;re in
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ao-nl-t1)', lineHeight: 1.1, margin: 0, textWrap: 'balance' as any }}>
              See you Sunday.
            </p>
          </div>
        ) : (
          <>
            <form onSubmit={submit} className="ao-nl-form" style={{ display: 'flex', gap: 8, marginBottom: 0 }}>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); if (state !== 'idle' && state !== 'loading') setState('idle') }}
                onBlur={() => setTouched(true)}
                placeholder="you@email.com"
                disabled={state === 'loading'}
                style={{
                  flex: 1, height: 50, padding: '0 20px',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${showInlineError ? '#f87171' : 'var(--ao-nl-t2)'}`,
                  borderRadius: 0, fontFamily: 'inherit', fontSize: 14,
                  color: 'var(--ao-nl-t1)', outline: 'none', transition: 'border-color 0.2s',
                }}
              />
              <button
                type="submit"
                disabled={state === 'loading'}
                className="ao-cta"
                style={{ padding: '0 26px', height: 50, background: 'var(--ao-nl-t1)', color: 'var(--ao-nl-bg)', fontSize: 14, fontWeight: 600, borderRadius: 0, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', opacity: state === 'loading' ? 0.7 : 1 }}
              >
                {state === 'loading' ? '…' : 'Subscribe →'}
              </button>
            </form>

            {/* Inline email validation */}
            {showInlineError && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#f87171', marginBottom: 8, textAlign: 'left' }}>
                Enter a valid email address.
              </p>
            )}

            {/* API error messages */}
            {errorMsg[state] && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: state === 'already' ? 'var(--ao-nl-t2)' : '#f87171', marginBottom: 8, textAlign: 'left' }}>
                {errorMsg[state]}
              </p>
            )}
          </>
        )}

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ao-t3)', transition: 'color 0.4s', marginTop: 12, marginBottom: 0 }}>
          Join <strong>1,000+ readers</strong> · No spam · Unsubscribe anytime
        </p>
        {state !== 'done' && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ao-t3)', marginTop: 10, lineHeight: 1.6, opacity: 0.8 }}>
            By subscribing you agree to our{' '}
            <a href="/terms" style={{ color: 'var(--ao-t3)', textDecoration: 'underline' }}>Terms</a>
            {' '}and{' '}
            <a href="/privacy" style={{ color: 'var(--ao-t3)', textDecoration: 'underline' }}>Privacy Policy</a>.
            Unsubscribe anytime.
          </p>
        )}
      </div>
    </section>
  )
}
