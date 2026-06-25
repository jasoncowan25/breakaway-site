import { Metadata } from "next"
import { JsonLd } from "@/components/JsonLd"
import { Navigation } from "@/components/Navigation"
import { CampCard } from "@/components/CampCard"
import { MuskokaHubCard } from "@/components/MuskokaHubCard"
import { Footer } from "@/components/Footer"
import { getPublishedPublicCampCards, getPublishedPublicCampNavItems } from "@/lib/public-camps"
import { itemListJsonLd } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Camp Schedule | Breakaway Pickleball",
  description: "Browse pickleball camps by location and find your perfect dates",
  alternates: {
    canonical: "/schedule",
  },
  openGraph: {
    url: "/schedule",
  },
}

export default async function SchedulePage() {
  const [publishedCampCards, navCampItems] = await Promise.all([
    getPublishedPublicCampCards(),
    getPublishedPublicCampNavItems(),
  ])

  const puntaCanaCamp = {
    id: "punta-cana-2026",
    title: "Punta Cana Destination Retreat",
    date: "Nov 24 – Dec 1, 2026",
    sortDate: new Date("2026-11-24"),
    location: "TRS Turquesa, Punta Cana, DR",
    price: "From $2,420 CAD",
    image: "/punta-cana-resort-pool.jpg",
    badges: [
      { text: "Few spots left", variant: "destructive" as const },
      { text: "Destination", variant: "secondary" as const },
    ],
    coach: "Joey Manchurek",
    link: "/pickleball-camps/punta-cana",
    imageEnhanced: true,
    soldOut: false,
    buttonText: "Learn More",
  }

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={itemListJsonLd([...publishedCampCards, puntaCanaCamp])} />
      <Navigation campItems={navCampItems} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Camp Schedule</h1>
          <p className="text-xl text-muted-foreground">Browse upcoming pickleball camps by date and find your perfect session</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MuskokaHubCard className="md:col-span-2 lg:col-span-2" />
          {publishedCampCards.map((camp) => (
            <CampCard key={camp.id} {...camp} />
          ))}
          <CampCard {...puntaCanaCamp} />
        </div>
      </div>

      <Footer />
    </div>
  )
}
