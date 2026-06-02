// Maps the public Camp Event feed (api.breakawaypickleball.ca) into the exact
// MuskokaCamp shape the Muskoka page already renders. The page stays unchanged;
// only its data source moves from the hardcoded lib/muskoka-camps.ts to the DB.
//
// Derives the fields that used to be hardcoded:
//   • level   ← title + DUPR range  ("Fundamentals (Under 3.0)" / "Intermediate (3.0+)")
//   • dates   ← start_date/end_date  ("July 10-12, 2026")
//   • duration← day span             ("3 Days")
//   • price   ← base_price_cad cents  ("$800 CAD / player")
//   • week    ← chronological group of unique start dates (1-based)

import type { ApiCampEventCamp } from "./breakaway-api"
import type { MuskokaCamp } from "./muskoka-camps"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function parts(iso: string): { y: number; m: number; d: number } {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10))
  return { y, m, d }
}

/** "2026-07-10" + "2026-07-12" → "July 10-12, 2026" (handles month/year spans). */
function formatDates(start: string, end: string | null): string {
  const s = parts(start)
  if (!end || end === start) return `${MONTHS[s.m - 1]} ${s.d}, ${s.y}`
  const e = parts(end)
  if (s.y === e.y && s.m === e.m) {
    return `${MONTHS[s.m - 1]} ${s.d}-${e.d}, ${e.y}`
  }
  if (s.y === e.y) {
    return `${MONTHS[s.m - 1]} ${s.d} - ${MONTHS[e.m - 1]} ${e.d}, ${e.y}`
  }
  return `${MONTHS[s.m - 1]} ${s.d}, ${s.y} - ${MONTHS[e.m - 1]} ${e.d}, ${e.y}`
}

function durationDays(start: string, end: string | null): string {
  if (!end) return "1 Day"
  const ms = Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)
  const days = Math.round(ms / 86_400_000) + 1
  return `${days} ${days === 1 ? "Day" : "Days"}`
}

/** DUPR range → the level label the page filters on ("Under 3.0" / "3.0+"). */
function ratingLabel(duprMin: number | null, duprMax: number | null): string {
  if (duprMin != null) return `${duprMin.toFixed(1)}+`
  if (duprMax != null) return `Under ${duprMax.toFixed(1)}`
  return "All levels"
}

function priceLabel(basePriceCents: number | null): string {
  if (basePriceCents == null) return "Price TBA"
  return `$${Math.round(basePriceCents / 100).toLocaleString()} CAD / player`
}

export function mapEventCampsToMuskoka(camps: ApiCampEventCamp[]): MuskokaCamp[] {
  // week = chronological rank of the camp's start date among unique start dates.
  const uniqueStarts = Array.from(new Set(camps.map((c) => c.startDate))).sort()
  const weekByStart = new Map(uniqueStarts.map((s, i) => [s, i + 1]))

  return camps.map((c) => {
    // Strip the redundant "Muskoka " prefix — the cards live on the Muskoka
    // page, so the DB's "Muskoka Fundamentals Camp" reads as just
    // "Fundamentals Camp" here (matches the prior hardcoded copy).
    const cleanTitle = c.title.replace(/^Muskoka\s+/i, "").trim()
    const track = cleanTitle.replace(/\s*Camp$/i, "").trim() // "Fundamentals" / "Intermediate"
    const rating = ratingLabel(c.duprMin, c.duprMax)
    return {
      id: c.slug ?? c.id,
      title: cleanTitle,
      level: `${track} (${rating})`,
      levelVariant: "secondary" as const,
      dates: formatDates(c.startDate, c.endDate),
      time: c.sessionLabel ?? "Time announced after registration",
      duration: durationDays(c.startDate, c.endDate),
      price: priceLabel(c.basePriceCents),
      maxPlayers: c.capacity ?? 4,
      focus: c.focus,
      checkoutUrl: c.checkoutUrl ?? "",
      week: weekByStart.get(c.startDate) ?? 1,
    }
  })
}
