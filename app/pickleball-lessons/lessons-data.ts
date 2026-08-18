/* Breakaway Lessons — data + config model.
   Ported from the approved Claude Design project
   (templates/lesson-booking/lessons-data.js). Nothing seasonal or
   price-related is hard-coded into presentation components. Keep coach
   rates in sync with apps/api/lib/lessons/config.ts in the breakaway
   monorepo. */

export interface CoachPhoto {
  src: string
  alt: string
}

export interface LessonCoach {
  id: string
  slug: string
  name: string
  firstName: string
  image: string
  alt: string
  photos: CoachPhoto[]
  description: string
  levelLabel: string
  selectorDescriptor: string
  levelRange: string
  playerRating: string
  ratingLabel: string
  bio: string
  hourlyRate: number
  locations: string[]
  cities: string[]
  nextAvailable: string
  leadDays: number
  blockedWeekdays: number[]
  active: boolean
  bookingAvailable: boolean
}

export interface LessonCity {
  id: string
  name: string
  order: number
  isDefault: boolean
  activeMonths: number[]
  blurb: string
  offSeasonLabel?: string
  offSeasonHeading?: string
  offSeasonMessage?: string
  locations: string[]
  coaches: string[]
}

export const config = {
  oneClickBookingsEnabled: false,
  requestFormEnabled: true,
  muskokaSeasonStartMonth: 6,
  muskokaSeasonEndMonth: 8,
  responseWindowHours: 24,
  cancellationWindowHours: 72,
}

const IMG = '/images/lessons'

export const coaches: LessonCoach[] = [
  {
    id: 'joey',
    slug: 'joey-manchurek',
    name: 'Joey Manchurek',
    firstName: 'Joey',
    image: `${IMG}/coach-joey-1.png`,
    alt: 'Joey Manchurek, Breakaway Pickleball coach',
    photos: [
      { src: `${IMG}/coach-joey-1.png`, alt: 'Joey Manchurek, Breakaway Pickleball coach' },
      { src: `${IMG}/coach-joey-2.jpg`, alt: 'Joey Manchurek holding a tournament trophy and paddle' },
      { src: `${IMG}/coach-joey-3.jpg`, alt: 'Joey Manchurek coaching a player at the net' },
    ],
    description:
      'Former pro hockey player turned competitive pickleball player, bringing leadership and a technical, game-focused approach.',
    levelLabel: 'Best for: Intermediate–Advanced',
    selectorDescriptor: 'Intermediate to advanced coaching',
    levelRange: '3.0 – 4.5+',
    playerRating: '5.00',
    ratingLabel: 'DUPR 5.00',
    bio: 'Former pro hockey player (OHL Oshawa Generals captain; later ECHL). Grew up playing tennis and table tennis before transitioning quickly to competitive pickleball. Actively competes in tournaments, with a coaching focus on leadership, skill development and helping players reach their potential.',
    hourlyRate: 125,
    locations: ['jar', 'dill', 'muskoka'],
    cities: ['toronto', 'muskoka'],
    nextAvailable: 'Wednesday, August 12',
    leadDays: 21,
    blockedWeekdays: [],
    active: true,
    bookingAvailable: true,
  },
  {
    id: 'sam',
    slug: 'sam-schachter',
    name: 'Sam Schachter',
    firstName: 'Sam',
    image: `${IMG}/coach-sam-1.jpg`,
    alt: 'Sam Schachter, Breakaway Pickleball coach',
    photos: [
      { src: `${IMG}/coach-sam-1.jpg`, alt: 'Sam Schachter, Breakaway Pickleball coach' },
      { src: `${IMG}/coach-sam-2.jpg`, alt: 'Sam Schachter reaching for a shot on an outdoor court' },
      { src: `${IMG}/coach-sam-3.jpg`, alt: 'Sam Schachter bending low to dig out a ball at the kitchen line' },
    ],
    description:
      'Rising competitive player with strong fundamentals, a patient style and a passion for helping others improve.',
    levelLabel: 'Best for: Beginner–Intermediate',
    selectorDescriptor: 'Beginner to intermediate coaching',
    levelRange: '2.0 – 3.5',
    playerRating: '4.50',
    ratingLabel: 'DUPR 4.50',
    bio: 'Sam is a rising young player climbing the competitive ranks quickly. He regularly competes in Toronto and Florida and brings strong fundamentals, patience and a genuine passion for helping others improve.',
    hourlyRate: 100,
    locations: ['jar', 'dill'],
    cities: ['toronto'],
    nextAvailable: 'Tuesday, August 18',
    leadDays: 4,
    blockedWeekdays: [6],
    active: true,
    bookingAvailable: true,
  },
]

