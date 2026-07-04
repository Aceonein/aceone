import { Resend } from 'resend'

const FROM = 'Aceone <hello@aceone.in>'

export async function sendEmail(options: {
  to: string
  subject: string
  html: string
  text: string
  tags?: string[]
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY env var not set')

  const client = new Resend(apiKey)
  try {
    const { data, error } = await client.emails.send({
      from: FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      tags: options.tags?.map((name) => ({ name, value: 'true' })),
    })
    if (error) return { success: false, error: error.message }
    return { success: true, id: data?.id }
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown error' }
  }
}
