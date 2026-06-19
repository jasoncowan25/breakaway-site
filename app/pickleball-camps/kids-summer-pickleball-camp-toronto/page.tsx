import { Metadata } from "next"
import KidsSummerCampClient from "./kids-summer-camp-client"

export const metadata: Metadata = {
  title: "Baseline x Breakaway Kids Summer Pickleball Camp | Ages 8-14 | Toronto",
  description:
    "Baseline x Breakaway Kids Summer Pickleball Camp at The Jar PickleBall Club in Toronto, August 17 - September 4 2026. Ages 8-14, all skill levels, no experience required. $625/week.",
  alternates: {
    canonical: "/pickleball-camps/kids-summer-pickleball-camp-toronto",
  },
  openGraph: {
    title: "Baseline x Breakaway Kids Summer Pickleball Camp",
    description:
      "3-week youth pickleball camp at The Jar PickleBall Club, August 17 - September 4. Ages 8-14, all skill levels. Skills training, daily tournaments & lunch break included. $625/week.",
    url: "/pickleball-camps/kids-summer-pickleball-camp-toronto",
    images: [
      {
        url: "/kids-passover-camp-hero.webp",
        width: 1200,
        height: 630,
        alt: "Coach instructing kids at Breakaway Summer Pickleball Camp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Baseline x Breakaway Kids Summer Pickleball Camp",
    description:
      "3-week youth pickleball camp at The Jar PickleBall Club, August 17 - September 4. Ages 8-14, all skill levels. $625/week.",
    images: ["/kids-passover-camp-hero.webp"],
  },
}

export default function KidsSummerCampPage() {
  return <KidsSummerCampClient />
}
