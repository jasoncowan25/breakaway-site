/**
 * Per-camp rollout of the in-house checkout.
 *
 * While we migrate camps off the per-camp Stripe payment links, only the slugs
 * listed here route to the in-house `/checkout/[slug]` flow. Every other camp
 * keeps its existing `book.stripe.com` payment-link button — zero change.
 *
 * To enable the new checkout for ALL camps at once, set
 * `NEXT_PUBLIC_ENABLE_BREAKAWAY_CHECKOUT=true` (overrides this list).
 *
 * Payment → camp attribution is identical for every camp: each PaymentIntent
 * carries `camp_id` in its metadata and the webhook projects it to
 * `camp_attendance.camp_id`, so the admin roster always knows which camp a
 * payment belongs to (the old links mapped 1:1; the new flow keeps that 1:1).
 */
export const NEW_CHECKOUT_SLUGS: readonly string[] = [
  "toronto-intermediate-intensive-sep-12-2026-3", // Toronto · Sep 12, 2026
  "toronto-intermediate-intensive-oct-17-2026", // Toronto · Oct 2026
]

/** True if this camp's Book button should use the in-house checkout. */
export function isNewCheckoutEnabled(slug: string | null | undefined): boolean {
  if (process.env.NEXT_PUBLIC_ENABLE_BREAKAWAY_CHECKOUT === "true") return true
  if (!slug) return false
  return NEW_CHECKOUT_SLUGS.includes(slug)
}
