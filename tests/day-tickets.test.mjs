import assert from 'node:assert/strict'
import { test } from 'node:test'
import { dayTicketBadge, dayTicketStartingPrice, ticketMoney } from '../lib/day-tickets.ts'

const offer = { priceCents: 35000, days: [
  { date: '2026-10-24', priceCents: 35000, available: true },
  { date: '2026-10-25', priceCents: 37550, available: true },
] }

test('flexible badge appears only for a multi-day offer', () => {
  assert.equal(dayTicketBadge(offer), '1 or 2 Days')
  assert.equal(dayTicketBadge(null), null)
})
test('starting price reflects the cheapest available date', () => {
  assert.equal(dayTicketStartingPrice(offer), 35000)
  assert.equal(dayTicketStartingPrice({ ...offer, days: [{ ...offer.days[0], available: false }, offer.days[1]] }), 37550)
})
test('prices retain cents and legacy offers retain their shared price', () => {
  assert.equal(ticketMoney(37550), '$375.50')
  assert.equal(ticketMoney(35000), '$350')
  assert.equal(dayTicketStartingPrice({ priceCents: 35000, days: [{ available: true }] }), 35000)
})

test('day tickets open the branded checkout with the selected date', async () => {
  const { dayTicketCheckoutHref } = await import('../lib/day-tickets.ts')
  assert.equal(dayTicketCheckoutHref('toronto-intensive', '2026-10-24'), '/checkout/toronto-intensive?day=2026-10-24')
  assert.equal(dayTicketCheckoutHref('toronto-intensive', '2026-10-25'), '/checkout/toronto-intensive?day=2026-10-25')
})

test('checkout uses the selected date price without requiring a legacy payment link', async () => {
  const { checkoutDayTicket } = await import('../lib/day-tickets.ts')
  assert.equal(checkoutDayTicket(offer, '2026-10-25').priceCents, 37550)
  assert.equal(checkoutDayTicket(offer, '2026-10-26'), null)
  assert.equal(checkoutDayTicket(null, '2026-10-24'), null)
  assert.equal(checkoutDayTicket({ ...offer, days: [{ ...offer.days[0], available: false }] }, '2026-10-24'), null)
  assert.equal(checkoutDayTicket({ ...offer, days: [{ ...offer.days[0], priceCents: 0 }] }, '2026-10-24'), null)
})
