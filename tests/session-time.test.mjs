import assert from "node:assert/strict"
import test from "node:test"

import { formatSessionTime } from "../lib/session-time.ts"

test("keeps already-12h ranges, normalizing to an en-dash", () => {
  assert.equal(formatSessionTime("9:00 AM - 12:00 PM"), "9:00 AM – 12:00 PM")
  assert.equal(formatSessionTime("1:00 PM - 4:00 PM"), "1:00 PM – 4:00 PM")
})

test("converts 24-hour ranges to 12-hour", () => {
  assert.equal(formatSessionTime("09:00 - 12:00"), "9:00 AM – 12:00 PM")
  assert.equal(formatSessionTime("09:00 - 15:00"), "9:00 AM – 3:00 PM")
  assert.equal(formatSessionTime("12:00 - 13:00"), "12:00 PM – 1:00 PM")
})

test("infers AM/PM for bare business-hours ranges", () => {
  assert.equal(formatSessionTime("9:00 - 3:00"), "9:00 AM – 3:00 PM")
  assert.equal(formatSessionTime("11:00 - 1:00"), "11:00 AM – 1:00 PM")
})

test("returns null when there is no time to show", () => {
  assert.equal(formatSessionTime(null), null)
  assert.equal(formatSessionTime(undefined), null)
  assert.equal(formatSessionTime(""), null)
  assert.equal(formatSessionTime("AM"), null)
  assert.equal(formatSessionTime("Full"), null)
})

test("falls back to the trimmed raw string when it has digits but cannot be parsed", () => {
  assert.equal(formatSessionTime("  9-5ish  "), "9-5ish")
})
