import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { BlogHome } from '@/components/BlogHome'
import { NewsletterSection } from '@/components/NewsletterSection'
import { HOME_PAGE_SIZE, HOME_POST_SELECT } from '@/lib/blogPosts'

export const revalidate = 60

export default async function BlogHomePage() {
  const payload = await getPayload({ config: configPromise })

  const [postsRes, catsRes] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 1,
      limit: HOME_PAGE_SIZE,
      sort: '-publishedAt',
      draft: false,
      overrideAccess: false,
      select: HOME_POST_SELECT,
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
      <BlogHome posts={posts} categories={categories} featuredPost={featured} total={postsRes.totalDocs} />
      <NewsletterSection />
    </main>
  )
}

export const metadata = {
  title: 'Aceone — The smart money blog for young India',
  description: 'Financial clarity for a generation that never got it in school.',
}
