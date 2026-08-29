import assert from "node:assert/strict"
import test from "node:test"

import { resolveCheckoutOffer } from "../lib/checkout-offers.ts"
import { formatRecurringCampDates } from "../lib/session-time.ts"

const reducedSessionDates = [
  "2026-09-14",
  "2026-09-28",
  "2026-10-05",
  "2026-10-19",
  "2026-10-26",
  "2026-11-02",
  "2026-11-09",
  "2026-11-16",
  "2026-11-23",
  "2026-11-30",
  "2026-12-07",
  "2026-12-14",
]

test("resolves the $480 reduced-weeks checkout for the all-levels weekly camp", () => {
  const offer = resolveCheckoutOffer(
    "a828af29-f41f-42e6-a83d-86a4e40baee9",
    "reduced-weeks-480",
  )
  assert.equal(offer?.code, "reduced-weeks-480")
  assert.equal(offer?.label, "Reduced weeks")
  assert.equal(offer?.unitPriceCents, 48000)
})

test("resolves the $960 reduced-weeks checkout for the experienced weekly camp", () => {
  const offer = resolveCheckoutOffer(
    "d77526f5-1e63-48bd-8d50-4ce3ebcd593a",
    "reduced-weeks-960",
  )
  assert.equal(offer?.code, "reduced-weeks-960")
  assert.equal(offer?.label, "Reduced weeks")
  assert.equal(offer?.unitPriceCents, 96000)
})

test("shows the corrected 12-week Monday schedule for the all-levels offer", () => {
  const offer = resolveCheckoutOffer(
    "a828af29-f41f-42e6-a83d-86a4e40baee9",
    "reduced-weeks-480",
  )

  assert.deepEqual(offer?.sessionDates, reducedSessionDates)
  assert.deepEqual(
    formatRecurringCampDates(offer?.sessionDates, offer?.sessionLabel),
    {
      dateLabel: "September 14 – December 14, 2026",
      scheduleLabel: "Mondays · 6:00 PM – 7:00 PM",
      sessionCountLabel: "12 weekly sessions",
    },
  )
  assert.equal(offer?.scheduleNote, "No class September 21 or October 12")
})

test("shows the corrected 12-week Monday schedule for the experienced offer", () => {
  const offer = resolveCheckoutOffer(
    "d77526f5-1e63-48bd-8d50-4ce3ebcd593a",
    "reduced-weeks-960",
  )

  assert.deepEqual(offer?.sessionDates, reducedSessionDates)
  assert.deepEqual(
    formatRecurringCampDates(offer?.sessionDates, offer?.sessionLabel),
    {
      dateLabel: "September 14 – December 14, 2026",
      scheduleLabel: "Mondays · 5:00 PM – 7:00 PM",
      sessionCountLabel: "12 weekly sessions",
    },
  )
  assert.equal(offer?.scheduleNote, "No class September 21 or October 12")
})

test("does not display the reduced rate for another camp", () => {
  assert.equal(
    resolveCheckoutOffer("another-camp", "reduced-weeks-480"),
    null,
  )
})
