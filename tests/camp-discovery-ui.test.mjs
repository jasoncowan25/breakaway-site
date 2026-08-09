import assert from "node:assert/strict"
import test from "node:test"

import {
  COMPLETED_CAMP_CARDS,
  HOME_COMPLETED_CAMP_CARDS,
  campMatchesFilters,
} from "../lib/camp-discovery.ts"

test("preserves the existing completed camps in shared discovery data", () => {
  const existingCamps = [
    { id: "toronto-april", skillLevel: "3.0-3.5" },
    { id: "kids-passover-camp", skillLevel: "Kids" },
    { id: "saint-martin-clinic", skillLevel: "3.0-4.0" },
    { id: "toronto-intermediate-jan", skillLevel: "3.0-4.0" },
  ]

  assert.deepEqual(
    existingCamps.map(({ id }) => {
      const camp = COMPLETED_CAMP_CARDS.find((candidate) => candidate.id === id)
      return { id: camp?.id, skillLevel: camp?.skillLevel }
    }),
    existingCamps,
  )
})

test("homepage discovery retains the two existing featured recaps", () => {
  const homeIds = HOME_COMPLETED_CAMP_CARDS.map((camp) => camp.id)

  assert.equal(homeIds.includes("toronto-april"), true)
  assert.equal(homeIds.includes("kids-passover-camp"), true)
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
