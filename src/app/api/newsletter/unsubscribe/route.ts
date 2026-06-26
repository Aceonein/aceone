import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { verifyUnsubscribeToken } from '@/lib/email/tokens'
import { getSupabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  if (!email || !token) {
    return NextResponse.json({ error: 'Missing email or token' }, { status: 400 })
  }

  if (!verifyUnsubscribeToken(email, token)) {
    return NextResponse.json({ error: 'Invalid unsubscribe link' }, { status: 403 })
  }

  try {
    const payload = await getPayload({ config: configPromise })

    const existing = await payload.find({
      collection: 'newsletter-subscribers',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      // Already gone — redirect to unsubscribed page anyway
      return NextResponse.redirect(new URL('/unsubscribed', request.url))
    }

    await payload.update({
      collection: 'newsletter-subscribers',
      id: existing.docs[0].id,
      data: {
        status: 'unsubscribed',
        unsubscribedAt: new Date().toISOString(),
      },
    })

    // Mark consent as revoked in Supabase audit log (non-blocking)
    const sb = getSupabase()
    if (sb) {
      void (sb.from('consent_logs') as any)
        .update({ revoked_at: new Date().toISOString() })
        .eq('email', email)
        .is('revoked_at', null)
        .then(({ error }: { error: any }) => {
          if (error) console.error('Consent revoke failed (non-fatal):', error)
        })
    }

    return NextResponse.redirect(new URL('/unsubscribed', request.url))
  } catch (err) {
    console.error('Unsubscribe error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
