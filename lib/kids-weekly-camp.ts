import type { ApiCamp } from "./breakaway-api.ts"
import { formatRecurringCampDates } from "./session-time.ts"
import { campVenueDetails } from "./camp-venue.ts"

export const KIDS_WEEKLY_LANDING_PATH =
  "/pickleball-camps/kids-weekly-pickleball-camp-toronto"

const JAR = { venue: "The JAR Pickleball Club", city: "Toronto, ON", venueShort: "The JAR" } as const
const PICKLR_WEST = { venue: "The Picklr Toronto West", city: "Etobicoke, ON", venueShort: "Picklr West" } as const

/** Winter 2027: three All Skill Levels nights across two clubs. */
export const KIDS_WEEKLY_PROGRAMS = {
  jarMon: {
    slug: "toronto-kids-weekly-pickleball-camp-jan-4-2027",
    name: "All Skill Levels",
    shortName: JAR.venueShort,
    ...JAR,
    track: "allLevels",
    day: "Mondays",
    duration: "one-hour",
    capacity: 30,
    badge: null,
    description: "Grip, serve and rally first, then real game play — Monday evenings at The JAR in Toronto.",
  },
  picklrTue: {
    slug: "etobicoke-kids-weekly-pickleball-camp-jan-5-2027",
    name: "All Skill Levels",
    shortName: PICKLR_WEST.venueShort,
    ...PICKLR_WEST,
    track: "allLevels",
    day: "Tuesdays",
    duration: "one-hour",
    capacity: 30,
    badge: "New Location",
    description: "The same program after school on Tuesdays at The Picklr Toronto West in Etobicoke.",
  },
  jarThu: {
    slug: "toronto-kids-weekly-pickleball-camp-jan-7-2027",
    name: "All Skill Levels",
    shortName: JAR.venueShort,
    ...JAR,
    track: "allLevels",
    day: "Thursdays",
    duration: "one-hour",
    capacity: 30,
    badge: null,
    description: "Grip, serve and rally first, then real game play — Thursday evenings at The JAR in Toronto.",
  },
} as const

export type KidsWeeklyProgramKey = keyof typeof KIDS_WEEKLY_PROGRAMS

/** Landing-page order: by weekday. */
export const KIDS_WEEKLY_PROGRAM_KEYS: readonly KidsWeeklyProgramKey[] = [
  "jarMon",
  "picklrTue",
  "jarThu",
]

/** The booking card opens on the first night of the week. */
export const KIDS_WEEKLY_DEFAULT_PROGRAM: KidsWeeklyProgramKey = "jarMon"

export const KIDS_WEEKLY_PROGRAM_SLUGS = Object.values(KIDS_WEEKLY_PROGRAMS).map(
  (program) => program.slug,
)

/** Fall 2026 programs: still routed here so their old URLs land on the current season. */
const KIDS_WEEKLY_PAST_SLUGS = [
  "toronto-kids-weekly-all-levels-mondays-sep-14-2026",
  "toronto-kids-weekly-all-levels-sep-10-2026",
  "toronto-kids-weekly-experienced-sep-7-2026",
]
const KIDS_WEEKLY_PROGRAM_SLUG_SET = new Set<string>([...KIDS_WEEKLY_PROGRAM_SLUGS, ...KIDS_WEEKLY_PAST_SLUGS])

const TRACK_COPY = {
  allLevels: {
    whoFor: "All levels, from complete beginners to experienced players",
    includes: ["Fundamentals: serve, return, dinking, volleys", "Paddles available to borrow"],
  },
  experienced: {
    whoFor: "Playing one year or more",
    includes: ["Strategy, court positioning and shot selection", "Capped at 10 players for more court time"],
  },
} as const

export function kidsWeeklyProgramKey(value: string | null | undefined): KidsWeeklyProgramKey {
  return KIDS_WEEKLY_PROGRAM_KEYS.find((key) => key === value) ?? KIDS_WEEKLY_DEFAULT_PROGRAM
}

export function kidsWeeklyProgramPath(key: KidsWeeklyProgramKey) {
  return `${KIDS_WEEKLY_LANDING_PATH}?program=${key}`
}

export function kidsWeeklyLandingPathForCamp(slug: string | null | undefined) {
  if (!slug || !KIDS_WEEKLY_PROGRAM_SLUG_SET.has(slug)) return null
  const key = KIDS_WEEKLY_PROGRAM_KEYS.find((key) => KIDS_WEEKLY_PROGRAMS[key].slug === slug)
  if (key) return kidsWeeklyProgramPath(key)
  return KIDS_WEEKLY_LANDING_PATH
}

export function shouldListKidsWeeklyCampAsStandalone(slug: string | null | undefined) {
  return kidsWeeklyLandingPathForCamp(slug) === null
}

