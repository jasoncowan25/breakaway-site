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

    // Format travellers for Zapier - create a readable summary
    const travellersSummary = travellers.map((t: Traveller, i: number) => {
      const pickleball = t.willPlayPickleball ? "Yes" : "No"
      return `Traveller ${i + 1}: ${t.fullName || "N/A"} | DOB: ${t.dob || "N/A"} | Email: ${t.email || "N/A"} | Phone: ${t.phone || "N/A"} | Pickleball: ${pickleball}`
    }).join("\n")

    const pickleballParticipants = travellers
      .filter((t: Traveller) => t.willPlayPickleball && t.fullName)
      .map((t: Traveller) => t.fullName)
      .join(", ")

    // Send to Zapier webhook
    const webhook = "https://hooks.zapier.com/hooks/catch/22788039/uvqtfp4/"
    const payload = {
      room_preference: roomPreference,
      num_travellers: numTravellers,
      // Primary traveller details for easy access
      primary_name: primaryTraveller.fullName,
      primary_email: primaryTraveller.email,
      primary_phone: primaryTraveller.phone,
      primary_dob: primaryTraveller.dob,
      // All travellers summary
      travellers_details: travellersSummary,
      pickleball_participants: pickleballParticipants,
      comments,
    }
    
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
