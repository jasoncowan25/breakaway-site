import assert from "node:assert/strict"
import test from "node:test"

import {
  KIDS_WEEKLY_DEFAULT_PROGRAM,
  KIDS_WEEKLY_LANDING_PATH,
  KIDS_WEEKLY_PROGRAM_KEYS,
  KIDS_WEEKLY_PROGRAMS,
  buildKidsWeeklyProgram,
  canRenderKidsWeeklyLanding,
  kidsWeeklyLandingPathForCamp,
  shouldListKidsWeeklyCampAsStandalone,
} from "../lib/kids-weekly-camp.ts"

// Sep 14 2026 is a Monday; the real run skips Sep 21 and Oct 12.
const MONDAYS = [
  "2026-09-14", "2026-09-28", "2026-10-05", "2026-10-19", "2026-10-26", "2026-11-02",
  "2026-11-09", "2026-11-16", "2026-11-23", "2026-11-30", "2026-12-07", "2026-12-14",
]

function camp(overrides = {}) {
  return {
    id: "camp-1",
    slug: KIDS_WEEKLY_PROGRAMS.allLevelsThu.slug,
    title: "Kids Weekly Pickleball Camp — All Levels",
    fullLabel: "Kids Weekly Pickleball Camp — All Levels",
    startDate: "2026-09-10",
    endDate: "2026-12-17",
    basePriceCents: 60000,
    capacity: 20,
    registeredCount: 3,
    spotsLeft: 17,
    isSoldOut: false,
    sessionLabel: "5:00 PM - 6:00 PM",
    sessionDates: Array.from({ length: 15 }, (_, index) => `2026-09-${String(10 + index).padStart(2, "0")}`),
    publicVisibility: "published",
    childrenEligible: true,
    ...overrides,
  }
}

test("lists the three programs with the Monday section first and Thursdays selected by default", () => {
  assert.deepEqual(KIDS_WEEKLY_PROGRAM_KEYS, ["allLevelsMon", "allLevelsThu", "experienced"])
  assert.equal(KIDS_WEEKLY_DEFAULT_PROGRAM, "allLevelsThu")
})

test("builds the Thursday all-levels card from one camp and its 15 sessions", () => {
  const program = buildKidsWeeklyProgram("allLevelsThu", camp())

  assert.equal(program.checkoutHref, "/checkout/toronto-kids-weekly-all-levels-sep-10-2026")
  assert.equal(program.priceLabel, "$600 CAD")
  assert.equal(program.spotsLabel, "20 spots")
  assert.equal(program.sessionsLabel, "15 one-hour sessions")
  assert.equal(program.eyebrow, "Thursdays · 15 Weeks")
  assert.equal(program.day, "Thursdays")
  assert.equal(program.timeLabel, "5:00 PM – 6:00 PM")
  assert.equal(program.durationBadge, "1-hour sessions")
  assert.equal(program.badge, null)
  assert.equal(program.ctaLabel, "Book Thursdays")
  assert.equal(program.ctaDisabled, false)
  assert.deepEqual(program.includes.slice(0, 3), [
    "Thursdays · 5:00 PM – 6:00 PM",
    "September 10 – September 24, 2026",
    "15 one-hour sessions",
  ])
})

test("builds the new Monday all-levels card with its Just Added badge", () => {
  const program = buildKidsWeeklyProgram("allLevelsMon", camp({
    slug: KIDS_WEEKLY_PROGRAMS.allLevelsMon.slug,
    basePriceCents: 48000,
    sessionLabel: "6:00 PM - 7:00 PM",
    sessionDates: MONDAYS,
  }))

  assert.equal(program.checkoutHref, "/checkout/toronto-kids-weekly-all-levels-mondays-sep-14-2026")
  assert.equal(program.priceLabel, "$480 CAD")
  assert.equal(program.badge, "Just Added")
  assert.equal(program.eyebrow, "Mondays · 12 Weeks")
  assert.equal(program.sessionsLabel, "12 one-hour sessions")
  assert.equal(program.weeksLabel, "12 weeks")
  assert.equal(program.dateLabel, "September 14 – December 14, 2026")
  assert.equal(program.ctaLabel, "Book Mondays")
  assert.equal(program.whoFor, "Brand new, or playing under a year")
})

test("builds experienced program duration copy from its live 12-session schedule", () => {
  const program = buildKidsWeeklyProgram("experienced", camp({
    slug: KIDS_WEEKLY_PROGRAMS.experienced.slug,
    basePriceCents: 96000,
    capacity: 10,
    spotsLeft: 9,
    sessionLabel: "5:00 PM - 7:00 PM",
    sessionDates: MONDAYS,
  }))

  assert.equal(program.priceLabel, "$960 CAD")
  assert.equal(program.spotsLabel, "10 spots")
  assert.equal(program.sessionCount, 12)
  assert.equal(program.sessionsLabel, "12 two-hour sessions")
  assert.equal(program.durationBadge, "2-hour sessions")
  assert.equal(program.ctaLabel, "Book Experienced")
  assert.equal(program.includes.at(-1), "Capped at 10 players for more court time")
})

test("falls back to the configured weekday when the camp is missing", () => {
  const program = buildKidsWeeklyProgram("allLevelsMon", null)
  assert.equal(program.day, "Mondays")
  assert.equal(program.eyebrow, "Mondays")
  assert.equal(program.ctaLabel, "Registration unavailable")
  assert.equal(program.ctaDisabled, true)
})

test("disables only the missing or sold-out program", () => {
  assert.equal(buildKidsWeeklyProgram("experienced", null).ctaDisabled, true)
  assert.equal(buildKidsWeeklyProgram("allLevelsThu", camp({ spotsLeft: 0, isSoldOut: true })).ctaLabel, "Sold out")
})

test("the public route requires at least one published child camp unless previewing", () => {
  assert.equal(canRenderKidsWeeklyLanding([null, camp(), null], false), true)
  assert.equal(canRenderKidsWeeklyLanding([null, camp({ publicVisibility: "unpublished" }), null], false), false)
  assert.equal(canRenderKidsWeeklyLanding([null, camp({ publicVisibility: "unpublished" }), null], true), true)
  assert.equal(canRenderKidsWeeklyLanding([null, null, null], true), false)
})

test("routes all three weekly child camps to the single public landing page", () => {
  for (const key of KIDS_WEEKLY_PROGRAM_KEYS) {
    assert.equal(kidsWeeklyLandingPathForCamp(KIDS_WEEKLY_PROGRAMS[key].slug), KIDS_WEEKLY_LANDING_PATH)
  }
  assert.equal(kidsWeeklyLandingPathForCamp("toronto-intermediate-intensive"), null)
})

test("keeps weekly child camps out of standalone camp listings", () => {
  for (const key of KIDS_WEEKLY_PROGRAM_KEYS) {
    assert.equal(shouldListKidsWeeklyCampAsStandalone(KIDS_WEEKLY_PROGRAMS[key].slug), false)
  }
  assert.equal(shouldListKidsWeeklyCampAsStandalone("toronto-intermediate-intensive"), true)
})
