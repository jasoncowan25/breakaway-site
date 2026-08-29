type CheckoutPaymentQuote = {
  expectedTotalCents: number
  amountTotalCents: unknown
  currency: unknown
}

const TOTAL_CHANGED_MESSAGE =
  "The payment total changed. Refresh this page before continuing."

/**
 * Fail closed if the server-authoritative PaymentIntent does not match the
 * total and currency displayed immediately before payment.
 */
export function checkoutPaymentQuoteError({
  expectedTotalCents,
  amountTotalCents,
  currency,
}: CheckoutPaymentQuote): string | null {
  if (
    !Number.isSafeInteger(expectedTotalCents) ||
    !Number.isSafeInteger(amountTotalCents) ||
    amountTotalCents !== expectedTotalCents ||
    typeof currency !== "string" ||
    currency.toLowerCase() !== "cad"
  ) {
    return TOTAL_CHANGED_MESSAGE
  }

  return null
}
