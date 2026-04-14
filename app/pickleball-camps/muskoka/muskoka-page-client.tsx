"use client"

import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Check, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"

const muskokaCamps = [
  {
    id: "muskoka-intermediate-jul-10",
    title: "Intermediate Camp",
    level: "Intermediate (3.0+)",
    levelVariant: "accent" as const,
    dates: "July 10-12, 2026",
    time: "9:00 AM - 12:00 PM",
    duration: "3 Days",
    price: "$800 CAD",
    maxPlayers: 4,
    focus: ["Drives", "Drops", "Dinking", "Positioning", "Attacks"],
    checkoutUrl: "",
    week: 1,
  },
  {
    id: "muskoka-fundamentals-jul-10",
    title: "Fundamentals Camp",
    level: "Fundamentals (Under 3.0)",
    levelVariant: "secondary" as const,
    dates: "July 10-12, 2026",
    time: "1:00 PM - 4:00 PM",
    duration: "3 Days",
    price: "$800 CAD",
    maxPlayers: 4,
    focus: ["Core Skills", "Positioning"],
    checkoutUrl: "",
    week: 1,
  },
  {
    id: "muskoka-intermediate-jul-13",
    title: "Intermediate Camp",
    level: "Intermediate (3.0+)",
    levelVariant: "accent" as const,
    dates: "July 13-15, 2026",
    time: "9:00 AM - 12:00 PM",
    duration: "3 Days",
    price: "$800 CAD",
    maxPlayers: 4,
    focus: ["Drives", "Drops", "Dinking", "Positioning", "Attacks"],
    checkoutUrl: "",
    week: 2,
  },
  {
    id: "muskoka-fundamentals-jul-13",
    title: "Fundamentals Camp",
    level: "Fundamentals (Under 3.0)",
    levelVariant: "secondary" as const,
    dates: "July 13-15, 2026",
    time: "1:00 PM - 4:00 PM",
    duration: "3 Days",
    price: "$800 CAD",
    maxPlayers: 4,
    focus: ["Core Skills", "Positioning"],
    checkoutUrl: "",
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
    focus: ["Core Skills", "Positioning"],
    checkoutUrl: "",
    week: 3,
  },
  {
    id: "muskoka-intermediate-jul-17",
    title: "Intermediate Camp",
    level: "Intermediate (3.0+)",
    levelVariant: "accent" as const,
    dates: "July 17-19, 2026",
    time: "1:00 PM - 4:00 PM",
    duration: "3 Days",
    price: "$800 CAD",
    maxPlayers: 4,
    focus: ["Drives", "Drops", "Dinking", "Positioning", "Attacks"],
    checkoutUrl: "",
    week: 3,
  },
]

function CampCard({ camp }: { camp: (typeof muskokaCamps)[0] }) {
  const hasCheckout = camp.checkoutUrl && camp.checkoutUrl.length > 0

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardContent className="p-5 flex flex-col h-full">
        {/* Badges */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant={camp.levelVariant}>{camp.level}</Badge>
          <Badge variant="outline" className="text-xs">
            <Users className="h-3 w-3 mr-1" />4 Players Max
          </Badge>
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
            {hasCheckout ? (
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <a href={camp.checkoutUrl} target="_blank" rel="noopener noreferrer">
                  Book Now
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

export function MuskokaPageClient() {
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
                  <p className="text-2xl font-bold text-primary">OHL</p>
                  <p className="text-xs text-muted-foreground">Captain</p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-muted-foreground mb-6">
                Former pro hockey player turned 5.0 rated pickleball pro. Joey&apos;s coaching philosophy centers on
                leadership, explosive movement, and technical precision - honed over years of elite team sport
                competition.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={scrollToCamps} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  View July Camps
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-2">July 2026 Camps</h2>
            <p className="text-muted-foreground">
              6 small-group camps. 4 players per session. Three days of focused training with a 5.0 pro.
            </p>
          </div>

          {/* Week 1 */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
              Week 1: July 10-12
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {muskokaCamps
                .filter((c) => c.week === 1)
                .map((camp) => (
                  <CampCard key={camp.id} camp={camp} />
                ))}
            </div>
          </div>

          {/* Week 2 */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
              Week 2: July 13-15
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {muskokaCamps
                .filter((c) => c.week === 2)
                .map((camp) => (
                  <CampCard key={camp.id} camp={camp} />
                ))}
            </div>
          </div>

          {/* Week 3 */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
              Week 3: July 17-19
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {muskokaCamps
                .filter((c) => c.week === 3)
                .map((camp) => (
                  <CampCard key={camp.id} camp={camp} />
                ))}
            </div>
          </div>

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
                Train on a premium indoor pickleball surface in the heart of Muskoka cottage country. Our facility
                is exclusive to Breakaway campers - no public walk-ins, no court time pressure, no distractions.
                Just you, Joey, and three other players working for three days.
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

              {/* Map placeholder */}
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
                <div className="bg-primary/10 rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-primary/50 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Exact address provided after booking
                    </p>
                  </div>
                </div>
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
          <p className="text-white/80 mb-6">Join Joey this July in Muskoka cottage country.</p>
          <Button onClick={scrollToCamps} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            View Camps <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
