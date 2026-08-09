import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const source = readFileSync(new URL("../components/checkout/CheckoutView.tsx", import.meta.url), "utf8")
const checkoutPageSource = readFileSync(new URL("../app/checkout/[slug]/page.tsx", import.meta.url), "utf8")

test("kids checkout links to the under-18 waiver", () => {
  assert.match(source, /waiver-u18/)
})

test("kids checkout uses weekly-program trust copy instead of all-day camp copy", () => {
  assert.doesNotMatch(source, /eyes on every camper, all day/i)
  assert.doesNotMatch(source, /15-session schedule/i)
  assert.match(source, /weekly program/i)
  assert.match(source, /complete\s+weekly schedule/i)
})

test("experienced kids camps are labelled Experienced in checkout", () => {
  assert.match(checkoutPageSource, /text\.includes\("experienced"\).*return "Experienced"/s)
})
