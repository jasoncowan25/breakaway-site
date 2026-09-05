import assert from "node:assert/strict"
import test from "node:test"

import {
  checkoutLinkScheduleNote,
  checkoutLinkUnavailableMessage,
  checkoutOfferFromLink,
  looksLikeCheckoutLinkCode,
} from "../lib/checkout-links.ts"
import { formatRecurringCampDates } from "../lib/session-time.ts"

const THURSDAYS = [
  "2026-09-10", "2026-09-17", "2026-09-24", "2026-10-01", "2026-10-08",
  "2026-10-15", "2026-10-22", "2026-10-29", "2026-11-05", "2026-11-12",
  "2026-11-19", "2026-11-26", "2026-12-03", "2026-12-10", "2026-12-17",
]
const LINK_DATES = THURSDAYS.filter((d) => d !== "2026-10-08" && d !== "2026-10-15")

function link(overrides = {}) {
  return {
    code: "kw-7f3a",
    campId: "camp_1",
    campSlug: "toronto-kids-weekly-all-levels-sep-10-2026",
    unitPriceCents: 52000,
    sessionDates: LINK_DATES,
    campSessionDates: THURSDAYS,
    sessionLabel: "5:00 PM – 6:00 PM",
    weekdayLabel: "Thursdays",
    scheduleNote: "Skips Oct 8, Oct 15",
    maxCheckouts: null,
    completedCheckouts: 0,
    countsTowardCapacity: true,
    available: true,
    unavailableReason: null,
    ...overrides,
  }
}

test("only short codes are treated as custom checkout links", () => {
  assert.equal(looksLikeCheckoutLinkCode("kw-7f3a"), true)
  assert.equal(looksLikeCheckoutLinkCode("KW-7F3A"), true)
  assert.equal(looksLikeCheckoutLinkCode("toronto-kids-weekly-all-levels-sep-10-2026"), false)
  assert.equal(looksLikeCheckoutLinkCode("ab"), false)
  assert.equal(looksLikeCheckoutLinkCode(""), false)
})

test("describes the sessions a link skips against the camp schedule", () => {
  assert.equal(checkoutLinkScheduleNote(link()), "Skips Oct 8, Oct 15")
  assert.equal(checkoutLinkScheduleNote(link({ sessionDates: THURSDAYS })), null)
  // Dates outside the stored schedule fall back to the API's own note.
  assert.equal(
    checkoutLinkScheduleNote(link({ sessionDates: ["2026-09-14"], scheduleNote: "Mondays only" })),
    "Mondays only",
  )
})

test("maps a link onto the checkout offer the page renders", () => {
  const offer = checkoutOfferFromLink(link(), "5:00 PM – 6:00 PM")
  assert.equal(offer.code, "kw-7f3a")
  assert.equal(offer.unitPriceCents, 52000)
  assert.deepEqual(offer.sessionDates, LINK_DATES)
  assert.equal(offer.scheduleNote, "Skips Oct 8, Oct 15")
  assert.deepEqual(formatRecurringCampDates(offer.sessionDates, offer.sessionLabel), {
    dateLabel: "September 10 – December 17, 2026",
    scheduleLabel: "Thursdays · 5:00 PM – 6:00 PM",
    sessionCountLabel: "13 weekly sessions",
  })
})

test("falls back to the camp time window when the link has none", () => {
  const offer = checkoutOfferFromLink(link({ sessionLabel: null }), "6:00 PM – 7:00 PM")
  assert.equal(offer.sessionLabel, "6:00 PM – 7:00 PM")
})

test("explains why a closed link can't be used", () => {
  assert.match(checkoutLinkUnavailableMessage("limit_reached"), /reached its limit/)
  assert.match(checkoutLinkUnavailableMessage("disabled"), /no longer available/)
  assert.match(checkoutLinkUnavailableMessage(null), /contact us to register/)
})
