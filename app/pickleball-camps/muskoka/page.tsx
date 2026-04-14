import type { Metadata } from "next"
import { MuskokaPageClient } from "./muskoka-page-client"

export const metadata: Metadata = {
  title: "Muskoka Pickleball Camps With Joey Manchurek | Breakaway Pickleball",
  description:
    "Train with 5.0 DUPR pro Joey Manchurek this July at a brand new private indoor court near Lake Joseph. 6 small-group camps, 4 players max per session. Fundamentals and intermediate levels. $800 CAD.",
  openGraph: {
    title: "Muskoka Pickleball Camps With Joey Manchurek | Breakaway Pickleball",
    description:
      "Train with 5.0 DUPR pro Joey Manchurek this July at a brand new private indoor court near Lake Joseph. 6 small-group camps, 4 players max per session.",
    images: ["/muskoka-photos/coach-joey-headshot.png"],
  },
}

export default function MuskokaPage() {
  return <MuskokaPageClient />
}
