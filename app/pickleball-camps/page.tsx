import { Metadata } from "next"
import CampsPageClient from "./camps-page-client"
import { getPublishedPublicCampCards, getPublishedPublicCampNavItems } from "@/lib/public-camps"

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

export default async function CampsPage() {
  const [publishedCampCards, navCampItems] = await Promise.all([
    getPublishedPublicCampCards(),
    getPublishedPublicCampNavItems(),
  ])

  return <CampsPageClient publishedCampCards={publishedCampCards} navCampItems={navCampItems} />
}
