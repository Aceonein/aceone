import React from 'react'
import { font, type as t, transition } from '@/lib/ds'

const s = {
  t1: 'var(--ao-t1)',
  t2: 'var(--ao-t2)',
  t3: 'var(--ao-t3)',
  acc: 'var(--ao-accent)',
  bg2: 'var(--ao-bg-2)',
  bg3: 'var(--ao-bg-3)',
  bdr: 'var(--ao-border)',
  bdr2: 'var(--ao-border-2)',
  serif: font.sans,
  mono: font.mono,
}

// Lexical text format bitmask
const IS_BOLD        = 1
const IS_ITALIC      = 2
const IS_STRIKETHROUGH = 4
const IS_UNDERLINE   = 8
const IS_CODE        = 16
const IS_SUBSCRIPT   = 32
const IS_SUPERSCRIPT = 64

function parseCssString(css: string): React.CSSProperties {
  if (!css) return {}
  const style: Record<string, string> = {}
  css.split(';').forEach((decl) => {
    const idx = decl.indexOf(':')
    if (idx === -1) return
    const prop = decl.slice(0, idx).trim()
    const val  = decl.slice(idx + 1).trim()
    if (!prop || !val) return
    const camel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    style[camel] = val
  })
  return style as React.CSSProperties
}

function elementAlign(format: string | number): React.CSSProperties {
  if (format === 'center' || format === 2) return { textAlign: 'center' }
  if (format === 'right'  || format === 3) return { textAlign: 'right' }
  if (format === 'justify'|| format === 4) return { textAlign: 'justify' }
  return {}
}

function renderText(node: any): React.ReactNode {
  if (node.type === 'linebreak') return <br />

  if (node.type === 'text') {
    const stateStyle = parseCssString(node.style ?? '')
    let content: React.ReactNode = node.text

    if (node.format & IS_BOLD)          content = <strong>{content}</strong>
    if (node.format & IS_ITALIC)        content = <em>{content}</em>
    if (node.format & IS_UNDERLINE)     content = <u>{content}</u>
    if (node.format & IS_STRIKETHROUGH) content = <s>{content}</s>
    if (node.format & IS_CODE)          content = (
      <code style={{ fontFamily: s.mono, fontSize: '0.88em', background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: 2 }}>
        {content}
      </code>
    )
    if (node.format & IS_SUBSCRIPT)   content = <sub style={{ fontSize: '0.75em' }}>{content}</sub>
    if (node.format & IS_SUPERSCRIPT) content = <sup style={{ fontSize: '0.75em' }}>{content}</sup>

    if (Object.keys(stateStyle).length) {
      content = <span style={stateStyle}>{content}</span>
    }
    return content
  }

  if (node.type === 'link') {
    const url = node.fields?.url || node.url || '#'
    return (
      <a href={url} style={{ color: s.acc, textDecoration: 'underline' }}>
        {(node.children || []).map((c: any, i: number) => (
          <React.Fragment key={i}>{renderText(c)}</React.Fragment>
        ))}
      </a>
    )
  }

  if (node.children) {
    return (node.children || []).map((c: any, i: number) => (
      <React.Fragment key={i}>{renderText(c)}</React.Fragment>
    ))
  }

  return null
}

function inlineChildren(children: any[]): React.ReactNode {
  return (children || []).map((c, i) => (
    <React.Fragment key={i}>{renderText(c)}</React.Fragment>
  ))
}

function richTextToString(lexical: any): string {
  if (!lexical) return ''
  if (typeof lexical === 'string') return lexical
  if (lexical.root?.children) return lexical.root.children.map((n: any) => richTextToString(n)).join('')
  if (lexical.children) return lexical.children.map((n: any) => richTextToString(n)).join(lexical.type === 'paragraph' ? '\n\n' : '')
  if (lexical.text) return lexical.text
  return ''
}

