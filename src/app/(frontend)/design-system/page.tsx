import React from 'react'
import { font, type as t, space, z, transition, layout } from '@/lib/ds'

export const metadata = {
  title: 'Design System — Aceone',
  description: 'Aceone design token library: typography, color, spacing, z-index, and component patterns.',
}

const mono = font.mono
const sans = font.sans

// Color tokens
const colorTokens = {
  light: [
    { token: '--ao-bg',         value: '#f8f7f4', label: 'Background' },
    { token: '--ao-bg-2',       value: '#f0efe9', label: 'Background 2' },
    { token: '--ao-bg-3',       value: '#e8e7e0', label: 'Background 3' },
    { token: '--ao-surface',    value: '#ffffff', label: 'Surface' },
    { token: '--ao-border',     value: '#d4d3cc', label: 'Border' },
    { token: '--ao-border-2',   value: '#b8b7af', label: 'Border 2' },
    { token: '--ao-border-ui',  value: '#a0a099', label: 'Border UI' },
    { token: '--ao-t1',         value: '#0a0a08', label: 'Text Primary' },
    { token: '--ao-t2',         value: '#4a4a44', label: 'Text Secondary' },
    { token: '--ao-t3',         value: '#6a6960', label: 'Text Tertiary' },
    { token: '--ao-accent',     value: '#3B3FD8', label: 'Accent' },
    { token: '--ao-accent-dim', value: 'rgba(59,63,216,0.08)', label: 'Accent Dim' },
  ],
  dark: [
    { token: '--ao-bg',         value: '#0a0a08', label: 'Background' },
    { token: '--ao-bg-2',       value: '#111110', label: 'Background 2' },
    { token: '--ao-bg-3',       value: '#1a1a18', label: 'Background 3' },
    { token: '--ao-surface',    value: '#161614', label: 'Surface' },
    { token: '--ao-border',     value: '#2a2a26', label: 'Border' },
    { token: '--ao-border-2',   value: '#3a3a36', label: 'Border 2' },
    { token: '--ao-border-ui',  value: '#4a4a44', label: 'Border UI' },
    { token: '--ao-t1',         value: '#f0efe9', label: 'Text Primary' },
    { token: '--ao-t2',         value: '#8c8b84', label: 'Text Secondary' },
    { token: '--ao-t3',         value: '#888880', label: 'Text Tertiary' },
    { token: '--ao-accent',     value: '#6b6ff0', label: 'Accent' },
    { token: '--ao-accent-dim', value: 'rgba(107,111,240,0.12)', label: 'Accent Dim' },
  ],
  category: [
    { token: '--ao-dot-pf',  value: '#3b82f6', label: 'Personal Finance' },
    { token: '--ao-dot-inv', value: '#22c55e', label: 'Investing' },
    { token: '--ao-dot-mkt', value: '#f59e0b', label: 'Markets' },
    { token: '--ao-dot-pol', value: '#a78bfa', label: 'Policy' },
    { token: '--ao-dot-cry', value: '#06b6d4', label: 'Crypto' },
    { token: '--ao-dot-dd',  value: '#f97316', label: 'Deep Dives' },
  ],
}

