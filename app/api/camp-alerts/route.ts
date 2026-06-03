import type { NextRequest } from "next/server"

// Same-origin proxy for the /camp-alerts form. Forwards the submission to the
// Breakaway API's public intake endpoint server-side, attaching the shared
// intake secret. Keeps the secret off the client and avoids cross-origin CORS.

const API_BASE = (
  process.env.NEXT_PUBLIC_BREAKAWAY_API_URL ??
  process.env.BREAKAWAY_API_URL ??
  "https://api.breakawaypickleball.ca"
).replace(/\/$/, "")

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 })
  }

  const email = typeof body.email === "string" ? body.email : ""
  const firstName = typeof body.firstName === "string" ? body.firstName : ""
  const skillLevels = Array.isArray(body.skillLevels) ? body.skillLevels : []

  if (!firstName.trim()) {
    return Response.json({ ok: false, error: "First name is required" }, { status: 400 })
  }
  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ ok: false, error: "Invalid email" }, { status: 400 })
  }
  if (skillLevels.length === 0) {
    return Response.json({ ok: false, error: "Select at least one skill level" }, { status: 400 })
  }

  const secret = process.env.CAMP_ALERTS_INTAKE_SECRET
  if (!secret) {
    console.error("[camp-alerts proxy] CAMP_ALERTS_INTAKE_SECRET is not set")
    return Response.json({ ok: false, error: "Intake not configured" }, { status: 500 })
  }

  try {
    const upstream = await fetch(`${API_BASE}/api/v1/public/camp-alerts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify(body),
    })

    if (!upstream.ok) {
      const detail = await upstream.json().catch(() => ({}))
      console.error("[camp-alerts proxy] upstream error", upstream.status, detail)
      return Response.json({ ok: false, error: "Upstream error" }, { status: 502 })
    }

    return Response.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error("[camp-alerts proxy] fetch failed:", err)
    return Response.json({ ok: false, error: "Unexpected error" }, { status: 500 })
  }
}

export function GET() {
  return new Response("Method Not Allowed", { status: 405 })
}
