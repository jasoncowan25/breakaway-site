import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const waiverSource = readFileSync(new URL("../app/waiver/page.tsx", import.meta.url), "utf8")
const waiverSignSource = readFileSync(new URL("../app/waiver-sign/page.tsx", import.meta.url), "utf8")

test("appends The Jar terms as the Facility Waiver", () => {
  const acknowledgementIndex = waiverSource.indexOf("10. ACKNOWLEDGEMENT")
  const facilityWaiverIndex = waiverSource.indexOf("Facility Waiver")

  assert.ok(acknowledgementIndex >= 0)
  assert.ok(facilityWaiverIndex > acknowledgementIndex)
  assert.match(waiverSource, /1000614977 Ontario Inc\. \(d\/b\/a The Jar Pickleball Club\)/)
  assert.match(waiverSource, /900 Caledonia Road, Unit 5/)
  assert.match(waiverSource, /ASSUMPTION OF RISKS/)
  assert.match(waiverSource, /I SHALL DEFEND, INDEMNIFY AND HOLD HARMLESS THE COMPANY/)
  assert.match(waiverSource, /INCLUDING THE RIGHT TO SUE THE COMPANY AND THE RELEASEES/)
})

test("records acceptance against the facility-waiver version", () => {
  assert.match(waiverSignSource, /waiver_version: "2026-09-11"/)
  assert.match(waiverSignSource, /Assumption of Risk and the Facility Waiver\./)
})
