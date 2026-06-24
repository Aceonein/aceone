import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Search } from '@/search/Component'
import Link from 'next/link'

type Args = {
  searchParams: Promise<{ q: string }>
}

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    pagination: false,
    ...(query
      ? {
          where: {
            or: [
              { title: { like: query } },
              { 'meta.description': { like: query } },
              { 'meta.title': { like: query } },
              { slug: { like: query } },
            ],
          },
        }
      : {}),
  })

  return (
    <main style={{ background: 'var(--ao-bg)', minHeight: '100vh', paddingTop: 52, transition: 'background 0.4s' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '70px 48px 80px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ao-t1)', marginBottom: 36 }}>
          Search
        </h1>
        <div style={{ marginBottom: 48 }}>
          <Search />
        </div>
        {posts.totalDocs > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {posts.docs.map((post: any) => (
              <Link key={post.id} href={`/posts/${post.slug}`} style={{ textDecoration: 'none', padding: '20px 0', borderBottom: '1px solid var(--ao-border)', display: 'block' }}>
                <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--ao-t1)', marginBottom: 4 }}>{post.title}</div>
                {post.meta?.description && <div style={{ fontSize: 13.5, color: 'var(--ao-t3)', lineHeight: 1.6 }}>{post.meta.description}</div>}
              </Link>
            ))}
          </div>
        ) : query ? (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ao-t3)' }}>No results for &ldquo;{query}&rdquo;.</p>
        ) : null}
      </div>
    </main>
  )
}

export function generateMetadata(): Metadata {
  return { title: 'Search — Aceone' }
}
