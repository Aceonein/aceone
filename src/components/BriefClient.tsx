'use client'
import React, { useState, useMemo } from 'react'
import { font, type as t, z } from '@/lib/ds'

const mono = font.mono
const sans = font.sans

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function BriefContent({ content }: { content: any }) {
  const nodes: any[] = content?.root?.children ?? []
  if (!nodes.length) return <p style={{ ...t.body, color: 'var(--ao-t3)', fontStyle: 'italic' }}>Issue content coming soon.</p>

  function nodeToText(node: any): string {
    if (!node) return ''
    if (node.text !== undefined) return node.text
    if (node.children) return node.children.map(nodeToText).join('')
    return ''
  }

  return (
    <div className="ao-brief-body">
      {nodes.map((node: any, i: number) => {
        if (node.type === 'heading') {
          const Tag = node.tag as 'h2' | 'h3'
          return <Tag key={i} style={{ ...(node.tag === 'h2' ? t.h2Sm : t.h3), color: 'var(--ao-t1)', margin: '32px 0 10px' }}>{nodeToText(node)}</Tag>
        }
        if (node.type === 'list') {
          const Tag = node.listType === 'bullet' ? 'ul' : 'ol'
          return (
            <Tag key={i} style={{ margin: '8px 0 18px', paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {(node.children ?? []).map((li: any, j: number) => (
                <li key={j} style={{ ...t.body, color: 'var(--ao-t2)' }}>{nodeToText(li)}</li>
              ))}
            </Tag>
          )
        }
        const text = nodeToText(node)
        if (!text.trim()) return <div key={i} style={{ height: 8 }} />
        return <p key={i} style={{ ...t.body, color: 'var(--ao-t2)', marginBottom: 18 }}>{text}</p>
      })}
    </div>
  )
}

type Brief = {
  id: string
  title: string
  subtitle?: string | null
  issueNumber?: number | null
  publishedAt?: string | null
  content?: any
  tags?: string[]
}

export function BriefClient({ briefs }: { briefs: Brief[] }) {
  const years = useMemo(() => {
    const ys = Array.from(new Set(briefs.map(b => b.publishedAt ? new Date(b.publishedAt).getFullYear() : null).filter(Boolean) as number[])).sort((a, b) => b - a)
    return ys
  }, [briefs])

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const [activeYear, setActiveYear] = useState<number | 'all'>('all')
  const [activeMonth, setActiveMonth] = useState<number | 'all'>('all')
  const [activeId, setActiveId] = useState<string>(briefs[0]?.id ?? '')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const filtered = useMemo(() => briefs.filter(b => {
    if (!b.publishedAt) return activeYear === 'all'
    const d = new Date(b.publishedAt)
    if (activeYear !== 'all' && d.getFullYear() !== activeYear) return false
    if (activeMonth !== 'all' && d.getMonth() !== activeMonth) return false
    return true
  }), [briefs, activeYear, activeMonth])

  const availableMonths = useMemo(() => {
    const ms = new Set(
      briefs
        .filter(b => b.publishedAt && (activeYear === 'all' || new Date(b.publishedAt).getFullYear() === activeYear))
        .map(b => new Date(b.publishedAt!).getMonth())
    )
    return Array.from(ms).sort((a, b) => b - a)
  }, [briefs, activeYear])

  const activeBrief = briefs.find(b => b.id === activeId) ?? filtered[0] ?? briefs[0]

  const FilterPill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button onClick={onClick} style={{
      fontFamily: mono, fontSize: 10, fontWeight: active ? 700 : 400,
      letterSpacing: '0.08em', padding: '4px 12px',
      background: active ? 'var(--ao-t1)' : 'var(--ao-bg-2)',
      color: active ? 'var(--ao-bg)' : 'var(--ao-t3)',
      border: '1px solid var(--ao-border)',
      cursor: 'pointer', whiteSpace: 'nowrap',
      transition: 'all 0.15s',
    }}>{label}</button>
  )

  return (
    <div className="ao-brief-client" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: `${sidebarOpen ? 260 : 0}px 1fr`, borderLeft: '1px solid var(--ao-border)', borderBottom: '1px solid var(--ao-border)', transition: 'grid-template-columns 0.25s ease', overflow: 'hidden' }}>

      {/* ── Sidebar ── */}
      <aside
        className="ao-brief-sidebar"
        style={{
          display: 'flex', flexDirection: 'column',
          borderRight: '1px solid var(--ao-border)',
          overflow: 'hidden',
          position: 'sticky', top: 'var(--ao-nav-h)',
          height: 'calc(100vh - var(--ao-nav-h))',
          alignSelf: 'start',
          minWidth: 0,
          transition: 'opacity 0.2s ease',
          opacity: sidebarOpen ? 1 : 0,
        }}
      >
        {/* Filters */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--ao-border)', flexShrink: 0 }}>
          <div style={{ ...t.label, color: 'var(--ao-t3)', marginBottom: 10 }}>Year</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
            <FilterPill label="All" active={activeYear === 'all'} onClick={() => { setActiveYear('all'); setActiveMonth('all') }} />
            {years.map(y => (
              <FilterPill key={y} label={String(y)} active={activeYear === y} onClick={() => { setActiveYear(y); setActiveMonth('all') }} />
            ))}
          </div>
          <div style={{ ...t.label, color: 'var(--ao-t3)', marginBottom: 10 }}>Month</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <FilterPill label="All" active={activeMonth === 'all'} onClick={() => setActiveMonth('all')} />
            {availableMonths.map(m => (
              <FilterPill key={m} label={monthNames[m]!} active={activeMonth === m} onClick={() => setActiveMonth(m)} />
            ))}
          </div>
        </div>

        {/* Issue count */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--ao-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ ...t.label, color: 'var(--ao-t3)' }}>Editions</span>
          <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: 'var(--ao-t1)' }}>{filtered.length}</span>
        </div>

        {/* Issue list */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {filtered.length === 0 ? (
            <p style={{ fontFamily: mono, fontSize: 11, color: 'var(--ao-t3)', padding: '24px 20px' }}>No issues found.</p>
          ) : filtered.map((b) => {
            const isActive = b.id === (activeId || briefs[0]?.id)
            return (
              <button
                key={b.id}
                onClick={() => setActiveId(b.id)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--ao-border)',
                  borderLeft: isActive ? '3px solid var(--ao-accent)' : '3px solid transparent',
                  background: isActive ? 'var(--ao-bg-2)' : 'transparent',
                  cursor: 'pointer', border: 'none',
                  borderBottomColor: 'var(--ao-border)',
                  borderBottomWidth: 1,
                  borderBottomStyle: 'solid',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  {b.issueNumber && (
                    <span style={{ fontFamily: mono, fontSize: 9, color: 'var(--ao-bg)', background: isActive ? 'var(--ao-accent)' : 'var(--ao-t3)', padding: '2px 7px' }}>
                      #{b.issueNumber}
                    </span>
                  )}
                  {b.publishedAt && (
                    <span style={{ fontFamily: mono, fontSize: 9, color: 'var(--ao-t3)' }}>{fmtDate(b.publishedAt)}</span>
                  )}
                </div>
                <div style={{ ...t.listTitle, color: isActive ? 'var(--ao-t1)' : 'var(--ao-t2)', marginBottom: b.tags?.length ? 8 : 0 }}>
                  {b.title}
                </div>
                {b.tags && b.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {b.tags.slice(0, 3).map(tag => (
                      <span key={tag} style={{ ...t.labelSm, color: 'var(--ao-t3)', border: '1px solid var(--ao-border)', padding: '2px 6px' }}>{tag}</span>
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </aside>

      {/* ── Issue viewer ── */}
      <div className="ao-brief-content" style={{ position: 'relative', minHeight: '60vh', minWidth: 0 }}>

        {/* Toggle tab — always on left edge of content */}
        <button
          className="ao-brief-toggle-tab"
          onClick={() => setSidebarOpen(o => !o)}
          aria-label={sidebarOpen ? 'Collapse filters' : 'Expand filters'}
          style={{
            position: 'absolute', left: 0, top: 0,
            width: 20, height: '100%', minHeight: 80,
            background: 'var(--ao-bg-2)',
            border: 'none', borderRight: '1px solid var(--ao-border)',
            cursor: 'pointer', zIndex: z.tab,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'flex-start', paddingTop: 28, gap: 4,
            color: 'var(--ao-t3)', transition: 'background 0.15s',
          }}
        >
          <span style={{ fontFamily: mono, fontSize: 10, lineHeight: 1, userSelect: 'none' }}>
            {sidebarOpen ? '‹' : '›'}
          </span>
          {!sidebarOpen && (
            <span style={{ fontFamily: mono, fontSize: 7, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ao-t3)', writingMode: 'vertical-rl', marginTop: 8 }}>
              Filter
            </span>
          )}
        </button>

        {/* Content with left offset for tab */}
        <div className="ao-brief-content-inner" style={{ padding: '40px 52px 80px', paddingLeft: 44 }}>
          {activeBrief ? (
            <>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28, padding: '5px 14px', background: 'var(--ao-bg-2)', border: '1px solid var(--ao-border)' }}>
                {activeBrief.issueNumber && (
                  <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, color: 'var(--ao-accent)' }}>ISSUE #{activeBrief.issueNumber}</span>
                )}
                {activeBrief.issueNumber && activeBrief.publishedAt && <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ao-border-2)', display: 'block' }} />}
                {activeBrief.publishedAt && (
                  <span style={{ fontFamily: mono, fontSize: 9, color: 'var(--ao-t3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {new Date(activeBrief.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                  </span>
                )}
              </div>

              <h2 style={{ ...t.displaySm, color: 'var(--ao-t1)', marginBottom: 16 }}>
                {activeBrief.title}
              </h2>

              {activeBrief.subtitle && (
                <p style={{ ...t.bodyBase, color: 'var(--ao-t2)', marginBottom: 36, paddingBottom: 28, borderBottom: '1px solid var(--ao-border)' }}>
                  {activeBrief.subtitle}
                </p>
              )}

              <BriefContent content={activeBrief.content} />
            </>
          ) : (
            <p style={{ fontFamily: mono, fontSize: 12, color: 'var(--ao-t3)' }}>Select an issue from the list.</p>
          )}
        </div>
      </div>
    </div>
  )
}
