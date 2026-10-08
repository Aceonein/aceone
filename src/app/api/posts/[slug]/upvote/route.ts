import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'

import { postsCollection } from '@/lib/mongo'

// Direct driver access (not Payload): skips Payload's cold start and hooks, and each change is one atomic update
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const { action } = await request.json() // 'add' | 'remove'

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown'

    if (action !== 'add' && action !== 'remove') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const posts = await postsCollection()
    const published = { slug, status: 'published' }

    const updated =
      action === 'add'
        ? await posts.findOneAndUpdate(
            { ...published, 'upvotedBy.ip': { $ne: ip } },
            { $inc: { upvotes: 1 }, $push: { upvotedBy: { ip, id: new ObjectId().toHexString() } } as any },
            { returnDocument: 'after', projection: { upvotes: 1 } },
          )
        : await posts.findOneAndUpdate(
            { ...published, 'upvotedBy.ip': ip },
            [
              {
                $set: {
                  upvotes: { $max: [0, { $subtract: [{ $ifNull: ['$upvotes', 0] }, 1] }] },
                  upvotedBy: { $filter: { input: '$upvotedBy', cond: { $ne: ['$$this.ip', ip] } } },
                },
              },
            ],
            { returnDocument: 'after', projection: { upvotes: 1 } },
          )

    if (updated) return NextResponse.json({ upvotes: updated.upvotes ?? 0 })

    // No match: either the post is missing/unpublished, or the vote state already was what was asked for
    const exists = await posts.findOne(published, { projection: { _id: 1 } })
    if (!exists) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    return NextResponse.json(
      { error: action === 'add' ? 'Already upvoted' : 'Not upvoted' },
      { status: 400 },
    )
  } catch (err: any) {
    console.error('Upvote error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
