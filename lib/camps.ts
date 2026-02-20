export interface CampInfo {
  title: string
  date: string
  venue: string
  location: string
  coach: string
  contactEmail: string
}

// Keys are Stripe Product IDs from the Stripe Dashboard.
export const CAMP_REGISTRY: Record<string, CampInfo> = {
  // Breakaway x Baseline - Kids Passover Pickleball Camp — April 7-10, 2026
  prod_U0j4sf0N865Q2s: {
    title: "Kids Passover Pickleball Camp",
    date: "April 7-10, 2026",
    venue: "The Jar PickleBall Club",
    location: "Toronto",
    coach: "Joey Manchurek",
    contactEmail: "breakawaypickleball@gmail.com",
  },

  // (single day) Breakaway Pickleball Camp — Toronto 3.0-3.5 — April 11-12, 2026
  prod_TxCTmNfbUwsE97: {
    title: "Breakaway Pickleball Camp — Single Day",
    date: "April 11-12, 2026",
    venue: "The Jar PickleBall Club",
    location: "Toronto",
    coach: "Joey Manchurek",
    contactEmail: "breakawaypickleball@gmail.com",
  },

  // Breakaway Pickleball Camp — Toronto 3.0-3.5 — April 11-12, 2026 (full 2-day)
  prod_TnVYQXDuMJ0Qb1: {
    title: "Toronto Intermediate Pickleball Intensive",
    date: "April 11-12, 2026",
    venue: "The Jar PickleBall Club",
    location: "Toronto",
    coach: "Joey Manchurek",
    contactEmail: "breakawaypickleball@gmail.com",
  },

  // Breakaway Saint Martin Pop-Up Clinic — March 20, 2026
  prod_Tn8vKqE11MM5MG: {
    title: "Saint Martin Pop-Up Clinic",
    date: "March 20, 2026",
    venue: "Near Anse Marcel",
    location: "Saint Martin",
    coach: "Joey Manchurek",
    contactEmail: "breakawaypickleball@gmail.com",
  },

  // Breakaway Pickleball Kids Camp — April 7-10, 2026
  prod_Tn8EkxcZyllFMl: {
    title: "Breakaway Pickleball Kids Camp",
    date: "April 7-10, 2026",
    venue: "The Jar PickleBall Club",
    location: "Toronto",
    coach: "Joey Manchurek",
    contactEmail: "breakawaypickleball@gmail.com",
  },
}

const FALLBACK_CAMP: CampInfo = {
  title: "Breakaway Pickleball Camp",
  date: "See your receipt for details",
  venue: "See your receipt for details",
  location: "",
  coach: "Breakaway Coaching Team",
  contactEmail: "breakawaypickleball@gmail.com",
}

export function getCampByProductId(productId: string): CampInfo {
  return CAMP_REGISTRY[productId] ?? FALLBACK_CAMP
}
