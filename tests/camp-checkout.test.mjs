import assert from 'node:assert/strict'
import { test } from 'node:test'
import { campCheckoutHref } from '../lib/camp-checkout.ts'

const stripe = 'https://buy.stripe.com/test_link'

test('a priced camp books through the branded checkout, not its Stripe link', () => {
  assert.equal(
    campCheckoutHref({ checkoutPath: '/checkout/toronto-adult-camp', checkoutUrl: stripe, priceCents: 70000 }),
    '/checkout/toronto-adult-camp',
  )
})
test('any slug qualifies — there is no per-camp allowlist', () => {
  assert.equal(
    campCheckoutHref({ checkoutPath: '/checkout/a-camp-created-tomorrow', checkoutUrl: stripe, priceCents: 1 }),
    '/checkout/a-camp-created-tomorrow',
  )
})
test('an unpriced camp keeps its Stripe link, since the checkout cannot charge it', () => {
  assert.equal(campCheckoutHref({ checkoutPath: '/checkout/x', checkoutUrl: stripe, priceCents: null }), stripe)
  assert.equal(campCheckoutHref({ checkoutPath: '/checkout/x', checkoutUrl: stripe, priceCents: 0 }), stripe)
  assert.equal(campCheckoutHref({ checkoutPath: '/checkout/x', checkoutUrl: null, priceCents: null }), null)
})
test('a camp without a slug path falls back to its Stripe link', () => {
  assert.equal(campCheckoutHref({ checkoutPath: null, checkoutUrl: stripe, priceCents: 70000 }), stripe)
})
test('a camp whose price is not supplied still uses the branded checkout', () => {
  assert.equal(campCheckoutHref({ checkoutPath: '/checkout/x', checkoutUrl: null }), '/checkout/x')
})
