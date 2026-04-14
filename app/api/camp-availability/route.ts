import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Map payment link URLs to max spots
const CAMP_CONFIG: Record<string, number> = {
  "https://book.stripe.com/8x228r8fGdH98qybOqf3a0j": 4, // Week 1 - Fundamentals AM
  "https://book.stripe.com/4gM5kD3ZqcD59uC9Gif3a0k": 4, // Week 1 - Intermediate PM
  "https://book.stripe.com/6oUaEX2Vm0Un22abOqf3a0l": 4, // Week 2 - Fundamentals AM
  "https://book.stripe.com/00wbJ13Zq1YrfT0bOqf3a0m": 4, // Week 2 - Intermediate PM
  "https://book.stripe.com/cNi5kDbrS9qTcGObOqf3a0n": 4, // Week 3 - Fundamentals AM
  "https://book.stripe.com/7sYaEX9jKfPh22adWyf3a0o": 4, // Week 3 - Intermediate PM
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
