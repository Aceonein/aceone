import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { HOME_PAGE_SIZE, HOME_POST_SELECT } from '@/lib/blogPosts'

// Public, published posts only (overrideAccess:false). Cached at the edge for a minute per URL.
export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams
    const page = Math.max(1, Math.min(100, Number(sp.get('page')) || 1))
    const category = sp.get('category')?.slice(0, 80)
    const q = sp.get('q')?.trim().slice(0, 80)

    const and: any[] = [{ status: { equals: 'published' } }]
    if (category) and.push({ 'categories.title': { equals: category } })
    if (q) and.push({ or: [{ title: { like: q } }, { excerpt: { like: q } }] })

    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({
      collection: 'posts',
      depth: 1,
      limit: HOME_PAGE_SIZE,
      page,
      sort: '-publishedAt',
      draft: false,
      overrideAccess: false,
      where: { and },
      select: HOME_POST_SELECT,
    })

    return NextResponse.json(
      { docs: res.docs, totalDocs: res.totalDocs, hasNextPage: res.hasNextPage },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } },
    )
  } catch (err: any) {
    console.error('blog-posts error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
