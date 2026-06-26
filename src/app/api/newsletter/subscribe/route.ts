import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { generateUnsubscribeToken } from '@/lib/email/tokens'
import { getSupabase } from '@/lib/supabase'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

let ratelimit: Ratelimit | null = null
function getRatelimit() {
  const rawUrl = process.env.UPSTASH_REDIS_REST_URL?.replace(/^["']|["']$/g, '')
  const rawToken = process.env.UPSTASH_REDIS_REST_TOKEN?.replace(/^["']|["']$/g, '')
  if (!ratelimit && rawUrl?.startsWith('https://') && rawToken) {
    ratelimit = new Ratelimit({
      redis: new Redis({
        url: rawUrl,
        token: rawToken,
      }),
      limiter: Ratelimit.slidingWindow(3, '1 h'),
      prefix: 'ao:newsletter',
    })
  }
  return ratelimit
}

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

    const rl = getRatelimit()
    if (rl) {
      const { success } = await rl.limit(ip)
      if (!success) {
        return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
      }
    }

    const payload = await getPayload({ config: configPromise })

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

    // Log consent to Supabase (non-blocking audit trail)
    const sb = getSupabase()
    if (sb) {
      const consentRows = [
        { email, source: source || 'unknown', consent_type: 'newsletter', consent_given: true, ip_address: ip, user_agent: metadata?.userAgent || '' },
        ...(consent.marketing ? [{ email, source: source || 'unknown', consent_type: 'marketing', consent_given: true, ip_address: ip, user_agent: metadata?.userAgent || '' }] : []),
      ]
      void sb.from('consent_logs').insert(consentRows as any).then(({ error }) => {
        if (error) console.error('Consent log failed (non-fatal):', error)
      })
    }

    // Send welcome email (non-blocking — failure doesn't break subscribe)
    void sendWelcomeEmail(email).catch((err) =>
      console.error('Welcome email failed (non-fatal):', err),
    )

    return NextResponse.json({ success: true, message: 'Successfully subscribed' })
  } catch (err: any) {
    console.error('Subscribe error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function sendWelcomeEmail(email: string) {
  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey || resendApiKey === 'YOUR_RESEND_API_KEY_HERE') return

  const { getEmailProvider } = await import('@/lib/email')
  const provider = getEmailProvider()

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://blog.aceone.in'
  const token = generateUnsubscribeToken(email)
  const unsubUrl = `${baseUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`

  await provider.sendEmail({
    to: email,
    subject: 'Welcome to The Aceone Brief',
    html: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="background:#0d0f14;color:#edeae3;font-family:'DM Sans',Arial,sans-serif;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
        <tr><td align="center" style="padding:32px 0 24px;">
          <span style="font-size:20px;font-weight:700;color:#edeae3;letter-spacing:0.08em;">ACEONE</span>
        </td></tr>
        <tr><td style="padding:40px 40px 32px;border-top:1px solid #2e3440;">
          <h1 style="font-size:28px;font-weight:700;color:#edeae3;margin:0 0 16px;line-height:1.2;">
            You&apos;re in. See you Sunday.
          </h1>
          <p style="font-size:16px;line-height:1.7;color:#a0a8b8;margin:0 0 24px;">
            Every Sunday at 12:30 PM IST — one email, the week&apos;s most important financial decision explained clearly. No jargon. No agenda.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#a0a8b8;margin:0 0 32px;">
            While you wait, browse past issues in the archive.
          </p>
          <a href="${baseUrl}/the-brief"
             style="display:inline-block;padding:14px 32px;background:#edeae3;color:#0d0f14;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;">
            Browse Archive →
          </a>
        </td></tr>
        <tr><td style="padding:24px 40px;border-top:1px solid #2e3440;text-align:center;">
          <p style="font-size:12px;color:#4c566a;margin:0 0 8px;">
            You&apos;re receiving this because you subscribed to The Aceone Brief.
          </p>
          <p style="font-size:12px;color:#4c566a;margin:0;">
            <a href="${unsubUrl}" style="color:#4c566a;text-decoration:underline;">Unsubscribe</a>
            &nbsp;·&nbsp; © 2026 Aceone. Mumbai, India.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    text: `Welcome to The Aceone Brief.\n\nEvery Sunday at 12:30 PM IST — one email, the week's most important financial decision explained clearly.\n\nBrowse past issues: ${baseUrl}/the-brief\n\nUnsubscribe: ${unsubUrl}`,
    tags: ['welcome', 'aceone-brief'],
  })
}
