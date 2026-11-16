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

const campsPage = await assertPage("/pickleball-camps", [
  ["<h1", "server-rendered h1"],
  ["Pickleball Camps", "server-rendered heading text"],
  ["Toronto Intermediate", "server-rendered Toronto camp card"],
  ["Muskoka", "server-rendered Muskoka hub/card"],
])

assert.ok(
  !campsPage.includes("toronto-intermediate-intensive-oct-17-2026"),
  "/pickleball-camps should not emit the stale October slug",
)

await assertPage("/pickleball-camps/toronto-intermediate-intensive-sep-12-2026-3", [
  [
    'rel="canonical" href="https://www.breakawaypickleball.ca/pickleball-camps/toronto-intermediate-intensive-sep-12-2026-3"',
    "canonical",
  ],
  ["Toronto Intermediate Intensive", "page title"],
  ['type="application/ld+json"', "JSON-LD"],
])

const schedulePage = await assertPage("/schedule", [
  ["Kids Weekly Pickleball Camp", "upcoming weekly camp"],
  ["Muskoka", "Muskoka hub/card"],
])

for (const retired of [
  "/experience",
  "/pickleball-camp-experience",
  "/pickleball-camps/punta-cana",
  "/pickleball-camps/punta-cana-nov-24-dec-1-2026",
  "/checkout/punta-cana-nov-24-dec-1-2026",
]) {
  const redirect = await fetch(new URL(retired, baseUrl), { redirect: "manual" })
  assert.ok([301, 308].includes(redirect.status), `${retired} should permanently redirect`)
  assert.equal(
    redirect.headers.get("location"),
    "/pickleball-camps",
    `${retired} should redirect to /pickleball-camps`,
  )
}

const { text: sitemap } = await fetchText("/sitemap.xml")
for (const path of [
  "/pickleball-coaches",
  "/schedule",
  "/pickleball-lessons",
  "/pickleball-camps/muskoka",
]) {
  const url = `https://www.breakawaypickleball.ca${path}`
  const entry = `<loc>${url}</loc>`
  assertIncludes(sitemap, entry, "sitemap")
  assert.equal(sitemap.indexOf(entry), sitemap.lastIndexOf(entry), `sitemap should include ${url} once`)
}

assert.ok(
  !sitemap.includes("/pickleball-camp-experience"),
  "sitemap should no longer list the retired experience page",
)

const homePage = await assertPage("/", [["Upcoming Signature Camps", "featured camps"]])
assertIncludes(homePage, "Breakaway Pickleball | Adult Camps &amp; Kids Programs", "homepage title")
assertIncludes(homePage, 'href="/favicon-192x192.png"', "high-resolution favicon")
assertIncludes(homePage, "Recently Completed Camps", "original homepage recap section")

for (const slug of [
  "kids-passover-pickleball-camp-toronto",
  "toronto-intermediate-pickleball-camp",
  "toronto-intensive-jan",
  "saint-martin-pickleball-clinic",
]) {
  const path = `/pickleball-camps/${slug}`
  const response = await fetch(new URL(path, baseUrl), { redirect: "manual" })
  assert.equal(response.status, 308, `${path} should redirect permanently to its recap`)
  assert.equal(response.headers.get("location"), `${path}/recap`)
  await assertPage(`${path}/recap`, [["<h1", "recap heading"]])
  assert.ok(!sitemap.includes(`<loc>https://www.breakawaypickleball.ca${path}</loc>`), "old booking page excluded from sitemap")
}

for (const slug of ["toronto-intermediate-intensive-sep-12-2026-3", "toronto-intermediate-intensive-oct-24-2026"]) {
  const path = `/pickleball-camps/${slug}`
  assert.ok(!sitemap.includes(`<loc>https://www.breakawaypickleball.ca${path}</loc>`), "completed dated camp excluded from sitemap")
  await assertPage(path, [['name="robots" content="noindex, follow"', "completed camp indexing"]])
}

const iconResponse = await fetch(new URL("/favicon.ico", baseUrl))
assert.equal(iconResponse.status, 200)
const icon = Buffer.from(await iconResponse.arrayBuffer())
assert.deepEqual([...icon.subarray(0, 4)], [0, 0, 1, 0], "favicon.ico must be a real ICO, not placeholder text")
const pngResponse = await fetch(new URL("/favicon-192x192.png", baseUrl))
assert.equal(pngResponse.status, 200)
const png = Buffer.from(await pngResponse.arrayBuffer())
assert.equal(png.readUInt32BE(16), 192, "favicon width")
assert.equal(png.readUInt32BE(20), 192, "favicon height")
for (const page of [homePage, campsPage, schedulePage, sitemap]) {
  assert.doesNotMatch(page, /punta[ -]cana|dominican republic|trs turquesa/i)
}
const registration = await fetch(new URL("/api/punta-cana-register", baseUrl))
assert.equal(registration.status, 404, "retired retreat registration endpoint")

console.log("SEO smoke checks passed")
