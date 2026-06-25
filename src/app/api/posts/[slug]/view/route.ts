import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

// ponytail: simple in-memory dedup per process — good enough for MVP, use Redis if needed
const recentViews = new Map<string, number>()

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'

  const key = `${slug}:${ip}`
  const now = Date.now()
  const last = recentViews.get(key)

  // Deduplicate: 1 view per IP per 24 hours
  if (last && now - last < 24 * 60 * 60 * 1000) {
    const payload = await getPayload({ config: configPromise })
    const posts = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      limit: 1,
      select: { views: true },
    })
    return NextResponse.json({ views: posts.docs[0]?.views || 0 })
  }

  recentViews.set(key, now)

  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (posts.docs.length === 0) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  const post = posts.docs[0] as any
  const newViews = (post.views || 0) + 1

  await payload.update({
    collection: 'posts',
    id: post.id,
    data: { views: newViews },
  })

  return NextResponse.json({ views: newViews })
}
