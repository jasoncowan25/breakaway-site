export function parseOpenAtUTC(openAtISO: string, tz = "America/Toronto") {
  const hasOffset = /[Zz]|[+-]\d{2}:\d{2}$/.test(openAtISO)

  if (hasOffset) {
    return new Date(openAtISO)
  }

  // For local datetime strings, assume they're in the specified timezone
  // Convert to UTC by creating a date and adjusting for timezone offset
  const localDate = new Date(openAtISO)

  // Get the timezone offset for Toronto at the given date
  const tempDate = new Date(localDate.toLocaleString("en-US", { timeZone: tz }))
  const utcDate = new Date(localDate.toLocaleString("en-US", { timeZone: "UTC" }))
  const offset = utcDate.getTime() - tempDate.getTime()

  return new Date(localDate.getTime() + offset)
}

export function addMinutes(date: Date, mins: number) {
  return new Date(date.getTime() + mins * 60_000)
}

export function toICSDateUTC(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  )
}
