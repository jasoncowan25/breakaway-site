import assert from "node:assert/strict"
import test from "node:test"

import {
  KIDS_WEEKLY_PROGRAMS,
  buildKidsWeeklyProgram,
  canRenderKidsWeeklyLanding,
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

test("disables only the missing or sold-out program", () => {
  assert.equal(buildKidsWeeklyProgram("experienced", null).ctaDisabled, true)
  assert.equal(buildKidsWeeklyProgram("allLevels", camp({ spotsLeft: 0, isSoldOut: true })).ctaLabel, "Sold out")
})

test("the public route requires at least one published child camp unless previewing", () => {
  assert.equal(canRenderKidsWeeklyLanding(camp(), null, false), true)
  assert.equal(canRenderKidsWeeklyLanding(camp({ publicVisibility: "unpublished" }), null, false), false)
  assert.equal(canRenderKidsWeeklyLanding(camp({ publicVisibility: "unpublished" }), null, true), true)
})
