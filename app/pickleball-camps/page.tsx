import { Metadata } from "next"
import { JsonLd } from "@/components/JsonLd"
import CampsPageClient from "./camps-page-client"
import { getPublishedPublicCampCards, getPublishedPublicCampNavItems } from "@/lib/public-camps"
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

type CampsPageProps = {
  searchParams?: Promise<{
    location?: string
    skill?: string
    view?: string
  }>
}

function locationsFromParam(location?: string) {
  if (location === "toronto-gta") return ["Toronto & GTA"]
  if (location === "muskoka") return ["Muskoka"]
  if (location === "punta-cana") return ["Punta Cana"]
  return []
}

export default async function CampsPage({ searchParams }: CampsPageProps) {
  const [publishedCampCards, navCampItems, params] = await Promise.all([
    getPublishedPublicCampCards(),
    getPublishedPublicCampNavItems(),
    searchParams ?? Promise.resolve({}),
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
        navCampItems={navCampItems}
        initialSelectedLocations={locationsFromParam(params.location)}
        initialSelectedSkillLevels={params.skill ? [params.skill] : []}
        initialView={params.view === "completed" ? "completed" : "upcoming"}
      />
    </>
  )
}
