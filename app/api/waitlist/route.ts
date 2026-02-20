import type { NextRequest } from "next/server"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || !EMAIL_RE.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid email" }), { status: 400 })
    }

    const webhook = process.env.ZAPIER_WEBHOOK_URL
    if (!webhook) {
      return new Response(JSON.stringify({ ok: false, error: "Server not configured" }), { status: 500 })
    }

    const payload = {
      email,
      source: process.env.NEXT_PUBLIC_SITE_URL || "unknown",
      ts: new Date().toISOString(),
    }

    const z = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!z.ok) {
      return new Response(JSON.stringify({ ok: false, error: "Upstream error" }), { status: 502 })
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Unexpected error" }), { status: 500 })
  }
}

export async function GET() {
  return new Response("Method Not Allowed", { status: 405 })
}