export const cities: LessonCity[] = [
  {
    id: 'toronto',
    name: 'Toronto',
    order: 1,
    isDefault: true,
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    blurb: 'Private lessons are available year-round at select Toronto pickleball clubs.',
    locations: ['jar', 'dill'],
    coaches: ['joey', 'sam'],
  },
  {
    id: 'muskoka',
    name: 'Muskoka',
    order: 2,
    isDefault: false,
    activeMonths: [6, 7, 8],
    blurb: 'Spend your summer improving your game with private coaching in Muskoka.',
    offSeasonLabel: 'Returns in June',
    offSeasonHeading: 'Muskoka lessons return in June.',
    offSeasonMessage:
      'Private lessons in Muskoka are offered during June, July and August. Toronto lessons remain available throughout the year.',
    locations: ['muskoka'],
    coaches: ['joey'],
  },
]

export const locations: Record<string, { id: string; name: string; short: string; detail: string; city: string }> = {
  jar: { id: 'jar', name: 'The Jar Pickleball Club', short: 'The Jar', detail: 'North York, Toronto', city: 'toronto' },
  dill: { id: 'dill', name: 'The Dill Pickleball Club', short: 'The Dill', detail: 'Toronto', city: 'toronto' },
  muskoka: { id: 'muskoka', name: 'Private Breakaway Facility', short: 'Breakaway Facility', detail: 'Muskoka', city: 'muskoka' },
}

export const timeOptions = ['Early morning', 'Morning', 'Midday', 'Afternoon', 'Evening']

export const extraPlayerRate = 20
export const playerCounts = [1, 2, 3]

export function currentMonth(override?: number): number {
  return override ? Number(override) : new Date().getMonth() + 1
}

export function cityState(cityId: string, month: number) {
  const city = cities.find((c) => c.id === cityId)!
  const open = city.activeMonths.indexOf(month) !== -1
  return {
    id: city.id,
    name: city.name,
    open,
    city,
    label: open ? null : city.offSeasonLabel,
    heading: city.offSeasonHeading,
    message: city.offSeasonMessage,
    blurb: city.blurb,
  }
}

/* 'Wednesday, August 12' -> 'Wed, Aug 12' */
export function shortDate(label: string): string {
  if (!label) return ''
  return String(label).replace(/^([A-Za-z]{3})[a-z]*,\s*([A-Za-z]{3})[a-z]*/, '$1, $2')
}

export function coach(id: string): LessonCoach | undefined {
  return coaches.find((c) => c.id === id)
}

export function photos(id: string): CoachPhoto[] {
  const c = coach(id)
  if (!c) return []
  return c.photos && c.photos.length ? c.photos : [{ src: c.image, alt: c.alt }]
}

export function coachesForCity(cityId: string): LessonCoach[] {
  return coaches.filter((c) => c.cities.indexOf(cityId) !== -1)
}

