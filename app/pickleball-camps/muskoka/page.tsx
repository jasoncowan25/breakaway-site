import type { Metadata } from "next"
import { MuskokaPageClient } from "./muskoka-page-client"
import { getUpcomingMuskokaCamps } from "@/lib/public-muskoka-camps"

// Refresh the camp feed on the standard public-camp ISR window.
export const revalidate = 300

export const metadata: Metadata = {
  title: "Muskoka Pickleball Camps | Breakaway",
  description:
    "Explore adult pickleball camps in Muskoka with Joey Manchurek. Small-group coaching near Lake Joseph. Find upcoming dates, skill levels and availability.",
  alternates: {
    canonical: "/pickleball-camps/muskoka",
  },
  openGraph: {
    title: "Muskoka Pickleball Camps | Breakaway",
    description:
      "Explore adult pickleball camps in Muskoka with Joey Manchurek. Find upcoming dates and small-group coaching near Lake Joseph.",
    url: "/pickleball-camps/muskoka",
    images: ["/muskoka-photos/coach-joey-headshot.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/muskoka-photos/coach-joey-headshot.png"],
  },
}

export default async function MuskokaPage() {
  const camps = await getUpcomingMuskokaCamps()

  return <MuskokaPageClient camps={camps} />
}
