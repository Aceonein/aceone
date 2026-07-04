import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import sharp from 'sharp'

// Cloudflare Workers AI — flux-1-schnell
// Dimensions must be multiples of 8, max 1024 on free tier
const SIZES: Record<string, { width: number; height: number }> = {
  landscape: { width: 1024, height: 576 },
  square:    { width: 1024, height: 1024 },
  portrait:  { width: 576,  height: 1024 },
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
    const apiToken  = process.env.CLOUDFLARE_API_TOKEN

    if (!accountId || !apiToken) {
      return NextResponse.json(
        { error: 'CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN not configured' },
        { status: 503 },
      )
    }

    const { prompt, size = 'landscape', quality = 'standard' } = await request.json()

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
      return NextResponse.json({ error: 'Prompt is required (min 3 characters)' }, { status: 400 })
    }

    const { width, height } = SIZES[size] ?? SIZES.landscape
    // standard = 8 steps (fast), hd = 20 steps (more detail)
    const num_steps = quality === 'hd' ? 20 : 8

    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim(), num_steps, width, height }),
      },
    )

    if (!cfRes.ok) {
      const err = await cfRes.json().catch(() => ({}))
      const message = err?.errors?.[0]?.message || `Cloudflare AI error ${cfRes.status}`
      console.error('Cloudflare AI error:', cfRes.status, JSON.stringify(err))
      return NextResponse.json({ error: message }, { status: 502 })
    }

    // CF returns binary image — convert to WebP
    const rawBuffer = Buffer.from(await cfRes.arrayBuffer())

    const { data: webpBuffer, info } = await sharp(rawBuffer)
      .webp({ quality: 85, effort: 4 })
      .toBuffer({ resolveWithObject: true })

    return NextResponse.json({
      imageData: webpBuffer.toString('base64'),
      size: info.size,
      width: info.width,
      height: info.height,
      revisedPrompt: prompt, // CF doesn't revise prompts
    })
  } catch (err: any) {
    console.error('Generate image error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
