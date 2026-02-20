import { Metadata } from "next"
import KidsPassoverCampClient from "./kids-camp-client"

export const metadata: Metadata = {
  title: "Breakaway Kids Passover Pickleball Camp | Ages 8-16 | Toronto",
  description:
    "Breakaway Kids Passover Pickleball Camp at The Jar PickleBall Club in Toronto, April 7-10 2026. Ages 8-16, no experience required. $118/day.",
  openGraph: {
    title: "Breakaway Kids Passover Pickleball Camp",
    description:
      "4-day youth pickleball camp at The Jar PickleBall Club, April 7-10. Ages 8-16, no experience required. Skills training, tournaments, prizes & lunch included. $118/day.",
    url: "/pickleball-camps/kids-passover-pickleball-camp-toronto",
    images: [
      {
        url: "/kids-pickleball-training.jpg",
        width: 1200,
        height: 630,
        alt: "Kids playing pickleball at Breakaway Passover Camp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Breakaway Kids Passover Pickleball Camp",
    description:
      "4-day youth pickleball camp at The Jar PickleBall Club, April 7-10. Ages 8-16, no experience required. $118/day.",
    images: ["/kids-pickleball-training.jpg"],
  },
}

export default function KidsPassoverCampPage() {
  return <KidsPassoverCampClient />
}
