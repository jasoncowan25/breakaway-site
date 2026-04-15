import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Map payment link URLs to max spots
const CAMP_CONFIG: Record<string, number> = {
  "https://book.stripe.com/28E00j2Vmbz18qy5q2f3a0p": 4, // July 10-12 - Fundamentals AM
  "https://book.stripe.com/dRm8wPeE46eHeOW05If3a0q": 4, // July 10-12 - Intermediate PM
  "https://book.stripe.com/dRmfZhanOcD5bCK8Cef3a0r": 4, // July 13-15 - Fundamentals AM
  "https://book.stripe.com/9B600j7bC5aD22a3hUf3a0s": 4, // July 13-15 - Intermediate PM
  "https://book.stripe.com/3cI5kDanOfPhgX4g4Gf3a0t": 4, // July 17-19 - Fundamentals AM
  "https://book.stripe.com/6oU3cvgMc32v6iqf0Cf3a0u": 4, // July 17-19 - Intermediate PM
}

export async function GET() {
  try {
    const availability: Record<string, { spotsRemaining: number; maxSpots: number }> = {}
    
    // Initialize all camps with max spots
    for (const [url, maxSpots] of Object.entries(CAMP_CONFIG)) {
      availability[url] = { spotsRemaining: maxSpots, maxSpots }
    }

    // Fetch all completed checkout sessions
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      status: "complete",
      created: {
        gte: Math.floor(Date.now() / 1000) - 180 * 24 * 60 * 60, // Last 180 days
      },
    })

    // Count bookings per payment link URL
    for (const session of sessions.data) {
      // Check if this session came from one of our payment links
      // The payment_link field contains the ID, but we need to match by URL
      if (session.payment_link) {
        // Fetch the payment link to get its URL
        const linkId = typeof session.payment_link === "string" 
          ? session.payment_link 
          : session.payment_link.id
        
        try {
          const paymentLink = await stripe.paymentLinks.retrieve(linkId)
          if (paymentLink.url && availability[paymentLink.url]) {
            availability[paymentLink.url].spotsRemaining = Math.max(
              0,
              availability[paymentLink.url].spotsRemaining - 1
            )
          }
        } catch {
          // Payment link may have been deleted or is inaccessible
          continue
        }
      }
    }

    return NextResponse.json({ 
      availability,
      lastUpdated: new Date().toISOString(),
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
