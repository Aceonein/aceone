import { Resend } from 'resend'

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text: string
  tags?: string[]
  metadata?: Record<string, string>
}

interface SendEmailResult {
  success: boolean
  id?: string
  error?: string
}

export class ResendAdapter {
  private client: Resend
  private from: string

  constructor(apiKey: string, from: string) {
    this.client = new Resend(apiKey)
    this.from = from
  }

  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    try {
      const { data, error } = await this.client.emails.send({
        from: this.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        tags: options.tags?.map((name) => ({ name, value: 'true' })),
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, id: data?.id }
    } catch (err: any) {
      return { success: false, error: err.message || 'Unknown error' }
    }
  }
}
