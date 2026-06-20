import { Metadata } from "next"
import KidsSummerCampClient from "./kids-summer-client"

export const metadata: Metadata = {
  title: "Baseline x Breakaway Kids Summer Pickleball Camp | Ages 8-14 | Toronto",
  description:
    "A 3-week youth pickleball summer camp in Toronto for ages 8-14, August 17 - September 4, 2026, at The Jar PickleBall Club. All skill levels welcome, no experience required. From $625/week.",
  alternates: {
    canonical: "/pickleball-camps/kids-summer-pickleball-camp-toronto",
  },
  openGraph: {
    title: "Baseline x Breakaway Kids Summer Pickleball Camp",
    description:
      "3-week youth pickleball summer camp at The Jar PickleBall Club, August 17 - September 4. Ages 8-14, no experience required. Skills training, daily tournaments & lunch break included. From $625/week.",
    url: "/pickleball-camps/kids-summer-pickleball-camp-toronto",
    images: [
      {
        url: "/kids-passover-camp-hero.webp",
        width: 1200,
        height: 630,
        alt: "Kids playing pickleball at Breakaway Summer Camp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Baseline x Breakaway Kids Summer Pickleball Camp",
    description:
      "3-week youth pickleball summer camp at The Jar PickleBall Club, August 17 - September 4. Ages 8-14, no experience required. From $625/week.",
    images: ["/kids-passover-camp-hero.webp"],
  },
}

export default function KidsSummerCampPage() {
  return <KidsSummerCampClient />
}
