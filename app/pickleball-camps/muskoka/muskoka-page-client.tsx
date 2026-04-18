"use client"

import { useState } from "react"
import useSWR from "swr"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, Users, Check, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type AvailabilityData = {
  availability: Record<string, { spotsRemaining: number; maxSpots: number }>
  lastUpdated: string
}

const muskokaCamps = [
  {
    id: "muskoka-fundamentals-jul-10",
    title: "Fundamentals Camp",
    level: "Fundamentals (Under 3.0)",
    levelVariant: "secondary" as const,
    dates: "July 10-12, 2026",
    time: "9:00 AM - 12:00 PM",
    duration: "3 Days",
    price: "$800 CAD",
    maxPlayers: 4,
    focus: ["Core shots", "Dinking & control", "Court movement", "Positioning basics", "Game confidence"],
    checkoutUrl: "https://book.stripe.com/28E00j2Vmbz18qy5q2f3a0p",
    week: 1,
  },
  {
    id: "muskoka-intermediate-jul-10",
    title: "Intermediate Camp",
    level: "Intermediate (3.0+)",
    levelVariant: "secondary" as const,
    dates: "July 10-12, 2026",
    time: "1:00 PM - 4:00 PM",
    duration: "3 Days",
    price: "$800 CAD",
    maxPlayers: 4,
    focus: ["Drops & resets", "Drives & speed-ups", "Dinking patterns", "Positioning & transitions", "Smart attacking"],
    checkoutUrl: "https://book.stripe.com/dRm8wPeE46eHeOW05If3a0q",
    week: 1,
  },
  {
    id: "muskoka-intermediate-jul-13-am",
    title: "Intermediate Camp",
    level: "Intermediate (3.0+)",
    levelVariant: "secondary" as const,
    dates: "July 13-15, 2026",
    time: "9:00 AM - 12:00 PM",
    duration: "3 Days",
    price: "$800 CAD",
    maxPlayers: 4,
    focus: ["Drops & resets", "Drives & speed-ups", "Dinking patterns", "Positioning & transitions", "Smart attacking"],
    checkoutUrl: "https://book.stripe.com/dRmfZhanOcD5bCK8Cef3a0r",
    week: 2,
  },
  {
    id: "muskoka-intermediate-jul-13",
    title: "Intermediate Camp",
    level: "Intermediate (3.0+)",
    levelVariant: "secondary" as const,
    dates: "July 13-15, 2026",
    time: "1:00 PM - 4:00 PM",
    duration: "3 Days",
    price: "$800 CAD",
    maxPlayers: 4,
    focus: ["Drops & resets", "Drives & speed-ups", "Dinking patterns", "Positioning & transitions", "Smart attacking"],
    checkoutUrl: "https://book.stripe.com/9B600j7bC5aD22a3hUf3a0s",
    week: 2,
  },
  {
    id: "muskoka-fundamentals-jul-17",
    title: "Fundamentals Camp",
    level: "Fundamentals (Under 3.0)",
    levelVariant: "secondary" as const,
    dates: "July 17-19, 2026",
    time: "9:00 AM - 12:00 PM",
    duration: "3 Days",
    price: "$800 CAD",
    maxPlayers: 4,
    focus: ["Core shots", "Dinking & control", "Court movement", "Positioning basics", "Game confidence"],
    checkoutUrl: "https://book.stripe.com/3cI5kDanOfPhgX4g4Gf3a0t",
    week: 3,
  },
  {
    id: "muskoka-intermediate-jul-17",
    title: "Intermediate Camp",
    level: "Intermediate (3.0+)",
    levelVariant: "secondary" as const,
    dates: "July 17-19, 2026",
    time: "1:00 PM - 4:00 PM",
    duration: "3 Days",
    price: "$800 CAD",
    maxPlayers: 4,
    focus: ["Drops & resets", "Drives & speed-ups", "Dinking patterns", "Positioning & transitions", "Smart attacking"],
    checkoutUrl: "https://book.stripe.com/6oU3cvgMc32v6iqf0Cf3a0u",
    week: 3,
  },
]

