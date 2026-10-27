import assert from "node:assert/strict"
import test from "node:test"

import {
  KIDS_WEEKLY_DEFAULT_PROGRAM,
  KIDS_WEEKLY_LANDING_PATH,
  KIDS_WEEKLY_PROGRAM_KEYS,
  KIDS_WEEKLY_PROGRAMS,
  buildKidsWeeklyProgram,
  skippedWeeks,
  canRenderKidsWeeklyLanding,
  kidsWeeklyLandingPathForCamp,
  kidsWeeklyProgramKey,
  shouldListKidsWeeklyCampAsStandalone,
} from "../lib/kids-weekly-camp.ts"

// Jan 4 2027 is a Monday; the real run skips Feb 15 (Family Day) and Mar 15 (March Break).
const MONDAYS = [
  "2027-01-04", "2027-01-11", "2027-01-18", "2027-01-25", "2027-02-01", "2027-02-08", "2027-02-22",
  "2027-03-01", "2027-03-08", "2027-03-22", "2027-03-29", "2027-04-05", "2027-04-12", "2027-04-19",
]
const TUESDAYS = [
  "2027-01-05", "2027-01-12", "2027-01-19", "2027-01-26", "2027-02-02", "2027-02-09", "2027-02-16",
  "2027-02-23", "2027-03-02", "2027-03-09", "2027-03-23", "2027-03-30", "2027-04-06",
]

function camp(overrides = {}) {
  return {
    id: "camp-1",
    slug: KIDS_WEEKLY_PROGRAMS.jarMon.slug,
    title: "Kids Weekly Pickleball Camp",
    fullLabel: "Kids Weekly Pickleball Camp",
    startDate: "2027-01-04",
    endDate: "2027-04-19",
    basePriceCents: 56000,
    capacity: 30,
    registeredCount: 3,
    spotsLeft: 27,
    isSoldOut: false,
    sessionLabel: "6:00 PM – 7:00 PM",
    sessionDates: MONDAYS,
    publicVisibility: "published",
    childrenEligible: true,
    ...overrides,
  }
}

test("lists the three winter nights in weekday order with Mondays selected by default", () => {
  assert.deepEqual(KIDS_WEEKLY_PROGRAM_KEYS, ["jarMon", "picklrTue", "jarThu"])
  assert.equal(KIDS_WEEKLY_DEFAULT_PROGRAM, "jarMon")
})

test("builds the Monday card at The JAR from its 14 live sessions", () => {
  const program = buildKidsWeeklyProgram("jarMon", camp())

  assert.equal(program.checkoutHref, "/checkout/toronto-kids-weekly-pickleball-camp-jan-4-2027")
  assert.equal(program.priceLabel, "$560 CAD")
  assert.equal(program.spotsLabel, "Capacity: 30")
  assert.equal(program.capacity, 30)
  assert.equal(program.taxLabel, "+ HST")
  assert.equal(program.sessionsLabel, "14 one-hour sessions")
  assert.equal(program.eyebrow, "Mondays · 14 Weeks")
  assert.equal(program.day, "Mondays")
  assert.equal(program.venue, "The JAR Pickleball Club")
  assert.equal(program.city, "Toronto, ON")
  assert.equal(program.durationBadge, "1-hour sessions")
  assert.equal(program.ctaLabel, "Book Mondays")
  assert.equal(program.ctaDisabled, false)
  assert.equal(program.whoFor, "All levels, from complete beginners to experienced players")
})

test("builds the Tuesday card at The Picklr Toronto West", () => {
  const program = buildKidsWeeklyProgram("picklrTue", camp({
    slug: KIDS_WEEKLY_PROGRAMS.picklrTue.slug,
    basePriceCents: 52000,
    sessionLabel: "16:00 - 17:00",
    sessionDates: TUESDAYS,
  }))

  assert.equal(program.checkoutHref, "/checkout/etobicoke-kids-weekly-pickleball-camp-jan-5-2027")
  assert.equal(program.priceLabel, "$520 CAD")
  assert.equal(program.badge, "New Location")
  assert.equal(program.eyebrow, "Tuesdays · 13 Weeks")
  assert.equal(program.venue, "The Picklr Toronto West")
  assert.equal(program.city, "Etobicoke, ON")
  assert.equal(program.dateLabel, "January 5 – April 6, 2027")
  assert.equal(program.ctaLabel, "Book Tuesdays")
  assert.equal(program.skippedLabel, "Mar 16")
  assert.ok(program.includes.includes("No class Mar 16"))
})

