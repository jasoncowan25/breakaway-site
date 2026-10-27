import { getRecaps, recapCard } from "@/lib/recaps/get"
import { Metadata } from "next"
import { JsonLd } from "@/components/JsonLd"
import CampsPageClient from "./camps-page-client"
import { getPublishedPublicCampCards } from "@/lib/public-camps"
import { getUpcomingMuskokaCamps } from "@/lib/public-muskoka-camps"
import { itemListJsonLd } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Pickleball Camps | Find Your Camp | Breakaway",
  description: "Discover upcoming pickleball camps and clinics across Toronto, the GTA and Muskoka led by top pros",
  alternates: {
    canonical: "/pickleball-camps",
  },
  openGraph: {
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

  const puntaCanaCard = {
    title: "Punta Cana Destination Retreat",
    link: "/pickleball-camps/punta-cana",
  }

  return (
    <>
      <JsonLd data={itemListJsonLd([...publishedCampCards, puntaCanaCard])} />
      <CampsPageClient
        publishedCampCards={publishedCampCards}
        recapCards={recaps.map(recapCard)}
        muskokaCamps={upcomingMuskokaCamps}
      />
    </>
  )
}
