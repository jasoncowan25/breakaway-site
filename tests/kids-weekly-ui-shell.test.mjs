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
