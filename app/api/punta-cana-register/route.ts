import type { NextRequest } from "next/server"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

export async function POST(req: NextRequest) {
  try {
    const { 
      fullName, 
      dob, 
      roomPreference, 
      phone, 
      email, 
      otherGuests, 
      comments 
    } = await req.json()
    
    console.log("[v0] Punta Cana registration received:", { fullName, dob, roomPreference, phone, email, otherGuests, comments })
    
    if (!fullName || !email || !EMAIL_RE.test(email)) {
      console.log("[v0] Validation failed - missing name or invalid email")
      return new Response(JSON.stringify({ ok: false, error: "Name and valid email are required" }), { status: 400 })
    }

    // Send to Zapier webhook - this will email to breakawaypickleball@gmail.com
    const webhook = "https://hooks.zapier.com/hooks/catch/22788039/ugfdooi/"
    const payload = {
      formType: "Punta Cana Registration",
      fullName,
      dob,
      roomPreference,
      phone,
      email,
      otherGuests,
      comments,
      timestamp: new Date().toISOString(),
      source: "breakawaypickleball.ca - Punta Cana Trip",
    }
    
    console.log("[v0] Sending to Zapier:", payload)
    
    const z = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    
    console.log("[v0] Zapier response status:", z.status)
    
    if (!z.ok) {
      console.log("[v0] Zapier returned error")
      return new Response(JSON.stringify({ ok: false, error: "Upstream error" }), { status: 502 })
    }
    console.log("[v0] Punta Cana registration successful")
    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Unexpected error" }), { status: 500 })
  }
}

export async function GET() {
  return new Response("Method Not Allowed", { status: 405 })
}
