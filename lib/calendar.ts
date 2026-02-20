interface CalendarEvent {
  title: string
  start: Date
  end?: Date
  description?: string
  url?: string
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