function addIsoDays(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function isoWeekday(isoDate: string): number {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay()
}

function coachCanTakeDate(c: LessonCoach, requestedDate: string, today: string): boolean {
  return requestedDate >= addIsoDays(today, c.leadDays) && !c.blockedWeekdays.includes(isoWeekday(requestedDate))
}

export function isRequestDateAllowed(
  coachChoice: string,
  cityId: string,
  requestedDate: string,
  today: string,
): boolean {
  const selected = coachChoice && coachChoice !== 'none' ? coach(coachChoice) : null
  const candidates = selected
    ? [selected]
    : coachesForCity(cityId).filter((candidate) => candidate.active && candidate.bookingAvailable)

  return candidates.some(
    (candidate) => candidate.cities.includes(cityId) && coachCanTakeDate(candidate, requestedDate, today),
  )
}

export function earliestRequestDate(coachChoice: string, cityId: string, today: string): string {
  for (let offset = 0; offset <= 366; offset += 1) {
    const candidate = addIsoDays(today, offset)
    if (isRequestDateAllowed(coachChoice, cityId, candidate, today)) return candidate
  }
  return addIsoDays(today, 367)
}

export function money(n: number): string {
  return '$' + (Math.round(n * 100) % 100 === 0 ? String(Math.round(n)) : n.toFixed(2))
}

export function clampPlayers(players: number): number {
  const p = Math.round(Number(players) || 1)
  return Math.min(3, Math.max(1, p))
}

export function playersLabel(players: number): string {
  const p = clampPlayers(players)
  return p === 1 ? '1 player' : p + ' players (including me)'
}

export function pricing(coachId: string, players: number) {
  const p = clampPlayers(players)
  const c = coachId && coachId !== 'none' ? coach(coachId) : null
  const base = c ? c.hourlyRate : null
  const extras = p - 1
  const extra = extras * extraPlayerRate
  const total = base == null ? null : base + extra
  return {
    players: p,
    extras,
    base,
    extra,
    total,
    perPlayer: total == null ? null : total / p,
    baseLabel: base == null ? 'Confirmed on match' : money(base) + '/hour',
    extraLabel: extras ? '+' + money(extra) + '/hour' : 'None',
    extraDetail: extras
      ? extras + ' additional ' + (extras === 1 ? 'player' : 'players') + ' × ' + money(extraPlayerRate) + '/hour'
      : 'Just you — no additional charge',
    totalLabel: total == null ? 'Confirmed on match' : money(total) + '/hour total',
    totalShort: total == null ? 'Rate on match' : money(total) + '/hr',
    totalValue: total == null ? '—' : money(total),
    splitLabel: total == null || p === 1 ? '' : money(total / p) + ' per player if split evenly',
    playersLabel: playersLabel(p),
  }
}

export function formatPhone(v: string): string {
  let d = String(v == null ? '' : v).replace(/\D/g, '')
  if (d.length > 10 && d.charAt(0) === '1') d = d.slice(1)
  d = d.slice(0, 10)
  if (d.length <= 3) return d
  if (d.length <= 6) return '(' + d.slice(0, 3) + ') ' + d.slice(3)
  return '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6)
}

export interface LessonForm {
  coach: string
  firstName: string
  lastName: string
  email: string
  phone: string
  consent: boolean
  players: number
  playerNames: string
  city: string
  slots: { date: string; time: string; flexible: boolean }[]
  notes: string
}

export function validate(f: LessonForm, month: number): Record<string, string> {
  const e: Record<string, string> = {}
  if (!f.coach) e.coach = 'Please select a coach or choose no preference.'
  if (!f.firstName || !f.firstName.trim()) e.firstName = 'Please enter your first name.'
  if (!f.lastName || !f.lastName.trim()) e.lastName = 'Please enter your last name.'
  if (!f.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Please enter a valid email address.'
  if (!f.phone || f.phone.replace(/\D/g, '').length < 10) e.phone = 'Please enter a valid phone number.'
  const filled = (f.slots || []).filter((s) => s.date && s.time)
  if (!filled.length) e.slots = 'Please choose at least one requested date and time.'
  if (f.city === 'muskoka' && !cityState('muskoka', month).open) e.city = 'Muskoka lessons return in June. Please select Toronto.'
  return e
}

export function emptyForm(): LessonForm {
  return {
    coach: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    consent: false,
    players: 1,
    playerNames: '',
    city: 'toronto',
    slots: [{ date: '', time: '', flexible: false }],
    notes: '',
  }
}

export function track(event: string, payload?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] }
  ;(w.dataLayer = w.dataLayer || []).push({ event, ...(payload || {}) })
}
