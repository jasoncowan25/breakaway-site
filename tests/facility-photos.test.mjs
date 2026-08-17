import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveFacilityPhotos } from '../lib/facility-photos.ts'

test('a JAR facility uses its database photos before static fallbacks', () => {
  const facility = {
    name: 'The JAR Pickleball Club',
    photo_url: 'https://example.com/court-default.png',
    photos: [
      'https://example.com/court-default.png',
      'https://example.com/court-two.png',
    ],
  }

  assert.deepEqual(
    resolveFacilityPhotos(facility, '/generic.png', ['/players.png']),
    [
      'https://example.com/court-default.png',
      'https://example.com/court-two.png',
    ],
  )
})

test('a JAR facility without database photos keeps its static fallback', () => {
  assert.deepEqual(
    resolveFacilityPhotos(
      { name: 'The JAR Pickleball Club', photo_url: null, photos: null },
      '/generic.png',
      ['/jar-fallback.png'],
    ),
    ['/jar-fallback.png'],
  )
})
