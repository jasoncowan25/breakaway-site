import type { NextRequest } from "next/server"
import { parseOpenAtUTC, addMinutes, toICSDateUTC } from "@/lib/datetime"

const TITLE = "Breakaway Camps – Registration Opens"
const DESCRIPTION = "Be ready to register when the camp opens."

export async function GET(_req: NextRequest) {
  const openAt = process.env.NEXT_PUBLIC_OPEN_AT_ISO
  if (!openAt) return new Response("Missing NEXT_PUBLIC_OPEN_AT_ISO", { status: 500 })

  const start = parseOpenAtUTC(openAt, "America/Toronto")
  const end = addMinutes(start, 60)

  const dtStart = toICSDateUTC(start)
  const dtEnd = toICSDateUTC(end)

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Breakaway Camps//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:reg-open-${dtStart}@breakawaycamps.ca`,
    `DTSTAMP:${toICSDateUTC(new Date())}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${TITLE}`,
    `DESCRIPTION:${DESCRIPTION}`,
    `LOCATION:${process.env.NEXT_PUBLIC_SITE_URL || "breakawaycamps.ca"}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")

  return new Response(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="registration-opens.ics"',
    },
  })
}
