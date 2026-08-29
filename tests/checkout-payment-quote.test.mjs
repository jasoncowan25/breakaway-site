import assert from "node:assert/strict"
import test from "node:test"

import { checkoutPaymentQuoteError } from "../lib/checkout-payment-quote.ts"

test("accepts the exact checkout total returned in CAD", () => {
  assert.equal(
    checkoutPaymentQuoteError({
      expectedTotalCents: 54240,
      amountTotalCents: 54240,
      currency: "cad",
    }),
    null,
  )
})

test("rejects an API total that does not match the displayed checkout", () => {
  assert.match(
    checkoutPaymentQuoteError({
      expectedTotalCents: 54240,
      amountTotalCents: 67800,
      currency: "cad",
    }) ?? "",
    /total changed/i,
  )
})

test("rejects a checkout response in another currency", () => {
  assert.match(
    checkoutPaymentQuoteError({
      expectedTotalCents: 54240,
      amountTotalCents: 54240,
      currency: "usd",
    }) ?? "",
    /total changed/i,
  )
})
