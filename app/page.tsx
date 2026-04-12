import { Navigation } from "@/components/Navigation"
import { CampFinder } from "@/components/CampFinder"
import { ValueProps } from "@/components/ValueProps"
import { CampCard } from "@/components/CampCard"
import { Footer } from "@/components/Footer"
import { HeroAvatars } from "@/components/HeroAvatars"
import { HeroVideo } from "@/components/HeroVideo"
import { Button } from "@/components/ui/button"
import { ArrowRight, Quote } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const featuredCamps = [
    {
      id: "toronto-beginner-may",
      title: "Toronto Core Skills Intensive (2.5-2.75)",
      date: "May 23-24, 2026",
      sortDate: new Date("2026-05-23"),
      location: "The Jar PickleBall Club",
      price: "$800 CAD",
      image: "/toronto-beginner-intensive-may-2026.png",
      badges: [
        { text: "Just Announced", variant: "accent" as const },
        { text: "Joey Manchurek Signature", variant: "secondary" as const },
      ],
      coach: "Joey Manchurek",
      link: "/pickleball-camps/toronto-core-skills-pickleball-camp",
      imageEnhanced: true,
      soldOut: false,
    },
  ].sort((a, b) => {
    // Sort by soldOut status first (available camps first), then by date
    if (a.soldOut !== b.soldOut) {
      return a.soldOut ? 1 : -1
    }
    return a.sortDate.getTime() - b.sortDate.getTime()
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-[#1e3a8a]">
        <HeroVideo />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 text-balance">Elevate Your Game</h1>

            {/* Subtitle - moved above avatars */}
            <p className="text-lg text-white font-medium drop-shadow-md mb-4">Pickleball camps across Toronto, the GTA & Muskoka</p>

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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCamps.map((camp) => (
              <CampCard key={camp.id} {...camp} />
            ))}
          </div>
        </div>
      </section>

      {/* Recently Completed Camps section */}
      <section className="py-12 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-primary mb-6">Recently Completed Camps</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Kids Passover Camp */}
            <div className="group relative overflow-hidden rounded-lg bg-card border shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="/kids-passover-camp-hero.webp"
                  alt="Kids Passover Pickleball Camp group photo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                    Ages 8-16
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-primary mb-1">Kids Passover Pickleball Camp</h3>
                <p className="text-sm text-muted-foreground mb-4">April 7-10, 2026</p>

                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/pickleball-camps/kids-passover-pickleball-camp-toronto/recap" scroll={true}>
                    View Recap
                  </Link>
                </Button>
              </div>
            </div>

            {/* Toronto Intermediate Intensive */}
            <div className="group relative overflow-hidden rounded-lg bg-card border shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="/images/jan2026camp.jpeg"
                  alt="Toronto Intermediate Intensive group photo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center rounded-full bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground">
                    Sold Out
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-primary mb-1">Toronto Intermediate Intensive</h3>
                <p className="text-sm text-muted-foreground mb-4">Jan 10-11, 2026</p>

                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/pickleball-camps/toronto-intensive-jan/recap" scroll={true}>
                    View Recap
                  </Link>
                </Button>
              </div>
            </div>
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

      {/* Footer */}
      <Footer />
    </div>
  )
}
