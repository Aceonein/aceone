import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { action } = await request.json() // 'add' | 'remove'

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'

  if (action !== 'add' && action !== 'remove') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

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
  const upvotedBy: Array<{ ip: string }> = post.upvotedBy || []
  const alreadyUpvoted = upvotedBy.some((u) => u.ip === ip)

  let newUpvotes = post.upvotes || 0
  let newUpvotedBy = [...upvotedBy]

  if (action === 'add') {
    if (alreadyUpvoted) {
      return NextResponse.json({ error: 'Already upvoted' }, { status: 400 })
    }
    newUpvotes += 1
    newUpvotedBy.push({ ip })
  } else {
    if (!alreadyUpvoted) {
      return NextResponse.json({ error: 'Not upvoted' }, { status: 400 })
    }
    newUpvotes = Math.max(0, newUpvotes - 1)
    newUpvotedBy = newUpvotedBy.filter((u) => u.ip !== ip)
  }

  await payload.update({
    collection: 'posts',
    id: post.id,
    data: { upvotes: newUpvotes, upvotedBy: newUpvotedBy },
  })

  return NextResponse.json({ upvotes: newUpvotes })
}
