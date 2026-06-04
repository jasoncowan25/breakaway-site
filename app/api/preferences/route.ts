import type { NextRequest } from "next/server"

// Same-origin proxy for the /preferences page. Forwards load (GET) and save
// (POST) to the Breakaway API's public preferences endpoint server-side,
// attaching the shared intake secret. The signed token in the request is the
// per-recipient capability; the secret keeps the endpoint off the open web.

const API_BASE = (
  process.env.NEXT_PUBLIC_BREAKAWAY_API_URL ??
  process.env.BREAKAWAY_API_URL ??
  "https://api.breakawaypickleball.ca"
).replace(/\/$/, "")

function secretOrError() {
  const secret = process.env.CAMP_ALERTS_INTAKE_SECRET
  if (!secret) {
    console.error("[preferences proxy] CAMP_ALERTS_INTAKE_SECRET is not set")
    return null
  }
  return secret
}

export async function GET(req: NextRequest) {
  const secret = secretOrError()
  if (!secret) return Response.json({ ok: false, error: "Not configured" }, { status: 500 })

  const token = new URL(req.url).searchParams.get("token") ?? ""
  if (!token) return Response.json({ ok: false, error: "Missing token" }, { status: 400 })

  try {
    const upstream = await fetch(
      `${API_BASE}/api/v1/public/preferences?token=${encodeURIComponent(token)}`,
      { headers: { authorization: `Bearer ${secret}` }, cache: "no-store" },
    )
    const json = await upstream.json().catch(() => ({}))
    if (!upstream.ok || json?.error) {
      return Response.json({ ok: false, error: json?.error?.message ?? "Upstream error" }, { status: 502 })
    }
    return Response.json({ ok: true, data: json.data }, { status: 200 })
  } catch (err) {
    console.error("[preferences proxy] GET failed:", err)
    return Response.json({ ok: false, error: "Unexpected error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const secret = secretOrError()
  if (!secret) return Response.json({ ok: false, error: "Not configured" }, { status: 500 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 })
  }
  if (typeof body.token !== "string" || !body.token) {
    return Response.json({ ok: false, error: "Missing token" }, { status: 400 })
  }

  try {
    const upstream = await fetch(`${API_BASE}/api/v1/public/preferences`, {
      method: "POST",
      headers: { "Content-Type": "application/json", authorization: `Bearer ${secret}` },
      body: JSON.stringify(body),
    })
    const json = await upstream.json().catch(() => ({}))
    if (!upstream.ok || json?.error) {
      return Response.json({ ok: false, error: json?.error?.message ?? "Upstream error" }, { status: 502 })
    }
    return Response.json({ ok: true, data: json.data }, { status: 200 })
  } catch (err) {
    console.error("[preferences proxy] POST failed:", err)
    return Response.json({ ok: false, error: "Unexpected error" }, { status: 500 })
  }
}
