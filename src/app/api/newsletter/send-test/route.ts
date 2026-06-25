import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getEmailProvider } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { issueId, testEmail } = await request.json()

    if (!issueId || !testEmail) {
      return NextResponse.json({ error: 'Missing issueId or testEmail' }, { status: 400 })
    }

    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!EMAIL_REGEX.test(testEmail)) {
      return NextResponse.json({ error: 'Invalid test email address' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
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
