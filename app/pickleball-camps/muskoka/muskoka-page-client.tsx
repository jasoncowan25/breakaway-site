"use client"

import { useState } from "react"
import useSWR from "swr"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, Users, Check, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"
import { muskokaCamps, type MuskokaCamp } from "@/lib/muskoka-camps"
import type { PublicCampNavItem } from "@/lib/public-camps"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type AvailabilityData = {
  availability: Record<string, { spotsRemaining: number; maxSpots: number }>
  lastUpdated: string
}

type LiveAvailability = { spotsRemaining: number; maxSpots: number }

/* ---------------------------------------------------------------------------
 * Camp card — verbatim port of the Claude Design "Muskoka Camps.dc.html" card
 * (project b1163a4b). Layout, spacing, colours and type sizes are copied
 * mechanically from the design; token values come from the design system's
 * colors_and_type.css (navy #124A7A, lime #90D123, border #e5e7eb,
 * fg-muted #6b7280, radius-md 6px, shadow-sm).
 * ------------------------------------------------------------------------- */

const CARD_SHADOW = "shadow-[0_1px_2px_0_rgba(0,0,0,0.05),0_1px_3px_0_rgba(0,0,0,0.1)]"
const BADGE_BASE =
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-medium leading-none"
const BTN_SM =
  "inline-flex h-8 items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 text-[13px] transition-colors"

/** "Fri Jul 10" (feed label) → "Day 1 · Fri, Jul 10" (design day-row label). */
function dayRowLabel(label: string, index: number): string {
  return `Day ${index + 1} · ${label.replace(/^(\S+)\s+/, "$1, ")}`
}

