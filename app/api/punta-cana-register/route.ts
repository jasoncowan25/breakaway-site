import type { NextRequest } from "next/server"
import { sendCampInterestConfirmation } from "@/lib/email/camp-interest-confirmation"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

export async function POST(req: NextRequest) {
  try {
    const {
      fullName,
      roomPreference,
      dob,
      email,
      phone,
      numTravellers,
      pickleballParticipants,
      comments
    } = await req.json()

    if (!fullName || !email || !EMAIL_RE.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: "Name and valid email are required" }), { status: 400 })
    }

    // Send to Zapier webhook
    const webhook = "https://hooks.zapier.com/hooks/catch/22788039/uvqtfp4/"
    const payload = {
      full_name: fullName,
      room_preference: roomPreference,
      date_of_birth: dob,
      email,
      phone,
      num_travellers: numTravellers,
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

    const confirmation = await sendCampInterestConfirmation({
      to: email,
      firstName: fullName,
      campName: "Punta Cana Pickleball Camp",
    })
    if (!confirmation.ok) {
      console.error("[punta-cana-register] confirmation email failed:", confirmation.error)
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Unexpected error" }), { status: 500 })
  }
}

export async function GET() {
  return new Response("Method Not Allowed", { status: 405 })
}
