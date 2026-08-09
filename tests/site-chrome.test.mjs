import assert from "node:assert/strict"
import test from "node:test"

import { shouldRenderSiteChrome } from "../lib/site-chrome.ts"

test("shows shared chrome on marketing and legal pages", () => {
  for (const path of [
    "/",
    "/pickleball-camps",
    "/pickleball-camps/kids-weekly-pickleball-camp-toronto",
    "/pickleball-camps/muskoka/recap",
    "/pickleball-coaches",
    "/privacy-policy",
    "/terms",
  ]) {
    assert.equal(shouldRenderSiteChrome(path), true, path)
  }
})

test("keeps focused and internal routes chromeless", () => {
  for (const path of [
    "/checkout/example",
    "/checkout/confirmation",
    "/waiver",
    "/waiver-sign/token",
    "/waiver-u18/token",
    "/preferences",
    "/thank-you",
    "/countdown",
    "/countdown-b",
    "/design-system/cards",
  ]) {
    assert.equal(shouldRenderSiteChrome(path), false, path)
  }
})

test("matches chromeless prefixes only at complete route boundaries", () => {
  for (const path of ["/checkout-guide", "/waivers", "/countdown-builder", "/design-systems"]) {
    assert.equal(shouldRenderSiteChrome(path), true, path)
  }
})
