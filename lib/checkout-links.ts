/**
 * Custom checkout links — private /checkout/<code> URLs created from the
 * admin (camp_checkout_links). The API resolves a code to the link terms plus
 * the camp; this module maps that into the CheckoutOffer shape the checkout
 * page already renders for the legacy hard-coded offers.
 */
import type { CheckoutOffer } from "@/lib/checkout-offers"
import type { ApiCamp } from "./breakaway-api"

export type ApiCheckoutLinkUnavailableReason = "disabled" | "limit_reached"

export interface ApiCheckoutLink {
  code: string
  campId: string
  campSlug: string | null
  unitPriceCents: number
  sessionDates: string[]
  campSessionDates: string[]
  sessionLabel: string | null
  weekdayLabel: string | null
  scheduleNote: string | null
  maxCheckouts: number | null
  completedCheckouts: number
  countsTowardCapacity: boolean
  available: boolean
  unavailableReason: ApiCheckoutLinkUnavailableReason | null
}

const LINK_CODE_RE = /^[a-z0-9][a-z0-9-]{2,63}$/

/** Codes are short ("kw-7f3a"); anything else is a camp slug. */
export function looksLikeCheckoutLinkCode(value: string | null | undefined): boolean {
  const v = String(value ?? "").trim().toLowerCase()
  return LINK_CODE_RE.test(v) && v.length <= 24
}

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function shortDate(date: string): string {
  const m = date.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return date
  return `${MONTHS_SHORT[Number(m[2]) - 1]} ${Number(m[3])}`
}

/**
 * "Skips Oct 8, Oct 15" — the schedule note shown after the session count on
 * the checkout page. Falls back to the API's note (or nothing) when the link
 * isn't a strict subset of the camp's stored sessions.
 */
export function checkoutLinkScheduleNote(link: Pick<ApiCheckoutLink, "sessionDates" | "campSessionDates" | "scheduleNote">): string | null {
  const total = link.campSessionDates.length
  const campSet = new Set(link.campSessionDates)
  if (total === 0 || !link.sessionDates.every((d) => campSet.has(d))) return link.scheduleNote
  const included = new Set(link.sessionDates)
  const skipped = link.campSessionDates.filter((d) => !included.has(d))
  if (skipped.length === 0) return null
  return `Skips ${skipped.map(shortDate).join(", ")}`
}

/** Map an API link onto the CheckoutOffer shape the checkout page renders. */
export function checkoutOfferFromLink(link: ApiCheckoutLink, campSessionLabel: string | null): CheckoutOffer {
  return {
    code: link.code,
    label: "Custom checkout link",
    unitPriceCents: link.unitPriceCents,
    sessionDates: [...link.sessionDates],
    sessionLabel: link.sessionLabel ?? campSessionLabel ?? "",
    scheduleNote: checkoutLinkScheduleNote(link) ?? "",
  }
}

/** A private link needs seats only on the dates it includes. */
export function checkoutOfferSpotsLeft(
  camp: Pick<ApiCamp, "spotsLeft" | "capacity" | "remainingByDay" | "singleDay">,
  offer: CheckoutOffer | null,
): number {
  const fallback = camp.spotsLeft ?? camp.capacity ?? 0
  if (!offer?.sessionDates.length) return fallback
  const days = camp.remainingByDay ?? camp.singleDay?.days ?? []
  const remaining = offer.sessionDates.map(date => days.find(day => day.date === date)?.remaining)
  return remaining.every((count): count is number => count != null) ? Math.min(...remaining) : fallback
}

export function checkoutLinkUnavailableMessage(reason: ApiCheckoutLinkUnavailableReason | null): string {
  if (reason === "limit_reached") {
    return "This checkout link has reached its limit and is no longer available — contact us to register."
  }
  return "This checkout link is no longer available — contact us to register."
}
