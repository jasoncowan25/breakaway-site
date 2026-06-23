import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

import {
  buildCampCalendarDownload,
  buildGoogleCalendarUrl,
  buildOutlookCalendarUrl,
  buildCampCalendarIcs,
} from "../lib/calendar.ts"
import {
  checkoutAmount,
} from "../lib/checkout-amount.ts"
import {
  nextTeeOptionIndex,
  teeOptionIndex,
} from "../lib/tee-select.ts"

test("tee select keyboard helpers move through options predictably", () => {
  const options = ["XS", "S", "M"]

  assert.equal(teeOptionIndex("", options), -1)
  assert.equal(teeOptionIndex("S", options), 1)
  assert.equal(nextTeeOptionIndex("ArrowDown", -1, options), 0)
  assert.equal(nextTeeOptionIndex("ArrowDown", 1, options), 2)
  assert.equal(nextTeeOptionIndex("ArrowDown", 2, options), 2)
  assert.equal(nextTeeOptionIndex("ArrowUp", -1, options), 2)
  assert.equal(nextTeeOptionIndex("Home", 2, options), 0)
  assert.equal(nextTeeOptionIndex("End", 0, options), 2)
})

test("tee select opens on focus and exposes combobox/listbox semantics", async () => {
  const source = await readFile(new URL("../components/checkout/PlayerCard.tsx", import.meta.url), "utf8")

  assert.match(source, /role="combobox"/)
  assert.match(source, /aria-expanded=/)
  assert.match(source, /role="listbox"/)
  assert.match(source, /role="option"/)
  assert.match(source, /onFocus=.*openList/s)
})

test("camp calendar helper builds timed events for each camp day", () => {
  const ics = buildCampCalendarIcs({
    id: "reg_123",
    title: "Toronto Intermediate Intensive",
    startDate: "2026-09-12",
    endDate: "2026-09-13",
    venue: "The Jar Pickleball Club",
    startHour: 9,
    endHour: 15,
  })

  assert.match(ics, /^BEGIN:VCALENDAR\r\nVERSION:2\.0\r\n/)
  assert.match(ics, /UID:breakaway-reg_123-20260912@breakawaypickleball\.ca/)
  assert.match(ics, /DTSTART;TZID=America\/Toronto:20260912T090000/)
  assert.match(ics, /DTEND;TZID=America\/Toronto:20260912T150000/)
  assert.match(ics, /UID:breakaway-reg_123-20260913@breakawaypickleball\.ca/)
  assert.match(ics, /DTSTART;TZID=America\/Toronto:20260913T090000/)
  assert.match(ics, /DTEND;TZID=America\/Toronto:20260913T150000/)
  assert.equal(ics.match(/BEGIN:VEVENT/g)?.length, 2)
  assert.doesNotMatch(ics, /VALUE=DATE/)
  assert.match(ics, /SUMMARY:Toronto Intermediate Intensive/)
  assert.match(ics, /LOCATION:The Jar Pickleball Club/)

  const download = buildCampCalendarDownload({
    id: "reg_123",
    title: "Toronto Intermediate Intensive",
    startDate: "2026-09-12",
    endDate: "2026-09-13",
    venue: "The Jar Pickleball Club",
    startHour: 9,
    endHour: 15,
  })

  assert.equal(download.filename, "breakaway-toronto-intermediate-intensive.ics")
  assert.match(download.href, /^data:text\/calendar;charset=utf-8,/)
  assert.ok(decodeURIComponent(download.href).includes("BEGIN:VCALENDAR"))

  assert.match(buildGoogleCalendarUrl({
    id: "reg_123",
    title: "Toronto Intermediate Intensive",
    startDate: "2026-09-12",
    endDate: "2026-09-13",
    venue: "The Jar Pickleball Club",
    startHour: 9,
    endHour: 15,
  }), /^https:\/\/calendar\.google\.com\/calendar\/render\?/)
  assert.match(buildOutlookCalendarUrl({
    id: "reg_123",
    title: "Toronto Intermediate Intensive",
    startDate: "2026-09-12",
    endDate: "2026-09-13",
    venue: "The Jar Pickleball Club",
    startHour: 9,
    endHour: 15,
  }), /^https:\/\/outlook\.live\.com\/calendar\/0\/deeplink\/compose\?/)
})

test("adult player details tab from last name reaches T-shirt before email", async () => {
  const source = await readFile(new URL("../components/checkout/PlayerCard.tsx", import.meta.url), "utf8")

  const adultBranch = source.slice(source.indexOf(") : ("), source.indexOf("</>\\n      )}\\n    </div>"))
  assert.ok(adultBranch.indexOf('label="T-shirt size"') < adultBranch.indexOf('label="Email"'))
  assert.match(source, /onPointerDown=\{\(event\) => event\.preventDefault\(\)\}/)
  assert.match(source, /onMouseDown=\{\(event\) => event\.preventDefault\(\)\}/)
  assert.match(source, /requestAnimationFrame\(\(\) => buttonRef\.current\?\.focus\(\)\)/)
  assert.match(source, /focusTeeOnTab/)
  assert.match(source, /event\.key !== "Tab"/)
  assert.match(source, /teeSelectRef\.current\.focus\(\)/)
})

test("confirmation and payment views wire calendar download and Stripe autofill blur", async () => {
  const successView = await readFile(new URL("../components/checkout/SuccessView.tsx", import.meta.url), "utf8")
  const addToCalendar = await readFile(new URL("../components/AddToCalendar.tsx", import.meta.url), "utf8")
  const actionRow = await readFile(new URL("../components/ActionRow.tsx", import.meta.url), "utf8")
  const confirmationClient = await readFile(
    new URL("../app/checkout/confirmation/confirmation-client.tsx", import.meta.url),
    "utf8",
  )
  const checkoutClient = await readFile(
    new URL("../app/checkout/[slug]/checkout-client.tsx", import.meta.url),
    "utf8",
  )
  const checkoutView = await readFile(new URL("../components/checkout/CheckoutView.tsx", import.meta.url), "utf8")

  assert.match(successView, /AddToCalendar/)
  assert.match(successView, /calendarEvent/)
  assert.match(addToCalendar, /Google Calendar/)
  assert.match(addToCalendar, /Outlook/)
  assert.match(addToCalendar, /Apple Calendar/)
  assert.match(actionRow, /AddToCalendar/)
  assert.match(confirmationClient, /calendarEvent/)
  assert.match(checkoutClient, /onAutofillComplete/)
  assert.match(checkoutView, /bookingButtonRef/)
})

test("checkout summary shows HST and uses the tax-inclusive total", async () => {
  assert.deepEqual(checkoutAmount(5), { subtotal: 5, tax: 0.65, total: 5.65 })
  assert.deepEqual(checkoutAmount(10), { subtotal: 10, tax: 1.3, total: 11.3 })

  const checkoutView = await readFile(new URL("../components/checkout/CheckoutView.tsx", import.meta.url), "utf8")
  const checkoutClient = await readFile(
    new URL("../app/checkout/[slug]/checkout-client.tsx", import.meta.url),
    "utf8",
  )

  assert.match(checkoutView, /HST \(13%\)/)
  assert.match(checkoutView, /money\(tax\)/)
  assert.match(checkoutView, /money\(total\)/)
  assert.doesNotMatch(checkoutView, /Calculated at confirm/)
  assert.match(checkoutClient, /checkoutAmount\(subtotal\)\.total/)
})
