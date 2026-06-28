import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import React from 'react'
import { NewsletterSection } from '@/components/NewsletterSection'
import { font, type as t } from '@/lib/ds'

export const dynamic = 'force-dynamic'

const mono = font.mono
const sans = font.sans

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function BriefContent({ content }: { content: any }) {
  const nodes: any[] = content?.root?.children ?? []
  if (!nodes.length)
    return (
      <p style={{ fontSize: 15, color: 'var(--ao-t3)', fontStyle: 'italic' }}>
        Content coming soon.
      </p>
    )

  function nodeToText(node: any): string {
    if (!node) return ''
    if (node.text !== undefined) return node.text
    if (node.children) return node.children.map(nodeToText).join('')
    return ''
  }

  return (
    <div style={{ maxWidth: 680 }}>
      {nodes.map((node: any, i: number) => {
        if (node.type === 'heading') {
          const Tag = node.tag as 'h2' | 'h3'
          return (
            <Tag
              key={i}
              style={{
                ...(node.tag === 'h2' ? t.h2 : t.h3),
                color: 'var(--ao-t1)',
                margin: '36px 0 12px',
              }}
            >
              {nodeToText(node)}
            </Tag>
          )
        }
        if (node.type === 'list') {
          const Tag = node.listType === 'bullet' ? 'ul' : 'ol'
          return (
            <Tag
              key={i}
              style={{
                margin: '8px 0 20px',
                paddingLeft: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {(node.children ?? []).map((li: any, j: number) => (
                <li key={j} style={{ ...t.bodyBase, color: 'var(--ao-t2)' }}>
                  {nodeToText(li)}
                </li>
              ))}
            </Tag>
          )
        }
        const text = nodeToText(node)
        if (!text.trim()) return <div key={i} style={{ height: 10 }} />
        return (
          <p key={i} style={{ ...t.body, color: 'var(--ao-t2)', marginBottom: 20 }}>
            {text}
          </p>
        )
      })}
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'aceone-briefs',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  const brief = res.docs[0] as any
  if (!brief) return { title: 'Issue Not Found — Aceone' }
  return {
    title: `${brief.title} — The Aceone Brief`,
    description: brief.emailPreviewText || '',
    openGraph: {
      title: brief.title,
      description: brief.emailPreviewText || '',
      ...(brief.coverImage?.url ? { images: [{ url: brief.coverImage.url }] } : {}),
    },
  }
}

export default async function BriefIssuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'aceone-briefs',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })

  const brief = res.docs[0] as any
  if (!brief) notFound()

  const tags: string[] = (brief.tags ?? [])
    .map((t: any) => (typeof t === 'object' ? t.tag ?? '' : t))
    .filter(Boolean)

  return (
    <main style={{ background: 'var(--ao-bg)', minHeight: '100vh', paddingTop: 'var(--ao-nav-h)' }}>
      {/* Back */}
      <div className="ao-brief-back" style={{ borderBottom: '1px solid var(--ao-border)', padding: '16px 48px', maxWidth: 1280, margin: '0 auto' }}>
        <Link
          href="/the-brief"
          style={{
            fontFamily: mono,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--ao-t3)',
            textDecoration: 'none',
          }}
        >
          ← All Issues
        </Link>
      </div>

      {/* Article */}
      <article className="ao-brief-article" style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 48px 100px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 64 }}>
        {/* Main */}
        <div>
          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            {brief.issueNumber && (
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 9,
                  fontWeight: 700,
                  color: 'var(--ao-bg)',
                  background: 'var(--ao-accent)',
                  padding: '3px 10px',
                  letterSpacing: '0.1em',
                }}
              >
                ISSUE #{brief.issueNumber}
              </span>
            )}
            {brief.publishedAt && (
              <span style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)', letterSpacing: '0.08em' }}>
                {fmtDate(brief.publishedAt)}
              </span>
            )}
          </div>

          <h1
            style={{
              ...t.displaySm,
              color: 'var(--ao-t1)',
              marginBottom: 20,
            }}
          >
            {brief.title}
          </h1>

          {brief.emailPreviewText && (
            <p
              style={{
                ...t.bodyLg,
                color: 'var(--ao-t2)',
                marginBottom: 40,
                paddingBottom: 32,
                borderBottom: '1px solid var(--ao-border)',
              }}
            >
              {brief.emailPreviewText}
            </p>
          )}

          {/* Cover image */}
          {brief.coverImage?.url && (
            <div style={{ marginBottom: 40, borderBottom: '1px solid var(--ao-border)', paddingBottom: 40 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brief.coverImage.url}
                alt={brief.title}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          )}

          <BriefContent content={brief.content} />
        </div>

        {/* Sidebar */}
        <aside style={{ paddingTop: 56 }}>
          <div style={{ position: 'sticky', top: 'calc(var(--ao-nav-h) + 32px)', display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Tags */}
            {tags.length > 0 && (
              <div>
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--ao-t3)',
                    marginBottom: 12,
                  }}
                >
                  Topics
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: mono,
                        fontSize: 9,
                        letterSpacing: '0.08em',
                        color: 'var(--ao-t2)',
                        border: '1px solid var(--ao-border)',
                        padding: '3px 8px',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back to archive */}
            <div style={{ borderTop: '1px solid var(--ao-border)', paddingTop: 24 }}>
              <div
                style={{
                  ...t.label,
                  color: 'var(--ao-t3)',
                  marginBottom: 12,
                }}
              >
                More Issues
              </div>
              <Link
                href="/the-brief"
                style={{
                  fontFamily: mono,
                  fontSize: 11,
                  color: 'var(--ao-t2)',
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                Browse the archive →
              </Link>
            </div>
          </div>
        </aside>
      </article>

      <NewsletterSection />
    </main>
  )
}
