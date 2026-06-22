export interface CalendarEvent {
  title: string
  start: Date
  end?: Date
  description?: string
  url?: string
}

export type AddToCalendarEvent = {
  id?: string
  title: string
  startAt?: Date | string | null
  endAt?: Date | string | null
  startDate?: string | null
  endDate?: string | null
  venue?: string | null
  location?: string | null
  description?: string | null
  url?: string | null
  startHour?: number
  endHour?: number
  datesLabel?: string | null
  timeLabel?: string | null
}

export type CampCalendarInput = AddToCalendarEvent & {
  id: string
  startDate: string | null
  endDate: string | null
  venue: string | null
}

export type CalendarDownload = {
  href: string
  filename: string
}

export function toGoogleCalendarUrl({ title, start, end, description }: CalendarEvent): string {
  const params = new URLSearchParams()

  // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
  const formatDate = (date: Date) => {
    return date
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "")
  }

  const endDate = end || new Date(start.getTime() + 30 * 60 * 1000) // Default 30 minutes

  params.set("action", "TEMPLATE")
  params.set("text", title)
  params.set("dates", `${formatDate(start)}/${formatDate(endDate)}`)

  if (description) {
    params.set("details", description)
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function buildICS({ title, start, end, description, url }: CalendarEvent): string {
  const formatICSDate = (date: Date) => {
    return date
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "")
  }

  const endDate = end || new Date(start.getTime() + 30 * 60 * 1000) // Default 30 minutes
  const now = new Date()

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Breakaway Pickleball Camps//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${now.getTime()}@breakaway-pickleball.com`,
    `DTSTAMP:${formatICSDate(now)}`,
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:${title.replace(/,/g, "\\,")}`,
    description ? `DESCRIPTION:${description.replace(/,/g, "\\,").replace(/\n/g, "\\n")}` : "",
    url ? `URL:${url}` : "",
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n")

  return icsContent
}

function isIsoDate(value: string | null | undefined): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value))
}

function compactDate(value: string) {
  return value.replace(/-/g, "")
}

function addDays(value: string, days: number) {
  const date = new Date(`${value}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function localTimed(value: string, hour: number) {
  return `${compactDate(value)}T${String(hour).padStart(2, "0")}0000`
}

function localIsoTimed(value: string, hour: number) {
  return `${value}T${String(hour).padStart(2, "0")}:00:00`
}

function formatUtcDateTime(value: Date) {
  return value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
}

function toDate(value: Date | string | null | undefined) {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n")
}

function slugifyFilename(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return slug || "breakaway-camp"
}

function calendarLocation(event: AddToCalendarEvent) {
  return event.location ?? event.venue ?? ""
}

function calendarDescription(event: AddToCalendarEvent) {
  return event.description || "Breakaway Pickleball camp registration."
}

function calendarDates(event: AddToCalendarEvent) {
  const startAt = toDate(event.startAt)
  const endAt = toDate(event.endAt)

  if (startAt) {
    return {
      kind: "timed" as const,
      startAt,
      endAt: endAt && endAt > startAt ? endAt : new Date(startAt.getTime() + 30 * 60 * 1000),
    }
  }

  const startDate = isIsoDate(event.startDate) ? event.startDate : new Date().toISOString().slice(0, 10)
  const endDate = isIsoDate(event.endDate) ? event.endDate : startDate
  const multiDay = startDate !== endDate

  return {
    kind: multiDay ? ("all-day" as const) : ("local-time" as const),
    startDate,
    endDate,
    startHour: event.startHour ?? 9,
    endHour: event.endHour ?? 15,
  }
}

export function buildCampCalendarIcs(event: AddToCalendarEvent) {
  const dates = calendarDates(event)
  const dateStamp = formatUtcDateTime(new Date())
  const uidId = (event.id || event.title || "camp").replace(/[^a-zA-Z0-9_-]/g, "-")
  const summary = escapeIcsText(event.title || "Breakaway Pickleball Camp")
  const description = escapeIcsText(calendarDescription(event))
  const location = calendarLocation(event)
  const dateUid = dates.kind === "timed" ? formatUtcDateTime(dates.startAt) : compactDate(dates.startDate)

  let dateLines: string[]
  if (dates.kind === "timed") {
    dateLines = [`DTSTART:${formatUtcDateTime(dates.startAt)}`, `DTEND:${formatUtcDateTime(dates.endAt)}`]
  } else if (dates.kind === "all-day") {
    dateLines = [
      `DTSTART;VALUE=DATE:${compactDate(dates.startDate)}`,
      `DTEND;VALUE=DATE:${compactDate(addDays(dates.endDate, 1))}`,
    ]
  } else {
    dateLines = [
      `DTSTART:${localTimed(dates.startDate, dates.startHour)}`,
      `DTEND:${localTimed(dates.startDate, dates.endHour)}`,
    ]
  }

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Breakaway Pickleball//Add to Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Breakaway Pickleball",
    "BEGIN:VEVENT",
    `UID:breakaway-${uidId}-${dateUid}@breakawaypickleball.ca`,
    `DTSTAMP:${dateStamp}`,
    ...dateLines,
    `SUMMARY:${summary}`,
    location ? `LOCATION:${escapeIcsText(location)}` : "",
    `DESCRIPTION:${description}`,
    event.url ? `URL:${event.url}` : "",
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n")
}

export function buildCampCalendarDownload(event: AddToCalendarEvent): CalendarDownload {
  const ics = buildCampCalendarIcs(event)
  return {
    href: `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`,
    filename: `breakaway-${slugifyFilename(event.title)}.ics`,
  }
}

export function buildGoogleCalendarUrl(event: AddToCalendarEvent) {
  const dates = calendarDates(event)
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: calendarDescription(event),
    location: calendarLocation(event),
  })

  if (dates.kind === "timed") {
    params.set("dates", `${formatUtcDateTime(dates.startAt)}/${formatUtcDateTime(dates.endAt)}`)
  } else if (dates.kind === "all-day") {
    params.set("dates", `${compactDate(dates.startDate)}/${compactDate(addDays(dates.endDate, 1))}`)
  } else {
    params.set("dates", `${localTimed(dates.startDate, dates.startHour)}/${localTimed(dates.startDate, dates.endHour)}`)
    params.set("ctz", "America/Toronto")
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function buildOutlookCalendarUrl(event: AddToCalendarEvent) {
  const dates = calendarDates(event)
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    body: calendarDescription(event),
    location: calendarLocation(event),
  })

  if (dates.kind === "timed") {
    params.set("startdt", dates.startAt.toISOString())
    params.set("enddt", dates.endAt.toISOString())
  } else if (dates.kind === "all-day") {
    params.set("startdt", dates.startDate)
    params.set("enddt", addDays(dates.endDate, 1))
    params.set("allday", "true")
  } else {
    params.set("startdt", localIsoTimed(dates.startDate, dates.startHour))
    params.set("enddt", localIsoTimed(dates.startDate, dates.endHour))
  }

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}
