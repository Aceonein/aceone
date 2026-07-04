import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getEmailProvider } from '@/lib/email'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let ratelimit: Ratelimit | null = null
function getRatelimit() {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/^["']|["']$/g, '')
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.replace(/^["']|["']$/g, '')
  if (!ratelimit && url?.startsWith('https://') && token) {
    ratelimit = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      prefix: 'ao:send-test',
    })
  }
  return ratelimit
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    const { issueId, testEmail } = await request.json()

    if (!issueId || !testEmail) {
      return NextResponse.json({ error: 'Missing issueId or testEmail' }, { status: 400 })
    }

    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!EMAIL_REGEX.test(testEmail)) {
      return NextResponse.json({ error: 'Invalid test email address' }, { status: 400 })
    }

    const issue = await payload.findByID({ collection: 'aceone-briefs', id: issueId }) as any

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 })
    }

    if (!issue.htmlEmailContent) {
      return NextResponse.json(
        { error: 'No HTML content — set status to Scheduled first to generate it' },
        { status: 400 },
      )
    }

    const emailProvider = getEmailProvider()
    const html = issue.htmlEmailContent.replace(
      '{{unsubscribe_url}}',
      `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/unsubscribed`,
    )

    const result = await emailProvider.sendEmail({
      to: testEmail,
      subject: `[TEST] ${issue.emailSubject}`,
      html,
      text: issue.plainTextContent || '',
      tags: ['test', 'aceone-brief'],
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: `Test email sent to ${testEmail}` })
  } catch (err: any) {
    console.error('Send test email error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
