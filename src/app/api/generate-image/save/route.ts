import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { imageData, alt, filename } = await request.json()

    if (!imageData || !filename) {
      return NextResponse.json({ error: 'Missing imageData or filename' }, { status: 400 })
    }

    const buffer = Buffer.from(imageData, 'base64')

    const doc = await payload.create({
      collection: 'media',
      data: { alt: alt || filename },
      file: {
        data: buffer,
        mimetype: 'image/webp',
        name: filename,
        size: buffer.length,
      },
      // AI-generated images skip NSFW hook — DALL-E has its own content filters
      context: { skipNsfwCheck: true },
      overrideAccess: false,
      req: { user } as any,
    })

    return NextResponse.json({ id: doc.id, filename: (doc as any).filename })
  } catch (err: any) {
    console.error('Save generated image error:', err)
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 })
  }
}
