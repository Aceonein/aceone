import { createHmac, timingSafeEqual } from 'crypto'

const SECRET = process.env.PAYLOAD_SECRET || 'fallback-secret'

export function generateUnsubscribeToken(email: string): string {
  return createHmac('sha256', SECRET).update(email.toLowerCase()).digest('hex')
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = generateUnsubscribeToken(email)
  if (expected.length !== token.length) return false
  return timingSafeEqual(Buffer.from(expected), Buffer.from(token))
}
