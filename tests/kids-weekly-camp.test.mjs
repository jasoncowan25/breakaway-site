import assert from "node:assert/strict"
import test from "node:test"

import {
  KIDS_WEEKLY_LANDING_PATH,
  KIDS_WEEKLY_PROGRAMS,
  buildKidsWeeklyProgram,
  canRenderKidsWeeklyLanding,
  kidsWeeklyLandingPathForCamp,
  kidsWeeklyWeeksLabel,
  shouldListKidsWeeklyCampAsStandalone,
} from "../lib/kids-weekly-camp.ts"

function camp(overrides = {}) {
  return {
    id: "camp-1",
    slug: KIDS_WEEKLY_PROGRAMS.allLevels.slug,
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

test("builds a live all-levels program card from one camp and its 15 sessions", () => {
  const program = buildKidsWeeklyProgram("allLevels", camp())

  assert.equal(program.checkoutHref, "/checkout/toronto-kids-weekly-all-levels-sep-10-2026")
  assert.equal(program.priceLabel, "$600 CAD")
  assert.equal(program.spotsLabel, "17 spots left")
  assert.equal(program.sessionsLabel, "15 one-hour sessions")
  assert.equal(program.ctaDisabled, false)
})

test("reads week counts off session_dates instead of assuming 15", () => {
  const experienced = buildKidsWeeklyProgram(
    "experienced",
    camp({
      slug: KIDS_WEEKLY_PROGRAMS.experienced.slug,
      basePriceCents: 112000,
      sessionDates: Array.from({ length: 14 }, (_, index) => `2026-09-${String(7 + index).padStart(2, "0")}`),
    }),
  )

  assert.equal(experienced.priceLabel, "$1,120 CAD")
  assert.equal(experienced.sessionCount, 14)
  assert.equal(experienced.weeksLabel, "14 weeks")
  assert.equal(experienced.sessionsLabel, "14 two-hour sessions")
})

test("shared copy widens to a range when the two programs run different weeks", () => {
  const allLevels = buildKidsWeeklyProgram("allLevels", camp())
  const experienced = buildKidsWeeklyProgram(
    "experienced",
    camp({ sessionDates: Array.from({ length: 14 }, (_, index) => `2026-09-${String(7 + index).padStart(2, "0")}`) }),
  )

  assert.equal(kidsWeeklyWeeksLabel(allLevels, experienced), "14–15")
  assert.equal(kidsWeeklyWeeksLabel(allLevels, allLevels), "15")
  assert.equal(kidsWeeklyWeeksLabel(allLevels, buildKidsWeeklyProgram("experienced", null)), "15")
  assert.equal(
    kidsWeeklyWeeksLabel(
      buildKidsWeeklyProgram("allLevels", null),
      buildKidsWeeklyProgram("experienced", null),
    ),
    null,
  )
})

test("omits the week count rather than defaulting to 15 when a camp is missing", () => {
  const missing = buildKidsWeeklyProgram("experienced", null)

  assert.equal(missing.sessionCount, null)
  assert.equal(missing.weeksLabel, null)
  assert.equal(missing.sessionsLabel, "two-hour sessions")
})

test("disables only the missing or sold-out program", () => {
  assert.equal(buildKidsWeeklyProgram("experienced", null).ctaDisabled, true)
  assert.equal(buildKidsWeeklyProgram("allLevels", camp({ spotsLeft: 0, isSoldOut: true })).ctaLabel, "Sold out")
})

test("the public route requires at least one published child camp unless previewing", () => {
  assert.equal(canRenderKidsWeeklyLanding(camp(), null, false), true)
  assert.equal(canRenderKidsWeeklyLanding(camp({ publicVisibility: "unpublished" }), null, false), false)
  assert.equal(canRenderKidsWeeklyLanding(camp({ publicVisibility: "unpublished" }), null, true), true)
})

test("routes both weekly child camps to the single public landing page", () => {
  assert.equal(
    kidsWeeklyLandingPathForCamp(KIDS_WEEKLY_PROGRAMS.allLevels.slug),
    KIDS_WEEKLY_LANDING_PATH,
  )
  assert.equal(
    kidsWeeklyLandingPathForCamp(KIDS_WEEKLY_PROGRAMS.experienced.slug),
    KIDS_WEEKLY_LANDING_PATH,
  )
  assert.equal(kidsWeeklyLandingPathForCamp("toronto-intermediate-intensive"), null)
})

test("keeps weekly child camps out of standalone camp listings", () => {
  assert.equal(shouldListKidsWeeklyCampAsStandalone(KIDS_WEEKLY_PROGRAMS.allLevels.slug), false)
  assert.equal(shouldListKidsWeeklyCampAsStandalone(KIDS_WEEKLY_PROGRAMS.experienced.slug), false)
  assert.equal(shouldListKidsWeeklyCampAsStandalone("toronto-intermediate-intensive"), true)
})
