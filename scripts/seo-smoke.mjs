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
  "/pickleball-camps/toronto-intermediate-intensive-sep-12-2026-3",
  "/pickleball-camps/toronto-intermediate-intensive-oct-24-2026",
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
for (const page of [homePage, campsPage, schedulePage, sitemap]) {
  assert.doesNotMatch(page, /punta[ -]cana|dominican republic|trs turquesa/i)
}
const registration = await fetch(new URL("/api/punta-cana-register", baseUrl))
assert.equal(registration.status, 404, "retired retreat registration endpoint")

console.log("SEO smoke checks passed")
