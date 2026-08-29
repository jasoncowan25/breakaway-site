import assert from "node:assert/strict"
import test from "node:test"

import { resolveCheckoutOffer } from "../lib/checkout-offers.ts"

test("resolves the $480 reduced-weeks checkout for the all-levels weekly camp", () => {
  assert.deepEqual(
    resolveCheckoutOffer(
      "a828af29-f41f-42e6-a83d-86a4e40baee9",
      "reduced-weeks-480",
    ),
    {
      code: "reduced-weeks-480",
      label: "Reduced weeks",
      unitPriceCents: 48000,
    },
  )
})

test("does not display the reduced rate for another camp", () => {
  assert.equal(
    resolveCheckoutOffer("another-camp", "reduced-weeks-480"),
    null,
  )
})
