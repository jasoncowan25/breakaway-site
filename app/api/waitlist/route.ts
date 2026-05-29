import type { NextRequest } from "next/server"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

// Where the waitlist submission lands: the Breakaway admin webhook, which
// creates/updates the contact in Supabase (email, name, postal code, skill
// tags). Configured per-environment:
//   - local dev:  http://localhost:3007/api/webhooks/waitlist
//   - production: https://admin.breakawaypickleball.ca/api/webhooks/waitlist
// Set ADMIN_WAITLIST_WEBHOOK_URL + WAITLIST_WEBHOOK_SECRET in the site env.
const ADMIN_WEBHOOK_URL =
  process.env.ADMIN_WAITLIST_WEBHOOK_URL ??
  "http://localhost:3007/api/webhooks/waitlist"

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

    const secret = process.env.WAITLIST_WEBHOOK_SECRET
    if (!secret) {
      console.error("WAITLIST_WEBHOOK_SECRET is not set — cannot forward waitlist submission")
      return new Response(JSON.stringify({ ok: false, error: "Server not configured" }), { status: 500 })
    }

    // Normalize skillLevels to an array of ids regardless of how the client
    // sent it (array, or legacy comma-separated string).
    const skills: string[] = Array.isArray(skillLevels)
      ? skillLevels
      : String(skillLevels)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)

    const payload = {
      email,
      first_name: firstName || null,
      last_name: lastName || null,
      postal_code: postalCode || null,
      skill_levels: skills,
      timestamp: timestamp || new Date().toISOString(),
    }

    const res = await fetch(ADMIN_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => "")
      console.error("Admin waitlist webhook rejected submission:", res.status, detail)
      return new Response(JSON.stringify({ ok: false, error: "Upstream error" }), { status: 502 })
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (err) {
    console.error("Waitlist submission failed:", err)
    return new Response(JSON.stringify({ ok: false, error: "Unexpected error" }), { status: 500 })
  }
}

export async function GET() {
  return new Response("Method Not Allowed", { status: 405 })
}
