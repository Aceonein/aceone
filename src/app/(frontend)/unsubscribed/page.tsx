import Link from 'next/link'
import React from 'react'

export const metadata = {
  title: 'Unsubscribed — Aceone',
  description: "You've been unsubscribed from The Aceone Brief.",
}

const mono = 'var(--font-mono)'
const sans = 'var(--font-sans)'

export default function UnsubscribedPage() {
  return (
    <main
      style={{
        background: 'var(--ao-bg)',
        minHeight: '100vh',
        paddingTop: 'var(--ao-nav-h)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          maxWidth: 480,
          padding: '0 24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--ao-t3)',
            marginBottom: 24,
          }}
        >
          — Aceone Brief
        </div>
        <h1
          style={{
            fontFamily: sans,
            fontSize: 'clamp(28px,4vw,40px)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--ao-t1)',
            marginBottom: 16,
          }}
        >
          You&apos;re unsubscribed.
        </h1>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: 'var(--ao-t2)',
            marginBottom: 40,
          }}
        >
          No more emails from The Aceone Brief. You won&apos;t hear from us again.
          <br />
          Changed your mind? Subscribe again below.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <Link
            href="/#newsletter"
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: 'var(--ao-t1)',
              color: 'var(--ao-bg)',
              fontFamily: mono,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            Re-subscribe →
          </Link>
          <Link
            href="/"
            style={{
              fontFamily: mono,
              fontSize: 11,
              color: 'var(--ao-t3)',
              textDecoration: 'none',
              letterSpacing: '0.06em',
            }}
          >
            Back to Aceone
          </Link>
        </div>
      </div>
    </main>
  )
}
