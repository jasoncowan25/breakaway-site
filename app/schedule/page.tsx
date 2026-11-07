import { Metadata } from "next"
import { JsonLd } from "@/components/JsonLd"
import { CampCard } from "@/components/CampCard"
import { MuskokaHubCard } from "@/components/MuskokaHubCard"
import { getPublishedPublicCampCards } from "@/lib/public-camps"
import { getUpcomingMuskokaCamps } from "@/lib/public-muskoka-camps"
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
  const [publishedCampCards, upcomingMuskokaCamps] = await Promise.all([
    getPublishedPublicCampCards(),
    getUpcomingMuskokaCamps(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={itemListJsonLd(publishedCampCards)} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Camp Schedule</h1>
          <p className="text-xl text-muted-foreground">Browse upcoming pickleball camps by date and find your perfect session</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MuskokaHubCard camps={upcomingMuskokaCamps} className="md:col-span-2 lg:col-span-2" />
          {publishedCampCards.map((camp) => (
            <CampCard key={camp.id} {...camp} />
          ))}
        </div>
      </div>

    </div>
  )
}