export type KidsWeeklyCampLike = Pick<
  ApiCamp,
  | "slug"
  | "basePriceCents"
  | "capacity"
  | "spotsLeft"
  | "isSoldOut"
  | "sessionDates"
  | "sessionLabel"
  | "publicVisibility"
> & Partial<Pick<ApiCamp, "facility">>

const SHORT_DATE = new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", timeZone: "UTC" })

/** Weekly dates the run skips (holidays, breaks): every gap longer than a week. */
export function skippedWeeks(sessionDates: readonly string[] | null | undefined): string[] {
  const dates = [...(sessionDates ?? [])].sort()
  const skipped: string[] = []
  for (let i = 1; i < dates.length; i++) {
    const next = Date.parse(`${dates[i]}T00:00:00Z`)
    for (let d = Date.parse(`${dates[i - 1]}T00:00:00Z`) + 7 * 864e5; d < next; d += 7 * 864e5) {
      skipped.push(new Date(d).toISOString().slice(0, 10))
    }
  }
  return skipped
}

function formatMoney(cents: number | null | undefined) {
  if (cents == null) return "Registration unavailable"
  return `$${Math.round(cents / 100).toLocaleString("en-CA")} CAD`
}

/** Experienced books by track; every other program books by its night. */
function bookingName(track: keyof typeof TRACK_COPY, day: string) {
  return track === "experienced" ? "Experienced" : day
}

export function buildKidsWeeklyProgram(
  key: KidsWeeklyProgramKey,
  camp: KidsWeeklyCampLike | null,
) {
  const config = KIDS_WEEKLY_PROGRAMS[key]
  const track = TRACK_COPY[config.track]
  const recurring = camp
    ? formatRecurringCampDates(camp.sessionDates, camp.sessionLabel)
    : null
  const soldOut = Boolean(camp?.isSoldOut || camp?.spotsLeft === 0)
  const unavailable = !camp || !recurring || camp.basePriceCents == null
  const capacity = camp?.capacity ?? config.capacity
  const sessionCount = camp?.sessionDates?.length ?? 0

  // "Mondays · 6:00 PM – 7:00 PM" → the live weekday wins over the config's,
  // so a rescheduled camp never shows a stale day.
  const [liveDay, ...liveTime] = (recurring?.scheduleLabel ?? "").split(" · ")
  const day = liveDay || config.day
  const timeLabel = liveTime.join(" · ") || "Time to be confirmed"
  const scheduleLabel = recurring?.scheduleLabel ?? "Schedule unavailable"
  const dateLabel = recurring?.dateLabel ?? "Schedule unavailable"
  const skipped = skippedWeeks(camp?.sessionDates).map((date) => SHORT_DATE.format(new Date(`${date}T00:00:00Z`)))
  const skippedLabel = skipped.length ? skipped.join(" · ") : null
  const sessionsLabel = sessionCount > 0
    ? `${sessionCount} ${config.duration} sessions`
    : "Schedule unavailable"

  return {
    key,
    name: config.name,
    shortName: config.shortName,
    venue: config.venue,
    city: config.city,
    ...campVenueDetails(camp?.facility),
    track: config.track,
    day,
    badge: config.badge,
    description: config.description,
    whoFor: track.whoFor,
    eyebrow: sessionCount > 0 ? `${day} · ${sessionCount} Weeks` : day,
    checkoutHref: `/checkout/${config.slug}`,
    priceLabel: formatMoney(camp?.basePriceCents),
    capacity,
    spotsLabel: soldOut ? "Sold out" : `Capacity: ${capacity}`,
    taxLabel: camp?.basePriceCents != null ? "+ HST" : null,
    sessionCount,
    sessionsLabel,
    weeksLabel: sessionCount > 0
      ? `${sessionCount} ${sessionCount === 1 ? "week" : "weeks"}`
      : "Schedule unavailable",
    dateLabel,
    scheduleLabel,
    timeLabel,
    durationBadge: `${config.duration === "one-hour" ? "1-hour" : "2-hour"} sessions`,
    skippedLabel,
    includes: [
      scheduleLabel,
      dateLabel,
      sessionsLabel,
      ...(skippedLabel ? [`No class ${skipped.join(" or ")}`] : []),
      ...track.includes,
    ],
    ctaDisabled: unavailable || soldOut,
    ctaLabel: soldOut
      ? "Sold out"
      : unavailable
        ? "Registration unavailable"
        : `Book ${bookingName(config.track, day)}`,
  }
}

export function canRenderKidsWeeklyLanding(
  camps: ReadonlyArray<Pick<ApiCamp, "publicVisibility"> | null>,
  preview: boolean,
) {
  if (preview) return camps.some((camp) => Boolean(camp))
  return camps.some((camp) => camp?.publicVisibility === "published")
}
