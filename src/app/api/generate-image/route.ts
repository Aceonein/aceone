import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import sharp from 'sharp'

const SIZES: Record<string, '1024x1024' | '1792x1024' | '1024x1792'> = {
  square: '1024x1024',
  landscape: '1792x1024',
  portrait: '1024x1792',
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 503 })
    }

    const { prompt, size = 'landscape', quality = 'standard' } = await request.json()

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
      return NextResponse.json({ error: 'Prompt is required (min 3 characters)' }, { status: 400 })
    }

    const dalleSize = SIZES[size] ?? SIZES.landscape

    const dalleRes = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt.trim(),
        n: 1,
        size: dalleSize,
        quality,
        response_format: 'url',
      }),
    })

    if (!dalleRes.ok) {
      const err = await dalleRes.json().catch(() => ({}))
      const message = err?.error?.message || `DALL-E API error ${dalleRes.status}`
      console.error('DALL-E error:', dalleRes.status, JSON.stringify(err))
      return NextResponse.json({ error: message, status: dalleRes.status }, { status: 502 })
    }

    const dalleJson = await dalleRes.json()
    const imageUrl: string = dalleJson?.data?.[0]?.url
    const revisedPrompt: string = dalleJson?.data?.[0]?.revised_prompt || prompt

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image returned from DALL-E' }, { status: 502 })
    }

    // Download and convert to WebP
    const imgRes = await fetch(imageUrl)
    const rawBuffer = Buffer.from(await imgRes.arrayBuffer())

    const { data: webpBuffer, info } = await sharp(rawBuffer)
      .webp({ quality: 85, effort: 4 })
      .toBuffer({ resolveWithObject: true })

    return NextResponse.json({
      imageData: webpBuffer.toString('base64'),
      size: info.size,
      width: info.width,
      height: info.height,
      revisedPrompt,
    })
  } catch (err: any) {
    console.error('Generate image error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
