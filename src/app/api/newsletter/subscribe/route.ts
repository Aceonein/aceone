import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, source, consent, metadata } = body

    if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
    if (!consent?.newsletter) {
      return NextResponse.json({ error: 'Newsletter consent required' }, { status: 400 })
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown'

    const payload = await getPayload({ config: configPromise })

    // Check duplicate
    const existing = await payload.find({
      collection: 'newsletter-subscribers',
      where: { email: { equals: email } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      return NextResponse.json({ error: 'Email already subscribed' }, { status: 409 })
    }

    await payload.create({
      collection: 'newsletter-subscribers',
      data: {
        email,
        status: 'active',
        source: source || 'unknown',
        consentNewsletter: true,
        consentMarketing: consent.marketing || false,
        subscribedAt: new Date().toISOString(),
        ipAddress: ip,
        userAgent: metadata?.userAgent || '',
        referrer: metadata?.referrer || '',
      },
    })

    return NextResponse.json({ success: true, message: 'Successfully subscribed' })
  } catch (err: any) {
    console.error('Subscribe error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
