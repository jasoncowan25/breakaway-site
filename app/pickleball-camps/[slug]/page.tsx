import { notFound } from "next/navigation"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Eye,
  Quote,
  Target,
  Move,
  Send,
  TrendingUp,
  Shield,
  Compass,
  Award,
  UtensilsCrossed,
  MessageSquare,
  Trophy,
} from "lucide-react"

import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getPublicCampBySlug, getPublishedPublicCampNavItems, publicBadgeText } from "@/lib/public-camps"
import { fetchPublicCampShots, type ApiShotFamily } from "@/lib/breakaway-api"

// Fixed family → icon map (migration 0076). Every shot inherits its family's
// icon — no per-shot icons.
const familyIcons: Record<ApiShotFamily, typeof Target> = {
  shots: Target,
  defense: Shield,
  strategy_positioning: Compass,
}

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ preview?: string }>
}

function canPreview(token: string | undefined) {
  if (!token) return false
  if (process.env.NODE_ENV !== "production" && token === "local") return true
  return Boolean(process.env.PUBLIC_CAMP_PREVIEW_TOKEN && token === process.env.PUBLIC_CAMP_PREVIEW_TOKEN)
}

export default async function DynamicCampPage({ params, searchParams }: PageProps) {
  const [{ slug }, query] = await Promise.all([
    params,
    searchParams ?? Promise.resolve({} as { preview?: string }),
  ])
  const preview = canPreview(query.preview)
  const [camp, navCampItems, campShots] = await Promise.all([
    getPublicCampBySlug(slug, { preview }),
    getPublishedPublicCampNavItems(),
    fetchPublicCampShots(slug, { preview }),
  ])

  if (!camp) notFound()

  const badgeText = publicBadgeText(camp.badge)
  const venuePhotos = camp.facility?.photos.length ? camp.facility.photos : [camp.heroImageUrl]
  const moduleIcons = [Target, Send, Move, TrendingUp]
  const showSpotsLeft = camp.capacity < 8
  const availabilityLabel = showSpotsLeft
    ? `Only ${camp.spotsLeft} ${camp.spotsLeft === 1 ? "spot" : "spots"}`
    : `Only ${camp.capacity} spots`
  const newCheckoutEnabled = process.env.NEXT_PUBLIC_ENABLE_BREAKAWAY_CHECKOUT === "true"
  const checkoutHref = newCheckoutEnabled ? camp.checkoutPath ?? camp.checkoutUrl : camp.checkoutUrl
  const checkoutIsExternal = Boolean(checkoutHref && /^https?:\/\//i.test(checkoutHref))

  return (
    <div className="min-h-screen bg-background">
      <Navigation campItems={navCampItems} />

      {preview && (
        <div className="border-b bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <div className="mx-auto flex max-w-7xl items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview mode · {camp.visibility}
          </div>
        </div>
      )}

      <section className="relative h-[500px] overflow-hidden bg-gradient-to-br from-primary to-primary/80 md:h-[400px]">
        <img
          src={camp.heroImageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8">
          <div className="mx-auto max-w-7xl">
            {badgeText && (
              <Badge className="mb-4 bg-accent text-accent-foreground hover:bg-accent">
                {badgeText}
              </Badge>
            )}
            <h1 className="mb-2 text-4xl font-bold text-white md:text-5xl">
              {camp.title}
            </h1>
            <p className="max-w-3xl text-xl text-white/90">
              {camp.subtitle}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-white/80">
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {camp.dateLabel}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {camp.schedule.dailyTimeLabel}
              </span>
              {camp.schedule.lunchBreakLabel ? (
                <span className="inline-flex items-center gap-2">
                  <UtensilsCrossed className="h-4 w-4" />
                  Lunch {camp.schedule.lunchBreakLabel}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {camp.venue}
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:px-8 lg:pt-14">
        <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-10 md:space-y-12">
          <section>
            <h2 className="mb-6 text-3xl font-bold text-primary">What You&apos;ll Master</h2>
            <p className="mb-6 max-w-3xl leading-relaxed text-muted-foreground">
              {camp.modulesIntro}
            </p>
            {campShots.length > 0 ? (
              <div className="rounded-2xl border border-border p-5">
                <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                  {campShots.map((shot) => {
                    const Icon = familyIcons[shot.family] ?? Target
                    return (
                      <div
                        key={shot.id}
                        className="flex items-center gap-3.5 rounded-xl border border-border bg-card p-4"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10">
                          <Icon className="h-[22px] w-[22px] text-[#6EA626]" />
                        </div>
                        <div className="font-semibold text-primary">{shot.title}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {camp.modules.map((module, index) => {
                  const Icon = moduleIcons[index] ?? Target
                  return (
                  <div key={module.id} className="flex gap-4 rounded-lg border border-border bg-card p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-primary">{module.name}</div>
                      <div className="text-sm leading-6 text-muted-foreground">{module.publicBullet}</div>
                    </div>
                  </div>
                  )
                })}
              </div>
            )}
          </section>

          {camp.schedule.days.length > 0 ? (
            <section>
              <h2 className="mb-6 text-3xl font-bold text-primary">Daily Schedule</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {camp.schedule.days.map((day) => (
                  <div key={day.dateLabel} className="rounded-lg border border-border bg-card p-4">
                    <div className="font-semibold text-primary">{day.dateLabel}</div>
                    <div className="mt-3 grid gap-3 text-sm text-muted-foreground">
                      <div>
                        <div>Start</div>
                        <div className="font-medium text-foreground">{day.startTime}</div>
                      </div>
                      <div>
                        <div>Finish</div>
                        <div className="font-medium text-foreground">{day.endTime}</div>
                      </div>
                      {day.lunchBreakLabel ? (
                        <div className="border-t border-border pt-3">
                          <div>Lunch</div>
                          <div className="font-medium text-foreground">{day.lunchBreakLabel}</div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {camp.coach && (
            <section>
              <h2 className="mb-6 text-3xl font-bold text-primary">Meet Your Coach</h2>
              <Card className="p-6">
                <div className="flex flex-col gap-6 md:flex-row">
                  <div className="flex h-48 w-48 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary to-accent text-5xl font-bold text-white">
                    {camp.coach.imageUrl ? (
                      <img src={camp.coach.imageUrl} alt={camp.coach.name} className="h-full w-full object-cover" />
                    ) : (
                      camp.coach.initials
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-bold text-primary">{camp.coach.name}</h3>
                      {camp.coach.duprRating ? (
                        <Badge variant="secondary" className="gap-1.5 text-xs font-semibold">
                          <Trophy className="h-3.5 w-3.5" />
                          Lead pro · DUPR {camp.coach.duprRating.toFixed(2)}
                        </Badge>
                      ) : null}
                    </div>
                    <p className="leading-relaxed text-muted-foreground">
                      {camp.coach.bio || "Your Breakaway coach will lead the group through clear patterns, coached reps, and practical feedback you can use immediately."}
                    </p>
                  </div>
                </div>
              </Card>
            </section>
          )}

          <section>
            <h2 className="mb-6 text-3xl font-bold text-primary">The Venue</h2>
            <p className="mb-6 max-w-3xl leading-relaxed text-muted-foreground">
              {camp.facility?.notes || `${camp.venue} gives the group a focused court environment for coached reps and match-play feedback.`}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {venuePhotos.slice(0, 4).map((photo, index) => (
                <div key={`${photo}-${index}`} className="relative h-64 overflow-hidden rounded-lg">
                  <img
                    src={photo}
                    alt={`Venue photo ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <span>{camp.venue}</span>
            </div>
          </section>

          {camp.testimonials.length > 0 && (
            <section>
              <h2 className="mb-6 text-3xl font-bold text-primary">From the Court</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {camp.testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="relative p-6">
                    <Quote className="absolute left-6 top-6 h-8 w-8 text-accent opacity-20" />
                    <div className="relative">
                      <p className="mb-6 text-lg leading-relaxed text-foreground">“{testimonial.quote}”</p>
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-950 to-lime-400" />
                        <div>
                          <p className="text-sm font-semibold text-primary">{testimonial.name}</p>
                          {testimonial.detail ? <p className="text-xs text-muted-foreground">{testimonial.detail}</p> : null}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="hidden w-80 shrink-0 lg:block">
          <div className="sticky top-24">
          <Card className="border-2 border-primary/20 p-6">
            <div className="space-y-4">
              <div>
                <div className="mb-1 text-3xl font-bold text-primary">{camp.priceLabel}</div>
                <div className="text-sm text-muted-foreground">Per player</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{camp.dateLabel}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{camp.schedule.dailyTimeLabel}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{camp.venue}</span>
                </div>
              </div>

              {camp.schedule.days.length > 0 ? (
                <div className="rounded-lg border border-border bg-muted/20 p-3">
                  <div className="mb-2 text-sm font-semibold text-primary">Daily schedule</div>
                  <div className="space-y-2">
                    {camp.schedule.days.map((day) => (
                      <div key={day.dateLabel} className="text-sm">
                        <div className="font-medium text-foreground">{day.dateLabel}</div>
                        <div className="mt-0.5 text-muted-foreground">
                          Start {day.startTime} · Finish {day.endTime}
                        </div>
                        {day.lunchBreakLabel ? (
                          <div className="mt-0.5 text-muted-foreground">
                            Lunch {day.lunchBreakLabel}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {showSpotsLeft ? (
                <div className="rounded-lg bg-accent/10 p-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                      <Users className="h-4 w-4 text-accent-foreground" />
                      Spots left
                    </span>
                    <span className="text-2xl font-bold text-primary">{camp.spotsLeft}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{
                        width: `${Math.min(100, Math.round((camp.registeredCount / Math.max(1, camp.capacity)) * 100))}%`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {camp.registeredCount} of {camp.capacity} spots claimed.
                  </p>
                </div>
              ) : !camp.isSoldOut ? (
                <div className="rounded-lg bg-accent/10 p-3">
                  <p className="text-sm font-semibold text-accent-foreground">
                    {availabilityLabel}
                  </p>
                </div>
              ) : null}

              {camp.isSoldOut ? (
                <Button disabled className="w-full py-6 text-lg">
                  Sold out
                </Button>
              ) : checkoutHref ? (
                <Button asChild className="w-full bg-primary py-6 text-lg text-white hover:bg-primary/90">
                  <a
                    href={checkoutHref}
                    target={checkoutIsExternal ? "_blank" : undefined}
                    rel={checkoutIsExternal ? "noopener noreferrer" : undefined}
                  >
                    Book Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <Button disabled className="w-full py-6 text-lg">
                  Checkout coming soon
                </Button>
              )}

              <div className="space-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
                {camp.lunchType === "catered" ? (
                  <div className="flex items-center gap-2 font-medium">
                    <UtensilsCrossed className="h-4 w-4" />
                    <span>Catered Lunch Included</span>
                  </div>
                ) : camp.lunchType === "byo" ? (
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="h-4 w-4" />
                    <span>Bring your own lunch</span>
                  </div>
                ) : null}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{camp.capacity >= 8 ? "4:1 small group instruction" : `${camp.capacity}-player cap`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Scrimmage sessions with coaching feedback</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>Prizes & giveaways</span>
                </div>
              </div>
            </div>
          </Card>
          </div>
        </aside>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white p-4 shadow-lg lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-bold text-primary">{camp.priceLabel}</div>
            <div className="text-xs font-semibold text-accent-foreground">
              {camp.isSoldOut
                ? "Sold out"
                : availabilityLabel}
            </div>
          </div>
          {camp.isSoldOut || !checkoutHref ? (
            <Button disabled className="px-8">
              {camp.isSoldOut ? "Sold out" : "Coming soon"}
            </Button>
          ) : (
            <Button asChild className="bg-primary px-8 text-white hover:bg-primary/90">
              <a
                href={checkoutHref}
                target={checkoutIsExternal ? "_blank" : undefined}
                rel={checkoutIsExternal ? "noopener noreferrer" : undefined}
              >
                Book Now
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="h-20 lg:hidden" />

      <Footer hideNotifySignup={true} />
    </div>
  )
}
