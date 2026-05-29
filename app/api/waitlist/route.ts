import type { NextRequest } from "next/server"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

// System of record: the Breakaway admin webhook creates/updates the contact in
// Supabase (email, name, postal code, skill tags). Configured per-environment:
//   - local dev:  http://localhost:3007/api/webhooks/waitlist
//   - production: https://admin.breakawaypickleball.ca/api/webhooks/waitlist
// Needs ADMIN_WAITLIST_WEBHOOK_URL + WAITLIST_WEBHOOK_SECRET in the site env.
const ADMIN_WEBHOOK_URL =
  process.env.ADMIN_WAITLIST_WEBHOOK_URL ??
  "http://localhost:3007/api/webhooks/waitlist"

// Side channel: the Zapier hook that sends the "new waitlist signup" email.
// Kept alongside the admin webhook so we still get the email. Hardcoded default
// (same as before) so the email keeps working with no new env var; overridable.
const ZAPIER_WEBHOOK_URL =
  process.env.ZAPIER_WAITLIST_WEBHOOK_URL ??
  "https://hooks.zapier.com/hooks/catch/22788039/ugfdooi/"

export async function POST(req: NextRequest) {
  try {
    const {
      firstName = "",
      lastName = "",
      email,
      postalCode = "",
      skillLevels = [],
      timestamp,
    } = await req.json()

    if (!email || !EMAIL_RE.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid email" }), { status: 400 })
    }

    // Normalize skillLevels to an array regardless of how the client sent it
    // (array, or legacy comma-separated string).
    const skills: string[] = Array.isArray(skillLevels)
      ? skillLevels
      : String(skillLevels)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
    const ts = timestamp || new Date().toISOString()

    // 1) Admin webhook — creates the contact. This is the success criterion.
    const adminCall = (async (): Promise<{ ok: boolean }> => {
      const secret = process.env.WAITLIST_WEBHOOK_SECRET
      if (!secret) {
        console.error("WAITLIST_WEBHOOK_SECRET is not set — cannot create contact")
        return { ok: false }
      }
      const res = await fetch(ADMIN_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
        body: JSON.stringify({
          email,
          first_name: firstName || null,
          last_name: lastName || null,
          postal_code: postalCode || null,
          skill_levels: skills,
          timestamp: ts,
        }),
      })
      if (!res.ok) {
        console.error("Admin waitlist webhook rejected:", res.status, await res.text().catch(() => ""))
        return { ok: false }
      }
      return { ok: true }
    })()

    // 2) Zapier — sends the notification email. Best-effort: a failure here must
    // NOT fail the submission (we don't lose the signup over a missed email).
    const zapierCall = (async (): Promise<{ ok: boolean }> => {
      try {
        const res = await fetch(ZAPIER_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            postalCode,
            skillLevels: skills.join(", "),
            timestamp: ts,
            source: "breakawaypickleball.ca",
          }),
        })
        if (!res.ok) {
          console.error("Zapier waitlist hook rejected:", res.status)
          return { ok: false }
        }
        return { ok: true }
      } catch (err) {
        console.error("Zapier waitlist hook failed:", err)
        return { ok: false }
      }
    })()

    const [admin, zapier] = await Promise.all([adminCall, zapierCall])

    // Success = the contact was recorded. Zapier is best-effort; report whether
    // the email was queued so failures are observable without blocking the user.
    if (!admin.ok) {
      return new Response(JSON.stringify({ ok: false, error: "Upstream error" }), { status: 502 })
    }
    return new Response(JSON.stringify({ ok: true, emailQueued: zapier.ok }), { status: 200 })
  } catch (err) {
    console.error("Waitlist submission failed:", err)
    return new Response(JSON.stringify({ ok: false, error: "Unexpected error" }), { status: 500 })
  }
}

export async function GET() {
  return new Response("Method Not Allowed", { status: 405 })
}
