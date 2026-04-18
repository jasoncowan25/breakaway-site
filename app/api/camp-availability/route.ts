import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Map payment link URLs to max spots
const CAMP_CONFIG: Record<string, number> = {
  "https://book.stripe.com/28E00j2Vmbz18qy5q2f3a0p": 4, // July 10-12 - Fundamentals AM
  "https://book.stripe.com/dRm8wPeE46eHeOW05If3a0q": 4, // July 10-12 - Intermediate PM
  "https://book.stripe.com/dRmfZhanOcD5bCK8Cef3a0r": 4, // July 13-15 - Intermediate AM
  "https://book.stripe.com/9B600j7bC5aD22a3hUf3a0s": 4, // July 13-15 - Intermediate PM
  "https://book.stripe.com/3cI5kDanOfPhgX4g4Gf3a0t": 4, // July 17-19 - Fundamentals AM
  "https://book.stripe.com/6oU3cvgMc32v6iqf0Cf3a0u": 4, // July 17-19 - Intermediate PM
}

// Map Stripe product IDs to payment link URLs
// Used for count_as_camp metadata to reassign payments
// To transfer a payment: add metadata count_as_camp: "prod_XXX" to the checkout session in Stripe
const PRODUCT_TO_LINK: Record<string, string> = {
  "prod_UKtnS4kMQQx6HI": "https://book.stripe.com/28E00j2Vmbz18qy5q2f3a0p", // July 10-12 - Morning (Fundamentals)
  "prod_UKtnU177PNSIMw": "https://book.stripe.com/dRm8wPeE46eHeOW05If3a0q", // July 10-12 - Afternoon (Intermediate)
  "prod_UKtn2FDQkfBiaN": "https://book.stripe.com/dRmfZhanOcD5bCK8Cef3a0r", // July 13-15 - Morning (Intermediate)
  "prod_UKtnLns2d1cyI1": "https://book.stripe.com/9B600j7bC5aD22a3hUf3a0s", // July 13-15 - Afternoon (Intermediate)
  "prod_UKtnFKj6lyQxoB": "https://book.stripe.com/3cI5kDanOfPhgX4g4Gf3a0t", // July 17-19 - Morning (Fundamentals)
  "prod_UKtnZ7rPql9dQD": "https://book.stripe.com/6oU3cvgMc32v6iqf0Cf3a0u", // July 17-19 - Afternoon (Intermediate)
}



export async function GET() {
  try {
    const availability: Record<string, { spotsRemaining: number; maxSpots: number }> = {}
    
    // Initialize all camps with max spots
    for (const [url, maxSpots] of Object.entries(CAMP_CONFIG)) {
      availability[url] = { spotsRemaining: maxSpots, maxSpots }
    }

    // Fetch all completed checkout sessions with payment_intent expanded
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      status: "complete",
      expand: ["data.payment_intent", "data.payment_intent.latest_charge"],
      created: {
        gte: Math.floor(Date.now() / 1000) - 180 * 24 * 60 * 60, // Last 180 days
      },
    })

    // Cache payment link URLs to avoid repeated API calls
    const paymentLinkCache: Record<string, string | null> = {}

    // Debug: track sessions with metadata
    const debugInfo: Array<{ sessionId: string; metadata: Record<string, string> | null; paymentIntentMetadata: Record<string, string> | null }> = []

    // Count bookings per payment link URL
    for (const session of sessions.data) {
      if (!session.payment_link) continue

      // Check if the payment was refunded using expanded payment intent
      let paymentIntentMetadata: Record<string, string> | null = null
      if (session.payment_intent && typeof session.payment_intent !== "string") {
        const paymentIntent = session.payment_intent
        paymentIntentMetadata = paymentIntent.metadata as Record<string, string> | null
        
        // Check latest_charge for refund status
        const latestCharge = paymentIntent.latest_charge
        if (latestCharge && typeof latestCharge !== "string") {
          if (latestCharge.refunded || latestCharge.amount_refunded > 0) {
            continue // Skip refunded payments
          }
        }
        
        // Also check payment intent status
        if (paymentIntent.status === "canceled" || paymentIntent.amount_received === 0) {
          continue
        }
      }

      // Log metadata for debugging - check BOTH session and payment intent metadata
      const hasSessionMetadata = session.metadata && Object.keys(session.metadata).length > 0
      const hasPaymentIntentMetadata = paymentIntentMetadata && Object.keys(paymentIntentMetadata).length > 0
      if (hasSessionMetadata || hasPaymentIntentMetadata) {
        debugInfo.push({
          sessionId: session.id,
          metadata: session.metadata as Record<string, string>,
          paymentIntentMetadata,
        })
      }

      // Check for count_as_camp metadata to reassign this payment to a different camp
      // Check both session metadata and payment intent metadata
      const countAsCamp = session.metadata?.count_as_camp || paymentIntentMetadata?.count_as_camp
      if (countAsCamp && PRODUCT_TO_LINK[countAsCamp]) {
        const reassignedLinkUrl = PRODUCT_TO_LINK[countAsCamp]
        if (availability[reassignedLinkUrl]) {
          availability[reassignedLinkUrl].spotsRemaining = Math.max(
            0,
            availability[reassignedLinkUrl].spotsRemaining - 1
          )
        }
        continue // Skip normal counting for this payment
      }

      // Get payment link URL (use cache to avoid repeated API calls)
      const linkId = typeof session.payment_link === "string" 
        ? session.payment_link 
        : session.payment_link.id
      
      if (!(linkId in paymentLinkCache)) {
        try {
          const paymentLink = await stripe.paymentLinks.retrieve(linkId)
          paymentLinkCache[linkId] = paymentLink.url
        } catch {
          paymentLinkCache[linkId] = null
        }
      }

      const linkUrl = paymentLinkCache[linkId]
      if (linkUrl && availability[linkUrl]) {
        availability[linkUrl].spotsRemaining = Math.max(
          0,
          availability[linkUrl].spotsRemaining - 1
        )
      }
    }

    return NextResponse.json({ 
      availability,
      lastUpdated: new Date().toISOString(),
      debug: {
        totalSessions: sessions.data.length,
        sessionsWithMetadata: debugInfo,
      },
    })
  } catch (error) {
    console.error("Error fetching camp availability:", error)
    // Return default availability on error
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
