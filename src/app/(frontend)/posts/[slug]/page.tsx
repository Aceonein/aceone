import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { BlockRenderer } from '@/components/BlockRenderer'
import { NewsletterSection } from '@/components/NewsletterSection'
import { ReadingProgress } from '@/components/ReadingProgress'
import { UpvoteButton, ShareButtons, TOCClient } from '@/components/ArticleActions'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import Link from 'next/link'

import type { Post } from '@/payload-types'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { catColor } from '@/utilities/catColor'
import { font, type as t, z } from '@/lib/ds'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return posts.docs.map(({ slug }) => ({ slug }))
}

type Args = { params: Promise<{ slug?: string }> }

const mono = font.mono
const sans = font.sans

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function extractTOC(blocks: any[]): { label: string; id: string }[] {
  const items: { label: string; id: string }[] = []
  for (const b of blocks) {
    if (b.blockType === 'heading' && (b.level === 'h2' || !b.level) && b.text) {
      items.push({ label: b.text, id: slugify(b.text) })
    }
    if (b.blockType === 'section-marker' && b.label) {
      items.push({ label: b.label, id: slugify(b.label) })
    }
  }
  return items
}

export default async function PostPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const author  = typeof post.author === 'object' ? post.author : null
  const cat     = typeof (post as any).categories?.[0] === 'object' ? (post as any).categories[0] : null
  const accent  = catColor(cat?.color)
  const tags: any[] = (post as any).tags ?? []
  const img     = typeof (post as any).featuredImage === 'object' ? (post as any).featuredImage : null
  const blocks  = (post as any).content ?? []
  const toc     = extractTOC(blocks)
  const upvotes = (post as any).upvotes ?? 0
  const views   = (post as any).views

  const date = (post as any).publishedAt
    ? new Date((post as any).publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''

  // Related posts — same category, different slug
  let relatedPosts: any[] = []
  if (cat?.id) {
    const payload = await getPayload({ config: configPromise })
    const rel = await payload.find({
      collection: 'posts',
      where: { and: [{ slug: { not_equals: decodedSlug } }, { categories: { in: [cat.id] } }] },
      limit: 4,
      depth: 1,
      select: { title: true, slug: true, categories: true },
    }).catch(() => ({ docs: [] }))
    relatedPosts = rel.docs
  }

  const fullUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://blog.aceone.in'}/posts/${post.slug}`

  return (
    <main style={{ background: 'var(--ao-bg)', minHeight: '100vh', paddingTop: 'var(--ao-nav-h)' }}>
      <ReadingProgress />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      {/* Breadcrumb */}
      <div style={{ position: 'sticky', top: 'var(--ao-nav-h)', zIndex: 50, borderBottom: '1px solid var(--ao-border)', background: 'var(--ao-bg)' }}>
        <div className="ao-breadcrumb-inner" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 36, display: 'flex', alignItems: 'center', gap: 6, fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)' }}>
          <Link href="/" style={{ color: 'var(--ao-t3)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          {cat?.title && (
            <>
              <Link href={`/?cat=${(cat.title as string).toLowerCase().replace(/\s+/g, '-')}`} style={{ color: 'var(--ao-t3)', textDecoration: 'none' }}>{cat.title}</Link>
              <span>/</span>
            </>
          )}
          <span style={{ color: 'var(--ao-t2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 320 }}>{post.title}</span>
        </div>
      </div>

      {/* 3-col body */}
      <div className="ao-article-3col" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '220px 1fr 220px', minHeight: 'calc(100vh - var(--ao-nav-h) - 36px)', borderLeft: '1px solid var(--ao-border)' }}>

        {/* ── Left sidebar ── */}
        <aside className="ao-sidebar-left" style={{ borderRight: '1px solid var(--ao-border)', padding: '32px 20px', position: 'sticky', top: 'calc(var(--ao-nav-h) + 36px + 2px)', alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: 0, maxHeight: 'calc(100vh - var(--ao-nav-h) - 60px)', overflowY: 'auto' }}>

          {/* Meta grid — 2-col on mobile */}
          <div className="ao-meta-grid">
            {cat?.title && (
              <div className="ao-meta-item ao-meta-cat" style={{ paddingBottom: 20, marginBottom: 20, borderBottom: '1px solid var(--ao-border)' }}>
                <div style={{ ...t.label, color: 'var(--ao-t3)', marginBottom: 10 }}>Category</div>
                <Link href={`/?cat=${(cat.title as string).toLowerCase().replace(/\s+/g, '-')}`} style={{ textDecoration: 'none' }}>
                  <span style={{ display: 'inline-block', fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent, border: `1px solid ${accent}`, padding: '4px 10px' }}>
                    {cat.title}
                  </span>
                </Link>
              </div>
            )}
            {date && (
              <div className="ao-meta-item" style={{ paddingBottom: 20, marginBottom: 20, borderBottom: '1px solid var(--ao-border)' }}>
                <div style={{ ...t.label, color: 'var(--ao-t3)', marginBottom: 6 }}>Published</div>
                <div style={{ fontFamily: mono, fontSize: 12, color: 'var(--ao-t2)' }}>{date}</div>
              </div>
            )}
            {(post as any).readTime && (
              <div className="ao-meta-item" style={{ paddingBottom: 20, marginBottom: 20, borderBottom: '1px solid var(--ao-border)' }}>
                <div style={{ ...t.label, color: 'var(--ao-t3)', marginBottom: 6 }}>Read time</div>
                <div style={{ fontFamily: mono, fontSize: 12, color: 'var(--ao-t2)' }}>{(post as any).readTime} min</div>
              </div>
            )}
            {views != null && (
              <div className="ao-meta-item" style={{ paddingBottom: 20, marginBottom: 20, borderBottom: '1px solid var(--ao-border)' }}>
                <div style={{ ...t.label, color: 'var(--ao-t3)', marginBottom: 6 }}>Views</div>
                <div style={{ fontFamily: mono, fontSize: 22, fontWeight: 700, color: 'var(--ao-t1)', lineHeight: 1 }}>
                  {views > 999 ? `${(views / 1000).toFixed(1)}k` : views}
                </div>
              </div>
            )}
          </div>

          {/* Upvote */}
          <div className="ao-sidebar-actions" style={{ marginBottom: 20 }}>
            <UpvoteButton slug={decodedSlug} initial={upvotes} />
          </div>

          {/* Share */}
          <div style={{ paddingBottom: 20, marginBottom: 20, borderBottom: '1px solid var(--ao-border)' }}>
            <div style={{ ...t.label, color: 'var(--ao-t3)', marginBottom: 10 }}>Share</div>
            <ShareButtons url={fullUrl} title={post.title} />
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <div style={{ ...t.label, color: 'var(--ao-t3)', marginBottom: 12 }}>Tags</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {tags.slice(0, 8).map((tag: any, i: number) => {
                  const label = typeof tag === 'object' ? (tag.title ?? tag.name ?? '') : tag
                  return (
                    <span key={i} style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ao-t2)', border: '1px solid var(--ao-border-2)', padding: '4px 8px' }}>
                      {label}
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </aside>

        {/* ── Main article ── */}
        <article className="ao-article-main" style={{ borderRight: '1px solid var(--ao-border)', padding: '48px 56px 100px' }}>

          {/* Category label */}
          {cat?.title && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <span style={{ display: 'inline-block', width: 28, height: 2, background: accent, flexShrink: 0 }} />
              <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: accent }}>{cat.title}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="ao-article-title" style={{ ...t.displayMd, color: 'var(--ao-t1)', marginBottom: 24, maxWidth: 780 }}>
            {post.title}
          </h1>

          {/* Excerpt / lead */}
          {(post as any).excerpt && (
            <p className="ao-article-excerpt" style={{ ...t.bodyLg, color: 'var(--ao-t2)', marginBottom: 32, paddingLeft: 18, borderLeft: '2px solid var(--ao-border-2)', maxWidth: 640 }}>
              {(post as any).excerpt}
            </p>
          )}

          {/* Author row */}
          {author && (
            <div className="ao-author-row" style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 28, borderBottom: '1px solid var(--ao-border)', marginBottom: 36 }}>
              <div style={{ width: 34, height: 34, background: 'var(--ao-bg-2)', border: `1px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontSize: 12, fontWeight: 700, color: accent, flexShrink: 0 }}>
                {author.name?.charAt(0) ?? 'A'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: 'var(--ao-t1)', marginBottom: 3 }}>{author.name}</div>
                <div style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {(author as any).role && <><span style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>{(author as any).role}</span><span>/</span></>}
                  {date && <><span>{date}</span><span>/</span></>}
                  {(post as any).readTime && <span>{(post as any).readTime} min read</span>}
                </div>
              </div>
              {views != null && (
                <div style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)', letterSpacing: '0.06em', flexShrink: 0 }}>
                  {views > 999 ? `${(views / 1000).toFixed(1)}k` : views} views
                </div>
              )}
              <UpvoteButton slug={decodedSlug} initial={upvotes} compact />
            </div>
          )}

          {/* Mobile meta — share + tags (hidden on desktop) */}
          <div className="ao-mobile-meta" style={{ display: 'none', marginBottom: 28 }}>
            {/* Share */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ ...t.label, color: 'var(--ao-t3)', marginBottom: 8 }}>Share</div>
              <ShareButtons url={fullUrl} title={post.title} horizontal />
            </div>
            {/* Tags */}
            {tags.length > 0 && (
              <div>
                <div style={{ ...t.label, color: 'var(--ao-t3)', marginBottom: 8 }}>Tags</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {tags.slice(0, 8).map((tag: any, i: number) => {
                    const label = typeof tag === 'object' ? (tag.title ?? tag.name ?? '') : tag
                    return (
                      <span key={i} style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ao-t2)', border: '1px solid var(--ao-border-2)', padding: '4px 8px' }}>
                        {label}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
            <div style={{ borderBottom: '1px solid var(--ao-border)', marginTop: 20 }} />
          </div>

          {/* Cover image */}
          {img?.url ? (
            <div style={{ width: '100%', aspectRatio: '16/7', overflow: 'hidden', marginBottom: 48, border: '1px solid var(--ao-border)' }}>
              <img src={img.url} alt={img.alt ?? post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          ) : (
            <div style={{ width: '100%', aspectRatio: '16/7', marginBottom: 48, border: '1px solid var(--ao-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ao-bg-2)' }}>
              <span style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Cover Image</span>
            </div>
          )}

          {/* Content */}
          <BlockRenderer blocks={blocks} />
          {!blocks.length && (
            <p style={{ fontSize: 16, color: 'var(--ao-t3)', fontStyle: 'italic' }}>No content yet.</p>
          )}
        </article>

        {/* ── Right sidebar ── */}
        <aside className="ao-sidebar-right" style={{ padding: '32px 20px', position: 'sticky', top: 'calc(var(--ao-nav-h) + 36px + 2px)', alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: 32, maxHeight: 'calc(100vh - var(--ao-nav-h) - 60px)', overflowY: 'auto' }}>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div>
              <div style={{ ...t.label, color: 'var(--ao-t3)', marginBottom: 14 }}>Related</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {relatedPosts.map((rp: any) => {
                  const rpCat = typeof rp.categories?.[0] === 'object' ? rp.categories[0] : null
                  const rpAccent = catColor(rpCat?.color)
                  return (
                    <Link key={rp.id} href={`/posts/${rp.slug}`} style={{ textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid var(--ao-border)', display: 'block' }}>
                      {rpCat?.title && (
                        <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: rpAccent, marginBottom: 5 }}>{rpCat.title}</div>
                      )}
                      <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, lineHeight: 1.35, color: 'var(--ao-t1)' }}>{rp.title}</div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* TOC + Newsletter — desktop only */}
          <div className="ao-sidebar-desktop-only">
            <TOCClient items={toc} />
            <div style={{ background: 'var(--ao-bg-2)', border: '1px solid var(--ao-border)', padding: 18, marginTop: 32 }}>
              <div style={{ ...t.label, color: 'var(--ao-t3)', marginBottom: 8 }}>The Brief</div>
              <p style={{ fontSize: 12, color: 'var(--ao-t2)', lineHeight: 1.6, marginBottom: 14 }}>Weekly financial clarity. Every Sunday.</p>
              <Link href="#newsletter" className="ao-cta" style={{ display: 'block', textAlign: 'center', padding: '9px 0', background: 'var(--ao-t1)', color: 'var(--ao-bg)', fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Subscribe →
              </Link>
            </div>
          </div>

        </aside>
      </div>

      <NewsletterSection />
    </main>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug: decodeURIComponent(slug) })
  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    depth: 2,
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})
