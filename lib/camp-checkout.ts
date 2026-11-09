/**
 * Where a camp page's full-camp "Book Now" button sends players.
 *
 * Every camp on the shared camp template books through the in-house branded
 * checkout at `/checkout/<slug>` (single-day tickets already do). This
 * replaces the per-slug rollout list that kept new camps on their Stripe
 * payment links until someone remembered to add them.
 *
 * The Stripe payment link is only a fallback for a camp with no price set:
 * the in-house checkout charges the camp's base price and refuses an unpriced
 * camp, while a payment link carries its own price.
 *
 * Payment → camp attribution is unchanged: each PaymentIntent carries
 * `camp_id` in its metadata and the webhook projects it to
 * `camp_attendance.camp_id`, so the admin roster knows which camp it is for.
 */
export function campCheckoutHref(camp: {
  checkoutPath: string | null
  checkoutUrl: string | null
  priceCents?: number | null
}): string | null {
  const unpriced = camp.priceCents !== undefined && !(Number(camp.priceCents) > 0)
  return (unpriced ? null : camp.checkoutPath) ?? camp.checkoutUrl
}
