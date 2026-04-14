import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Map payment link URLs to max spots
const CAMP_CONFIG: Record<string, number> = {
  "https://buy.stripe.com/eVq00jfI8cD54ai4lY": 4, // Week 1 - Intermediate AM
  "https://buy.stripe.com/eVq5kD0Nebz14ai5q2": 4, // Week 1 - Fundamentals PM
  "https://buy.stripe.com/8x2cN5gMcbz19uC6u6": 4, // Week 2 - Intermediate AM
  "https://buy.stripe.com/eVqbJ12Vm9qT6iq5q2": 4, // Week 2 - Intermediate PM
  "https://buy.stripe.com/8x228rcvWcD536e19M": 4, // Week 3 - Fundamentals AM
  "https://buy.stripe.com/3cI28r2Vm5aD9uC7ya": 4, // Week 3 - Intermediate PM
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
