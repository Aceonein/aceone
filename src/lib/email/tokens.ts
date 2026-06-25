import { createHmac } from 'crypto'

const SECRET = process.env.PAYLOAD_SECRET || 'fallback-secret'

export function generateUnsubscribeToken(email: string): string {
  return createHmac('sha256', SECRET).update(email.toLowerCase()).digest('hex')
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = generateUnsubscribeToken(email)
  // Constant-time comparison
  if (expected.length !== token.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ token.charCodeAt(i)
  }
  return diff === 0
}
