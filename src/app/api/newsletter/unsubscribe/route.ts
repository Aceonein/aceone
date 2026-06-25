import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config: configPromise })

    const existing = await payload.find({
      collection: 'newsletter-subscribers',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 })
    }

    await payload.update({
      collection: 'newsletter-subscribers',
      id: existing.docs[0].id,
      data: {
        status: 'unsubscribed',
        unsubscribedAt: new Date().toISOString(),
      },
    })

    return NextResponse.redirect(new URL('/unsubscribed', request.url))
  } catch (err) {
    console.error('Unsubscribe error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
