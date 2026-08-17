import type { NextRequest } from "next/server"

// Same-origin proxy for the /pickleball-lessons request form. Forwards the
// submission to the Breakaway API's public intake endpoint server-side,
// attaching the shared intake secret. Keeps the secret off the client and
// avoids cross-origin CORS — same shape as the /camp-alerts proxy.

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

  const firstName = typeof body.firstName === "string" ? body.firstName : ""
  const lastName = typeof body.lastName === "string" ? body.lastName : ""
  const email = typeof body.email === "string" ? body.email : ""
  const slots = Array.isArray(body.slots) ? body.slots : []

  if (!firstName.trim() || !lastName.trim()) {
    return Response.json({ ok: false, error: "Name is required" }, { status: 400 })
  }
  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ ok: false, error: "Invalid email" }, { status: 400 })
  }
  if (slots.length === 0) {
    return Response.json({ ok: false, error: "Choose at least one requested date and time" }, { status: 400 })
  }

  const secret =
    process.env.LESSON_REQUESTS_INTAKE_SECRET ?? process.env.CAMP_ALERTS_INTAKE_SECRET
  if (!secret) {
    console.error(
      "[lesson-requests proxy] LESSON_REQUESTS_INTAKE_SECRET / CAMP_ALERTS_INTAKE_SECRET is not set",
    )
    return Response.json({ ok: false, error: "Intake not configured" }, { status: 500 })
  }

  try {
    const upstream = await fetch(`${API_BASE}/api/v1/public/lesson-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify(body),
    })

    if (!upstream.ok) {
      const detail = await upstream.json().catch(() => ({}))
      console.error("[lesson-requests proxy] upstream error", upstream.status, detail)
      return Response.json({ ok: false, error: "Upstream error" }, { status: 502 })
    }

    const data = (await upstream.json().catch(() => null)) as {
      data?: { request_code?: string }
    } | null
    return Response.json(
      { ok: true, request_code: data?.data?.request_code ?? null },
      { status: 200 },
    )
  } catch (err) {
    console.error("[lesson-requests proxy] request failed", err)
    return Response.json({ ok: false, error: "Upstream unreachable" }, { status: 502 })
  }
}
