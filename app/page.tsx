import type { Metadata } from "next"
import { CampFinder } from "@/components/CampFinder"
import { ValueProps } from "@/components/ValueProps"
import { CampCard } from "@/components/CampCard"
import { MuskokaHubCard } from "@/components/MuskokaHubCard"
import { HeroAvatars } from "@/components/HeroAvatars"
import { HeroVideo } from "@/components/HeroVideo"
import { JsonLd } from "@/components/JsonLd"
import { Button } from "@/components/ui/button"
import { ArrowRight, Quote } from "lucide-react"
import Link from "next/link"
import { Fragment } from "react"
import { getPublishedPublicCampCards } from "@/lib/public-camps"
import { getUpcomingMuskokaCamps } from "@/lib/public-muskoka-camps"
import { organizationJsonLd } from "@/lib/seo"
import { HOME_COMPLETED_CAMP_CARDS, RELATED_CAMP_LINKS } from "@/lib/camp-discovery"

export const metadata: Metadata = {
  title: "Breakaway Pickleball Camps — Pro-Level Training in Toronto, GTA & Muskoka",
  description:
    "Premium pickleball training camps across Toronto, the GTA and Muskoka. Small groups, professional coaching, results-oriented programs for intermediate to advanced players.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
  },
}

export default async function HomePage() {
  const [publishedCampCards, upcomingMuskokaCamps] = await Promise.all([
    getPublishedPublicCampCards(),
    getUpcomingMuskokaCamps(),
  ])

  const puntaCanaCamp = {
    id: "punta-cana-2026",
    title: "Punta Cana Destination Retreat",
    date: "Nov 24 – Dec 1, 2026",
    sortDate: new Date("2026-11-24"),
    location: "TRS Turquesa, Punta Cana, DR",
    price: "From $2,201 CAD",
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
      <JsonLd data={organizationJsonLd()} />

      {/* Hero Section */}
      <section className="relative h-[690px] flex items-center justify-center bg-[#1e3a8a]">
        <HeroVideo />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 text-balance">Elevate Your Game</h1>

            {/* Subtitle - moved above avatars */}
            <p className="text-lg text-white font-medium drop-shadow-md mb-4">Pickleball camps across Toronto, the GTA &amp; now Muskoka</p>

            <HeroAvatars />

            {/* Label */}
            <p className="text-sm text-white/85 font-medium drop-shadow-md mb-8">Led by Top Pickleball Pros</p>
          </div>

          {/* Camp Finder Widget */}
          <CampFinder />
        </div>
      </section>

      {/* Value Props */}
      <ValueProps />

      <section className="border-y border-border bg-muted/20 py-8">
        <div className="mx-auto grid max-w-7xl gap-2 px-4 text-center text-sm sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-3 sm:px-6 lg:px-8">
          {RELATED_CAMP_LINKS.map((item, index) => (
            <Fragment key={item.href}>
              {index > 0 && <span className="hidden text-muted-foreground sm:inline">/</span>}
              <Link href={item.href} className="font-medium text-primary underline-offset-4 hover:underline">
                {item.homeLabel}
              </Link>
            </Fragment>
          ))}
        </div>
      </section>

      {/* Featured Camps Carousel */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-primary">Upcoming Signature Camps</h2>
            <Button asChild variant="ghost" className="text-primary hover:text-accent">
              <Link href="/pickleball-camps">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MuskokaHubCard camps={upcomingMuskokaCamps} className="md:col-span-2 lg:col-span-2" />
            {publishedCampCards.map((camp) => (
              <CampCard key={camp.id} {...camp} />
            ))}
            <CampCard {...puntaCanaCamp} />
          </div>
        </div>
      </section>

      {/* Recently Completed Camps section */}
      <section className="py-12 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-primary mb-6">Recently Completed Camps</h2>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl">
            {HOME_COMPLETED_CAMP_CARDS.map((camp) => (
              <CampCard key={camp.id} {...camp} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-background hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">From the Court</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 - Leadership */}
            <div className="relative bg-card border rounded-lg p-8 shadow-sm">
              <Quote className="absolute top-6 left-6 h-8 w-8 text-lime-400 opacity-20" />
              <div className="relative">
                <p className="text-lg text-foreground mb-6 leading-relaxed">
                  "Leadership and coaching style is of the highest caliber"
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-950 to-lime-400" />
                  <div>
                    <p className="font-semibold text-sm text-primary">Toronto Camp Participant</p>
                    <p className="text-xs text-muted-foreground">Jan 2026</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 - Stamina */}
            <div className="relative bg-card border rounded-lg p-8 shadow-sm">
              <Quote className="absolute top-6 left-6 h-8 w-8 text-lime-400 opacity-20" />
              <div className="relative">
                <p className="text-lg text-foreground mb-6 leading-relaxed">
                  "I was surprised at my stamina and at the end of the 2 days I felt completely invigorated"
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-950 to-lime-400" />
                  <div>
                    <p className="font-semibold text-sm text-primary">Toronto Camp Participant</p>
                    <p className="text-xs text-muted-foreground">Jan 2026</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 - Loved Everything */}
            <div className="relative bg-card border rounded-lg p-8 shadow-sm">
              <Quote className="absolute top-6 left-6 h-8 w-8 text-lime-400 opacity-20" />
              <div className="relative">
                <p className="text-lg text-foreground mb-6 leading-relaxed">
                  "I loved everything about the camp and will be recommending it to all my pickleball friends"
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-950 to-lime-400" />
                  <div>
                    <p className="font-semibold text-sm text-primary">Toronto Camp Participant</p>
                    <p className="text-xs text-muted-foreground">Jan 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
