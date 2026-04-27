import { NextResponse } from "next/server"

// Camp availability API - uses fetch to call Stripe REST API directly (no SDK needed)

// Force these camps to show as sold out (override Stripe data)
const SOLD_OUT_OVERRIDE: string[] = [
  "https://book.stripe.com/7sY6oHfI89qTgX405If3a0w", // Aug 4-6, 1-4 PM
]

// Map payment link URLs to max spots
const CAMP_CONFIG: Record<string, number> = {
  "https://book.stripe.com/28E00j2Vmbz18qy5q2f3a0p": 4,
  "https://book.stripe.com/dRm8wPeE46eHeOW05If3a0q": 4,
  "https://book.stripe.com/dRmfZhanOcD5bCK8Cef3a0r": 4,
  "https://book.stripe.com/9B600j7bC5aD22a3hUf3a0s": 4,
  "https://book.stripe.com/3cI5kDanOfPhgX4g4Gf3a0t": 4,
  "https://book.stripe.com/6oU3cvgMc32v6iqf0Cf3a0u": 4,
  "https://book.stripe.com/bJe00j1Ri6eH4ai4lYf3a0v": 4,
  "https://book.stripe.com/7sY6oHfI89qTgX405If3a0w": 4,
}

// Map Stripe product IDs to payment link URLs
const PRODUCT_TO_LINK: Record<string, string> = {
  "prod_UKtnS4kMQQx6HI": "https://book.stripe.com/28E00j2Vmbz18qy5q2f3a0p",
  "prod_UKtnU177PNSIMw": "https://book.stripe.com/dRm8wPeE46eHeOW05If3a0q",
  "prod_UKtn2FDQkfBiaN": "https://book.stripe.com/dRmfZhanOcD5bCK8Cef3a0r",
  "prod_UKtnLns2d1cyI1": "https://book.stripe.com/9B600j7bC5aD22a3hUf3a0s",
  "prod_UKtnFKj6lyQxoB": "https://book.stripe.com/3cI5kDanOfPhgX4g4Gf3a0t",
  "prod_UKtnZ7rPql9dQD": "https://book.stripe.com/6oU3cvgMc32v6iqf0Cf3a0u",
  "prod_UPSnqoO9ZvbmL7": "https://book.stripe.com/bJe00j1Ri6eH4ai4lYf3a0v",
  "prod_UPSozOLgmQVt5H": "https://book.stripe.com/7sY6oHfI89qTgX405If3a0w",
}

async function stripeGet(endpoint: string, params?: Record<string, string>) {
  const url = new URL(`https://api.stripe.com/v1${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value))
  }
  const response = await fetch(url.toString(), {
    headers: {
      "Authorization": `Bearer ${process.env.STRIPE_SECRET_KEY}`,
    },
  })
  if (!response.ok) throw new Error(`Stripe API error: ${response.status}`)
  return response.json()
}

interface Session {
  id: string
  payment_link: string | null
  metadata: Record<string, string> | null
  payment_intent: string | null
}

interface PaymentIntent {
  status: string
  amount_received: number
  metadata: Record<string, string> | null
  latest_charge: string | null
}

interface Charge {
  refunded: boolean
  amount_refunded: number
}

interface PaymentLink {
  url: string
}

export async function GET() {
  try {
    const availability: Record<string, { spotsRemaining: number; maxSpots: number }> = {}
    for (const [url, maxSpots] of Object.entries(CAMP_CONFIG)) {
      availability[url] = { spotsRemaining: maxSpots, maxSpots }
    }

    const createdGte = Math.floor(Date.now() / 1000) - 180 * 24 * 60 * 60
    const sessionsResponse = await stripeGet("/checkout/sessions", {
      limit: "100",
      status: "complete",
      "created[gte]": createdGte.toString(),
    })
    const sessions: Session[] = sessionsResponse.data
    const paymentLinkCache: Record<string, string | null> = {}
    const debugInfo: Array<{ sessionId: string; metadata: Record<string, string> | null; paymentIntentMetadata: Record<string, string> | null }> = []

    for (const session of sessions) {
      if (!session.payment_link) continue

      let paymentIntentMetadata: Record<string, string> | null = null
      if (session.payment_intent) {
        try {
          const pi: PaymentIntent = await stripeGet(`/payment_intents/${session.payment_intent}`)
          paymentIntentMetadata = pi.metadata
          if (pi.latest_charge) {
            const charge: Charge = await stripeGet(`/charges/${pi.latest_charge}`)
            if (charge.refunded || charge.amount_refunded > 0) continue
          }
          if (pi.status === "canceled" || pi.amount_received === 0) continue
        } catch { /* continue */ }
      }

      const hasSessionMetadata = session.metadata && Object.keys(session.metadata).length > 0
      const hasPaymentIntentMetadata = paymentIntentMetadata && Object.keys(paymentIntentMetadata).length > 0
      if (hasSessionMetadata || hasPaymentIntentMetadata) {
        debugInfo.push({ sessionId: session.id, metadata: session.metadata, paymentIntentMetadata })
      }

      const countAsCamp = session.metadata?.count_as_camp || paymentIntentMetadata?.count_as_camp
      if (countAsCamp && PRODUCT_TO_LINK[countAsCamp]) {
        const reassignedLinkUrl = PRODUCT_TO_LINK[countAsCamp]
        if (availability[reassignedLinkUrl]) {
          availability[reassignedLinkUrl].spotsRemaining = Math.max(0, availability[reassignedLinkUrl].spotsRemaining - 1)
        }
        continue
      }

      const linkId = session.payment_link
      if (!(linkId in paymentLinkCache)) {
        try {
          const pl: PaymentLink = await stripeGet(`/payment_links/${linkId}`)
          paymentLinkCache[linkId] = pl.url
        } catch {
          paymentLinkCache[linkId] = null
        }
      }

      const linkUrl = paymentLinkCache[linkId]
      if (linkUrl && availability[linkUrl]) {
        availability[linkUrl].spotsRemaining = Math.max(0, availability[linkUrl].spotsRemaining - 1)
      }
    }

    // Apply sold out overrides
    for (const url of SOLD_OUT_OVERRIDE) {
      if (availability[url]) {
        availability[url].spotsRemaining = 0
      }
    }

    return NextResponse.json({
      availability,
      lastUpdated: new Date().toISOString(),
      debug: { totalSessions: sessions.length, sessionsWithMetadata: debugInfo },
    })
  } catch (error) {
    console.error("Error fetching camp availability:", error)
    const defaultAvailability: Record<string, { spotsRemaining: number; maxSpots: number }> = {}
    for (const [url, maxSpots] of Object.entries(CAMP_CONFIG)) {
      defaultAvailability[url] = { spotsRemaining: maxSpots, maxSpots }
    }
    return NextResponse.json({
      availability: defaultAvailability,
      lastUpdated: new Date().toISOString(),
      error: "Using default availability",
    })
  }
}
