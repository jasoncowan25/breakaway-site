import type { ApiCamp } from "./breakaway-api.ts"
import { formatRecurringCampDates } from "./session-time.ts"

export const KIDS_WEEKLY_LANDING_PATH =
  "/pickleball-camps/kids-weekly-pickleball-camp-toronto"

export const KIDS_WEEKLY_PROGRAMS = {
  allLevelsMon: {
    slug: "toronto-kids-weekly-all-levels-mondays-sep-14-2026",
    name: "All Skill Levels",
    shortName: "All Levels",
    track: "allLevels",
    day: "Mondays",
    duration: "one-hour",
    capacity: 20,
    badge: "Just Added",
    description: "The same fundamentals track as Thursdays, on a shorter 12-week Monday schedule.",
  },
  allLevelsThu: {
    slug: "toronto-kids-weekly-all-levels-sep-10-2026",
    name: "All Skill Levels",
    shortName: "All Levels",
    track: "allLevels",
    day: "Thursdays",
    duration: "one-hour",
    capacity: 20,
    badge: null,
    description: "Start with grip, serve and rally, then build into real game play by the end of the season.",
  },
  experienced: {
    slug: "toronto-kids-weekly-experienced-sep-7-2026",
    name: "Experienced",
    shortName: "Experienced",
    track: "experienced",
    day: "Mondays",
    duration: "two-hour",
    capacity: 10,
    badge: null,
    description: "Longer sessions built around sharper drills, strategy and match play for kids who know the game.",
  },
} as const

export type KidsWeeklyProgramKey = keyof typeof KIDS_WEEKLY_PROGRAMS

/** Landing-page order: the new Monday section leads, per the Sep 2026 design. */
export const KIDS_WEEKLY_PROGRAM_KEYS: readonly KidsWeeklyProgramKey[] = [
  "allLevelsMon",
  "allLevelsThu",
  "experienced",
]

/** The booking card opens on the original Thursday program. */
export const KIDS_WEEKLY_DEFAULT_PROGRAM: KidsWeeklyProgramKey = "allLevelsThu"

export const KIDS_WEEKLY_PROGRAM_SLUGS = Object.values(KIDS_WEEKLY_PROGRAMS).map(
  (program) => program.slug,
)
const KIDS_WEEKLY_PROGRAM_SLUG_SET = new Set<string>(KIDS_WEEKLY_PROGRAM_SLUGS)

const TRACK_COPY = {
  allLevels: {
    whoFor: "Brand new, or playing under a year",
    includes: ["Fundamentals: serve, return, dinking, volleys", "Paddles available to borrow"],
  },
  experienced: {
    whoFor: "Playing one year or more",
    includes: ["Strategy, court positioning and shot selection", "Capped at 10 players for more court time"],
  },
} as const

export function kidsWeeklyLandingPathForCamp(slug: string | null | undefined) {
  if (!slug || !KIDS_WEEKLY_PROGRAM_SLUG_SET.has(slug)) return null
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
>

function formatMoney(cents: number | null | undefined) {
  if (cents == null) return "Registration unavailable"
  return `$${Math.round(cents / 100).toLocaleString("en-CA")} CAD`
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
  const sessionsLabel = sessionCount > 0
    ? `${sessionCount} ${config.duration} sessions`
    : "Schedule unavailable"

  return {
    key,
    name: config.name,
    shortName: config.shortName,
    track: config.track,
    day,
    badge: config.badge,
    description: config.description,
    whoFor: track.whoFor,
    eyebrow: sessionCount > 0 ? `${day} · ${sessionCount} Weeks` : day,
    checkoutHref: `/checkout/${config.slug}`,
    priceLabel: formatMoney(camp?.basePriceCents),
    spotsLabel: soldOut ? "Sold out" : `${capacity} spots`,
    sessionCount,
    sessionsLabel,
    weeksLabel: sessionCount > 0
      ? `${sessionCount} ${sessionCount === 1 ? "week" : "weeks"}`
      : "Schedule unavailable",
    dateLabel,
    scheduleLabel,
    timeLabel,
    durationBadge: `${config.duration === "one-hour" ? "1-hour" : "2-hour"} sessions`,
    includes: [scheduleLabel, dateLabel, sessionsLabel, ...track.includes],
    ctaDisabled: unavailable || soldOut,
    ctaLabel: soldOut
      ? "Sold out"
      : unavailable
        ? "Registration unavailable"
        : `Book ${config.track === "experienced" ? "Experienced" : day}`,
  }
}

export function canRenderKidsWeeklyLanding(
  camps: ReadonlyArray<Pick<ApiCamp, "publicVisibility"> | null>,
  preview: boolean,
) {
  if (preview) return camps.some((camp) => Boolean(camp))
  return camps.some((camp) => camp?.publicVisibility === "published")
}
