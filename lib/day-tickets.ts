import type { ApiCampSingleDay } from "./breakaway-api"

export function dayTicketCheckoutHref(slug: string, date: string): string {
  return `/checkout/${encodeURIComponent(slug)}?day=${encodeURIComponent(date)}`
}

export function checkoutDayTicket(offer: ApiCampSingleDay | null | undefined, date: string) {
  const day = offer?.days.find(day => day.date === date)
  const priceCents = day?.priceCents ?? offer?.priceCents
  if (!day?.available || priceCents == null || !Number.isSafeInteger(priceCents) || priceCents <= 0) return null
  return { ...day, priceCents }
}

export function dayTicketBadge(offer: ApiCampSingleDay | null | undefined): string | null {
  return offer && offer.days.length > 1 ? `1 or ${offer.days.length} Days` : null
}

export function dayTicketStartingPrice(offer: ApiCampSingleDay | null | undefined): number | null {
  if (!offer) return null
  const available = offer.days.filter(day => day.available)
  const prices = (available.length ? available : offer.days)
    .map(day => day.priceCents ?? offer.priceCents)
    .filter((price): price is number => typeof price === "number" && price > 0)
  return prices.length ? Math.min(...prices) : null
}

export function ticketMoney(cents: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency", currency: "CAD", maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100)
}
