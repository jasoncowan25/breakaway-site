import assert from "node:assert/strict"
import test from "node:test"
import { readCampFilterState, writeCampFilterState } from "../lib/camp-filter-state.ts"

const read = (query) => readCampFilterState(new URLSearchParams(query))

test("legacy and current 4.0+ links select the same visible chip", () => {
  for (const query of ["skill=4.0", "skill=4.0%2B", "skill=4.0+"]) {
    assert.deepEqual(read(query).skillLevels, ["4.0+"])
  }
  assert.deepEqual(read("skill=4.0&skill=4.0%2B").skillLevels, ["4.0+"])
})

test("clearing the visible 4.0+ chip removes its legacy query value", () => {
  const state = read("skill=4.0&utm_source=homepage")
  state.skillLevels = []
  const query = writeCampFilterState("skill=4.0&utm_source=homepage", state)
  assert.equal(query, "utm_source=homepage")
  assert.deepEqual(read(query).skillLevels, [])
})

test("multiple locations, skills, formats and completed view survive a URL round trip", () => {
  const state = {
    locations: ["Toronto & GTA", "Muskoka"],
    skillLevels: ["3.5", "4.0+", "Kids"],
    formats: ["Camp", "Clinic"],
    view: "completed",
  }
  const query = writeCampFilterState("utm_source=qa", state)
  assert.deepEqual(read(query), state)
  assert.equal(new URLSearchParams(query).get("utm_source"), "qa")
  assert.match(query, /skill=4.0%2B/)
})

test("changing a location replaces stale URL state while preserving other filters", () => {
  const original = "location=punta-cana&skill=Kids&format=Camp&view=completed"
  const state = { ...read(original), locations: ["Toronto & GTA"] }
  const updated = writeCampFilterState(original, state)
  assert.equal(new URLSearchParams(updated).get("location"), "toronto-gta")
  assert.deepEqual(read(updated), state)
  assert.deepEqual(read(original).locations, ["Punta Cana"])
})

test("unknown filters are ignored and duplicate values do not create hidden selections", () => {
  assert.deepEqual(read("location=unknown&skill=unknown&format=unknown&view=unknown"), {
    locations: [], skillLevels: [], formats: [], view: "upcoming",
  })
  assert.deepEqual(read("location=muskoka&location=muskoka&skill=Kids&skill=Kids&format=Camp&format=Camp"), {
    locations: ["Muskoka"], skillLevels: ["Kids"], formats: ["Camp"], view: "upcoming",
  })
})

test("clearing filters removes their URL keys and restores upcoming view", () => {
  const query = writeCampFilterState("location=muskoka&skill=Kids&format=Clinic&view=completed&utm_source=qa", {
    locations: [], skillLevels: [], formats: [], view: "upcoming",
  })
  assert.equal(query, "utm_source=qa")
})
