import { getRecaps, recapCard } from "@/lib/recaps/get"
import { Metadata } from "next"
import { JsonLd } from "@/components/JsonLd"
import CampsPageClient from "./camps-page-client"
import { getPublishedPublicCampCards } from "@/lib/public-camps"
import { getUpcomingMuskokaCamps } from "@/lib/public-muskoka-camps"
import { defaultOpenGraphImage, itemListJsonLd } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Upcoming Pickleball Camps & Kids Programs | Breakaway",
  description: "Find upcoming adult pickleball camps and kids programs in Toronto, the GTA and Muskoka. Compare dates, locations and skill levels with Breakaway.",
  alternates: {
    canonical: "/pickleball-camps",
  },
  openGraph: {
    title: "Upcoming Pickleball Camps & Kids Programs | Breakaway",
    description: "Explore upcoming adult camps and kids programs in Toronto, the GTA and Muskoka.",
    images: defaultOpenGraphImage,
    url: "/pickleball-camps",
  },
}

export const dynamic = "force-dynamic"

export default async function CampsPage() {
  const [publishedCampCards, upcomingMuskokaCamps, recaps] = await Promise.all([
    getPublishedPublicCampCards(),
    getUpcomingMuskokaCamps(),
    getRecaps(),
  ])

  return (
    <>
      <JsonLd data={itemListJsonLd(publishedCampCards)} />
      <CampsPageClient
        publishedCampCards={publishedCampCards}
        recapCards={recaps.map(recapCard)}
        muskokaCamps={upcomingMuskokaCamps}
      />
    </>
  )
}
