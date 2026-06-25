import React from 'react'

/* ponytail: inline styles keep this self-contained; no extra CSS file needed */

const s = {
  t1: 'var(--ao-t1)',
  t2: 'var(--ao-t2)',
  t3: 'var(--ao-t3)',
  acc: 'var(--ao-accent)',
  bg2: 'var(--ao-bg-2)',
  bg3: 'var(--ao-bg-3)',
  bdr: 'var(--ao-border)',
  bdr2: 'var(--ao-border-2)',
  serif: 'var(--font-sans)',
  mono: 'var(--font-mono)',
}

function richText(rt: any): string {
  if (!rt) return ''
  if (typeof rt === 'string') return rt
  if (rt.root?.children) return rt.root.children.map((n: any) => richText(n)).join('')
  if (rt.children) return rt.children.map((n: any) => richText(n)).join(rt.type === 'paragraph' ? '\n\n' : '')
  if (rt.text) return rt.text
  return ''
}

function RichTextProse({ value }: { value: any }) {
  const text = richText(value)
  return <>{text.split('\n\n').map((p, i) => <p key={i} style={{ fontSize: 17, fontWeight: 300, lineHeight: 1.8, color: s.t2, marginBottom: 24, transition: 'color 0.4s' }}>{p}</p>)}</>
}

