import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Redis } from '@upstash/redis'

let redis: Redis | null = null
function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/^["']|["']$/g, '')
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.replace(/^["']|["']$/g, '')
  if (!redis && url?.startsWith('https://') && token) {
    redis = new Redis({ url, token })
  }
  return redis
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown'

    const r = getRedis()
    if (r) {
      try {
        // SET key 1 EX 86400 NX — returns 'OK' if set (first view), null if already exists
        const set = await r.set(`ao:view:${slug}:${ip}`, 1, { ex: 86400, nx: true })
        if (set === null) {
          // Already viewed within 24h — client ignores null, skip DB entirely
          return NextResponse.json({ views: null })
        }
      } catch (err: any) {
        // Redis only de-duplicates; if it is down or misconfigured, still count the view
        console.error('[view] Redis unavailable, counting without dedup:', err?.message)
      }
    }

    const payload = await getPayload({ config: configPromise })
    const posts = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug }, status: { equals: 'published' } },
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
  } catch (err: any) {
    console.error('View count error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Current counts for a published post (the post page itself is cached, so its numbers go stale)
export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const payload = await getPayload({ config: configPromise })
    const posts = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug }, status: { equals: 'published' } },
      limit: 1,
      depth: 0,
      select: { views: true, upvotes: true } as any,
    })
    const post = posts.docs[0] as any
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    return NextResponse.json(
      { views: post.views ?? 0, upvotes: post.upvotes ?? 0 },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (err: any) {
    console.error('View counts read error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
