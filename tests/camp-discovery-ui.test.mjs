import assert from "node:assert/strict"
import test from "node:test"

import {
  COMPLETED_CAMP_CARDS,
  HOME_COMPLETED_CAMP_CARDS,
  campMatchesFilters,
} from "../lib/camp-discovery.ts"

test("preserves the existing completed camps in shared discovery data", () => {
  assert.deepEqual(
    COMPLETED_CAMP_CARDS.map((camp) => ({ id: camp.id, skillLevel: camp.skillLevel })),
    [
      { id: "toronto-april", skillLevel: "3.0-3.5" },
      { id: "kids-passover-camp", skillLevel: "Kids" },
      { id: "saint-martin-clinic", skillLevel: "3.0-4.0" },
      { id: "toronto-intermediate-jan", skillLevel: "3.0-4.0" },
    ],
  )
})

test("homepage discovery selects the two existing featured recaps", () => {
  assert.deepEqual(
    HOME_COMPLETED_CAMP_CARDS.map((camp) => camp.id),
    ["toronto-april", "kids-passover-camp"],
  )
})

test("Kids filtering includes the completed youth camp and excludes adult recaps", () => {
  const matches = COMPLETED_CAMP_CARDS.filter((camp) =>
    campMatchesFilters(camp, {
      locations: [],
      formats: [],
      skillLevels: ["Kids"],
    }),
  )

  assert.deepEqual(matches.map((camp) => camp.id), ["kids-passover-camp"])
})
