import assert from "node:assert/strict"

const baseUrl = process.env.SEO_BASE_URL ?? "http://localhost:3000"

async function fetchText(path, init) {
  const response = await fetch(new URL(path, baseUrl), init)
  return {
    response,
    text: await response.text(),
  }
}

function assertIncludes(text, needle, label) {
  assert.ok(text.includes(needle), `${label} missing ${needle}`)
}

async function assertPage(path, checks) {
  const { response, text } = await fetchText(path)
  assert.equal(response.status, 200, `${path} should return HTTP 200`)
  for (const [needle, label] of checks) {
    assertIncludes(text, needle, `${path} ${label}`)
  }
  return text
}

await assertPage("/pickleball-camps", [
  ["<h1", "server-rendered h1"],
  ["Pickleball Camps", "server-rendered heading text"],
  ["Toronto Intermediate", "server-rendered Toronto camp card"],
  ["Punta Cana", "server-rendered Punta Cana card"],
  ["Muskoka", "server-rendered Muskoka hub/card"],
])

const { text: campsPage } = await fetchText("/pickleball-camps")
assert.ok(
  !campsPage.includes("toronto-intermediate-intensive-oct-17-2026"),
  "/pickleball-camps should not emit the stale October slug",
)

await assertPage("/pickleball-camps/punta-cana", [
  ['rel="canonical" href="https://www.breakawaypickleball.ca/pickleball-camps/punta-cana"', "canonical"],
  ["Punta Cana Pickleball Retreat", "page title"],
  ['type="application/ld+json"', "JSON-LD"],
])

await assertPage("/pickleball-camps/toronto-intermediate-intensive-sep-12-2026-3", [
  [
    'rel="canonical" href="https://www.breakawaypickleball.ca/pickleball-camps/toronto-intermediate-intensive-sep-12-2026-3"',
    "canonical",
  ],
  ["Toronto Intermediate Intensive", "page title"],
  ['type="application/ld+json"', "JSON-LD"],
])

await assertPage("/schedule", [
  ["Toronto Intermediate Intensive", "current Toronto camp"],
  ["Punta Cana", "Punta Cana retreat"],
  ["Muskoka", "Muskoka hub/card"],
])

const redirect = await fetch(new URL("/experience", baseUrl), { redirect: "manual" })
assert.ok([301, 308].includes(redirect.status), "/experience should permanently redirect")
assert.equal(
  redirect.headers.get("location"),
  "/pickleball-camp-experience",
  "/experience should redirect to /pickleball-camp-experience",
)

const { text: sitemap } = await fetchText("/sitemap.xml")
for (const path of [
  "/pickleball-camps/punta-cana",
  "/pickleball-coaches",
  "/schedule",
  "/pickleball-camp-experience",
  "/pickleball-camps/toronto-intermediate-intensive-sep-12-2026-3",
  "/pickleball-camps/toronto-intermediate-intensive-oct-24-2026",
]) {
  const url = `https://www.breakawaypickleball.ca${path}`
  assertIncludes(sitemap, url, "sitemap")
  assert.equal(sitemap.indexOf(url), sitemap.lastIndexOf(url), `sitemap should include ${url} once`)
}

console.log("SEO smoke checks passed")
