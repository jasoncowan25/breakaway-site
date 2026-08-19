import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import test from "node:test"

import * as lessons from "../app/pickleball-lessons/lessons-data.ts"

const TODAY = "2026-08-17" // Monday in Toronto

test("quotes Sam's one-player lesson at $100 per hour", () => {
  assert.equal(lessons.pricing("sam", 1).total, 100)
})

test("enforces each coach's notice window and Sam's Saturday block", () => {
  assert.equal(typeof lessons.isRequestDateAllowed, "function")

  assert.equal(lessons.isRequestDateAllowed("sam", "toronto", "2026-08-20", TODAY), false)
  assert.equal(lessons.isRequestDateAllowed("sam", "toronto", "2026-08-21", TODAY), true)
  assert.equal(lessons.isRequestDateAllowed("sam", "toronto", "2026-08-22", TODAY), false)

  assert.equal(lessons.isRequestDateAllowed("joey", "toronto", "2026-09-06", TODAY), false)
  assert.equal(lessons.isRequestDateAllowed("joey", "toronto", "2026-09-07", TODAY), true)
})

test("no preference accepts a date only when at least one city coach can take it", () => {
  assert.equal(typeof lessons.isRequestDateAllowed, "function")

  assert.equal(lessons.isRequestDateAllowed("none", "toronto", "2026-08-21", TODAY), true)
  assert.equal(lessons.isRequestDateAllowed("none", "toronto", "2026-08-22", TODAY), false)
  assert.equal(lessons.isRequestDateAllowed("none", "toronto", "2026-09-12", TODAY), true)
})

test("finds the first requestable date for the selected coach", () => {
  assert.equal(typeof lessons.earliestRequestDate, "function")

  assert.equal(lessons.earliestRequestDate("sam", "toronto", TODAY), "2026-08-21")
  assert.equal(lessons.earliestRequestDate("joey", "toronto", TODAY), "2026-09-07")
  assert.equal(lessons.earliestRequestDate("none", "toronto", TODAY), "2026-08-21")
})

test("limits Muskoka lessons to July and August of the current season", () => {
  assert.equal(lessons.cityState("muskoka", 6).open, false)
  assert.equal(lessons.cityState("muskoka", 7).open, true)
  assert.equal(lessons.cityState("muskoka", 8).open, true)
  assert.equal(lessons.cityState("muskoka", 9).open, false)

  assert.equal(lessons.isRequestDateAllowed("joey", "muskoka", "2026-08-31", TODAY), false)
  assert.equal(lessons.isRequestDateAllowed("joey", "muskoka", "2026-09-07", TODAY), false)
  assert.equal(lessons.isRequestDateAllowed("joey", "muskoka", "2027-07-01", TODAY), false)
  assert.equal(lessons.earliestRequestDate("joey", "muskoka", TODAY), null)
})

test("publishes two bookable coach profiles with usable roster images", async () => {
  const rosterModule = await import("../app/pickleball-coaches/coaches-data.ts").catch(() => null)
  assert.ok(rosterModule, "expected a shared coach-roster data module")

  assert.equal(rosterModule.coachRoster.length, 2)
  assert.deepEqual(rosterModule.coachRoster.map((coach) => coach.slug), ["joey-manchurek", "sam-schachter"])
  assert.ok(rosterModule.coachRoster.every((coach) => coach.image.startsWith("/images/coaches/")))
  assert.ok(rosterModule.coachRoster.every((coach) => coach.badges.length > 0))
  for (const coach of rosterModule.coachRoster) {
    assert.ok(existsSync(new URL(`../public${coach.image}`, import.meta.url)), coach.image)
  }
})
