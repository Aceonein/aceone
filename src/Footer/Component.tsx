import Link from 'next/link'
import React from 'react'

const XIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width={14} height={14}>
    <path d="M12.6 2h2.4L9.8 7.4 16 14h-3.8l-3.8-5-4.4 5H1.6l5.5-6.3L1 2h3.9l3.5 4.6L12.6 2z" />
  </svg>
)
const LinkedInIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width={14} height={14}>
    <path d="M13.6 2H2.4A.4.4 0 002 2.4v11.2c0 .22.18.4.4.4h6V9.6H6.8V7.7h1.6V6.3c0-1.6.97-2.5 2.4-2.5.48 0 .97.04 1.44.08V5.8h-1c-.78 0-.93.37-.93.91V7.7h1.87l-.24 1.9h-1.63V14h3.19a.4.4 0 00.4-.4V2.4a.4.4 0 00-.4-.4z" />
  </svg>
)
const YouTubeIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width={14} height={14}>
    <path d="M15 4.6c-.18-.66-.7-1.18-1.36-1.36C12.4 3 8 3 8 3s-4.4 0-5.64.24C1.7 3.42 1.18 3.94 1 4.6.76 5.84.76 8.4.76 8.4s0 2.56.24 3.8c.18.66.7 1.18 1.36 1.36C3.6 13.8 8 13.8 8 13.8s4.4 0 5.64-.24c.66-.18 1.18-.7 1.36-1.36C15.24 10.96 15.24 8.4 15.24 8.4S15.24 5.84 15 4.6zM6.4 10.6V6.2l3.76 2.2L6.4 10.6z" />
  </svg>
)

const bg = '#0a0a08'
const bdr = '#2a2a26'
const t3 = 'rgba(240,239,233,0.28)'
const t2 = 'rgba(240,239,233,0.45)'

const cols = [
  { heading: 'Content', links: [
    { label: 'Personal Finance', href: '/?cat=personal-finance' },
    { label: 'Investing', href: '/?cat=investing' },
    { label: 'Markets', href: '/?cat=markets' },
    { label: 'Policy', href: '/?cat=policy' },
    { label: 'Crypto', href: '/?cat=crypto' },
  ]},
  { heading: 'Company', links: [
    { label: 'The Brief', href: '/brief' },
    { label: 'Admin', href: '/admin' },
  ]},
  { heading: 'Legal', links: [
    { label: 'Privacy policy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ]},
]

export async function Footer() {
  return (
    <footer style={{ background: bg, borderTop: `1px solid ${bdr}`, marginTop: 'auto' }} id="newsletter-foot">
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: `1px solid ${bdr}` }}>
        {/* Brand col */}
        <div style={{ padding: '40px 32px', borderRight: `1px solid ${bdr}` }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#f0efe9', marginBottom: 14 }}>ACEONE/</div>
          <p style={{ fontSize: 13, fontWeight: 400, color: t2, lineHeight: 1.7, maxWidth: 260 }}>
            The financially literate friend that young Indians never had.
          </p>
        </div>
        {/* Link cols */}
        {cols.map((col) => (
          <div key={col.heading} style={{ padding: '40px 32px', borderRight: `1px solid ${bdr}` }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: t3, marginBottom: 20 }}>{col.heading}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {col.links.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} style={{ fontSize: 13, color: t2, textDecoration: 'none' }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* Bottom bar */}
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: t3 }}>
          © 2026 Aceone · Anti-Debt. Pro-Decision.
        </span>
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          {[{ Icon: XIcon, label: 'Twitter' }, { Icon: LinkedInIcon, label: 'LinkedIn' }, { Icon: YouTubeIcon, label: 'YouTube' }].map(({ Icon, label }) => (
            <a key={label} href="#" style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 11, color: t3, textDecoration: 'none', padding: '0 14px', borderLeft: `1px solid ${bdr}` }}>
              <Icon />{label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
