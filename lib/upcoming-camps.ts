const BREAKAWAY_TIME_ZONE = "America/Toronto"

type DatedCamp = {
  startDate: string
  endDate?: string | null
}

export function todayIsoInToronto(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BREAKAWAY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))

  return `${values.year}-${values.month}-${values.day}`
}

export function campHasNotEnded(camp: DatedCamp, today = todayIsoInToronto()): boolean {
  return (camp.endDate ?? camp.startDate) >= today
}

export function currentAndUpcomingCamps<T extends DatedCamp>(
  camps: readonly T[],
  today = todayIsoInToronto(),
): T[] {
  return camps.filter((camp) => campHasNotEnded(camp, today))
}

export function postgrestCurrentCampDateFilter(today = todayIsoInToronto()): string {
  return `(end_date.gte.${today},and(end_date.is.null,start_date.gte.${today}))`
}
