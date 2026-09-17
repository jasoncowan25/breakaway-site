import assert from "node:assert/strict"
import test from "node:test"

import {
  CAMP_SKILL_FILTERS,
  RELATED_CAMP_LINKS,
  STATIC_PUBLIC_CAMP_CARDS,
  campMatchesFilters,
  shouldShowMuskokaHub,
  staticPublicCampNavItems,
} from "../lib/camp-discovery.ts"

test("publishes the approved captions and promotional badges for featured Toronto camps", () => {
  const featuredIds = [
    "toronto-intermediate-intensive-sep-12-2026-3",
    "toronto-intermediate-intensive-oct-24-2026",
  ]
  const featured = STATIC_PUBLIC_CAMP_CARDS.filter((camp) => featuredIds.includes(camp.id))

  assert.deepEqual(
    featured.map(({ id, date, badges, availabilityLabel }) => ({
      id,
      date,
      badges,
      availabilityLabel,
    })),
    [
      {
        id: "toronto-intermediate-intensive-sep-12-2026-3",
        date: "September 12-13, 2026",
        badges: [],
        availabilityLabel: "Only 16 Spots",
      },
      {
        id: "toronto-intermediate-intensive-oct-24-2026",
        date: "October 24-25, 2026",
        badges: [],
        availabilityLabel: "Only 16 Spots",
      },
    ],
  )
})

test("keeps the Kids filter available without promoting the started weekly program", () => {
  const kids = STATIC_PUBLIC_CAMP_CARDS
    .filter((camp) => camp.skillLevel === "Kids")
    .map((camp) => camp.id)

  assert.deepEqual(kids, [])
  assert.ok(CAMP_SKILL_FILTERS.includes("Kids"))
})

test("Kids filtering excludes the started weekly kids program", () => {
  const result = STATIC_PUBLIC_CAMP_CARDS
    .filter((camp) =>
      campMatchesFilters(camp, {
        locations: [],
        formats: [],
        skillLevels: ["Kids"],
      }),
    )
    .map((camp) => camp.id)

  assert.deepEqual(result, [])
  assert.equal(
    shouldShowMuskokaHub({
      campCount: 8,
      locations: [],
      formats: [],
      skillLevels: ["Kids"],
    }),
    false,
  )
})

test("hides the started weekly program from related links and active static navigation", () => {
  assert.equal(RELATED_CAMP_LINKS.some((link) => link.href.includes("kids-weekly")), false)
  assert.equal(
    staticPublicCampNavItems("2026-09-17").some((item) => item.href.includes("kids-weekly")),
    false,
  )
  assert.equal(
    staticPublicCampNavItems("2026-09-17").some(
      (item) => item.href === "/pickleball-camps/toronto-intermediate-intensive-oct-24-2026",
    ),
    true,
  )
})
