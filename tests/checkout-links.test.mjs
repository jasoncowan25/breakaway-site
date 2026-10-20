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

test("one-session custom checkout shows only its purchased date and fixed price", async () => {
  const { formatCheckoutCampSchedule } = await import('../lib/session-time.ts')
  const offer = checkoutOfferFromLink(link({
    code: 'tii-6bhi', unitPriceCents: 30000,
    sessionDates: ['2026-10-25'], campSessionDates: ['2026-10-24', '2026-10-25'],
    sessionLabel: '09:00 - 15:00',
  }), '09:00 - 15:00')
  const schedule = formatCheckoutCampSchedule({
    startDate: '2026-10-24', endDate: '2026-10-25',
    sessionDates: offer.sessionDates, sessionLabel: offer.sessionLabel, scheduleNote: offer.scheduleNote,
  })
  assert.equal(offer.unitPriceCents, 30000)
  assert.deepEqual(schedule, {
    dateLabel: 'October 25, 2026', timeLabel: '9:00 AM – 3:00 PM · Skips Oct 24', isRecurring: false,
  })
})

test("multi-day custom links keep their dates without being labelled weekly", async () => {
  const { formatCheckoutCampSchedule } = await import('../lib/session-time.ts')
  const schedule = formatCheckoutCampSchedule({
    startDate: '2026-10-24', endDate: '2026-10-25',
    sessionDates: ['2026-10-24', '2026-10-25'], sessionLabel: '09:00 - 15:00',
  })
  assert.equal(schedule.dateLabel, 'October 24-25, 2026')
  assert.equal(schedule.timeLabel, '9:00 AM – 3:00 PM')
  assert.equal(schedule.isRecurring, false)
})

test("weekly custom links retain their session count and skip notes", async () => {
  const { formatCheckoutCampSchedule } = await import('../lib/session-time.ts')
  const offer = checkoutOfferFromLink(link(), '5:00 PM – 6:00 PM')
  const schedule = formatCheckoutCampSchedule({
    startDate: THURSDAYS[0], endDate: THURSDAYS.at(-1),
    sessionDates: offer.sessionDates, sessionLabel: offer.sessionLabel, scheduleNote: offer.scheduleNote,
  })
  assert.equal(schedule.isRecurring, true)
  assert.equal(schedule.timeLabel, 'Thursdays · 5:00 PM – 6:00 PM · 13 weekly sessions · Skips Oct 8, Oct 15')
})

test("a one-day custom link remains bookable when only the other day is full", async () => {
  const { checkoutOfferSpotsLeft } = await import('../lib/checkout-links.ts')
  const camp = { capacity: 16, spotsLeft: 0, singleDay: null, remainingByDay: [
    { date: '2026-10-24', remaining: 0 }, { date: '2026-10-25', remaining: 3 },
  ] }
  const offer = checkoutOfferFromLink(link({ sessionDates: ['2026-10-25'] }), null)
  assert.equal(checkoutOfferSpotsLeft(camp, offer), 3)
  assert.equal(checkoutOfferSpotsLeft(camp, { ...offer, sessionDates: ['2026-10-24', '2026-10-25'] }), 0)
  assert.equal(checkoutOfferSpotsLeft(camp, null), 0)
})
