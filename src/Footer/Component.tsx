import Link from 'next/link'
import React from 'react'
import { getCachedGlobal } from '@/utilities/getGlobals'

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
const InstagramIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width={14} height={14}>
    <path d="M8 1.44c2.14 0 2.39.01 3.23.05.78.04 1.2.16 1.48.27.37.14.64.32.92.6.28.28.46.55.6.92.11.28.23.7.27 1.48.04.84.05 1.09.05 3.23s-.01 2.39-.05 3.23c-.04.78-.16 1.2-.27 1.48-.14.37-.32.64-.6.92-.28.28-.55.46-.92.6-.28.11-.7.23-1.48.27-.84.04-1.09.05-3.23.05s-2.39-.01-3.23-.05c-.78-.04-1.2-.16-1.48-.27a2.47 2.47 0 01-.92-.6 2.47 2.47 0 01-.6-.92c-.11-.28-.23-.7-.27-1.48C1.45 10.39 1.44 10.14 1.44 8s.01-2.39.05-3.23c.04-.78.16-1.2.27-1.48.14-.37.32-.64.6-.92.28-.28.55-.46.92-.6.28-.11.7-.23 1.48-.27C5.61 1.45 5.86 1.44 8 1.44zM8 0C5.83 0 5.56.01 4.71.05 3.86.09 3.27.22 2.76.42a3.9 3.9 0 00-1.41.92A3.9 3.9 0 00.42 2.76C.22 3.27.09 3.86.05 4.71.01 5.56 0 5.83 0 8c0 2.17.01 2.44.05 3.29.04.85.17 1.44.37 1.95.2.53.48.98.92 1.41.43.44.88.72 1.41.92.51.2 1.1.33 1.95.37C5.56 15.99 5.83 16 8 16s2.44-.01 3.29-.05c.85-.04 1.44-.17 1.95-.37a3.9 3.9 0 001.41-.92 3.9 3.9 0 00.92-1.41c.2-.51.33-1.1.37-1.95.04-.85.05-1.12.05-3.29s-.01-2.44-.05-3.29c-.04-.85-.17-1.44-.37-1.95a3.9 3.9 0 00-.92-1.41A3.9 3.9 0 0013.24.42C12.73.22 12.14.09 11.29.05 10.44.01 10.17 0 8 0zm0 3.89a4.11 4.11 0 100 8.22 4.11 4.11 0 000-8.22zm0 6.78a2.67 2.67 0 110-5.34 2.67 2.67 0 010 5.34zm5.23-6.94a.96.96 0 11-1.92 0 .96.96 0 011.92 0z" />
  </svg>
)

const SOCIAL_ICONS: Record<string, React.FC> = {
  'Twitter / X': XIcon,
  LinkedIn: LinkedInIcon,
  YouTube: YouTubeIcon,
  Instagram: InstagramIcon,
}

const FALLBACK_COLS = [
  { heading: 'Content', links: [
    { label: 'Personal Finance', href: '/?cat=personal-finance' },
    { label: 'Investing', href: '/?cat=investing' },
    { label: 'Markets', href: '/?cat=markets' },
    { label: 'Policy', href: '/?cat=policy' },
    { label: 'Crypto', href: '/?cat=crypto' },
  ]},
  { heading: 'Company', links: [{ label: 'The Brief', href: '/the-brief' }, { label: 'Admin', href: '/admin' }] },
  { heading: 'Legal', links: [{ label: 'Privacy policy', href: '/privacy' }, { label: 'Terms', href: '/terms' }] },
]

function resolveLink(item: any): { href: string; label: string } {
  const l = item?.link ?? {}
  const href = l.type === 'custom'
    ? (l.url ?? '#')
    : l.reference?.value?.slug ? `/${l.reference.value.slug}` : '#'
  return { href, label: l.label ?? '' }
}

const bg = '#0a0a08'
const bdr = '#2a2a26'
const t3 = 'rgba(240,239,233,0.28)'
const t2 = 'rgba(240,239,233,0.45)'

export async function Footer() {
  const data = await getCachedGlobal('footer', 1)().catch(() => null)
  const footer = data as any

  const tagline = footer?.brandTagline ?? 'The financially literate friend that young Indians never had.'
  const copyright = footer?.copyrightText ?? '© 2026 Aceone · Anti-Debt. Pro-Decision.'

  const cols = footer?.columns?.length
    ? footer.columns.map((col: any) => ({
        heading: col.heading ?? '',
        links: (col.links ?? []).map(resolveLink),
      }))
    : FALLBACK_COLS

  const socials: Array<{ platform: string; url: string }> = footer?.socialLinks ?? []

  return (
    <footer style={{ background: bg, borderTop: `1px solid ${bdr}`, marginTop: 'auto' }} id="newsletter-foot">
      <div className="ao-footer-grid" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: `2fr ${cols.map(() => '1fr').join(' ')}`, borderBottom: `1px solid ${bdr}` }}>
        {/* Brand col */}
        <div className="ao-footer-brand" style={{ padding: '40px 32px', borderRight: `1px solid ${bdr}` }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#f0efe9', marginBottom: 14 }}>ACEONE/</div>
          <p style={{ fontSize: 13, fontWeight: 400, color: t2, lineHeight: 1.7, maxWidth: 260 }}>{tagline}</p>
        </div>
        {/* Link cols */}
        {cols.map((col: any, i: number) => (
          <div key={i} className="ao-footer-link-col" style={{ padding: '40px 32px', borderRight: `1px solid ${bdr}` }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: t3, marginBottom: 20 }}>{col.heading}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {col.links.map(({ label, href }: any) => (
                <li key={href}>
                  <Link href={href} style={{ fontSize: 13, color: t2, textDecoration: 'none' }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* Bottom bar */}
      <div className="ao-footer-bottom" style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: t3 }}>{copyright}</span>
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          {socials.length > 0
            ? socials.map(({ platform, url }) => {
                const Icon = SOCIAL_ICONS[platform]
                return (
                  <a key={platform} href={url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 11, color: t3, textDecoration: 'none', padding: '0 14px', borderLeft: `1px solid ${bdr}` }}>
                    {Icon && <Icon />}<span className="ao-social-label">{platform}</span>
                  </a>
                )
              })
            : [{ Icon: XIcon, label: 'Twitter / X' }, { Icon: LinkedInIcon, label: 'LinkedIn' }, { Icon: YouTubeIcon, label: 'YouTube' }].map(({ Icon, label }) => (
                <a key={label} href="#" style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 11, color: t3, textDecoration: 'none', padding: '0 14px', borderLeft: `1px solid ${bdr}` }}>
                  <Icon /><span className="ao-social-label">{label}</span>
                </a>
              ))
          }
        </div>
      </div>
    </footer>
  )
}
