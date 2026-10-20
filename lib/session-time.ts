/**
 * Normalize a stored camp `session_label` into one canonical, customer-facing
 * time range: "9:00 AM – 12:00 PM".
 *
 * `camps.session_label` is entered inconsistently across seeds, the admin
 * create-camp wizard, and manual edits — "9:00 AM - 12:00 PM", "09:00 - 15:00",
 * "9:00 - 3:00", "AM", null. This mirrors the admin API's formatter
 * (apps/api/lib/camps/session-time.ts) so the checkout page reads times the same
 * way the confirmation email and checkout links do.
 *
 * Returns `null` when there is no clock to show (empty, or a bare AM/PM/Full
 * label) so callers can fall back to their own copy. Falls back to the trimmed
 * raw string when the value has digits but isn't a parseable time.
 */

const EN_DASH = "–"

type Clock = { h: number; m: number; mer: "AM" | "PM" | null }

export function formatSessionTime(raw: string | null | undefined): string | null {
  if (raw == null) return null
  const s = String(raw).trim()
  if (!s) return null
  if (!/\d/.test(s)) return null // "AM" / "PM" / "Full" — no clock to show

  const parts = s.split(/\s*(?:–|—|-|\bto\b)\s*/i)
  if (parts.length === 2) {
    const a = parseClock(parts[0])
    const b = parseClock(parts[1])
    if (a && b) return `${render(a)} ${EN_DASH} ${render(b)}`
  }

  const single = parseClock(s)
  if (single) return render(single)

  return s // has digits but unparseable — keep what staff wrote
}

export function formatRecurringCampDates(
  sessionDates: string[] | null | undefined,
  sessionLabel: string | null | undefined,
): {
  dateLabel: string
  scheduleLabel: string
  sessionCountLabel: string
} | null {
  const dates = (sessionDates ?? []).filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))
  if (dates.length < 2) return null

  const first = new Date(`${dates[0]}T00:00:00Z`)
  const last = new Date(`${dates[dates.length - 1]}T00:00:00Z`)
  if (Number.isNaN(first.getTime()) || Number.isNaN(last.getTime())) return null

  const monthDay = new Intl.DateTimeFormat("en-CA", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
  const weekday = new Intl.DateTimeFormat("en-CA", {
    weekday: "long",
    timeZone: "UTC",
  }).format(first)
  const time = formatSessionTime(sessionLabel)

  return {
    dateLabel: `${monthDay.format(first)} ${EN_DASH} ${monthDay.format(last)}, ${last.getUTCFullYear()}`,
    scheduleLabel: [weekday.endsWith("s") ? weekday : `${weekday}s`, time].filter(Boolean).join(" · "),
    sessionCountLabel: `${dates.length} weekly sessions`,
  }
}

function parseClock(chunk: string | undefined): Clock | null {
  if (!chunk) return null
  const m = chunk.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i)
  if (!m) return null
  const h = Number(m[1])
  const min = m[2] ? Number(m[2]) : 0
  if (h > 23 || min > 59) return null
  const mer = m[3] ? (m[3].toUpperCase() as "AM" | "PM") : null
  return { h, m: min, mer }
}

function render(c: Clock): string {
  let hour12: number
  let mer: "AM" | "PM"

  if (c.mer) {
    mer = c.mer
    hour12 = c.h % 12 || 12
  } else if (c.h === 0) {
    hour12 = 12
    mer = "AM"
  } else if (c.h >= 13) {
    hour12 = c.h - 12
    mer = "PM"
  } else if (c.h === 12) {
    hour12 = 12
    mer = "PM"
  } else if (c.h <= 6) {
    // 1–6 without a meridiem reads as afternoon (business-day heuristic)
    hour12 = c.h
    mer = "PM"
  } else {
    // 7–11 → morning
    hour12 = c.h
    mer = "AM"
  }

  return `${hour12}:${String(c.m).padStart(2, "0")} ${mer}`
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`))
}

function formatDateRange(startDate: string, endDate: string | null) {
  if (!endDate || endDate === startDate) return formatDate(startDate)

  const start = new Date(`${startDate}T00:00:00Z`)
  const end = new Date(`${endDate}T00:00:00Z`)
  const sameMonth = start.getUTCFullYear() === end.getUTCFullYear() && start.getUTCMonth() === end.getUTCMonth()

  if (sameMonth) {
    const month = new Intl.DateTimeFormat("en-CA", { month: "long", timeZone: "UTC" }).format(start)
    return `${month} ${start.getUTCDate()}-${end.getUTCDate()}, ${end.getUTCFullYear()}`
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

/** The checkout must show the purchased sessions, including a single-session link. */
export function formatCheckoutCampSchedule(input: {
  startDate: string
  endDate: string | null
  sessionDates?: string[] | null
  sessionLabel?: string | null
  scheduleNote?: string | null
}): { dateLabel: string; timeLabel: string; isRecurring: boolean } {
  const dates = [...new Set(input.sessionDates ?? [])].sort()
  const first = dates[0]
  const sameWeekday = first && dates.every(date =>
    new Date(`${date}T00:00:00Z`).getUTCDay() === new Date(`${first}T00:00:00Z`).getUTCDay(),
  )
  const recurring = sameWeekday ? formatRecurringCampDates(dates, input.sessionLabel) : null
  return {
    dateLabel: recurring?.dateLabel ?? formatDateRange(first ?? input.startDate, dates.at(-1) ?? input.endDate),
    timeLabel: [
      recurring?.scheduleLabel ?? formatSessionTime(input.sessionLabel) ?? "Time announced after registration",
      recurring?.sessionCountLabel,
      input.scheduleNote,
    ].filter(Boolean).join(" · "),
    isRecurring: Boolean(recurring),
  }
}
