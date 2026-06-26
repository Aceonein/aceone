'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'ao_cookie_consent'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
  }, [])

  function respond(decision: 'accepted' | 'rejected') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ decision, timestamp: Date.now() }))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999,
        background: 'var(--ao-surface, #1a1c20)',
        border: '1px solid var(--ao-border, #2e3440)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        maxWidth: '640px',
        width: 'calc(100% - 48px)',
      }}
    >
      <p style={{ margin: 0, fontSize: '13px', color: 'var(--ao-t2, #a0a8b8)', flex: 1, lineHeight: 1.5 }}>
        We use cookies for analytics. By continuing, you agree to our{' '}
        <a href="/privacy" style={{ color: 'var(--ao-t1)', textDecoration: 'underline' }}>privacy policy</a>.
      </p>
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={() => respond('rejected')}
          style={{
            background: 'none',
            border: '1px solid var(--ao-border, #2e3440)',
            color: 'var(--ao-t2, #a0a8b8)',
            padding: '6px 14px',
            fontSize: '12px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Reject
        </button>
        <button
          onClick={() => respond('accepted')}
          className="ao-cta"
          style={{
            background: 'var(--ao-t1, #edeae3)',
            border: 'none',
            color: 'var(--ao-bg, #0d0f14)',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Accept
        </button>
      </div>
    </div>
  )
}
