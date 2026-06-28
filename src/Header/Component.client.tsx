'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function toRelative(url: string): string {
  try { const u = new URL(url); return u.pathname + u.search + u.hash } catch { return url }
}

function resolveItem(item: any): { href: string; label: string; type: 'text' | 'cta'; alignment: 'left' | 'right' } {
  const l = item?.link ?? {}
  const raw =
    l.type === 'custom'
      ? (l.url ?? '#')
      : l.reference?.value?.slug
        ? `/${l.reference.value.slug}`
        : '#'
  const href = raw.startsWith('http') ? toRelative(raw) : raw
  return {
    href,
    label: l.label ?? '',
    type: item?.type ?? 'text',
    alignment: item?.alignment ?? 'left',
  }
}

const FALLBACK_NAV = [
  { href: '/', label: 'Blog', type: 'text' as const, alignment: 'left' as const },
  { href: '/the-brief', label: 'The Brief', type: 'text' as const, alignment: 'left' as const },
  { href: '#newsletter', label: 'Subscribe', type: 'cta' as const, alignment: 'right' as const },
]

type FooterCol = { heading: string; links: { href: string; label: string }[] }

export const HeaderClient: React.FC<{ navItems?: any[]; footerCols?: FooterCol[] }> = ({
  navItems = [],
  footerCols = [],
}) => {
  const pathname = usePathname()
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = localStorage.getItem('aceone-theme') as 'light' | 'dark' | null
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    return stored ?? preferred
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [openCols, setOpenCols] = useState<string[]>([])
  const toggleCol = (h: string) =>
    setOpenCols(cols => (cols.includes(h) ? cols.filter(c => c !== h) : [...cols, h]))

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.documentElement.style.overflow = '' }
  }, [menuOpen])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('aceone-theme', next)
  }

  const isActive = (href: string) => {
    if (href.includes('?') || href.startsWith('#')) return false
    return href === '/' ? pathname === '/' : pathname.startsWith(href)
  }

  const items = navItems.length > 0 ? navItems.map(resolveItem) : FALLBACK_NAV
  const leftItems = items.filter(i => i.alignment === 'left')
  const rightItems = items.filter(i => i.alignment === 'right')
  const ctaItem = rightItems.find(i => i.type === 'cta')
  const mainNavItems = [...leftItems, ...rightItems.filter(i => i.type !== 'cta')]

  const renderItem = (item: ReturnType<typeof resolveItem>, side: 'left' | 'right') => {
    const active = item.type === 'text' && isActive(item.href)
    const borderSide = side === 'left'
      ? { borderRight: '1px solid var(--ao-border)' }
      : { borderLeft: '1px solid var(--ao-border)' }

    if (item.type === 'cta') {
      return (
        <Link key={`${item.href}-${item.label}`} href={item.href} className="ao-cta" style={{
          display: 'flex', alignItems: 'center',
          padding: '0 20px', flexShrink: 0,
          ...borderSide,
          fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--ao-bg)', background: 'var(--ao-t1)',
          textDecoration: 'none', whiteSpace: 'nowrap',
        }}>{item.label}</Link>
      )
    }

    return (
      <Link key={`${item.href}-${item.label}`} href={item.href} style={{
        display: 'flex', alignItems: 'center',
        padding: '0 18px',
        ...borderSide,
        fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: active ? 700 : 400,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: active ? 'var(--ao-bg)' : 'var(--ao-t3)',
        background: active ? 'var(--ao-t1)' : 'none',
        textDecoration: 'none', whiteSpace: 'nowrap',
        borderBottom: active ? '2px solid var(--ao-accent)' : '2px solid transparent',
        transition: 'color 0.2s, background 0.2s',
      }}>{item.label}</Link>
    )
  }

  return (
    <>
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
          {/* Hamburger — mobile only, extreme left */}
          <button
            className="ao-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            style={{
              alignItems: 'center', justifyContent: 'center',
              width: 48, flexShrink: 0, background: 'none', border: 'none',
              borderRight: '1px solid var(--ao-border)',
              cursor: 'pointer', color: 'var(--ao-t1)',
            }}
          >
            {menuOpen
              ? <svg viewBox="0 0 20 20" fill="currentColor" width={16} height={16}><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              : <svg viewBox="0 0 20 20" fill="currentColor" width={16} height={16}><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
            }
          </button>

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

          <nav className="ao-nav-links" style={{ display: 'flex', alignItems: 'stretch' }}>
            {leftItems.map(item => renderItem(item, 'left'))}
          </nav>

          <div style={{ flex: 1 }} />

          <div className="ao-nav-cta-right" style={{ display: 'flex', alignItems: 'stretch' }}>
            {rightItems.map(item => renderItem(item, 'right'))}
          </div>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            suppressHydrationWarning
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 48, flexShrink: 0, background: 'none', border: 'none',
              borderLeft: '1px solid var(--ao-border)',
              cursor: 'pointer', color: 'var(--ao-t3)', transition: 'color 0.2s',
            }}
          >
            {theme === 'dark'
              ? <svg viewBox="0 0 20 20" fill="currentColor" width={14} height={14}><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 011.414-1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
              : <svg viewBox="0 0 20 20" fill="currentColor" width={14} height={14}><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            }
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          top: 'var(--ao-nav-h)',
          background: 'var(--ao-bg)',
          borderTop: '1px solid var(--ao-border)',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
        }}>
          {/* Main nav */}
          {mainNavItems.map(item => {
            const active = isActive(item.href)
            return (
              <Link
                key={`mob-${item.href}-${item.label}`}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: '18px 24px',
                  paddingLeft: active ? '21px' : '24px',
                  borderBottom: '1px solid var(--ao-border)',
                  borderLeft: active ? '3px solid var(--ao-accent)' : '3px solid transparent',
                  fontFamily: 'var(--font-mono)', fontSize: 12,
                  fontWeight: active ? 700 : 400,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: active ? 'var(--ao-bg)' : 'var(--ao-t2)',
                  background: active ? 'var(--ao-t1)' : 'transparent',
                  textDecoration: 'none',
                }}
              >
                {item.label}
                <span style={{ marginLeft: 'auto', color: 'var(--ao-t3)', fontSize: 10 }}>→</span>
              </Link>
            )
          })}

          {/* Footer cols — accordions */}
          {footerCols.map(col => {
            const open = openCols.includes(col.heading)
            return (
              <div key={col.heading}>
                <button
                  onClick={() => toggleCol(col.heading)}
                  aria-expanded={open}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    padding: '18px 24px',
                    borderBottom: '1px solid var(--ao-border)',
                    background: open ? 'var(--ao-bg-2)' : 'transparent',
                    border: 'none', borderBottomWidth: 1, borderBottomStyle: 'solid',
                    borderBottomColor: 'var(--ao-border)',
                    cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--ao-t1)',
                  }}
                >
                  {col.heading}
                  <span style={{
                    marginLeft: 'auto', color: 'var(--ao-t3)', fontSize: 13,
                    display: 'inline-flex', transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}>+</span>
                </button>
                {open && col.links.map(({ href, label }) => {
                  const active = isActive(href)
                  return (
                    <Link
                      key={`mob-col-${href}-${label}`}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center',
                        padding: '14px 24px 14px 40px',
                        borderBottom: '1px solid var(--ao-border)',
                        borderLeft: active ? '3px solid var(--ao-accent)' : '3px solid transparent',
                        paddingLeft: active ? '37px' : '40px',
                        background: active ? 'var(--ao-t1)' : 'var(--ao-bg-2)',
                        fontFamily: 'var(--font-mono)', fontSize: 11,
                        fontWeight: active ? 600 : 400,
                        letterSpacing: '0.04em',
                        color: active ? 'var(--ao-bg)' : 'var(--ao-t2)',
                        textDecoration: 'none',
                      }}
                    >
                      {label}
                      <span style={{ marginLeft: 'auto', color: 'var(--ao-t3)', fontSize: 10 }}>→</span>
                    </Link>
                  )
                })}
              </div>
            )
          })}

        </div>
      )}
    </>
  )
}