function CampCard({ 
  camp, 
  availability,
  isLoading 
}: { 
  camp: (typeof muskokaCamps)[0]
  availability?: { spotsRemaining: number; maxSpots: number }
  isLoading?: boolean
}) {
  const hasCheckout = camp.checkoutUrl && camp.checkoutUrl.length > 0
  const spotsRemaining = availability?.spotsRemaining ?? camp.maxPlayers
  const isSoldOut = !isLoading && spotsRemaining === 0

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardContent className="p-5 flex flex-col h-full">
        {/* Badges */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant={camp.levelVariant}>{camp.level}</Badge>
          {isLoading ? (
            <Skeleton className="h-5 w-20" />
          ) : isSoldOut ? (
            <Badge variant="destructive" className="text-xs">
              Sold Out
            </Badge>
          ) : (
            <Badge 
              variant="outline" 
              className={`text-xs ${spotsRemaining <= 2 ? "border-orange-500 text-orange-600" : ""}`}
            >
              <Users className="h-3 w-3 mr-1" />
              {spotsRemaining} {spotsRemaining === 1 ? "Spot" : "Spots"} Left
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-primary mb-3">{camp.title}</h3>

        {/* Details */}
        <div className="space-y-2 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{camp.dates}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{camp.time}</span>
          </div>
        </div>

        {/* Focus areas */}
        <div className="mb-4 flex-1">
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
            What you&apos;ll work on
          </p>
          <ul className="space-y-1">
            {camp.focus.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm">
                <Check className="h-3 w-3 text-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Price & CTA */}
        <div className="mt-auto pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">{camp.price}</span>
            {isSoldOut ? (
              <Button disabled variant="outline">
                Sold Out
              </Button>
            ) : hasCheckout ? (
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <a href={camp.checkoutUrl} target="_blank" rel="noopener noreferrer">
                  Book
                </a>
              </Button>
            ) : (
              <Button disabled variant="outline">
                Coming Soon
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

type LevelFilter = "all" | "under3" | "3plus"

export function MuskokaPageClient() {
  const [mapModalOpen, setMapModalOpen] = useState(false)
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all")
  
  const { data: availabilityData, isLoading: isLoadingAvailability } = useSWR<AvailabilityData>(
    "/api/camp-availability",
    fetcher,
    { refreshInterval: 30000 } // Refresh every 30 seconds
  )
  
  // Manual overrides for sold out camps
  const SOLD_OUT_OVERRIDES: Record<string, boolean> = {
    // Add URLs here to manually mark camps as sold out
  }

  const getAvailability = (checkoutUrl: string) => {
    // Check for manual sold out override
    if (SOLD_OUT_OVERRIDES[checkoutUrl]) {
      return { spotsRemaining: 0, maxSpots: 4 }
    }
    return availabilityData?.availability?.[checkoutUrl]
  }
  
  const filterCampsByLevel = (camps: typeof muskokaCamps) => {
    if (levelFilter === "all") return camps
    if (levelFilter === "under3") return camps.filter(c => c.level.includes("Under 3.0"))
    return camps.filter(c => c.level.includes("3.0+"))
  }
  
  const scrollToCamps = () => {
    document.getElementById("camps")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Joey's headshot */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden bg-primary/10 aspect-square max-w-md mx-auto lg:mx-0">
                <img
                  src="/muskoka-photos/coach-joey-headshot.png"
                  alt="Joey Manchurek - Lead Instructor"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-accent text-accent-foreground text-xs font-semibold">
                    LEAD INSTRUCTOR
                  </Badge>
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div>
              <p className="text-sm font-semibold text-accent tracking-wide mb-2">MUSKOKA SUMMER CAMPS</p>
              <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4 text-balance">
                Train With A Pro In Cottage Country
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Joey Manchurek - former OHL Captain turned 5.0 DUPR pickleball pro - is running six small-group
                camps this July at a brand-new private indoor court near Lake Joseph. 4 players max per session.
                No public court distractions.
              </p>

              {/* Stat cards */}
              <div className="flex gap-4 mb-6">
                <div className="bg-primary/5 rounded-lg p-4 text-center flex-1">
                  <p className="text-2xl font-bold text-primary">5.0</p>
                  <p className="text-xs text-muted-foreground">DUPR Rating</p>
                </div>
                <div className="bg-primary/5 rounded-lg p-4 text-center flex-1">
                  <p className="text-2xl font-bold text-primary">500+</p>
                  <p className="text-xs text-muted-foreground">Players Coached</p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-muted-foreground mb-6">
                Former pro hockey player turned pickleball pro. Joey's coaching philosophy centers on leadership, explosive movement, and technical precision - honed over years of elite team sport competition.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={scrollToCamps} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  See The Camps
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/pickleball-coaches">Meet Joey</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Camps Section */}
      <section id="camps" className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-2">Muskoka 2026 Camps</h2>
            <p className="text-muted-foreground mb-6">
              Choose from 6 camps. 4 players per session.
            </p>
            
            {/* Level Filter */}
            <div className="flex justify-center gap-2">
              <Button
                variant={levelFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setLevelFilter("all")}
                className={levelFilter === "all" ? "bg-primary text-primary-foreground" : ""}
              >
                All Levels
              </Button>
              <Button
                variant={levelFilter === "under3" ? "default" : "outline"}
                size="sm"
                onClick={() => setLevelFilter("under3")}
                className={levelFilter === "under3" ? "bg-primary text-primary-foreground" : ""}
              >
                Under 3.0
              </Button>
              <Button
                variant={levelFilter === "3plus" ? "default" : "outline"}
                size="sm"
                onClick={() => setLevelFilter("3plus")}
                className={levelFilter === "3plus" ? "bg-primary text-primary-foreground" : ""}
              >
                3.0+
              </Button>
            </div>
          </div>

          {/* Week 1 */}
          {filterCampsByLevel(muskokaCamps).filter((c) => c.week === 1).length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                July 10-12
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterCampsByLevel(muskokaCamps)
                  .filter((c) => c.week === 1)
                  .map((camp) => (
                    <CampCard key={camp.id} camp={camp} availability={getAvailability(camp.checkoutUrl)} isLoading={isLoadingAvailability} />
                  ))}
              </div>
            </div>
          )}

          {/* Week 2 */}
          {filterCampsByLevel(muskokaCamps).filter((c) => c.week === 2).length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                July 13-15
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterCampsByLevel(muskokaCamps)
                  .filter((c) => c.week === 2)
                  .map((camp) => (
                    <CampCard key={camp.id} camp={camp} availability={getAvailability(camp.checkoutUrl)} isLoading={isLoadingAvailability} />
                  ))}
              </div>
            </div>
          )}

          {/* Week 3 */}
          {filterCampsByLevel(muskokaCamps).filter((c) => c.week === 3).length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                July 17-19
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterCampsByLevel(muskokaCamps)
                  .filter((c) => c.week === 3)
                  .map((camp) => (
                    <CampCard key={camp.id} camp={camp} availability={getAvailability(camp.checkoutUrl)} isLoading={isLoadingAvailability} />
                  ))}
              </div>
            </div>
          )}

          {/* Booking note */}
          <p className="text-sm text-muted-foreground text-center mt-8">
            All camps are 3 consecutive days, limited to 4 players per session. Sessions are held at our private
            indoor facility - exact address shared after booking confirmation.
          </p>
        </div>
      </section>

      {/* Facility Section */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Court photo */}
            <div className="rounded-xl overflow-hidden">
              <img
                src="/muskoka-photos/muskoka-court-indoor.jpg"
                alt="Muskoka private indoor pickleball court"
                className="w-full h-auto"
              />
            </div>

            {/* Right: Content */}
            <div>
              <p className="text-sm font-semibold text-accent tracking-wide mb-2">THE FACILITY</p>
              <h2 className="text-3xl font-bold text-primary mb-4">
                A Brand New Private Court - Not Open To The Public
              </h2>
              <p className="text-muted-foreground mb-6">
                Train on a premium indoor pickleball surface in the heart of Muskoka cottage country. Our facility is exclusive to Breakaway - no public walk-ins, no court time pressure, no distractions. Just you, Joey, and three other players working for three days.
              </p>

              {/* Feature list */}
              <ul className="space-y-3 mb-8">
                {[
                  "Brand new indoor facility",
                  "Premium pickleball surface",
                  "Private - exclusive to Breakaway camps",
                  "Near Lake Joseph, cottage country setting",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-accent" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Map section */}
              <div className="bg-muted rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-primary">Muskoka, Ontario</p>
                    <p className="text-sm text-muted-foreground">
                      Roughly 2 hours north of Toronto
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMapModalOpen(true)}
                  className="relative rounded-lg aspect-video overflow-hidden w-full cursor-pointer hover:opacity-95 transition-opacity"
                >
                  <img
                    src="/muskoka-photos/muskoka-region-map.jpg"
                    alt="Muskoka region map - click to enlarge"
                    className="w-full h-full object-cover"
                  />
                </button>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Click map to enlarge. Exact address shared before camp begins.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cottage Country CTA Band */}
      <section className="relative py-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/muskoka-photos/muskoka-path.jpg)" }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Train where you&apos;d rather be.</h2>
          <p className="text-white/80 mb-6">Join Joey this summer in Muskoka cottage country.</p>
          <Button onClick={scrollToCamps} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            View Camps <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <Footer />

      {/* Map Modal */}
      <Dialog open={mapModalOpen} onOpenChange={setMapModalOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">Muskoka Region Map</DialogTitle>
          <div className="relative">
            <img
              src="/muskoka-photos/muskoka-region-map.jpg"
              alt="Muskoka region map showing Lake Joseph area"
              className="w-full h-auto"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white text-sm text-center">
                Exact address will be shared with campers before camp begins.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