export function BlockRenderer({ blocks }: { blocks: any[] }) {
  if (!blocks?.length) return null

  return (
    <div style={{ maxWidth: 680 }}>
      {blocks.map((block: any, i: number) => {
        const type = block.blockType

        if (type === 'paragraph') return (
          <div key={i} style={{ marginBottom: 28 }}>
            <RichTextProse value={block.content} />
          </div>
        )

        if (type === 'heading') {
          const Tag = (block.level ?? 'h2') as 'h2' | 'h3' | 'h4'
          const sizes: Record<string, number> = { h2: 32, h3: 24, h4: 19 }
          return (
            <Tag key={i} id={block.id ?? undefined} style={{ fontFamily: s.serif, fontSize: sizes[Tag] ?? 24, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.015em', color: s.t1, marginBottom: 14, marginTop: 46, transition: 'color 0.4s' }}>
              {block.text}
            </Tag>
          )
        }

        if (type === 'rich-text') return (
          <div key={i} style={{ marginBottom: 28 }}>
            <RichTextProse value={block.richText} />
          </div>
        )

        if (type === 'image') {
          const img = block.image
          const url = typeof img === 'object' ? img?.url : null
          if (!url) return null
          const sizes: Record<string, string> = { wide: '100%', medium: '75%', small: '50%' }
          const w = sizes[block.size ?? 'wide'] ?? '100%'
          return (
            <figure key={i} style={{ margin: '40px 0', maxWidth: w }}>
              <img src={url} alt={block.alt ?? (typeof img === 'object' ? img?.alt : '') ?? ''} style={{ width: '100%', display: 'block', border: `1px solid ${s.bdr}` }} />
              {block.caption && <figcaption style={{ fontFamily: s.mono, fontSize: 11.5, color: s.t3, marginTop: 8, textAlign: 'center' }}>{block.caption}</figcaption>}
            </figure>
          )
        }

        if (type === 'ordered-list') return (
          <ol key={i} style={{ margin: '8px 0 28px', paddingLeft: 26, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(block.items ?? []).map((item: any, j: number) => (
              <li key={j} style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.72, color: s.t2, transition: 'color 0.4s' }}>{richText(item.text)}</li>
            ))}
          </ol>
        )

        if (type === 'unordered-list') return (
          <ul key={i} style={{ margin: '8px 0 28px', paddingLeft: 26, display: 'flex', flexDirection: 'column', gap: 10, listStyleType: 'none' }}>
            {(block.items ?? []).map((item: any, j: number) => (
              <li key={j} style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.72, color: s.t2, position: 'relative', paddingLeft: 18, transition: 'color 0.4s' }}>
                <span style={{ position: 'absolute', left: 0, top: 9, width: 5, height: 5, borderRadius: '50%', background: s.acc }} />
                {richText(item.text)}
              </li>
            ))}
          </ul>
        )

        if (type === 'pull-quote') return (
          <blockquote key={i} style={{ margin: '44px 0', padding: '4px 0 4px 24px', borderLeft: `2px solid ${s.t1}`, transition: 'border-color 0.4s' }}>
            <p style={{ fontFamily: s.serif, fontSize: block.size === 'large' ? 26 : 21, fontWeight: 700, fontStyle: 'italic', lineHeight: 1.4, color: s.t1, marginBottom: block.attribution ? 14 : 0, transition: 'color 0.4s' }}>
              &ldquo;{block.quote}&rdquo;
            </p>
            {block.attribution && <cite style={{ fontFamily: s.mono, fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: s.acc, fontStyle: 'normal', display: 'block' }}>{block.attribution}</cite>}
          </blockquote>
        )

        if (type === 'data-box') return (
          <div key={i} style={{ margin: '36px 0', border: `1px solid ${s.bdr}`, overflow: 'hidden', transition: 'border-color 0.4s' }}>
            {block.title && <div style={{ fontFamily: s.mono, fontSize: 8, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: s.t3, background: s.bg2, padding: '8px 16px', borderBottom: `1px solid ${s.bdr}`, display: 'flex', alignItems: 'center', gap: 10, transition: 'color 0.4s, background 0.4s' }}><span style={{ width: 6, height: 6, background: s.acc, display: 'block', flexShrink: 0 }} />{block.title}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 0 }}>
              {(block.dataPoints ?? []).map((dp: any, j: number) => (
                <div key={j}>
                  <div style={{ fontFamily: s.serif, fontSize: 28, fontWeight: 700, lineHeight: 1, color: dp.isNegative ? '#ef4444' : s.acc, marginBottom: 4, transition: 'color 0.4s' }}>
                    {dp.value}{dp.unit && <span style={{ fontSize: 15, fontWeight: 400, marginLeft: 3 }}>{dp.unit}</span>}
                  </div>
                  <div style={{ fontSize: 12.5, color: s.t3, lineHeight: 1.4, transition: 'color 0.4s' }}>{dp.label}</div>
                </div>
              ))}
            </div>
          </div>
        )

        if (type === 'table') return (
          <div key={i} style={{ margin: '36px 0', overflowX: 'auto' }}>
            {block.caption && <div style={{ fontFamily: s.mono, fontSize: 11, color: s.t3, marginBottom: 10 }}>{block.caption}</div>}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, color: s.t2 }}>
              {block.headers?.length > 0 && (
                <thead>
                  <tr>{block.headers.map((h: any, j: number) => <th key={j} style={{ padding: '10px 14px', textAlign: 'left', fontFamily: s.mono, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: s.t3, borderBottom: `2px solid ${s.bdr2}`, whiteSpace: 'nowrap' }}>{typeof h === 'string' ? h : h.text}</th>)}</tr>
                </thead>
              )}
              <tbody>
                {(block.rows ?? []).map((row: any, j: number) => {
                  const cells: any[] = Array.isArray(row) ? row : (row.cells ?? [])
                  return (
                  <tr key={j} style={{ background: j % 2 === 0 ? 'transparent' : s.bg2, transition: 'background 0.4s' }}>
                    {cells.map((cell: any, k: number) => <td key={k} style={{ padding: '10px 14px', borderBottom: `1px solid ${s.bdr}`, lineHeight: 1.5, transition: 'border-color 0.4s' }}>{typeof cell === 'string' ? cell : cell.text}</td>)}
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )

        if (type === 'section-marker') return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '56px 0 36px' }}>
            <div style={{ height: 1, flex: 1, background: s.bdr2 }} />
            <span style={{ fontFamily: s.mono, fontSize: 10.5, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: s.t3, whiteSpace: 'nowrap', transition: 'color 0.4s, background 0.4s' }}>{block.label}</span>
            <div style={{ height: 1, flex: 1, background: s.bdr2 }} />
          </div>
        )

        if (type === 'spacer') return (
          <div key={i} style={{ height: block.height ?? 40 }} />
        )

        if (type === 'disclaimer') return (
          <div key={i} style={{ margin: '32px 0', padding: '16px 20px', background: s.bg2, border: `1px solid ${s.bdr}`, borderLeft: `2px solid ${s.acc}`, display: 'flex', gap: 14, transition: 'background 0.4s, border-color 0.4s' }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
            <div style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.7, color: s.t3 }}>{richText(block.content)}</div>
          </div>
        )

        if (type === 'accordion') return (
          <div key={i} style={{ margin: '28px 0', border: `1px solid ${s.bdr}`, overflow: 'hidden', transition: 'border-color 0.4s' }}>
            {(block.items ?? []).map((item: any, j: number) => (
              <details key={j} open={item.defaultOpen} style={{ borderBottom: j < block.items.length - 1 ? `1px solid ${s.bdr}` : 'none', transition: 'border-color 0.4s' }}>
                <summary style={{ padding: '16px 20px', fontWeight: 500, fontSize: 15, color: s.t1, cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'color 0.4s' }}>
                  {item.title}
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} width={14} height={14}><path d="M3 6l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </summary>
                <div style={{ padding: '4px 20px 18px', fontSize: 14.5, fontWeight: 300, lineHeight: 1.72, color: s.t2, transition: 'color 0.4s' }}>{richText(item.content)}</div>
              </details>
            ))}
          </div>
        )

        return null
      })}
    </div>
  )
}
