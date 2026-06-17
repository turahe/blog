import { createHmac, randomBytes } from 'crypto'
import { generateSecret, generateURI } from 'otplib'

const APP_NAME = 'Wach Blog'

export function createMfaSecret(): string {
  return generateSecret()
}

export function buildOtpAuthUrl(email: string, secret: string): string {
  return generateURI({
    issuer: APP_NAME,
    label: email,
    secret,
  })
}

export function generateRecoveryCodes(count = 8): string[] {
  return Array.from(
    { length: count },
    () =>
      randomBytes(5)
        .toString('hex')
        .toUpperCase()
        .match(/.{1,4}/g)
        ?.join('-') ?? randomBytes(5).toString('hex')
  )
}

export function hashRecoveryCode(code: string): string {
  const key = process.env.MFA_RECOVERY_KEY ?? process.env.SESSION_SECRET ?? 'dev-mfa-key'
  return createHmac('sha256', key).update(code.replace(/-/g, '').toUpperCase()).digest('hex')
}

export function hashRecoveryCodes(codes: string[]): string[] {
  return codes.map(hashRecoveryCode)
}
