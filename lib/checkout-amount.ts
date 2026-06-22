/**
 * HST math for the checkout summary. Mirrors `computeCheckoutAmount` in the API
 * (apps/api/lib/checkout/payment-intent.ts) EXACTLY — rounding on cents — so the
 * total shown here always equals the amount the PaymentIntent charges.
 *
 * Ontario HST, applied tax-exclusive (added on top) to the in-person Canadian
 * camps the in-house checkout serves today.
 */
export const HST_RATE = 0.13

export interface CheckoutAmount {
  /** Pre-tax subtotal in dollars. */
  subtotal: number
  /** HST in dollars. */
  tax: number
  /** Subtotal + HST in dollars (what the card is charged). */
  total: number
}

/** subtotal (dollars) → { subtotal, tax, total } with 13% HST, cent-accurate. */
export function checkoutAmount(subtotal: number): CheckoutAmount {
  const subtotalCents = Math.round(subtotal * 100)
  const taxCents = Math.round(subtotalCents * HST_RATE)
  return {
    subtotal: subtotalCents / 100,
    tax: taxCents / 100,
    total: (subtotalCents + taxCents) / 100,
  }
}
