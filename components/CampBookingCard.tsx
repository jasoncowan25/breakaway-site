"use client"

import { useId, useState } from "react"
import { ArrowRight, Award, Calendar, Clock, MapPin, MessageSquare, Users, UtensilsCrossed } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ticketMoney } from "@/lib/day-tickets"
import type { PublicCamp } from "@/lib/public-camps"

type Props = {
  camp: Pick<PublicCamp, "priceLabel" | "priceCents" | "singleDay" | "isSoldOut" | "spotsLeft" |
    "capacity" | "dateLabel" | "venue" | "schedule" | "lunchType">
  fullCheckoutHref: string | null
}

export function CampBookingCard({ camp, fullCheckoutHref }: Props) {
  const group = useId()
  const offer = camp.singleDay
  const options = [
    ...(offer?.days ?? []).map(day => ({
      id: day.date,
      label: new Intl.DateTimeFormat("en-CA", { weekday: "long", month: "short", day: "numeric", timeZone: "UTC" })
        .format(new Date(`${day.date}T12:00:00Z`)),
      price: day.priceCents ?? offer?.priceCents ?? null,
      available: day.available && Boolean(day.checkoutUrl),
      href: day.checkoutUrl,
      remaining: day.remaining,
    })),
    { id: "full", label: offer?.days.length === 2 ? "Both days" : "Full camp",
      price: camp.priceCents ?? null, available: !camp.isSoldOut && Boolean(fullCheckoutHref),
      href: fullCheckoutHref, remaining: camp.spotsLeft },
  ]
  const [selection, setSelection] = useState(
    options.find(option => option.id === "full" && option.available)?.id ??
    options.find(option => option.available)?.id ?? "full",
  )
  const selected = options.find(option => option.id === selection) ?? options[options.length - 1]
  const total = selected.price != null ? `${ticketMoney(selected.price)} CAD` : camp.priceLabel
  const anyAvailable = options.some(option => option.available)
  const external = Boolean(selected.href && /^https?:\/\//i.test(selected.href))
  const book = (compact = false) => selected.available && selected.href ? (
    <Button asChild className={compact ? "shrink-0 bg-primary px-6 text-white" : "w-full bg-primary py-6 text-lg text-white hover:bg-primary/90"}>
      <a href={selected.href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
        Book Now <ArrowRight className="ml-2 h-4 w-4" />
      </a>
    </Button>
  ) : (
    <Button disabled className={compact ? "shrink-0 px-6" : "w-full py-6 text-lg"}>
      {selected.remaining === 0 ? "Sold out" : "Currently unavailable"}
    </Button>
  )

  return (
    <>
      <Card id="camp-booking" className="scroll-mt-24 border-2 border-primary/20 p-6">
        <div className="space-y-5">
          {offer ? (
            <fieldset className="space-y-3">
              <legend className="mb-3 text-xl font-semibold text-primary">Choose your days</legend>
              {options.map(option => (
                <label key={option.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${selection === option.id ? "border-primary bg-primary/5" : "border-border"} ${!option.available ? "cursor-not-allowed opacity-60" : "hover:border-primary/60"}`}>
                  <input type="radio" name={group} value={option.id} checked={selection === option.id}
                    onChange={() => setSelection(option.id)} disabled={!option.available}
                    className="h-4 w-4 shrink-0 accent-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{option.label}</span>
                    {!option.available && <span className="text-xs text-muted-foreground">{option.remaining === 0 ? "Sold out" : "Currently unavailable"}</span>}
                  </span>
                  {option.price != null && <span className="shrink-0 font-semibold tabular-nums">{ticketMoney(option.price)}</span>}
                </label>
              ))}
            </fieldset>
          ) : null}
          <div className={offer ? "flex flex-wrap items-baseline justify-between gap-2 border-t pt-4" : ""} aria-live="polite" aria-atomic="true">
            {offer && <span className="text-sm text-muted-foreground">Total per player</span>}
            <div className={`${offer ? "text-2xl" : "text-3xl"} font-bold text-primary`}>{total}</div>
            {!offer && <div className="mt-1 text-sm text-muted-foreground">Per player</div>}
          </div>
          <div className="space-y-3 text-sm">
            {!offer && <div className="flex items-center gap-2"><Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />{camp.dateLabel}</div>}
            <div className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0 text-muted-foreground" />{camp.schedule.dailyTimeLabel}</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />{camp.venue}</div>
            <div className="flex items-center gap-2"><Users className="h-4 w-4 shrink-0 text-muted-foreground" />Maximum {camp.capacity} players{offer ? " per day" : ""}</div>
          </div>
          {anyAvailable && camp.capacity < 8 && selected.remaining != null && (
            <p className="rounded-lg bg-accent/10 p-3 text-sm font-medium">Only {selected.remaining} {selected.remaining === 1 ? "spot" : "spots"} left</p>
          )}
          {book()}
          <div className="space-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
            {camp.lunchType && <div className="flex items-center gap-2"><UtensilsCrossed className="h-4 w-4 shrink-0" />{camp.lunchType === "catered" ? "Catered lunch included" : "Bring your own lunch"}</div>}
            <div className="flex items-center gap-2"><Users className="h-4 w-4 shrink-0" />{camp.capacity >= 8 ? "4:1 small group instruction" : `${camp.capacity}-player cap`}</div>
            <div className="flex items-center gap-2"><MessageSquare className="h-4 w-4 shrink-0" />Scrimmage sessions with coaching feedback</div>
            <div className="flex items-center gap-2"><Award className="h-4 w-4 shrink-0" />Prizes &amp; giveaways</div>
          </div>
        </div>
      </Card>
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white p-4 shadow-lg lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <a href="#camp-booking" className="min-w-0">
            <div className="text-xl font-bold text-primary">{total}</div>
            <div className="text-xs text-muted-foreground">{offer ? selected.label : "Per player"}{offer ? " · Change days" : ""}</div>
          </a>
          {book(true)}
        </div>
      </div>
    </>
  )
}
