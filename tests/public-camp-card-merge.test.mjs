import assert from 'node:assert/strict'
import test from 'node:test'
import { mergePublicCampCards } from '../lib/public-camp-card-merge.ts'

test('a live card replaces a static card with the same link', () => {
  const staticCards = [{ link: '/pickleball-camps/toronto-oct', image: '/players.png' }]
  const liveCards = [{ link: '/pickleball-camps/toronto-oct', image: '/court.png' }]

  assert.deepEqual(mergePublicCampCards(staticCards, liveCards), liveCards)
})

test('a static card remains when no live card has its link', () => {
  const staticCards = [{ link: '/pickleball-camps/fallback', image: '/fallback.png' }]

  assert.deepEqual(mergePublicCampCards(staticCards, []), staticCards)
})
