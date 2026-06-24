import type { Metadata } from "next"
import { MuskokaPageClient } from "./muskoka-page-client"
import { fetchPublicCampEvent, PUBLIC_CAMP_REVALIDATE_SECONDS } from "@/lib/breakaway-api"
import { mapEventCampsToMuskoka } from "@/lib/muskoka-feed"
import { muskokaCamps } from "@/lib/muskoka-camps"
import { getPublishedPublicCampNavItems } from "@/lib/public-camps"

// Refresh the camp feed on the standard public-camp ISR window.
export const revalidate = 300

export const metadata: Metadata = {
  title: "Muskoka Pickleball Camps With Joey Manchurek | Breakaway Pickleball",
  description:
    "Train with 5.0 DUPR pro Joey Manchurek this July at a brand new private indoor court near Lake Joseph. 6 small-group camps, 4 players max per session. Fundamentals and intermediate levels. $800 CAD.",
  alternates: {
    canonical: "/pickleball-camps/muskoka",
  },
  openGraph: {
    title: "Muskoka Pickleball Camps With Joey Manchurek | Breakaway Pickleball",
    description:
      "Train with 5.0 DUPR pro Joey Manchurek this July at a brand new private indoor court near Lake Joseph. 6 small-group camps, 4 players max per session.",
    url: "/pickleball-camps/muskoka",
    images: ["/muskoka-photos/coach-joey-headshot.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/muskoka-photos/coach-joey-headshot.png"],
  },
}

export default async function MuskokaPage() {
  // Camps come from the Camp Event feed (DB). Fall back to the hardcoded list
  // if the API is unavailable so the page never breaks.
  const [event, navCampItems] = await Promise.all([
    fetchPublicCampEvent("muskoka", {
      revalidate: PUBLIC_CAMP_REVALIDATE_SECONDS,
    }),
    getPublishedPublicCampNavItems(),
  ])
  const camps =
    event && event.camps.length > 0
      ? mapEventCampsToMuskoka(event.camps)
      : muskokaCamps

  return <MuskokaPageClient camps={camps} navCampItems={navCampItems} />
}
