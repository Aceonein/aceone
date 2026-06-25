import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import { NewsletterSection } from '@/components/NewsletterSection'

function lexicalToText(node: any): string {
  if (!node) return ''
  if (node.text !== undefined) return node.text
  if (node.children) return node.children.map(lexicalToText).join('')
  return ''
}

function BriefContent({ content }: { content: any }) {
  const nodes: any[] = content?.root?.children ?? []
  if (!nodes.length) return <p style={{ fontSize: 15, color: 'var(--ao-t3)', fontStyle: 'italic' }}>Issue content coming soon.</p>

  return (
    <div>
      {nodes.map((node: any, i: number) => {
        if (node.type === 'heading') {
          const Tag = node.tag as 'h2' | 'h3'
          const sz = node.tag === 'h2' ? 22 : 17
          return (
            <Tag key={i} style={{ fontSize: sz, fontWeight: 700, lineHeight: 1.25, color: 'var(--ao-t1)', margin: '32px 0 10px' }}>
              {lexicalToText(node)}
            </Tag>
          )
        }
        if (node.type === 'list') {
          const items: any[] = node.children ?? []
          const Tag = node.listType === 'bullet' ? 'ul' : 'ol'
          return (
            <Tag key={i} style={{ margin: '8px 0 18px', paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {items.map((li, j) => (
                <li key={j} style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ao-t2)' }}>{lexicalToText(li)}</li>
              ))}
            </Tag>
          )
        }
        const text = lexicalToText(node)
        if (!text.trim()) return <div key={i} style={{ height: 8 }} />
        return <p key={i} style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--ao-t2)', marginBottom: 18 }}>{text}</p>
      })}
    </div>
  )
}

export const dynamic = 'force-dynamic'
export const revalidate = 60

const mono = 'var(--font-mono)'

export default async function BriefPage() {
  const payload = await getPayload({ config: configPromise })

  const res = await payload.find({
    collection: 'aceone-briefs',
    depth: 1,
    limit: 20,
    sort: '-publishedAt',
    draft: false,
    overrideAccess: false,
  })

  const briefs = res.docs as any[]
  const latest = briefs[0] ?? null
  const archive = briefs.slice(1)

  return (
    <main style={{ background: 'var(--ao-bg)', minHeight: '100vh', paddingTop: 'var(--ao-nav-h)' }}>

      {/* Split hero */}
      <section style={{ borderBottom: '1px solid var(--ao-border)', display: 'grid', gridTemplateColumns: '1fr 380px', minHeight: '58vh' }}>
        {/* Left */}
        <div style={{ padding: '56px 48px', borderRight: '1px solid var(--ao-border)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ao-t3)', marginBottom: 18 }}>
            Aceone / The Brief — Weekly newsletter
          </div>
          <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--ao-t1)', marginBottom: 18, maxWidth: 600 }}>
            One financial idea,{' '}
            <span style={{ color: 'var(--ao-accent)' }}>clearly explained.</span>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ao-t2)', maxWidth: 480, marginBottom: 36 }}>
            Every Sunday we break down the week's most important financial decision. No jargon. No agenda. Founder voice.
          </p>
          {/* Stats */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {[
              { value: String(briefs.length), label: 'Issues' },
              { value: '1k+', label: 'Readers' },
              { value: 'Weekly', label: 'Cadence' },
            ].map(({ value, label }, i) => (
              <div key={label} style={{ padding: '12px 24px', borderLeft: i > 0 ? '1px solid var(--ao-border)' : undefined, paddingLeft: i === 0 ? 0 : 24 }}>
                <div style={{ fontFamily: mono, fontSize: 18, fontWeight: 700, color: 'var(--ao-t1)', lineHeight: 1 }}>{value}</div>
                <div style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — subscribe form */}
        <div style={{ padding: '56px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24, background: 'var(--ao-bg-2)' }}>
          <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ao-t3)' }}>
            Subscribe free
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                width: '100%', padding: '12px 14px',
                background: 'var(--ao-bg)', border: '1px solid var(--ao-border)',
                fontFamily: mono, fontSize: 13, color: 'var(--ao-t1)',
                outline: 'none',
              }}
            />
            <Link href="#newsletter" style={{
              display: 'block', textAlign: 'center', padding: '12px 0',
              background: 'var(--ao-t1)', color: 'var(--ao-bg)',
              fontFamily: mono, fontSize: 11, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              textDecoration: 'none',
            }}>
              Join the Brief →
            </Link>
          </div>
          <p style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)', lineHeight: 1.6 }}>
            No spam. Unsubscribe anytime. Every Sunday morning.
          </p>
        </div>
      </section>

      {/* Body: sidebar + main */}
      {briefs.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', borderBottom: '1px solid var(--ao-border)' }}>

          {/* Edition list sidebar */}
          <aside style={{ borderRight: '1px solid var(--ao-border)', padding: '32px 0' }}>
            <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ao-t3)', padding: '0 20px', marginBottom: 16 }}>
              All issues
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {briefs.map((b: any, i: number) => (
                <a
                  key={b.id}
                  href={`#issue-${b.id}`}
                  style={{
                    display: 'block', padding: '14px 20px',
                    borderBottom: '1px solid var(--ao-border)',
                    borderLeft: i === 0 ? '3px solid var(--ao-accent)' : '3px solid transparent',
                    textDecoration: 'none',
                    background: i === 0 ? 'var(--ao-bg-2)' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                >
                  {b.issueNumber && (
                    <div style={{ fontFamily: mono, fontSize: 9, color: 'var(--ao-t3)', marginBottom: 4 }}>#{b.issueNumber}</div>
                  )}
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ao-t1)', lineHeight: 1.3, marginBottom: 4 }}>{b.title}</div>
                  {b.publishedAt && (
                    <div style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)' }}>
                      {new Date(b.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </aside>

          {/* Issue content pane */}
          <div style={{ padding: '40px 52px 80px' }}>
            {briefs.map((b: any) => (
              <div key={b.id} id={`issue-${b.id}`} style={{ marginBottom: 80, paddingBottom: 80, borderBottom: '1px solid var(--ao-border)' }}>
                {/* Issue header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  {b.issueNumber && (
                    <span style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)', background: 'var(--ao-bg-2)', border: '1px solid var(--ao-border)', padding: '3px 10px' }}>
                      #{b.issueNumber}
                    </span>
                  )}
                  {b.publishedAt && (
                    <span style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)' }}>
                      {new Date(b.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  )}
                </div>

                <h2 style={{ fontSize: 'clamp(22px,3vw,36px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.015em', color: 'var(--ao-t1)', marginBottom: 12 }}>
                  {b.title}
                </h2>

                {b.subtitle && (
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ao-t2)', marginBottom: 32, paddingBottom: 28, borderBottom: '1px solid var(--ao-border)' }}>
                    {b.subtitle}
                  </p>
                )}

                <BriefContent content={b.content} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ padding: '80px 48px', textAlign: 'center' }}>
          <p style={{ fontFamily: mono, fontSize: 12, color: 'var(--ao-t3)' }}>First issue dropping soon. Subscribe above to be notified.</p>
        </div>
      )}

      <NewsletterSection />
    </main>
  )
}

export const metadata = {
  title: 'The Brief — Aceone',
  description: 'Weekly financial intelligence. One idea, clearly explained. Every Sunday.',
}
