import { NextResponse } from "next/server"
import { fetchPublicCamps } from "@/lib/breakaway-api"

// Camp availability, keyed by Stripe checkout URL.
//
// Previously this route held STRIPE_SECRET_KEY and counted Stripe checkout
// sessions directly. It now proxies the Breakaway public API, which computes
// availability from camp_attendance server-side — no Stripe secret on the
// marketing site. The response shape is unchanged, so the Muskoka and
// Experience pages that consume it via SWR need no changes.
//
// Camps not present in the API (e.g. a hardcoded camp not yet entered in the
// admin) simply won't appear in the map; the consuming pages fall back to the
// camp's own maxPlayers, exactly as before when data was missing.

// Availability changes with every signup, and the consuming pages poll this via
// SWR every 30s — keep it fresh (was 300s, which left spots up to 5 min stale in
// production). Dev reads live (the API client is no-store outside production).
export const revalidate = 30

interface Availability {
  spotsRemaining: number
  maxSpots: number
}

export async function GET() {
  const camps = await fetchPublicCamps({ revalidate: 30 })

  const availability: Record<string, Availability> = {}
  for (const camp of camps) {
    if (!camp.checkoutUrl || camp.capacity == null) continue
    const maxSpots = camp.capacity
    const spotsRemaining = camp.isSoldOut ? 0 : Math.max(0, camp.spotsLeft ?? maxSpots)
    // If two camps share a checkout URL, keep the tighter (lower) availability.
    const existing = availability[camp.checkoutUrl]
    if (!existing || spotsRemaining < existing.spotsRemaining) {
      availability[camp.checkoutUrl] = { spotsRemaining, maxSpots }
    }
  }

  return NextResponse.json({ availability })
}
