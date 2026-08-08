import type { ApiCamp } from "./breakaway-api.ts"
import { formatRecurringCampDates } from "./session-time.ts"

export const KIDS_WEEKLY_LANDING_PATH =
  "/pickleball-camps/kids-weekly-pickleball-camp-toronto"

export const KIDS_WEEKLY_PROGRAMS = {
  allLevels: {
    slug: "toronto-kids-weekly-all-levels-sep-10-2026",
    name: "All Skill Levels",
    eyebrow: "New & developing players",
    duration: "one-hour",
    capacity: 20,
  },
  experienced: {
    slug: "toronto-kids-weekly-experienced-sep-7-2026",
    name: "Experienced",
    eyebrow: "One year or more",
    duration: "two-hour",
    capacity: 10,
  },
} as const

export const KIDS_WEEKLY_PROGRAM_SLUGS = Object.values(KIDS_WEEKLY_PROGRAMS).map(
  (program) => program.slug,
)
const KIDS_WEEKLY_PROGRAM_SLUG_SET = new Set<string>(KIDS_WEEKLY_PROGRAM_SLUGS)

export function kidsWeeklyLandingPathForCamp(slug: string | null | undefined) {
  if (!slug || !KIDS_WEEKLY_PROGRAM_SLUG_SET.has(slug)) return null
  return KIDS_WEEKLY_LANDING_PATH
}

export function shouldListKidsWeeklyCampAsStandalone(slug: string | null | undefined) {
  return kidsWeeklyLandingPathForCamp(slug) === null
}

export type KidsWeeklyProgramKey = keyof typeof KIDS_WEEKLY_PROGRAMS

export type KidsWeeklyCampLike = Pick<
  ApiCamp,
  | "slug"
  | "basePriceCents"
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
  const recurring = camp
    ? formatRecurringCampDates(camp.sessionDates, camp.sessionLabel)
    : null
  const soldOut = Boolean(camp?.isSoldOut || camp?.spotsLeft === 0)
  const unavailable = !camp || !recurring || camp.basePriceCents == null
  const spots = camp?.spotsLeft
  const sessionCount = camp?.sessionDates?.length ?? null

  return {
    key,
    name: config.name,
    eyebrow: config.eyebrow,
    checkoutHref: `/checkout/${config.slug}`,
    priceLabel: formatMoney(camp?.basePriceCents),
    spotsLabel: soldOut
      ? "Sold out"
      : spots == null
        ? `${config.capacity} spots total`
        : `${spots} ${spots === 1 ? "spot" : "spots"} left`,
    sessionCount,
    weeksLabel: sessionCount ? `${sessionCount} weeks` : null,
    sessionsLabel: sessionCount
      ? `${sessionCount} ${config.duration} sessions`
      : `${config.duration} sessions`,
    dateLabel: recurring?.dateLabel ?? "Schedule unavailable",
    scheduleLabel: recurring?.scheduleLabel ?? "Schedule unavailable",
    ctaDisabled: unavailable || soldOut,
    ctaLabel: soldOut ? "Sold out" : unavailable ? "Registration unavailable" : `Book ${key === "allLevels" ? "All Levels" : "Experienced"}`,
  }
}

/**
 * Week count for copy that covers both programs at once (hero pill, section
 * intro, coach stats). The two programs ran the same 15 weeks until the
 * Experienced camp dropped Sep 21, so this collapses to a single number when
 * they match and widens to a range when they don't. Returns null when no camp
 * data loaded, so callers can drop the claim rather than print a stale one.
 */
export function kidsWeeklyWeeksLabel(
  ...programs: Array<{ sessionCount: number | null }>
): string | null {
  const counts = programs
    .map((program) => program.sessionCount)
    .filter((count): count is number => typeof count === "number" && count > 0)
  if (counts.length === 0) return null

  const min = Math.min(...counts)
  const max = Math.max(...counts)
  return min === max ? String(min) : `${min}–${max}`
}

export function canRenderKidsWeeklyLanding(
  allLevels: Pick<ApiCamp, "publicVisibility"> | null,
  experienced: Pick<ApiCamp, "publicVisibility"> | null,
  preview: boolean,
) {
  if (preview) return Boolean(allLevels || experienced)
  return [allLevels, experienced].some((camp) => camp?.publicVisibility === "published")
}
