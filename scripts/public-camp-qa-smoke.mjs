// Run against a local site with a read-only public-camp fixture API.
// PLAYWRIGHT_MODULE and CHROMIUM_EXECUTABLE may point to an existing installation.
import assert from "node:assert/strict"
import { createRequire } from "node:module"
import { mkdir, writeFile } from "node:fs/promises"

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright")
const base = process.env.BASE_URL || "http://127.0.0.1:4317"
assert(["127.0.0.1", "localhost"].includes(new URL(base).hostname), "This smoke test is local-only")
const output = process.env.QA_OUTPUT || "/tmp/public-camp-qa"
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_EXECUTABLE || undefined })
const passed = [], errors = [], writes = []
const pass = (name) => { passed.push(name); console.log(`PASS ${name}`) }
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  let stripeBlocked = false
  await context.route("**/*", (route) => {
    const request = route.request(), url = new URL(request.url())
    if (!["GET", "HEAD"].includes(request.method())) { writes.push(request.url()); return route.abort() }
    if (url.hostname === "js.stripe.com") stripeBlocked = true
    return url.origin === new URL(base).origin ? route.continue() : route.abort()
  })
  const page = await context.newPage()
  page.setDefaultTimeout(10000)
  page.on("pageerror", (error) => {
    if (!(stripeBlocked && error.message === "Failed to load Stripe.js")) errors.push(error.message)
  })
  const goto = async (path) => { await page.goto(base + path, { waitUntil: "load" }) }
  const panel = () => page.getByRole("tabpanel", { name: "Upcoming Camps", exact: true })
  const cards = async (titles) => {
    await page.waitForFunction((expected) => [...document.querySelectorAll('[role="tabpanel"]:not([hidden]) h3')]
      .map((node) => node.textContent).join("|") === expected.join("|"), titles)
  }
  const noOverflow = async () => assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  const allCards = ["Punta Cana Destination Retreat", "Kids Weekly Pickleball Camp"]

  for (const query of ["skill=4.0", "skill=4.0%2B", "skill=4.0+", "skill=4.0&skill=4.0%2B"]) {
    await goto(`/pickleball-camps?${query}`)
    await page.getByRole("button", { name: "4.0+", exact: true, pressed: true }).waitFor()
    await cards([allCards[0]])
    await page.getByRole("button", { name: "4.0+", exact: true }).click()
    await page.getByRole("button", { name: "4.0+", exact: true, pressed: false }).waitFor()
    await cards(allCards)
    assert.equal(new URL(page.url()).searchParams.has("skill"), false)
  }
  pass("Legacy/current/duplicate 4.0+ links visibly select one chip and clear fully")

  await goto("/pickleball-camps?location=punta-cana&utm_source=qa")
  await page.getByRole("checkbox", { name: "Punta Cana", exact: true }).click()
  await page.getByRole("checkbox", { name: "Toronto & GTA", exact: true }).click()
  await page.getByRole("checkbox", { name: "Camp", exact: true }).click()
  await page.getByRole("button", { name: "Kids", exact: true }).click()
  await cards([allCards[1]])
  const filteredUrl = page.url()
  assert.equal(new URL(filteredUrl).searchParams.get("location"), "toronto-gta")
  assert.equal(new URL(filteredUrl).searchParams.get("utm_source"), "qa")
  await panel().getByRole("link", { name: /Kids Weekly/ }).click()
  await page.locator("#book").waitFor()
  await page.goBack({ waitUntil: "load" })
  await cards([allCards[1]])
  assert.equal(page.url(), filteredUrl)
  await page.reload({ waitUntil: "load" })
  await cards([allCards[1]])
  await page.getByRole("checkbox", { name: "Toronto & GTA", exact: true, checked: true }).waitFor()
  await page.getByRole("checkbox", { name: "Camp", exact: true, checked: true }).waitFor()
  await page.getByRole("button", { name: "Kids", exact: true, pressed: true }).waitFor()
  for (let i = 0; i < 2; i++) {
    await page.getByRole("tab", { name: "Recently Completed", exact: true }).click()
    await page.getByRole("tabpanel", { name: "Recently Completed Camps", exact: true }).waitFor()
    await page.goBack()
    await cards([allCards[1]])
    await page.goForward()
    await page.getByRole("tabpanel", { name: "Recently Completed Camps", exact: true }).waitFor()
    await page.goBack()
    await cards([allCards[1]])
  }
  pass("Location/skill/format state survives detail return, reload and repeated tab Back/Forward")

  await goto("/pickleball-camps?location=toronto-gta&location=punta-cana&format=Clinic")
  await page.getByText("No upcoming camps match your selected filters.", { exact: true }).waitFor()
  await page.getByRole("checkbox", { name: "Clinic", exact: true }).click()
  await cards(allCards)
  await page.getByRole("checkbox", { name: "Toronto & GTA", exact: true, checked: true }).waitFor()
  await page.getByRole("checkbox", { name: "Punta Cana", exact: true, checked: true }).waitFor()
  pass("Multi-location deep links and empty-state recovery")

  for (const width of [393, 320]) {
    await page.setViewportSize({ width, height: 852 })
    await goto("/")
    await page.getByRole("combobox").nth(0).click()
    await page.getByRole("option", { name: "Toronto & GTA", exact: true }).click()
    await page.getByRole("combobox").nth(1).click()
    await page.getByRole("option", { name: "4.0+", exact: true }).click()
    const toggle = page.getByRole("button", { name: "Find Your Perfect Camp", exact: true })
    await toggle.focus()
    await page.keyboard.press("Enter")
    assert.equal(await toggle.getAttribute("aria-expanded"), "false")
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press("Tab")
      assert.equal(await page.evaluate(() => !!document.activeElement?.closest("[inert]")), false)
    }
    await toggle.click()
    assert.match(await page.getByRole("combobox").nth(0).innerText(), /Toronto/)
    assert.match(await page.getByRole("combobox").nth(1).innerText(), /4.0\+/)
    await page.getByRole("button", { name: "Search Camps", exact: true }).click()
    await page.getByRole("button", { name: "Filters", exact: true }).waitFor()
    assert.equal(new URL(page.url()).searchParams.get("skill"), "4.0+")
    await noOverflow()
    pass(`${width}px collapsed finder skips hidden controls and retains selections when reopened`)

    await goto("/pickleball-camps")
    const open = page.getByRole("button", { name: "Filters", exact: true })
    await open.click()
    const dialog = page.getByRole("dialog", { name: "Filter Camps" })
    await dialog.waitFor()
    for (const name of ["Toronto & GTA", "Muskoka", "Punta Cana", "Camp", "Clinic"]) {
      await dialog.getByRole("checkbox", { name, exact: true }).waitFor()
    }
    const ids = await dialog.getByRole("checkbox").evaluateAll((nodes) => nodes.map((node) => node.id))
    assert(await page.evaluate((ids) => ids.every((id) => [...document.querySelectorAll("[id]")].filter((el) => el.id === id).length === 1), ids))
    await dialog.getByRole("button", { name: "Skill Level", exact: true }).click()
    const box = dialog.getByRole("checkbox", { name: "Toronto & GTA", exact: true })
    await box.focus()
    await page.keyboard.press("Space")
    await dialog.getByRole("checkbox", { name: "Toronto & GTA", exact: true, checked: true }).waitFor()
    assert(await box.evaluate((el) => el === document.activeElement))
    assert.equal(await dialog.getByRole("button", { name: "Skill Level", exact: true }).getAttribute("aria-expanded"), "false")
    await page.screenshot({ path: `${output}/filters-${width}.png`, animations: "disabled" })
    await dialog.getByRole("button", { name: "Apply Filters", exact: true }).click()
    await dialog.waitFor({ state: "hidden" })
    await cards([allCards[1]])
    await open.click()
    await page.keyboard.press("Escape")
    await dialog.waitFor({ state: "hidden" })
    assert(await open.evaluate((el) => el === document.activeElement))
    await noOverflow()
    pass(`${width}px named unique filter controls, stable keyboard focus/accordion and Apply/Escape`)
  }

  for (const width of [1440, 393, 320]) {
    await page.setViewportSize({ width, height: 900 })
    for (const [slug, date, price] of [
      ["toronto-intermediate-pickleball-camp", "April 11-12, 2026", "$900 CAD / player"],
      ["saint-martin-pickleball-clinic", "Mar 20, 2026", "$150 USD"],
    ]) {
      await goto(`/pickleball-camps/${slug}`)
      await page.getByText("This camp is completed. Registration is closed.", { exact: true }).first().waitFor()
      const text = await page.locator("body").innerText()
      assert(text.includes(date))
      if (width === 1440) assert(text.includes(price))
      assert(!/One Spot Left|Only \d+ spots? left|Book Now/.test(text))
      assert.equal(await page.locator('a[href*="stripe.com"]').count(), 0)
      await noOverflow()
      await page.screenshot({ path: `${output}/${slug}-${width}.png`, animations: "disabled" })
      await page.getByRole("link", { name: "View recap", exact: true }).first().click()
      await page.waitForURL(`**/${slug}/recap`)
      await page.locator("h1").first().waitFor()
      await page.goBack({ waitUntil: "load" })
      await page.getByRole("link", { name: "Browse upcoming camps", exact: true }).first().click()
      await page.waitForURL("**/pickleball-camps")
      await page.getByRole("tabpanel", { name: "Upcoming Camps", exact: true }).waitFor()
    }
    pass(`${width}px completed adult pages: no scarcity/payment links, preserved facts, recap/upcoming paths`)
  }

  await goto("/pickleball-camps/etobicoke-kids-weekly-pickleball-camp-jan-5-2027")
  await page.getByRole("tab", { selected: true }).filter({ hasText: "Tuesdays" }).waitFor()
  await page.locator("#book").getByRole("link", { name: "Book Tuesdays", exact: true }).click()
  await page.locator(".total-row .v").filter({ hasText: "$587.60" }).waitFor()
  await page.getByRole("button", { name: /Add another/ }).click()
  await page.locator(".total-row .v").filter({ hasText: "$1,175.20" }).waitFor()
  await page.getByRole("link", { name: "Back to camp", exact: true }).click()
  await page.getByRole("tab", { selected: true }).filter({ hasText: "Tuesdays" }).waitFor()
  pass("Prior kids Tuesday checkout/return and sibling totals remain correct")
  assert.deepEqual(errors, [])
  assert.deepEqual(writes, [])
  pass("No unexpected runtime errors, external writes or form submissions")
  await writeFile(`${output}/results.json`, JSON.stringify({ passed, errors, writes }, null, 2))
} finally {
  await browser.close()
}
