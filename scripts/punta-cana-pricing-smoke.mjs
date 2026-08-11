import assert from "node:assert/strict"

const baseUrl = process.env.PUNTA_CANA_BASE_URL ?? "http://localhost:3000"

async function fetchPage(path) {
  const response = await fetch(new URL(path, baseUrl))
  assert.equal(response.status, 200, `${path} should return HTTP 200`)
  return response.text()
}

function visibleText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"')
    .replace(/\s+/g, " ")
    .trim()
}

const retreatHtml = await fetchPage("/pickleball-camps/punta-cana")
const retreatText = visibleText(retreatHtml)

for (const retiredText of [
  "Pricing & Room Options",
  "Room Preference",
  "rooms available",
  "$800 program fee",
  "From $2,201 CAD",
]) {
  assert.ok(!retreatText.includes(retiredText), `retreat page still shows: ${retiredText}`)
}

assert.doesNotMatch(retreatText, /\$[\d,]+(?:\s+CAD)?/, "retreat page should not show a fixed dollar price")
assert.doesNotMatch(retreatText, /\d+\s+rooms?\b/i, "retreat page should not show room availability")
assert.ok(retreatText.includes("Number of Travellers"), "registration form should retain traveller count")
for (const retiredConversionCopy of [
  "Contact for trip details",
  "Register Your Interest",
  "Register Interest",
]) {
  assert.ok(!retreatText.includes(retiredConversionCopy), `retreat page still shows: ${retiredConversionCopy}`)
}

assert.ok(retreatText.includes("Request Pricing"), "retreat page should offer a pricing request")
assert.doesNotMatch(retreatHtml, /pricing from \$|"priceCurrency"/i, "retreat metadata should not advertise a fixed price")

for (const path of ["/", "/pickleball-camps", "/schedule"]) {
  const text = visibleText(await fetchPage(path))
  assert.match(
    text,
    /Punta Cana Destination Retreat.*?Request Pricing/s,
    `${path} should show Request Pricing on the Punta Cana card`,
  )
}

console.log("Punta Cana pricing smoke checks passed")
