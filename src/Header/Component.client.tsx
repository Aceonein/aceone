'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function resolveNavItem(item: any): { href: string; label: string } {
  const l = item?.link ?? {}
  const href =
    l.type === 'custom'
      ? (l.url ?? '#')
      : l.reference?.value?.slug
        ? `/${l.reference.value.slug}`
        : '#'
  return { href, label: l.label ?? '' }
}

const FALLBACK_NAV = [
  { href: '/', label: 'Blog' },
  { href: '/brief', label: 'The Brief' },
]

export const HeaderClient: React.FC<{ navItems?: any[] }> = ({ navItems = [] }) => {
  const pathname = usePathname()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const stored = localStorage.getItem('aceone-theme') as 'light' | 'dark' | null
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const t = stored ?? preferred
    setTheme(t)
    document.documentElement.setAttribute('data-theme', t)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('aceone-theme', next)
  }

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const links = navItems.length > 0 ? navItems.map(resolveNavItem) : FALLBACK_NAV

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      height: 'var(--ao-nav-h)', background: 'var(--ao-nav-bg)',
      borderBottom: '1px solid var(--ao-border)',
      transition: 'background 0.3s, border-color 0.3s',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        height: '100%', display: 'flex', alignItems: 'stretch',
      }}>
        {/* Brand */}
        <Link href="/" style={{
          display: 'flex', alignItems: 'center',
          padding: '0 20px', borderRight: '1px solid var(--ao-border)',
          textDecoration: 'none', flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ao-t1)',
            transition: 'color 0.3s',
          }}>ACEONE/</span>
        </Link>

        {/* Nav links */}
        <nav className="ao-nav-links" style={{ display: 'flex', alignItems: 'stretch' }}>
          {links.map(({ href, label }) => {
            const active = isActive(href)
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center',
                padding: '0 18px', borderRight: '1px solid var(--ao-border)',
                fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: active ? 700 : 400,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: active ? 'var(--ao-bg)' : 'var(--ao-t3)',
                background: active ? 'var(--ao-t1)' : 'none',
                textDecoration: 'none', whiteSpace: 'nowrap',
                borderBottom: active ? '2px solid var(--ao-accent)' : '2px solid transparent',
                transition: 'color 0.2s, background 0.2s',
              }}>{label}</Link>
            )
          })}
        </nav>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 48, flexShrink: 0,
              background: 'none', border: 'none',
              borderLeft: '1px solid var(--ao-border)',
              cursor: 'pointer', color: 'var(--ao-t3)',
              transition: 'color 0.2s',
            }}
          >
            {theme === 'dark'
              ? <svg viewBox="0 0 20 20" fill="currentColor" width={14} height={14}><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 011.414-1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
              : <svg viewBox="0 0 20 20" fill="currentColor" width={14} height={14}><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            }
          </button>
          <Link href="#newsletter" className="ao-cta" style={{
            display: 'flex', alignItems: 'center',
            padding: '0 20px', flexShrink: 0,
            borderLeft: '1px solid var(--ao-border)',
            fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--ao-bg)', background: 'var(--ao-t1)',
            textDecoration: 'none', whiteSpace: 'nowrap',
          }}>Subscribe</Link>
        </div>
      </div>
    </header>
  )
}
