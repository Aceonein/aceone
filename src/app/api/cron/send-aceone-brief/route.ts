import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getEmailProvider } from '@/lib/email'
import { generateUnsubscribeToken } from '@/lib/email/tokens'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config: configPromise })

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Find newsletter scheduled for today
    const newsletters = await payload.find({
      collection: 'aceone-briefs',
      where: {
        status: { equals: 'scheduled' },
        publishedAt: {
          greater_than_equal: today.toISOString(),
          less_than: tomorrow.toISOString(),
        },
      },
      limit: 1,
    })

    if (newsletters.docs.length === 0) {
      return NextResponse.json({ message: 'No newsletter scheduled for today' })
    }

    const newsletter = newsletters.docs[0] as any

    if (!newsletter.htmlEmailContent) {
      return NextResponse.json({ error: 'Newsletter has no generated HTML content' }, { status: 400 })
    }

    // Get all active subscribers
    const subscribers = await payload.find({
      collection: 'newsletter-subscribers',
      where: { status: { equals: 'active' } },
      limit: 10000,
      pagination: false,
    })

    if (subscribers.docs.length === 0) {
      return NextResponse.json({ message: 'No active subscribers' })
    }

    const emailProvider = getEmailProvider()
    const BATCH_SIZE = 100
    let sentCount = 0
    let failedCount = 0

    for (let i = 0; i < subscribers.docs.length; i += BATCH_SIZE) {
      const batch = subscribers.docs.slice(i, i + BATCH_SIZE)

      await Promise.allSettled(
        batch.map(async (subscriber: any) => {
          try {
            const token = generateUnsubscribeToken(subscriber.email)
            const unsubUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}&token=${token}`
            const html = newsletter.htmlEmailContent.replace('{{unsubscribe_url}}', unsubUrl)

            const result = await emailProvider.sendEmail({
              to: subscriber.email,
              subject: newsletter.emailSubject,
              html,
              text: newsletter.plainTextContent || '',
              tags: ['aceone-brief', 'newsletter'],
            })

            if (result.success) {
              sentCount++
              await payload.update({
                collection: 'newsletter-subscribers',
                id: subscriber.id,
                data: { lastEmailSentAt: new Date().toISOString() },
              })
            } else {
              failedCount++
            }
          } catch {
            failedCount++
          }
        }),
      )

      // Rate limit between batches
      if (i + BATCH_SIZE < subscribers.docs.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    // Mark newsletter as sent
    await payload.update({
      collection: 'aceone-briefs',
      id: newsletter.id,
      data: {
        status: 'sent',
        sentAt: new Date().toISOString(),
        recipientCount: sentCount,
      },
    })

    return NextResponse.json({
      success: true,
      newsletter_id: newsletter.id,
      sent: sentCount,
      failed: failedCount,
      total: subscribers.docs.length,
    })
  } catch (err) {
    console.error('Cron send error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
