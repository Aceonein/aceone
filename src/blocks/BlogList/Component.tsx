import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import type { BlogListBlock as BlogListBlockProps, Category, Post } from '@/payload-types'

type Props = BlogListBlockProps & {
  searchParams?: { page?: string; category?: string }
}

export const BlogListBlock: React.FC<Props> = async ({
  postsPerPage = 12,
  showCategoryFilter = true,
  searchParams,
}) => {
  const payload = await getPayload({ config: configPromise })
  const page = Number(searchParams?.page ?? 1)
  const categorySlug = searchParams?.category

  // Resolve category filter
  let categoryId: string | undefined
  if (categorySlug) {
    const cats = await payload.find({
      collection: 'categories',
      where: { slug: { equals: categorySlug } },
      limit: 1,
    })
    categoryId = cats.docs[0]?.id
  }

  const result = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: postsPerPage ?? 12,
    page,
    sort: '-publishedAt',
    where: {
      status: { equals: 'published' },
      ...(categoryId ? { categories: { in: [categoryId] } } : {}),
    },
  })

  const posts = result.docs as Post[]
  const totalPages = result.totalPages

  // Fetch categories for filter bar
  let categories: Category[] = []
  if (showCategoryFilter) {
    const catResult = await payload.find({ collection: 'categories', limit: 20, sort: 'order' })
    categories = catResult.docs as Category[]
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 80px' }}>
      {/* Category filter */}
      {showCategoryFilter && categories.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
          <FilterChip label="All" slug="" active={!categorySlug} />
          {categories.map((cat) => (
            <FilterChip
              key={cat.id}
              label={cat.title}
              slug={(cat as any).slug ?? ''}
              active={categorySlug === (cat as any).slug}
            />
          ))}
        </div>
      )}

      {/* Posts grid */}
      {posts.length === 0 ? (
        <p style={{ color: 'var(--ao-t3, #6b7296)', fontSize: 15 }}>No posts found.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 28,
            marginBottom: 48,
          }}
        >
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination current={page} total={totalPages} categorySlug={categorySlug} />
      )}
    </div>
  )
}

function FilterChip({ label, slug, active }: { label: string; slug: string; active: boolean }) {
  return (
    <a
      href={slug ? `?category=${slug}` : '?'}
      style={{
        display: 'inline-block',
        padding: '6px 16px',
        borderRadius: 100,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.06em',
        textDecoration: 'none',
        border: '1px solid',
        borderColor: active ? '#6fa0f8' : 'rgba(255,255,255,0.1)',
        background: active ? 'rgba(72,120,232,0.15)' : 'transparent',
        color: active ? '#6fa0f8' : 'var(--ao-t3, #6b7296)',
        transition: 'all 0.15s',
      }}
    >
      {label}
    </a>
  )
}

function PostCard({ post }: { post: Post }) {
  const image = typeof post.featuredImage === 'object' ? post.featuredImage : null
  const imgUrl = (image as any)?.sizes?.medium?.url ?? (image as any)?.url ?? ''
  const category =
    Array.isArray(post.categories) && typeof post.categories[0] === 'object'
      ? (post.categories[0] as any)
      : null

  return (
    <Link
      href={`/posts/${post.slug}`}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
    >
      {imgUrl && (
        <div
          style={{
            width: '100%',
            aspectRatio: '16/9',
            overflow: 'hidden',
            borderRadius: 8,
            marginBottom: 16,
            background: '#1a1d26',
          }}
        >
          <img
            src={imgUrl}
            alt={post.featuredImageAlt ?? post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}
      {category && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#6fa0f8',
            marginBottom: 8,
          }}
        >
          {category.title}
        </span>
      )}
      <h3
        style={{
          fontSize: 17,
          fontWeight: 700,
          lineHeight: 1.3,
          color: 'var(--ao-t1, #edeae3)',
          margin: '0 0 8px',
          letterSpacing: '-0.01em',
        }}
      >
        {post.title}
      </h3>
      {post.excerpt && (
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: 'var(--ao-t3, #6b7296)',
            margin: '0 0 12px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.excerpt}
        </p>
      )}
      {post.publishedAt && (
        <span style={{ fontSize: 12, color: 'var(--ao-t4, #4c566a)', marginTop: 'auto' }}>
          {new Date(post.publishedAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      )}
    </Link>
  )
}

function Pagination({
  current,
  total,
  categorySlug,
}: {
  current: number
  total: number
  categorySlug?: string
}) {
  const base = categorySlug ? `?category=${categorySlug}&page=` : '?page='
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {current > 1 && (
        <a href={`${base}${current - 1}`} style={pageBtn}>
          ← Prev
        </a>
      )}
      <span style={{ ...pageBtn, cursor: 'default', opacity: 0.5 }}>
        {current} / {total}
      </span>
      {current < total && (
        <a href={`${base}${current + 1}`} style={pageBtn}>
          Next →
        </a>
      )}
    </div>
  )
}

const pageBtn: React.CSSProperties = {
  display: 'inline-block',
  padding: '8px 20px',
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 600,
  textDecoration: 'none',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'var(--ao-t3, #6b7296)',
  background: 'transparent',
}
