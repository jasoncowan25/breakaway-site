import assert from "node:assert/strict"
import test from "node:test"

import { fetchPublicCampShots } from "../lib/breakaway-api.ts"

test("camp shots bypass the site data cache so admin edits appear immediately", async (t) => {
  const originalFetch = globalThis.fetch
  const originalNodeEnv = process.env.NODE_ENV
  const calls = []

  process.env.NODE_ENV = "production"
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options })
    return new Response(JSON.stringify({ data: { shots: [] }, error: null }), {
      status: 200,
      headers: { "content-type": "application/json" },
    })
  }

  t.after(() => {
    globalThis.fetch = originalFetch
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV
    else process.env.NODE_ENV = originalNodeEnv
  })

  await fetchPublicCampShots("toronto intermediate")

  assert.equal(calls.length, 1)
  assert.equal(
    calls[0].url,
    "https://api.breakawaypickleball.ca/api/v1/public/camps/toronto%20intermediate/shots",
  )
  assert.deepEqual(calls[0].options, {
    headers: { accept: "application/json" },
    cache: "no-store",
  })
})
