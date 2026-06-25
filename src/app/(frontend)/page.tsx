import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { BlogHome } from '@/components/BlogHome'
import { NewsletterSection } from '@/components/NewsletterSection'

export const dynamic = 'force-dynamic'
export const revalidate = 60

export default async function BlogHomePage() {
  const payload = await getPayload({ config: configPromise })

  const [postsRes, catsRes] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 1,
      limit: 50,
      sort: '-publishedAt',
      draft: false,
      overrideAccess: false,
      select: {
        title: true, slug: true, excerpt: true, publishedAt: true,
        readTime: true, views: true, upvotes: true,
        featuredImage: true, categories: true, author: true,
      },
    }),
    payload.find({
      collection: 'categories',
      depth: 0,
      limit: 20,
      sort: 'order',
      overrideAccess: false,
    }),
  ])

  const posts = postsRes.docs as any[]
  const categories = catsRes.docs as any[]
  const featured = posts[0] ?? null

  return (
    <main style={{ background: 'var(--ao-bg)', minHeight: '100vh', transition: 'background 0.4s' }}>
      <BlogHome posts={posts} categories={categories} featuredPost={featured} />
      <NewsletterSection />
    </main>
  )
}

export const metadata = {
  title: 'Aceone — The smart money blog for young India',
  description: 'Financial clarity for a generation that never got it in school.',
}
