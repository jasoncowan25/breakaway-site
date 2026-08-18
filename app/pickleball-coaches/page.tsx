import type { Metadata } from 'next'

import { JsonLd } from '@/components/JsonLd'
import { personJsonLd } from '@/lib/seo'

import { CoachRoster } from './CoachRoster'
import { coachRoster } from './coaches-data'

export const metadata: Metadata = {
  title: 'Pickleball Coaches | Pro-Led Training | Breakaway Camps',
  description: 'Meet Breakaway Pickleball coaches Joey Manchurek and Sam Schachter in Toronto.',
  alternates: {
    canonical: '/pickleball-coaches',
  },
  openGraph: {
    url: '/pickleball-coaches',
  },
}

export default function CoachesPage() {
  return (
    <>
      {coachRoster.map((coach) => (
        <JsonLd
          key={coach.slug}
          data={personJsonLd({
            name: coach.name,
            jobTitle: coach.role.split(' · ')[0],
            image: coach.image,
            description: coach.bio,
          })}
        />
      ))}
      <CoachRoster />
    </>
  )
}