function renderBlock(fields: any, i: number): React.ReactNode {
  const type = fields.blockType

  if (type === 'data-box') return (
    <div key={i} style={{ margin: '36px 0', border: `1px solid ${s.bdr}`, overflow: 'hidden', transition: 'border-color 0.4s' }}>
      {fields.title && (
        <div style={{ fontFamily: s.mono, fontSize: 8, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: s.t3, background: s.bg2, padding: '8px 16px', borderBottom: `1px solid ${s.bdr}`, display: 'flex', alignItems: 'center', gap: 10, transition: 'color 0.4s, background 0.4s' }}>
          <span style={{ width: 6, height: 6, background: s.acc, display: 'block', flexShrink: 0 }} />{fields.title}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 0 }}>
        {(fields.dataPoints ?? []).map((dp: any, j: number) => (
          <div key={j} style={{ padding: '16px' }}>
            <div style={{ fontFamily: s.serif, fontSize: 28, fontWeight: 700, lineHeight: 1, color: dp.isNegative ? '#ef4444' : s.acc, marginBottom: 4, transition: 'color 0.4s' }}>
              {dp.value}{dp.unit && <span style={{ fontSize: 15, fontWeight: 400, marginLeft: 3 }}>{dp.unit}</span>}
            </div>
            <div style={{ fontSize: 12.5, color: s.t3, lineHeight: 1.4, transition: 'color 0.4s' }}>{dp.label}</div>
          </div>
        ))}
      </div>
    </div>
  )

  if (type === 'pull-quote') return (
    <blockquote key={i} style={{ margin: '44px 0', padding: '4px 0 4px 24px', borderLeft: `2px solid ${s.t1}`, transition: 'border-color 0.4s' }}>
      <p style={{ fontFamily: s.serif, fontSize: fields.size === 'large' ? 26 : 21, fontWeight: 700, fontStyle: 'italic', lineHeight: 1.4, color: s.t1, marginBottom: fields.attribution ? 14 : 0, transition: 'color 0.4s' }}>
        &ldquo;{fields.quote}&rdquo;
      </p>
      {fields.attribution && (
        <cite style={{ fontFamily: s.mono, fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: s.acc, fontStyle: 'normal', display: 'block' }}>
          {fields.attribution}
        </cite>
      )}
    </blockquote>
  )

  if (type === 'table') return (
    <div key={i} className="ao-article-table" style={{ margin: '36px 0', overflowX: 'auto' }}>
      {fields.caption && <div style={{ fontFamily: s.mono, fontSize: 11, color: s.t3, marginBottom: 10 }}>{fields.caption}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, color: s.t2 }}>
        {fields.headers?.length > 0 && (
          <thead>
            <tr>
              {fields.headers.map((h: any, j: number) => (
                <th key={j} style={{ padding: '10px 14px', textAlign: 'left', fontFamily: s.mono, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: s.t3, borderBottom: `2px solid ${s.bdr2}`, whiteSpace: 'nowrap' }}>
                  {typeof h === 'string' ? h : h.text}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {(fields.rows ?? []).map((row: any, j: number) => {
            const cells: any[] = Array.isArray(row) ? row : (row.cells ?? [])
            return (
              <tr key={j} style={{ background: j % 2 === 0 ? 'transparent' : s.bg2, transition: 'background 0.4s' }}>
                {cells.map((cell: any, k: number) => (
                  <td key={k} style={{ padding: '10px 14px', borderBottom: `1px solid ${s.bdr}`, lineHeight: 1.5, transition: 'border-color 0.4s' }}>
                    {typeof cell === 'string' ? cell : cell.text}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  if (type === 'section-marker') {
    const id = fields.label
      ? fields.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : undefined
    return (
      <div key={i} id={id} style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '56px 0 36px' }}>
        <div style={{ height: 1, flex: 1, background: s.bdr2 }} />
        {fields.label && (
          <span style={{ fontFamily: s.mono, fontSize: 10.5, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: s.t3, whiteSpace: 'nowrap', transition: 'color 0.4s' }}>
            {fields.label}
          </span>
        )}
        <div style={{ height: 1, flex: 1, background: s.bdr2 }} />
      </div>
    )
  }

  if (type === 'spacer') {
    const heights: Record<string, number> = { small: 16, medium: 32, large: 64, xlarge: 128 }
    return <div key={i} style={{ height: heights[fields.height ?? 'medium'] ?? 32 }} />
  }

  if (type === 'disclaimer') return (
    <div key={i} style={{ margin: '32px 0', padding: '16px 20px', background: s.bg2, border: `1px solid ${s.bdr}`, borderLeft: `2px solid ${s.acc}`, display: 'flex', gap: 14, transition: 'background 0.4s, border-color 0.4s' }}>
      <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
      <div style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.7, color: s.t3 }}>{richTextToString(fields.content)}</div>
    </div>
  )

  if (type === 'accordion') return (
    <div key={i} style={{ margin: '28px 0', border: `1px solid ${s.bdr}`, overflow: 'hidden', transition: 'border-color 0.4s' }}>
      {(fields.items ?? []).map((item: any, j: number) => (
        <details key={j} open={item.defaultOpen} style={{ borderBottom: j < fields.items.length - 1 ? `1px solid ${s.bdr}` : 'none', transition: 'border-color 0.4s' }}>
          <summary style={{ padding: '16px 20px', fontWeight: 500, fontSize: 15, color: s.t1, cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'color 0.4s' }}>
            {item.title}
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} width={14} height={14}>
              <path d="M3 6l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </summary>
          <div style={{ padding: '4px 20px 18px', fontSize: 14.5, fontWeight: 300, lineHeight: 1.72, color: s.t2, transition: 'color 0.4s' }}>
            {richTextToString(item.content)}
          </div>
        </details>
      ))}
    </div>
  )

  return null
}

function renderNode(node: any, i: number): React.ReactNode {
  const type = node.type

  if (type === 'paragraph') {
    const isEmpty = !node.children?.length || (node.children.length === 1 && node.children[0].text === '')
    if (isEmpty) return <div key={i} style={{ height: 16 }} />
    return (
      <p key={i} style={{ ...t.bodyLg, ...elementAlign(node.format), color: s.t2, marginBottom: 24, transition: `color ${transition.xslow}` }}>
        {inlineChildren(node.children || [])}
      </p>
    )
  }

  if (type === 'heading') {
    const tag = node.tag as 'h2' | 'h3' | 'h4'
    const headingStyle: Record<string, any> = { h2: t.h2, h3: t.h3, h4: t.h4 }
    const textContent = (node.children || []).map((c: any) => c.text || '').join('')
    const id = textContent
      ? textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : undefined
    const Tag = tag || 'h2'
    return (
      <Tag key={i} id={id} style={{ ...(headingStyle[Tag] ?? t.h2), ...elementAlign(node.format), color: s.t1, marginBottom: 14, marginTop: 46, transition: `color ${transition.xslow}` }}>
        {inlineChildren(node.children || [])}
      </Tag>
    )
  }

  if (type === 'list') {
    const isOrdered  = node.listType === 'number'
    const isChecklist = node.listType === 'check'
    const items = (node.children || []).map((item: any, j: number) => {
      if (isChecklist) {
        return (
          <li key={j} style={{ ...t.bodyBase, color: s.t2, display: 'flex', alignItems: 'flex-start', gap: 10, listStyle: 'none', transition: `color ${transition.xslow}` }}>
            <input type="checkbox" checked={!!item.checked} readOnly style={{ marginTop: 4, accentColor: s.acc, flexShrink: 0 }} />
            <span style={{ textDecoration: item.checked ? 'line-through' : 'none', opacity: item.checked ? 0.5 : 1 }}>
              {inlineChildren(item.children || [])}
            </span>
          </li>
        )
      }
      return (
        <li key={j} style={{ ...t.bodyBase, color: s.t2, position: 'relative', paddingLeft: isOrdered ? 0 : 18, transition: `color ${transition.xslow}` }}>
          {!isOrdered && (
            <span style={{ position: 'absolute', left: 0, top: 9, width: 5, height: 5, borderRadius: '50%', background: s.acc }} />
          )}
          {inlineChildren(item.children || [])}
        </li>
      )
    })
    if (isOrdered) {
      return <ol key={i} style={{ margin: '8px 0 28px', paddingLeft: 26, display: 'flex', flexDirection: 'column', gap: 10 }}>{items}</ol>
    }
    return <ul key={i} style={{ margin: '8px 0 28px', paddingLeft: isChecklist ? 0 : 26, display: 'flex', flexDirection: 'column', gap: 10, listStyleType: 'none' }}>{items}</ul>
  }

  if (type === 'quote') {
    return (
      <blockquote key={i} style={{ margin: '32px 0', padding: '4px 0 4px 20px', borderLeft: `2px solid ${s.bdr2}` }}>
        <p style={{ ...t.bodyLg, color: s.t3, fontStyle: 'italic', margin: 0 }}>
          {inlineChildren(node.children || [])}
        </p>
      </blockquote>
    )
  }

  if (type === 'horizontalrule') {
    return <hr key={i} style={{ border: 'none', borderTop: `1px solid ${s.bdr2}`, margin: '44px 0' }} />
  }

  if (type === 'upload') {
    const val = node.value
    const url = typeof val === 'object' ? val?.url : null
    if (!url) return null
    const alt = node.fields?.alt ?? (typeof val === 'object' ? val?.alt : '') ?? ''
    const caption = node.fields?.caption
    return (
      <figure key={i} style={{ margin: '40px 0' }}>
        <img src={url} alt={alt} style={{ width: '100%', display: 'block', border: `1px solid ${s.bdr}` }} />
        {caption && (
          <figcaption style={{ fontFamily: s.mono, fontSize: 11.5, color: s.t3, marginTop: 8, textAlign: 'center' }}>
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }

  if (type === 'block') {
    return renderBlock(node.fields, i)
  }

  return null
}

export function BlockRenderer({ content }: { content: any }) {
  const nodes: any[] = content?.root?.children ?? []
  if (!nodes.length) return null

  return (
    <div className="ao-article-content" style={{ maxWidth: 680 }}>
      {nodes.map((node, i) => renderNode(node, i))}
    </div>
  )
}
