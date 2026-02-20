import { parseOpenAtUTC, addMinutes, toICSDateUTC } from "@/lib/datetime"

export function googleCalendarUrl({
  title = "Breakaway Camps – Registration Opens",
  details = "Be ready to register when the camp opens.",
  location = process.env.NEXT_PUBLIC_SITE_URL || "breakawaycamps.ca",
  openAtISO,
}: {
  title?: string
  details?: string
  location?: string
  openAtISO: string
}) {
  const start = parseOpenAtUTC(openAtISO, "America/Toronto")
  const end = addMinutes(start, 60)
  const startUtc = toICSDateUTC(start)
  const endUtc = toICSDateUTC(end)

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details,
    location,
    dates: `${startUtc}/${endUtc}`,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
