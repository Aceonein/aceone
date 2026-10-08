import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

import { postsCollection } from '@/lib/mongo'

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

    // Atomic $inc straight to the DB (no Payload boot, no update hooks, no cache purge)
    const posts = await postsCollection()
    const post = await posts.findOneAndUpdate(
      { slug, status: 'published' },
      { $inc: { views: 1 } },
      { returnDocument: 'after', projection: { views: 1 } },
    )
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

    return NextResponse.json({ views: post.views })
  } catch (err: any) {
    console.error('View count error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Current counts for a published post (the post page itself is cached, so its numbers go stale)
export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const posts = await postsCollection()
    const post = await posts.findOne({ slug, status: 'published' }, { projection: { views: 1, upvotes: 1 } })
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