test("lists the weeks a run skips", () => {
  assert.deepEqual(skippedWeeks(MONDAYS), ["2027-02-15", "2027-03-15"])
  assert.deepEqual(skippedWeeks(["2027-01-07", "2027-01-14"]), [])
  assert.equal(buildKidsWeeklyProgram("jarMon", camp()).skippedLabel, "Feb 15 · Mar 15")
})

test("falls back to the configured weekday when the camp is missing", () => {
  const program = buildKidsWeeklyProgram("jarMon", null)
  assert.equal(program.day, "Mondays")
  assert.equal(program.eyebrow, "Mondays")
  assert.equal(program.ctaLabel, "Registration unavailable")
  assert.equal(program.ctaDisabled, true)
})

test("disables only the missing or sold-out program", () => {
  assert.equal(buildKidsWeeklyProgram("jarThu", null).ctaDisabled, true)
  assert.equal(buildKidsWeeklyProgram("jarMon", camp({ spotsLeft: 0, isSoldOut: true })).ctaLabel, "Sold out")
})

test("the public route requires at least one published child camp unless previewing", () => {
  assert.equal(canRenderKidsWeeklyLanding([null, camp(), null], false), true)
  assert.equal(canRenderKidsWeeklyLanding([null, camp({ publicVisibility: "unpublished" }), null], false), false)
  assert.equal(canRenderKidsWeeklyLanding([null, camp({ publicVisibility: "unpublished" }), null], true), true)
  assert.equal(canRenderKidsWeeklyLanding([null, null, null], true), false)
})

test("routes each current weekly camp to its selected program on the shared landing page", () => {
  for (const key of KIDS_WEEKLY_PROGRAM_KEYS) {
    assert.equal(kidsWeeklyLandingPathForCamp(KIDS_WEEKLY_PROGRAMS[key].slug), `${KIDS_WEEKLY_LANDING_PATH}?program=${key}`)
  }
  assert.equal(kidsWeeklyLandingPathForCamp("toronto-kids-weekly-experienced-sep-7-2026"), KIDS_WEEKLY_LANDING_PATH)
  assert.equal(kidsWeeklyLandingPathForCamp("toronto-intermediate-intensive"), null)
})

test("unknown or missing program selections safely use Monday", () => {
  for (const key of KIDS_WEEKLY_PROGRAM_KEYS) assert.equal(kidsWeeklyProgramKey(key), key)
  for (const value of [null, undefined, "", "unknown", "__proto__"]) {
    assert.equal(kidsWeeklyProgramKey(value), KIDS_WEEKLY_DEFAULT_PROGRAM)
  }
})

test("capacity labels do not misrepresent remaining seats and do not change sold-out behavior", () => {
  const available = buildKidsWeeklyProgram("jarMon", camp({ capacity: 24, spotsLeft: 2 }))
  assert.equal(available.spotsLabel, "Capacity: 24")
  assert.equal(available.ctaDisabled, false)
  for (const overrides of [{ spotsLeft: 0 }, { isSoldOut: true }]) {
    const soldOut = buildKidsWeeklyProgram("jarMon", camp(overrides))
    assert.equal(soldOut.capacity, 30)
    assert.equal(soldOut.spotsLabel, "Sold out")
    assert.equal(soldOut.ctaDisabled, true)
  }
  const missing = buildKidsWeeklyProgram("jarMon", null)
  assert.equal(missing.ctaDisabled, true)
  assert.equal(missing.taxLabel, null)
})

test("venue directions come from the camp's facility record, with no guessed fallback", () => {
  const facility = { name: "The Picklr Toronto West", city: "Etobicoke", address: "70 Carson St" }
  const program = buildKidsWeeklyProgram("picklrTue", camp({ facility }))
  assert.equal(program.address, facility.address)
  assert.equal(new URL(program.directionsUrl).searchParams.get("destination"), "The Picklr Toronto West, 70 Carson St, Etobicoke")
  for (const facility of [null, { name: "The JAR", address: "  " }]) {
    const program = buildKidsWeeklyProgram("jarMon", camp({ facility }))
    assert.equal(program.address, null)
    assert.equal(program.directionsUrl, null)
  }
})

test("keeps weekly child camps out of standalone camp listings", () => {
  for (const key of KIDS_WEEKLY_PROGRAM_KEYS) {
    assert.equal(shouldListKidsWeeklyCampAsStandalone(KIDS_WEEKLY_PROGRAMS[key].slug), false)
  }
  assert.equal(shouldListKidsWeeklyCampAsStandalone("toronto-intermediate-intensive"), true)
})
