import { ResendAdapter } from './resend'

export interface EmailProvider {
  sendEmail(options: {
    to: string
    subject: string
    html: string
    text: string
    tags?: string[]
    metadata?: Record<string, string>
  }): Promise<{ success: boolean; id?: string; error?: string }>
}

export function getEmailProvider(): EmailProvider {
  const provider = process.env.EMAIL_PROVIDER || 'resend'

  if (provider === 'resend') {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) throw new Error('RESEND_API_KEY env var not set')
    return new ResendAdapter(apiKey, 'Aceone <hello@aceone.in>')
  }

  throw new Error(`Unsupported email provider: ${provider}`)
}
