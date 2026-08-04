import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const playerCardSource = readFileSync(
  new URL("../components/checkout/PlayerCard.tsx", import.meta.url),
  "utf8",
)
const guardianSource = readFileSync(
  new URL("../components/checkout/Guardian.tsx", import.meta.url),
  "utf8",
)

test("checkout name fields render the existing person icon", () => {
  assert.equal((playerCardSource.match(/<Icon name="user" size=\{16\} \/>/g) ?? []).length, 4)
  assert.equal((guardianSource.match(/<Icon name="user" size=\{16\} \/>/g) ?? []).length, 2)
})

const kidsPageSource = readFileSync(
  new URL("../app/pickleball-camps/kids-weekly-pickleball-camp-toronto/page.tsx", import.meta.url),
  "utf8",
)
const landingSource = readFileSync(
  new URL("../app/pickleball-camps/kids-weekly-pickleball-camp-toronto/kids-weekly-landing.tsx", import.meta.url),
  "utf8",
)
const landingCssSource = readFileSync(
  new URL("../app/pickleball-camps/kids-weekly-pickleball-camp-toronto/kids-weekly.module.css", import.meta.url),
  "utf8",
)

test("kids weekly page uses populated shared site navigation and footer", () => {
  assert.match(kidsPageSource, /getPublishedPublicCampNavItems/)
  assert.match(kidsPageSource, /<Navigation campItems=\{navCampItems\} \/>/)
  assert.match(kidsPageSource, /<Footer \/>/)
  assert.doesNotMatch(landingSource, /<nav\b/)
  assert.doesNotMatch(landingSource, /<Footer \/>/)
  assert.doesNotMatch(landingSource, /menuOpen/)
  assert.doesNotMatch(landingCssSource, /^\.nav/m)
})
