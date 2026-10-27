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

test("promotes the winter Kids Weekly program under the Kids filter", () => {
  const kids = STATIC_PUBLIC_CAMP_CARDS
    .filter((camp) => campMatchesFilters(camp, { locations: [], formats: [], skillLevels: ["Kids"] }))
    .map((camp) => camp.id)

  assert.deepEqual(kids, ["kids-weekly-pickleball-camp-toronto"])
  assert.ok(CAMP_SKILL_FILTERS.includes("Kids"))
  assert.equal(
    shouldShowMuskokaHub({ campCount: 8, locations: [], formats: [], skillLevels: ["Kids"] }),
    false,
  )
})

test("links the Kids Weekly page from related links and navigation until the run ends", () => {
  assert.equal(RELATED_CAMP_LINKS.some((link) => link.href.includes("kids-weekly")), true)
  assert.equal(staticPublicCampNavItems("2027-04-19").some((item) => item.href.includes("kids-weekly")), true)
  assert.equal(staticPublicCampNavItems("2027-04-20").some((item) => item.href.includes("kids-weekly")), false)
})