const typePresets = [
  { name: 'type.labelSm',   use: 'Tags, tiny badges',                  sample: 'MARKETS · 2 MIN', style: { ...t.labelSm } },
  { name: 'type.label',     use: 'Section eyebrows, stat labels',       sample: 'PUBLISHED · CATEGORY', style: { ...t.label } },
  { name: 'type.meta',      use: 'Filter headers, sidebar labels',      sample: 'YEAR · MONTH · EDITIONS', style: { ...t.meta } },
  { name: 'type.nav',       use: 'Navigation links, CTA buttons',       sample: 'SUBSCRIBE → · THE BRIEF', style: { ...t.nav } },
  { name: 'type.brand',     use: 'Logo wordmark',                       sample: 'ACEONE/', style: { ...t.brand } },
  { name: 'type.bodySm',    use: 'Card excerpts, secondary text',       sample: 'The biggest financial mistake young Indians make is treating savings and investing as the same thing.', style: { ...t.bodySm } },
  { name: 'type.body',      use: 'Brief body text, issue content',      sample: 'One financial decision explained clearly. No jargon. No agenda. Honest thinking about money.', style: { ...t.body } },
  { name: 'type.bodyBase',  use: 'Brief subtitles, standard paragraphs', sample: 'Every Sunday — one financial decision explained clearly. No jargon. No agenda.', style: { ...t.bodyBase } },
  { name: 'type.bodyLg',    use: 'Article body, lead paragraphs',       sample: 'The retirement number nobody tells you. The math is simpler than the industry wants you to believe.', style: { ...t.bodyLg } },
  { name: 'type.listTitle', use: 'Brief sidebar issue titles',          sample: 'The Retirement Number Nobody Tells You', style: { ...t.listTitle } },
  { name: 'type.cardTitle', use: 'Blog post list titles',               sample: 'Index Funds Explained: Which Nifty and Why', style: { ...t.cardTitle } },
  { name: 'type.itemTitle', use: 'Post card titles',                    sample: 'The Savings Trap: Why Playing It Safe Is the Riskiest Move', style: { ...t.itemTitle } },
  { name: 'type.h4',        use: 'Minor section headings in prose',     sample: 'What ₹1 Crore Actually Buys', style: { ...t.h4 } },
  { name: 'type.h3',        use: 'Article subheadings',                 sample: 'Safe Withdrawal Rate: The Real Math', style: { ...t.h3 } },
  { name: 'type.h2',        use: 'Article major headings',              sample: 'Why Most Retirement Plans Fail', style: { ...t.h2 } },
  { name: 'type.h2Sm',      use: 'Brief inline viewer title',           sample: 'The Retirement Number Nobody Tells You', style: { ...t.h2Sm } },
  { name: 'type.displaySm', use: 'Brief issue page h1',                 sample: 'Market Intelligence, Distilled', style: { ...t.displaySm } },
  { name: 'type.displayMd', use: 'Article page h1',                     sample: 'The Smart Money Blog for Young India', style: { ...t.displayMd } },
  { name: 'type.displayLg', use: 'Brief hero h1',                       sample: 'Market Intelligence, Distilled.', style: { ...t.displayLg } },
  { name: 'type.displayXl', use: 'Blog hero h1',                        sample: 'The smart money blog for young India', style: { ...t.displayXl } },
]

const spaceEntries = Object.entries(space) as [string, number][]
const zEntries = Object.entries(z) as [string, number][]
const transitionEntries = Object.entries(transition) as [string, string][]

const sec: React.CSSProperties = {
  paddingTop: 64,
  paddingBottom: 64,
  borderBottom: '1px solid var(--ao-border)',
}
const sectionLabel: React.CSSProperties = {
  ...t.label,
  color: 'var(--ao-t3)',
  marginBottom: 8,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
}
const sectionTitle: React.CSSProperties = {
  ...t.h2,
  color: 'var(--ao-t1)',
  marginBottom: 40,
}
const tokenPill: React.CSSProperties = {
  ...t.labelSm,
  fontFamily: mono,
  background: 'var(--ao-bg-2)',
  border: '1px solid var(--ao-border)',
  padding: '3px 8px',
  color: 'var(--ao-accent)',
  display: 'inline-block',
}

const navItems = [
  { href: '#colors', label: 'Colors' },
  { href: '#typography', label: 'Typography' },
  { href: '#spacing', label: 'Spacing' },
  { href: '#zindex', label: 'Z-Index' },
  { href: '#transitions', label: 'Transitions' },
  { href: '#components', label: 'Components' },
  { href: '#usage', label: 'Usage' },
]

