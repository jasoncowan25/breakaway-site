const TZ = "America/Toronto"

/** Parse env into a Date in absolute time (ms since epoch).
 * Accepts full ISO w/ offset (best), or plain local "YYYY-MM-DD HH:mm" which is
 * treated as America/Toronto local time.
 */
export function getTargetDate(): Date | null {
  const raw = process.env.NEXT_PUBLIC_OPEN_AT_ISO?.trim()
  if (!raw) return null

  // If the string clearly has timezone info (Z or ±HH:MM), let Date parse it.
  const hasTz = /Z$|[+-]\d{2}:\d{2}$/.test(raw)
  if (hasTz) {
    const d = new Date(raw)
    return isNaN(d.getTime()) ? null : d
  }

  // Otherwise treat as local-in-Toronto.
  // Normalize common inputs like "YYYY-MM-DD HH:mm" or "YYYY/MM/DD HH:mm".
  const m = raw.match(/^(\d{4})[-/](\d{2})[-/](\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/)
  if (!m) return null

  const [_, y, mo, d, h, mi, s] = m
  // Build a timestamp interpreting the components in America/Toronto
  try {
    const parts = {
      year: Number(y),
      month: Number(mo),
      day: Number(d),
      hour: Number(h),
      minute: Number(mi),
      second: Number(s ?? "0"),
    }
    // Use Intl to get the offset at that local wall time
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    // Compose a Date from local pieces by formatting a Date and replacing parts.
    // Simpler: construct as UTC then subtract the zone offset at that instant.
    const provisional = new Date(
      Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second),
    )
    // Figure out the Toronto offset (in minutes) at that instant:
    const tzOffsetMin = getZoneOffsetMinutes(provisional, TZ)
    const absolute = new Date(provisional.getTime() - tzOffsetMin * 60_000)
    return isNaN(absolute.getTime()) ? null : absolute
  } catch {
    return null
  }
}

// Returns the minutes EAST of UTC for a given instant in a zone (so UTC-5 => -300)
function getZoneOffsetMinutes(instant: Date, timeZone: string): number {
  // Get the local wall components for 'instant' in 'timeZone'
  const dtf = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
  const parts = dtf.formatToParts(instant).reduce<Record<string, number>>((acc, p) => {
    if (p.type !== "literal") acc[p.type] = Number(p.value)
    return acc
  }, {})
  // Build the same wall time as if it were in UTC to compare
  const asUTC = Date.UTC(
    parts.year,
    (parts.month ?? 1) - 1,
    parts.day ?? 1,
    parts.hour ?? 0,
    parts.minute ?? 0,
    parts.second ?? 0,
  )
  // Offset minutes = (UTC timestamp - absolute timestamp)/60_000
  return (asUTC - instant.getTime()) / 60_000
}

export function formatOpenLabel(d: Date): string {
  const datePart = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d)
  const timePart = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZoneName: "short",
  }).format(d)
  return `Opens at ${timePart} on ${datePart}`
}

export function diffParts(fromMs: number, toMs: number) {
  const ms = Math.max(0, toMs - fromMs)
  const days = Math.floor(ms / 86_400_000)
  const hours = Math.floor((ms % 86_400_000) / 3_600_000)
  const minutes = Math.floor((ms % 3_600_000) / 60_000)
  const seconds = Math.floor((ms % 60_000) / 1_000)
  return { days, hours, minutes, seconds, done: ms === 0 }
}
