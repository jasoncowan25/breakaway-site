import { Resend } from "resend"

let client: Resend | null = null

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  if (!client) client = new Resend(key)
  return client
}

export const FROM_ADDRESS =
  process.env.RESEND_FROM ?? "Breakaway Pickleball <hello@breakawaypickleball.ca>"
export const REPLY_TO = process.env.RESEND_REPLY_TO ?? "hello@breakawaypickleball.ca"