function CampCard({
  camp,
  getAvailability,
}: {
  camp: MuskokaCamp
  getAvailability: (checkoutUrl: string) => LiveAvailability | undefined
}) {
  const hasCheckout = camp.checkoutUrl && camp.checkoutUrl.length > 0
  // Prefer live availability (SWR, keyed by checkout link) when present; fall
  // back to the DB feed's own spotsRemaining — sold-out camps have no active
  // Stripe link, so no availability entry — then to capacity for the hardcoded
  // list. isSoldOut honours the feed (covers override + no-active-link camps).
  // Spot COUNTS are never rendered — availability only drives Book vs Sold Out.
  const availability = camp.checkoutUrl ? getAvailability(camp.checkoutUrl) : undefined
  const spotsRemaining =
    availability?.spotsRemaining ?? camp.spotsRemaining ?? camp.maxPlayers
  // The 3-day product. Feed isSoldOut already means "no seat free on every day".
  const fullSoldOut = (camp.isSoldOut ?? false) || spotsRemaining === 0

  // Single-day options: feed availability refined by the 30s SWR overlay.
  const singleDays = (camp.singleDay?.days ?? []).map((day) => {
    const live = day.checkoutUrl ? getAvailability(day.checkoutUrl) : undefined
    return {
      ...day,
      available:
        day.available &&
        Boolean(day.checkoutUrl) &&
        (live == null || live.spotsRemaining > 0),
    }
  })
  const hasSingleDays = singleDays.some((d) => d.checkoutUrl)
  const anyDayAvailable = singleDays.some((d) => d.available)
  // The card only reads fully SOLD OUT when every way in is gone.
  const isSoldOut = fullSoldOut && (!hasSingleDays || !anyDayAvailable)

  // Top badge: just Available / Sold Out — a partial "N Days Sold Out" state
  // read as more confusing than useful (the day rows below already show
  // exactly which days are gone).
  let topBadge: React.ReactNode
  if (isSoldOut) {
    topBadge = <span className={`${BADGE_BASE} border-transparent bg-[#dc2626] text-white`}>Sold Out</span>
  } else {
    topBadge = (
      <span className={`${BADGE_BASE} border-[#e5e7eb] bg-white/95 text-[#111827]`}>
        <Users className="h-3 w-3" />
        Available
      </span>
    )
  }

  return (
    <div className={`flex flex-col rounded-lg border border-[#e5e7eb] bg-white p-5 ${CARD_SHADOW}`}>
      {/* Level + availability badge */}
      <div className="mb-[10px] flex items-start justify-between gap-2">
        <span className="text-xs font-semibold text-[#6b7280]">{camp.level}</span>
        {topBadge}
      </div>

      {/* Title */}
      <h3 className="mb-[10px] text-lg font-bold leading-[1.1] tracking-[-0.02em] text-[#124A7A] text-balance">
        {camp.title}
      </h3>

      {/* Date + time */}
      <div className="mb-[5px] flex items-center gap-2 text-sm text-[#6b7280]">
        <Calendar className="h-3.5 w-3.5" />
        <span>{camp.dates}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-[#6b7280]">
        <Clock className="h-3.5 w-3.5" />
        <span>{camp.time}</span>
      </div>

      {/* What you'll work on */}
      <div className="mt-4">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#6b7280]">
          What You&apos;ll Work On
        </div>
        <ul className="flex flex-col gap-1.5">
          {camp.focus.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-[#111827]">
              <Check className="h-[15px] w-[15px] shrink-0 text-[#90D123]" strokeWidth={2.5} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Price + full-camp booking — sells out independently of day buttons */}
      <div className="mt-4 flex items-center justify-between border-t border-[#e5e7eb] pt-3.5">
        <div>
          <span className="text-[22px] font-bold text-[#124A7A]">
            {camp.price.replace(/\s*\/\s*player$/, "")}
          </span>
          <span className="text-[13px] text-[#6b7280]"> / player</span>
        </div>
        {fullSoldOut ? (
          <button
            disabled
            className={`${BTN_SM} cursor-not-allowed border border-[#e5e7eb] bg-[#f3f4f6] font-medium text-[#9ca3af] opacity-50`}
          >
            Sold Out
          </button>
        ) : hasCheckout ? (
          <a
            href={camp.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BTN_SM} border border-transparent bg-[#90D123] font-semibold text-[#111827] hover:bg-[#7fba1f]`}
          >
            Book 3 Days
          </a>
        ) : (
          <button
            disabled
            className={`${BTN_SM} cursor-not-allowed border border-[#e5e7eb] bg-[#f3f4f6] font-medium text-[#9ca3af] opacity-50`}
          >
            Coming Soon
          </button>
        )}
      </div>

      {/* Single-day booking — hidden until day links exist in the feed */}
      {hasSingleDays && camp.singleDay && (
        <div className="mt-4 border-t border-dashed border-[#e5e7eb] pt-3.5">
          <div className="mb-[10px] flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.04em] text-[#124A7A]">
              Or Book A Single Day
            </span>
            <span className="text-xs text-[#6b7280]">{camp.singleDay.priceLabel}</span>
          </div>
          <div className="flex flex-col gap-2">
            {singleDays.map((day, index) => (
              <div key={day.date} className="flex items-center justify-between gap-2">
                <span className="text-[13px] text-[#111827]">{dayRowLabel(day.label, index)}</span>
                {day.available && day.checkoutUrl ? (
                  <a
                    href={day.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${BTN_SM} border border-[#124A7A] bg-transparent font-medium text-[#124A7A] hover:bg-[#124A7A] hover:text-white`}
                  >
                    Book Day
                  </a>
                ) : (
                  <span className="inline-flex items-center whitespace-nowrap rounded-md border border-[#e5e7eb] bg-[#f3f4f6] px-[9px] py-1 text-[11px] font-medium leading-none text-[#6b7280]">
                    Sold Out
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

type LevelFilter = "all" | "under3" | "3plus"

export function MuskokaPageClient({
  camps = muskokaCamps,
  navCampItems = [],
}: {
  camps?: MuskokaCamp[]
  navCampItems?: PublicCampNavItem[]
}) {
  const [mapModalOpen, setMapModalOpen] = useState(false)
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all")
  
  const { data: availabilityData } = useSWR<AvailabilityData>(
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

  // Announce single-day options once any camp actually has day links live.
  const singleDayOffer = camps.find((c) => c.singleDay?.days.some((d) => d.checkoutUrl))?.singleDay
  const singleDayBannerPrice = singleDayOffer?.priceLabel.replace(" CAD / day", "/day")

  return (
    <div className="min-h-screen bg-background">
      <Navigation campItems={navCampItems} />

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
                <Button onClick={() => setMapModalOpen(true)} variant="outline" size="lg">
                  <MapPin className="h-4 w-4 mr-2" />
                  See The Location
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Single-day announcement — renders once day links are live */}
      {singleDayOffer && (
        <section className="bg-accent">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
            <Badge className="bg-primary text-primary-foreground text-xs font-bold tracking-wide">
              NEW
            </Badge>
            <p className="font-semibold text-accent-foreground">
              Single-day options now available — {singleDayBannerPrice}.
            </p>
            <button
              onClick={scrollToCamps}
              className="text-sm text-accent-foreground/80 underline underline-offset-2 hover:text-accent-foreground"
            >
              Can&apos;t make all three days? Book any open day below.
            </button>
          </div>
        </section>
      )}

      {/* Camps Section */}
      <section id="camps" className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-2">Muskoka 2026 Camps</h2>
            <p className="text-muted-foreground mb-6">
              Choose from the below camps. 4 players per session.
            </p>
            
            {/* Level Filter — design's rounded pills (navy when active) */}
            <div className="flex justify-center gap-2">
              {(
                [
                  { key: "all", label: "All Levels" },
                  { key: "under3", label: "Under 3.0" },
                  { key: "3plus", label: "3.0+" },
                ] as const
              ).map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setLevelFilter(f.key)}
                  className={`inline-flex h-8 items-center justify-center whitespace-nowrap rounded-full border px-3 text-[13px] font-medium transition-colors ${
                    levelFilter === f.key
                      ? "border-transparent bg-[#124A7A] text-white"
                      : "border-[#e5e7eb] bg-transparent text-[#6b7280]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Camp groups — one block per week (a "week" = camps sharing a start
              date). Both the grouping and the heading come from the actual camp
              data, so headings always match the cards and any number of weeks
              renders. (Previously these blocks + headings were hardcoded, which
              broke as soon as the camp set changed.) */}
          {(() => {
            const visible = filterCampsByLevel(camps)
            const weeks = Array.from(new Set(visible.map((c) => c.week))).sort(
              (a, b) => a - b,
            )
            return weeks.map((week) => {
              const group = visible.filter((c) => c.week === week)
              // Heading = the group's date range without the year (e.g.
              // "July 10-12, 2026" → "July 10-12"). Derived from a real card,
              // so it can never drift from what's shown below it.
              const heading = group[0].dates.replace(/,\s*\d{4}\s*$/, "")
              return (
                <div key={week} className="mb-10 last:mb-0">
                  <h3 className="mb-3.5 text-[13px] font-semibold uppercase tracking-[0.05em] text-[#6b7280]">
                    {heading}
                  </h3>
                  {/* Design's .bp-camp-cards grid: 2 columns, 1 below 720px, top-aligned */}
                  <div className="grid grid-cols-1 items-start gap-6 min-[720px]:grid-cols-2">
                    {group.map((camp) => (
                      <CampCard key={camp.id} camp={camp} getAvailability={getAvailability} />
                    ))}
                  </div>
                </div>
              )
            })
          })()}

          {/* Booking note */}
          <p className="text-sm text-muted-foreground text-center mt-8">
            All camps are 3 consecutive days, limited to 4 players per session.
            {singleDayOffer
              ? ` Can't make all three? Single-day spots (${singleDayBannerPrice}) are open on any day with a Book button. `
              : " "}
            Sessions are held at our private indoor facility - exact address shared after booking confirmation.
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
                    src="/muskoka-photos/muskoka-facility-location.jpg"
                    alt="Muskoka facility location map - click to enlarge"
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
          <DialogTitle className="sr-only">Muskoka Facility Location</DialogTitle>
          <div className="relative">
            <img
              src="/muskoka-photos/muskoka-facility-location.jpg"
              alt="Muskoka facility location map showing area near Mactier and Lake Joseph"
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
