import type { NextRequest } from "next/server"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

interface Traveller {
  fullName: string
  dob: string
  email: string
  phone: string
  willPlayPickleball: boolean
}

export async function POST(req: NextRequest) {
  try {
    const { 
      roomPreference,
      numTravellers,
      travellers,
      comments 
    } = await req.json() as {
      roomPreference: string
      numTravellers: number
      travellers: Traveller[]
      comments: string
    }
    
    // Validate primary traveller
    const primaryTraveller = travellers?.[0]
    if (!primaryTraveller?.fullName || !primaryTraveller?.email || !EMAIL_RE.test(primaryTraveller.email)) {
      return new Response(JSON.stringify({ ok: false, error: "Primary traveller name and valid email are required" }), { status: 400 })
    }

    const pickleballParticipants = travellers
      .filter((t: Traveller) => t.willPlayPickleball && t.fullName)
      .map((t: Traveller) => t.fullName)
      .join(", ")

    // Build payload with individual traveller fields for Zapier
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: Record<string, any> = {
      room_preference: roomPreference,
      num_travellers: numTravellers,
      pickleball_participants: pickleballParticipants,
      comments,
    }

    // Add each traveller's fields individually (up to 10 travellers)
    travellers.forEach((t: Traveller, i: number) => {
      const num = i + 1
      payload[`traveller_${num}_name`] = t.fullName || ""
      payload[`traveller_${num}_dob`] = t.dob || ""
      payload[`traveller_${num}_email`] = t.email || ""
      payload[`traveller_${num}_phone`] = t.phone || ""
      payload[`traveller_${num}_pickleball`] = t.willPlayPickleball ? "Yes" : "No"
    })

    // Send to Zapier webhook
    const webhook = "https://hooks.zapier.com/hooks/catch/22788039/uvqtfp4/"
    
    const z = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
