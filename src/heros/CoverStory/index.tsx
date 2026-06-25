import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import type { Page, Post } from '@/payload-types'
import Link from 'next/link'

type Props = Page['hero'] & { id?: string }

export const CoverStoryHero: React.FC<Props> = async ({ coverStoryOverride }) => {
  const payload = await getPayload({ config: configPromise })

  let post: Post | null = null

  if (coverStoryOverride && typeof coverStoryOverride === 'object') {
    post = coverStoryOverride as Post
  } else if (typeof coverStoryOverride === 'string') {
    try {
      post = (await payload.findByID({ collection: 'posts', id: coverStoryOverride, depth: 1 })) as Post
    } catch {
      // fall through to auto-pick
    }
  }

  if (!post) {
    const result = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-views',
      limit: 5,
      depth: 1,
    })
    // tiebreak: pick highest views+upvotes
    post = result.docs.sort(
      (a, b) => (b.views ?? 0) + (b.upvotes ?? 0) - ((a.views ?? 0) + (a.upvotes ?? 0)),
    )[0] ?? null
  }

  if (!post) return null

  const image = typeof post.featuredImage === 'object' ? post.featuredImage : null
  const imgUrl = (image as any)?.url ?? (image as any)?.sizes?.large?.url ?? ''
  const category = Array.isArray(post.categories) && typeof post.categories[0] === 'object'
    ? post.categories[0]
    : null

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 520,
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
        background: '#0d0f14',
      }}
    >
      {/* Background image */}
      {imgUrl && (
        <img
          src={imgUrl}
          alt={post.featuredImageAlt ?? post.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.45,
          }}
        />
      )}

      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, #0d0f14 30%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1200,
          margin: '0 auto',
          padding: '48px 32px',
          width: '100%',
        }}
      >
        {category && (
          <div
            style={{
              display: 'inline-block',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#6fa0f8',
              marginBottom: 14,
            }}
          >
            Cover Story · {(category as any).title}
          </div>
        )}

        <h1
          style={{
            fontSize: 'clamp(28px, 5vw, 52px)',
            fontWeight: 800,
            lineHeight: 1.1,
            color: '#edeae3',
            margin: '0 0 16px',
            maxWidth: 760,
            letterSpacing: '-0.02em',
          }}
        >
          {post.title}
        </h1>

        {post.excerpt && (
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.6,
              color: '#a0a8b8',
              margin: '0 0 28px',
              maxWidth: 620,
            }}
          >
            {post.excerpt}
          </p>
        )}

        <Link
          href={`/posts/${post.slug}`}
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            background: '#edeae3',
            color: '#0d0f14',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            borderRadius: 4,
          }}
        >
          Read Story →
        </Link>
      </div>
    </section>
  )
}