export default function DesignSystemPage() {
  return (
    <main style={{ background: 'var(--ao-bg)', minHeight: '100vh', paddingTop: 'var(--ao-nav-h)' }}>

      {/* Hero */}
      <div style={{ borderBottom: '1px solid var(--ao-border)', padding: '56px 0 48px' }}>
        <div style={{ ...layout.container, padding: '0 48px' }}>
          <div style={{ ...t.label, color: 'var(--ao-t3)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 24, height: 1, background: 'var(--ao-border-2)', display: 'block' }} />
            Aceone
          </div>
          <h1 style={{ ...t.displayMd, color: 'var(--ao-t1)', marginBottom: 16 }}>Design System</h1>
          <p style={{ ...t.bodyLg, color: 'var(--ao-t2)', maxWidth: 520 }}>
            Token library and component reference for the Aceone platform. All tokens live in{' '}
            <code style={{ fontFamily: mono, fontSize: 13, color: 'var(--ao-accent)' }}>src/lib/ds.ts</code>{' '}
            and{' '}
            <code style={{ fontFamily: mono, fontSize: 13, color: 'var(--ao-accent)' }}>globals.css</code>.
          </p>
        </div>
      </div>

      <div style={{ ...layout.container, padding: '0 48px', display: 'grid', gridTemplateColumns: '200px 1fr', gap: 64, alignItems: 'start' }}>

        {/* Sidebar nav */}
        <nav style={{ position: 'sticky', top: 'calc(var(--ao-nav-h) + 32px)', paddingTop: 48, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(item => (
            <a key={item.href} href={item.href} style={{
              ...t.nav,
              color: 'var(--ao-t3)',
              textDecoration: 'none',
              padding: '8px 12px',
              borderLeft: '2px solid transparent',
            }}>
              {item.label}
            </a>
          ))}
          <div style={{ marginTop: 24, borderTop: '1px solid var(--ao-border)', paddingTop: 20 }}>
            <a href="/design-system.html" style={{ ...t.label, color: 'var(--ao-accent)', textDecoration: 'none', display: 'block', marginBottom: 8 }}>↓ HTML file</a>
            <a href="/design-system.md" style={{ ...t.label, color: 'var(--ao-accent)', textDecoration: 'none', display: 'block' }}>↓ Markdown</a>
          </div>
        </nav>

        {/* Main content */}
        <div>

          {/* ── Colors ── */}
          <section id="colors" style={sec}>
            <div style={sectionLabel}><span style={{ width: 20, height: 1, background: 'var(--ao-border-2)', display: 'block' }} />Colors</div>
            <h2 style={sectionTitle}>Color Tokens</h2>

            <div style={{ ...t.meta, color: 'var(--ao-t3)', marginBottom: 16 }}>Light mode</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 40 }}>
              {colorTokens.light.map(c => (
                <div key={c.token} style={{ border: '1px solid var(--ao-border)', overflow: 'hidden' }}>
                  <div style={{ height: 40, background: c.value, borderBottom: '1px solid var(--ao-border)' }} />
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ ...t.label, color: 'var(--ao-t1)', marginBottom: 4 }}>{c.label}</div>
                    <div style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)' }}>{c.token}</div>
                    <div style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)' }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ ...t.meta, color: 'var(--ao-t3)', marginBottom: 16 }}>Dark mode</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 40, background: '#0a0a08', padding: 16, border: '1px solid #2a2a26' }}>
              {colorTokens.dark.map(c => (
                <div key={c.token} style={{ border: '1px solid #2a2a26', overflow: 'hidden' }}>
                  <div style={{ height: 40, background: c.value, borderBottom: '1px solid #2a2a26' }} />
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f0efe9', marginBottom: 4 }}>{c.label}</div>
                    <div style={{ fontFamily: mono, fontSize: 10, color: '#888880' }}>{c.token}</div>
                    <div style={{ fontFamily: mono, fontSize: 10, color: '#888880' }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ ...t.meta, color: 'var(--ao-t3)', marginBottom: 16 }}>Category dots</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {colorTokens.category.map(c => (
                <div key={c.token} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', border: '1px solid var(--ao-border)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.value, display: 'block', flexShrink: 0 }} />
                  <div>
                    <div style={{ ...t.label, color: 'var(--ao-t1)' }}>{c.label}</div>
                    <div style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)' }}>{c.token} · {c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Typography ── */}
          <section id="typography" style={sec}>
            <div style={sectionLabel}><span style={{ width: 20, height: 1, background: 'var(--ao-border-2)', display: 'block' }} />Typography</div>
            <h2 style={sectionTitle}>Type Scale</h2>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {typePresets.map(p => (
                <div key={p.name} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'start', gap: 24, padding: '24px 0', borderBottom: '1px solid var(--ao-border)' }}>
                  <div>
                    <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, color: 'var(--ao-accent)', marginBottom: 6 }}>{p.name}</div>
                    <div style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)', lineHeight: 1.6, marginBottom: 8 }}>
                      {('fontFamily' in p.style) && <div>family: {String(p.style.fontFamily).includes('mono') ? 'Space Mono' : 'Space Grotesk'}</div>}
                      {('fontSize' in p.style) && <div>size: {String(p.style.fontSize)}</div>}
                      {('fontWeight' in p.style) && <div>weight: {String(p.style.fontWeight)}</div>}
                      {('lineHeight' in p.style) && <div>line-h: {String(p.style.lineHeight)}</div>}
                      {('letterSpacing' in p.style) && <div>tracking: {String(p.style.letterSpacing)}</div>}
                    </div>
                    <div style={{ ...t.labelSm, color: 'var(--ao-t3)' }}>{p.use}</div>
                  </div>
                  <div style={{ ...p.style, color: 'var(--ao-t1)', wordBreak: 'break-word' }}>{p.sample}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Spacing ── */}
          <section id="spacing" style={sec}>
            <div style={sectionLabel}><span style={{ width: 20, height: 1, background: 'var(--ao-border-2)', display: 'block' }} />Spacing</div>
            <h2 style={sectionTitle}>Space Scale</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {spaceEntries.map(([key, val]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ width: 80, ...t.label, color: 'var(--ao-t3)' }}>space[{key}]</div>
                  <div style={{ ...t.label, color: 'var(--ao-t2)', width: 40 }}>{val}px</div>
                  <div style={{ width: val, height: 20, background: 'var(--ao-accent)', flexShrink: 0 }} />
                  <div style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)' }}>--ao-space-{key}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Z-Index ── */}
          <section id="zindex" style={sec}>
            <div style={sectionLabel}><span style={{ width: 20, height: 1, background: 'var(--ao-border-2)', display: 'block' }} />Z-Index</div>
            <h2 style={sectionTitle}>Z-Index Scale</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[...zEntries].reverse().map(([key, val]) => {
                const usages: Record<string, string> = {
                  grain: 'Grain overlay (html::before)',
                  header: 'Fixed header',
                  overlay: 'Mobile menu, reading progress',
                  sticky: 'Blog filter bar',
                  raised: 'Article breadcrumb',
                  above: 'General above-content',
                  tab: 'Brief sidebar toggle tab',
                  base: 'Base stacking',
                }
                return (
                  <div key={key} style={{ display: 'grid', gridTemplateColumns: '120px 80px 1fr', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--ao-border)' }}>
                    <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, color: 'var(--ao-accent)' }}>z.{key}</div>
                    <div style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: 'var(--ao-t1)' }}>{val}</div>
                    <div style={{ ...t.body, color: 'var(--ao-t3)' }}>{usages[key]}</div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* ── Transitions ── */}
          <section id="transitions" style={sec}>
            <div style={sectionLabel}><span style={{ width: 20, height: 1, background: 'var(--ao-border-2)', display: 'block' }} />Transitions</div>
            <h2 style={sectionTitle}>Transition Presets</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {transitionEntries.map(([key, val]) => (
                <div key={key} style={{ display: 'grid', gridTemplateColumns: '160px 200px 1fr', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--ao-border)' }}>
                  <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, color: 'var(--ao-accent)' }}>transition.{key}</div>
                  <div style={{ fontFamily: mono, fontSize: 12, color: 'var(--ao-t2)' }}>{val}</div>
                  <div style={tokenPill}>--ao-t-{key}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Components ── */}
          <section id="components" style={sec}>
            <div style={sectionLabel}><span style={{ width: 20, height: 1, background: 'var(--ao-border-2)', display: 'block' }} />Components</div>
            <h2 style={sectionTitle}>Component Patterns</h2>

            {/* Buttons */}
            <div style={{ ...t.meta, color: 'var(--ao-t3)', marginBottom: 16 }}>Buttons</div>
            <div style={{ display: 'flex', gap: 0, marginBottom: 40, flexWrap: 'wrap' }}>
              <button className="ao-cta" style={{ ...t.nav, background: 'var(--ao-t1)', color: 'var(--ao-bg)', padding: '0 24px', height: 48, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                Subscribe →
              </button>
              <button style={{ ...t.nav, background: 'transparent', color: 'var(--ao-t1)', padding: '0 24px', height: 48, border: '1px solid var(--ao-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: -1 }}>
                Read more
              </button>
              <button style={{ ...t.nav, background: 'var(--ao-accent)', color: '#fff', padding: '0 24px', height: 48, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: 16 }}>
                Accent CTA
              </button>
            </div>

            {/* Labels & Tags */}
            <div style={{ ...t.meta, color: 'var(--ao-t3)', marginBottom: 16 }}>Labels & Tags</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 40, alignItems: 'center' }}>
              <span style={{ ...t.label, color: 'var(--ao-t3)', padding: '4px 0' }}>Section eyebrow</span>
              <span style={{ ...t.meta, color: 'var(--ao-t3)', padding: '4px 0', marginLeft: 16 }}>Filter header</span>
              <span style={{ ...t.labelSm, color: 'var(--ao-t3)', border: '1px solid var(--ao-border)', padding: '2px 8px' }}>markets</span>
              <span style={{ ...t.label, color: 'var(--ao-bg)', background: 'var(--ao-accent)', padding: '3px 10px' }}>ISSUE #003</span>
              <span style={{ ...t.label, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#3b82f6', display: 'block' }} />
                Personal Finance
              </span>
            </div>

            {/* Filter pill */}
            <div style={{ ...t.meta, color: 'var(--ao-t3)', marginBottom: 16 }}>Filter Pills</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
              {['All', '2026', '2025', 'Jun', 'Jan'].map((label, i) => (
                <button key={label} style={{
                  fontFamily: mono, fontSize: 10, fontWeight: i === 0 ? 700 : 400,
                  letterSpacing: '0.08em',
                  background: i === 0 ? 'var(--ao-t1)' : 'var(--ao-bg-2)',
                  color: i === 0 ? 'var(--ao-bg)' : 'var(--ao-t3)',
                  border: '1px solid var(--ao-border)',
                  padding: '4px 12px', cursor: 'pointer',
                }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Card titles */}
            <div style={{ ...t.meta, color: 'var(--ao-t3)', marginBottom: 16 }}>Card Title Hierarchy</div>
            <div style={{ border: '1px solid var(--ao-border)', overflow: 'hidden', marginBottom: 40 }}>
              {[
                { label: 'type.listTitle', text: 'The Retirement Number Nobody Tells You', style: t.listTitle },
                { label: 'type.cardTitle', text: 'Index Funds Explained: Which Nifty and Why It Matters', style: t.cardTitle },
                { label: 'type.itemTitle', text: 'The Savings Trap: Why Playing It Safe Is the Riskiest Move', style: t.itemTitle },
              ].map(item => (
                <div key={item.label} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', borderBottom: '1px solid var(--ao-border)' }}>
                  <div style={{ ...t.labelSm, color: 'var(--ao-t3)', padding: '16px 20px', borderRight: '1px solid var(--ao-border)', display: 'flex', alignItems: 'center' }}>{item.label}</div>
                  <div style={{ ...item.style, color: 'var(--ao-t1)', padding: '16px 20px' }}>{item.text}</div>
                </div>
              ))}
            </div>

            {/* Nav item */}
            <div style={{ ...t.meta, color: 'var(--ao-t3)', marginBottom: 16 }}>Nav Item States</div>
            <div style={{ display: 'flex', border: '1px solid var(--ao-border)', marginBottom: 40, overflow: 'hidden' }}>
              <div style={{ ...t.nav, color: 'var(--ao-bg)', background: 'var(--ao-t1)', padding: '0 20px', height: 48, display: 'flex', alignItems: 'center', borderBottom: '2px solid var(--ao-accent)', borderRight: '1px solid var(--ao-border)' }}>Active</div>
              <div style={{ ...t.nav, color: 'var(--ao-t3)', padding: '0 20px', height: 48, display: 'flex', alignItems: 'center', borderRight: '1px solid var(--ao-border)', borderBottom: '2px solid transparent' }}>Inactive</div>
              <div style={{ ...t.nav, color: 'var(--ao-bg)', background: 'var(--ao-t1)', padding: '0 24px', height: 48, display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>Subscribe →</div>
            </div>
          </section>

          {/* ── Usage ── */}
          <section id="usage" style={{ ...sec, borderBottom: 'none', paddingBottom: 80 }}>
            <div style={sectionLabel}><span style={{ width: 20, height: 1, background: 'var(--ao-border-2)', display: 'block' }} />Usage</div>
            <h2 style={sectionTitle}>How to Use</h2>

            <div style={{ ...t.meta, color: 'var(--ao-t3)', marginBottom: 16 }}>Import</div>
            <pre style={{ fontFamily: mono, fontSize: 13, background: 'var(--ao-bg-2)', border: '1px solid var(--ao-border)', padding: '20px 24px', marginBottom: 40, overflowX: 'auto', color: 'var(--ao-t1)', lineHeight: 1.7 }}>
{`import { font, type as t, space, z, transition, layout } from '@/lib/ds'`}
            </pre>

            <div style={{ ...t.meta, color: 'var(--ao-t3)', marginBottom: 16 }}>Type token usage</div>
            <pre style={{ fontFamily: mono, fontSize: 13, background: 'var(--ao-bg-2)', border: '1px solid var(--ao-border)', padding: '20px 24px', marginBottom: 40, overflowX: 'auto', color: 'var(--ao-t1)', lineHeight: 1.7 }}>
{`// Spread the preset, then add overrides
<h1 style={{ ...t.displayLg, color: 'var(--ao-t1)', marginBottom: 20 }}>
  Market Intelligence, Distilled.
</h1>

<div style={{ ...t.label, color: 'var(--ao-t3)', marginBottom: 10 }}>
  Category
</div>

<p style={{ ...t.body, color: 'var(--ao-t2)' }}>
  One financial decision explained clearly.
</p>`}
            </pre>

            <div style={{ ...t.meta, color: 'var(--ao-t3)', marginBottom: 16 }}>Quick reference: when to use which preset</div>
            <div style={{ border: '1px solid var(--ao-border)', overflow: 'hidden' }}>
              {[
                ['type.label',    'Section eyebrows (Published, Category, Tags, Year, Month)'],
                ['type.meta',     'Filter section headers, sidebar titles, stat labels'],
                ['type.nav',      'All nav links, header CTA, mobile menu items'],
                ['type.brand',    'Logo wordmark only (ACEONE/)'],
                ['type.body',     'Brief issue body text, newsletter content'],
                ['type.bodyLg',   'Article body paragraphs, lead text, excerpts'],
                ['type.bodySm',   'Card excerpts (2-line clamp), secondary info'],
                ['type.listTitle','Brief sidebar issue titles (sidebar is narrow)'],
                ['type.cardTitle','Blog list view post titles'],
                ['type.itemTitle','Blog card grid post titles'],
                ['type.h4',       'Minor prose headings inside articles'],
                ['type.h3',       'Article subheadings'],
                ['type.h2',       'Article major headings, brief issue standalone h2'],
                ['type.h2Sm',     'Brief inline viewer headings (constrained panel)'],
                ['type.displaySm','Brief issue standalone page h1'],
                ['type.displayMd','Article page h1'],
                ['type.displayLg','Brief archive hero h1'],
                ['type.displayXl','Blog home hero h1'],
              ].map(([token, rule], i) => (
                <div key={token} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', borderBottom: i < 17 ? '1px solid var(--ao-border)' : 'none' }}>
                  <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, color: 'var(--ao-accent)', padding: '12px 16px', borderRight: '1px solid var(--ao-border)' }}>{token}</div>
                  <div style={{ ...t.body, color: 'var(--ao-t2)', padding: '12px 16px' }}>{rule}</div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </main>
  )
}
