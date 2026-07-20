import assert from "node:assert/strict"
import test from "node:test"

import {
  campHasNotEnded,
  currentAndUpcomingCamps,
  postgrestCurrentCampDateFilter,
  todayIsoInToronto,
} from "../lib/upcoming-camps.ts"

test("keeps a camp visible through its end date", () => {
  const camp = { startDate: "2026-07-17", endDate: "2026-07-19" }

  assert.equal(campHasNotEnded(camp, "2026-07-19"), true)
  assert.equal(campHasNotEnded(camp, "2026-07-20"), false)
})

test("uses the start date as the end date for a single-day camp", () => {
  const camp = { startDate: "2026-08-04", endDate: null }

  assert.equal(campHasNotEnded(camp, "2026-08-04"), true)
  assert.equal(campHasNotEnded(camp, "2026-08-05"), false)
})

test("filters a grouped event down to current and future sessions", () => {
  const camps = [
    { id: "past", startDate: "2026-07-10", endDate: "2026-07-12" },
    { id: "current", startDate: "2026-07-19", endDate: "2026-07-20" },
    { id: "future", startDate: "2026-08-04", endDate: "2026-08-06" },
  ]

  assert.deepEqual(
    currentAndUpcomingCamps(camps, "2026-07-20").map((camp) => camp.id),
    ["current", "future"],
  )
})

test("calculates the business date in Toronto instead of UTC", () => {
  assert.equal(todayIsoInToronto(new Date("2026-07-20T02:00:00Z")), "2026-07-19")
})

test("builds a PostgREST filter that supports multi-day and single-day camps", () => {
  assert.equal(
    postgrestCurrentCampDateFilter("2026-07-20"),
    "(end_date.gte.2026-07-20,and(end_date.is.null,start_date.gte.2026-07-20))",
  )
})
