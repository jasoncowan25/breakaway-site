import type { Metadata } from 'next'

import { CoachRoster } from '../pickleball-coaches/CoachRoster'

export const metadata: Metadata = {
  title: 'Pickleball Coaches | Breakaway Pickleball',
  description: 'Meet Breakaway Pickleball coaches Joey Manchurek and Sam Schachter in Toronto.',
  alternates: { canonical: '/pickleball-coaches' },
}

export default function CoachesPage() {
  return <CoachRoster />
}
