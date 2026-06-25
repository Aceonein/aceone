import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { BlockRenderer } from '@/components/BlockRenderer'
import { NewsletterSection } from '@/components/NewsletterSection'
import { ReadingProgress } from '@/components/ReadingProgress'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import Link from 'next/link'

import type { Post } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'

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

import { catColor } from '@/utilities/catColor'

const mono = 'var(--font-mono)'

export default async function PostPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const author = typeof post.author === 'object' ? post.author : null
  const cat = typeof (post as any).categories?.[0] === 'object' ? (post as any).categories[0] : null
  const accent = catColor(cat?.color)
  const tags: any[] = (post as any).tags ?? []
  const img = typeof (post as any).featuredImage === 'object' ? (post as any).featuredImage : null
  const date = (post as any).publishedAt
    ? new Date((post as any).publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''
  const blocks = (post as any).content ?? []

  return (
    <main style={{ background: 'var(--ao-bg)', minHeight: '100vh', paddingTop: 'var(--ao-nav-h)' }}>
      <ReadingProgress />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      {/* Breadcrumb bar */}
      <div style={{ borderBottom: '1px solid var(--ao-border)', background: 'var(--ao-bg)' }}>
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
      <div className="ao-article-3col" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '200px 1fr 200px', minHeight: 'calc(100vh - var(--ao-nav-h) - 36px)', borderLeft: '1px solid var(--ao-border)' }}>

        {/* Left sidebar */}
        <aside className="ao-sidebar-left" style={{ borderRight: '1px solid var(--ao-border)', padding: '32px 20px', position: 'sticky', top: 'calc(var(--ao-nav-h) + 36px + 2px)', alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: 28 }}>
          {cat?.title && (
            <div>
              <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ao-t3)', marginBottom: 6 }}>Category</div>
              <Link href={`/?cat=${(cat.title as string).toLowerCase().replace(/\s+/g, '-')}`} style={{ fontFamily: mono, fontSize: 11, color: 'var(--ao-accent)', textDecoration: 'none', fontWeight: 600 }}>{cat.title}</Link>
            </div>
          )}

          {date && (
            <div>
              <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ao-t3)', marginBottom: 6 }}>Published</div>
              <div style={{ fontFamily: mono, fontSize: 11, color: 'var(--ao-t2)' }}>{date}</div>
            </div>
          )}

          {(post as any).readTime && (
            <div>
              <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ao-t3)', marginBottom: 6 }}>Read time</div>
              <div style={{ fontFamily: mono, fontSize: 11, color: 'var(--ao-t2)' }}>{(post as any).readTime} min</div>
            </div>
          )}

          {(post as any).views != null && (
            <div>
              <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ao-t3)', marginBottom: 6 }}>Views</div>
              <div style={{ fontFamily: mono, fontSize: 18, fontWeight: 700, color: 'var(--ao-t1)', lineHeight: 1 }}>
                {(post as any).views > 999 ? `${((post as any).views / 1000).toFixed(1)}k` : (post as any).views}
              </div>
            </div>
          )}

          {/* Share */}
          <div>
            <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ao-t3)', marginBottom: 10 }}>Share</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { label: 'Twitter / X', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://aceone.in/posts/${post.slug}`)}` },
                { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://aceone.in/posts/${post.slug}`)}` },
              ].map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t2)', textDecoration: 'none', padding: '7px 0', borderBottom: '1px solid var(--ao-border)' }}>
                  {label} →
                </a>
              ))}
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ao-t3)', marginBottom: 10 }}>Tags</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {tags.slice(0, 6).map((tag: any, i: number) => (
                  <span key={i} style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-t3)', borderBottom: '1px solid var(--ao-border)', paddingBottom: 6 }}>
                    {typeof tag === 'object' ? tag.title ?? tag.name : tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main */}
        <article className="ao-article-main" style={{ borderRight: '1px solid var(--ao-border)', padding: '40px 48px 80px' }}>
          {/* Category label */}
          {cat?.title && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <span style={{ display: 'inline-block', width: 24, height: 2, background: accent }} />
              <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: accent }}>{cat.title}</span>
            </div>
          )}

          <h1 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--ao-t1)', marginBottom: 20 }}>
            {post.title}
          </h1>

          {/* Lead / excerpt */}
          {(post as any).excerpt && (
            <p style={{ fontSize: 17, lineHeight: 1.72, color: 'var(--ao-t2)', marginBottom: 28, paddingLeft: 16, borderLeft: '2px solid var(--ao-border-2)' }}>
              {(post as any).excerpt}
            </p>
          )}

          {/* Author row */}
          {author && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 24, borderBottom: '1px solid var(--ao-border)', marginBottom: 32 }}>
              <div style={{ width: 32, height: 32, background: 'var(--ao-bg-2)', border: '1px solid var(--ao-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontSize: 12, fontWeight: 700, color: 'var(--ao-accent)', flexShrink: 0 }}>
                {author.name?.charAt(0) ?? 'A'}
              </div>
              <div style={{ fontFamily: mono, fontSize: 11, color: 'var(--ao-t2)' }}>{author.name}</div>
              {date && <><span style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-border-2)' }}>·</span><span style={{ fontFamily: mono, fontSize: 11, color: 'var(--ao-t3)' }}>{date}</span></>}
              {(post as any).readTime && <><span style={{ fontFamily: mono, fontSize: 10, color: 'var(--ao-border-2)' }}>·</span><span style={{ fontFamily: mono, fontSize: 11, color: 'var(--ao-t3)' }}>{(post as any).readTime} min read</span></>}
            </div>
          )}

          {/* Cover image */}
          {img?.url && (
            <div style={{ width: '100%', aspectRatio: '16/7', overflow: 'hidden', marginBottom: 40, border: '1px solid var(--ao-border)' }}>
              <img src={img.url} alt={img.alt ?? post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          )}

          {/* Content */}
          <BlockRenderer blocks={blocks} />
          {!blocks.length && (
            <p style={{ fontSize: 16, color: 'var(--ao-t3)', fontStyle: 'italic' }}>No content yet.</p>
          )}
        </article>

        {/* Right sidebar */}
        <aside className="ao-sidebar-right" style={{ padding: '32px 20px', position: 'sticky', top: 'calc(var(--ao-nav-h) + 36px + 2px)', alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* Newsletter */}
          <div style={{ background: 'var(--ao-nl-bg)', padding: 20 }}>
            <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ao-nl-t2)', marginBottom: 8 }}>The Brief</div>
            <p style={{ fontSize: 12, color: 'var(--ao-nl-t2)', lineHeight: 1.6, marginBottom: 14 }}>Weekly financial clarity. Every Sunday.</p>
            <Link href="#newsletter" style={{ display: 'block', textAlign: 'center', padding: '9px 0', background: 'var(--ao-nl-t1)', color: 'var(--ao-nl-bg)', fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Subscribe →
            </Link>
          </div>

          {/* Upvotes stat */}
          {(post as any).upvotes != null && (
            <div>
              <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ao-t3)', marginBottom: 6 }}>Upvotes</div>
              <div style={{ fontFamily: mono, fontSize: 24, fontWeight: 700, color: 'var(--ao-t1)', lineHeight: 1 }}>{(post as any).upvotes}</div>
            </div>
          )}
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
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})
