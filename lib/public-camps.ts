import { getPublicCampModules, type PublicCampModule } from "@/lib/public-camp-modules"

const PUBLIC_CAMP_REVALIDATE_SECONDS = 300
const ACTIVE_ATTENDANCE_EXCLUSIONS = ["cancelled", "refunded", "credit_on_file", "credit_applied"]

type CampRow = {
  id: string
  slug: string | null
  title: string
  full_label: string
  start_date: string
  end_date: string | null
  venue: string | null
  location: string | null
  notes: string | null
  dupr_min: number | null
  dupr_max: number | null
  status: string
  base_price_cad: number | null
  capacity: number | null
  stripe_payment_link_ids: string[] | null
  is_sold_out_override: boolean | null
  camp_kind: string | null
  session_label: string | null
  landing_page_url: string | null
  module_ids: string[] | null
  public_visibility: "unpublished" | "preview" | "published" | "archived" | null
  website_published_at: string | null
  badge_mode: "auto" | "manual" | null
  badge_label: PublicCampBadge | null
  public_summary: string | null
  public_modules_intro: string | null
  hero_media_asset_id: string | null
  thumbnail_media_asset_id: string | null
  hero_image_url: string | null
  thumbnail_image_url: string | null
  facility_id: string | null
  featured_coach_id: string | null
  include_testimonials: boolean | null
  breaks: unknown
}

type CampBreak = {
  type: "snack" | "hydration" | "byo_lunch" | "catered_lunch"
  start: string
  durationMinutes: number
  windowLabel: string
}

function clockLabel(totalMinutes: number) {
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440
  let h = Math.floor(wrapped / 60)
  const m = wrapped % 60
  const meridiem = h >= 12 ? "PM" : "AM"
  h = h % 12 || 12
  return `${h}:${String(m).padStart(2, "0")} ${meridiem}`
}

/** Parse the camps.breaks JSONB column into typed breaks with window labels. */
function parseBreaks(raw: unknown): CampBreak[] {
  if (!Array.isArray(raw)) return []
  const valid = new Set(["snack", "hydration", "byo_lunch", "catered_lunch"])
  const out: CampBreak[] = []
  for (const item of raw) {
    if (!item || typeof item !== "object") continue
    const rec = item as Record<string, unknown>
    const type = String(rec.type ?? "")
    if (!valid.has(type)) continue
    const startMatch = String(rec.start ?? "").match(/^(\d{1,2}):(\d{2})/)
    if (!startMatch) continue
    const startMin = Number(startMatch[1]) * 60 + Number(startMatch[2])
    const durationRaw = rec.duration_minutes ?? rec.durationMinutes
    const duration = Number.isFinite(Number(durationRaw)) ? Number(durationRaw) : 60
    out.push({
      type: type as CampBreak["type"],
      start: `${String(startMatch[1]).padStart(2, "0")}:${startMatch[2]}`,
      durationMinutes: duration,
      windowLabel: `${clockLabel(startMin)} – ${clockLabel(startMin + duration)}`,
    })
  }
  return out
}

function lunchTypeFromBreaks(breaks: CampBreak[]): "catered" | "byo" | null {
  if (breaks.some((b) => b.type === "catered_lunch")) return "catered"
  if (breaks.some((b) => b.type === "byo_lunch")) return "byo"
  return null
}

type FacilityRow = {
  id: string
  name: string
  city: string | null
  address: string | null
  court_count: number | null
  photo_url: string | null
  photos: string[] | null
  notes: string | null
}

const JAR_VENUE_PHOTOS = ["/jar3.png", "/jar4.png", "/jar1.png", "/jar2.png"]
const JOEY_TORONTO_BIO =
  "Former pro hockey player (OHL Oshawa Generals Captain; later ECHL). Grew up playing tennis & table tennis; transitioned quickly to competitive pickleball. Actively competes in tournaments; coaching focus on leadership, skill development, and helping players reach potential."

function coachImageForCamp(coach: CoachRow | null) {
  if (!coach) return null
  const name = coach.display_name.toLowerCase()
  if (name.includes("joey")) return "/coach-joey-admin.png"
  return null
}

type CoachRow = {
  id: string
  display_name: string
  initials: string | null
  role_type: string | null
  primary_location: string | null
  bio: string | null
  dupr_rating: number | null
}

type AssignmentRow = {
  camp_id: string
  coach_id: string
  assignment_role: string | null
  is_partner: boolean | null
  hours: number | null
}

function isLeadAssignment(assignment: AssignmentRow) {
  return assignment.assignment_role === "lead" || assignment.is_partner === true
}

type CampTestimonialRow = {
  camp_id: string
  testimonial_id: string
  sort_order: number | null
}

type TestimonialRow = {
  id: string
  quote: string
  attribution_name: string
  attribution_detail: string | null
  rating: number | null
}

type PaymentLinkRow = {
  id: string
  url: string | null
}

type CheckoutSessionRow = {
  id: string
  payment_intent_id: string | null
  payment_link_id: string | null
}

type AttendanceRow = {
  id: string
  camp_id?: string | null
  attendance_status: string | null
}

export type PublicCampBadge =
  | "auto"
  | "none"
  | "new"
  | "just_announced"
  | "selling_fast"
  | "almost_full"
  | "sold_out"

export type PublicCamp = {
  id: string
  slug: string
  title: string
  startDate: string
  subtitle: string
  dateLabel: string
  timeLabel: string
  schedule: {
    dailyTimeLabel: string
    lunchBreakLabel: string | null
    days: Array<{
      dateLabel: string
      startTime: string
      endTime: string
      lunchBreakLabel: string | null
    }>
  }
  lunchType: "catered" | "byo" | null
  location: string
  venue: string
  priceLabel: string
  checkoutUrl: string | null
  capacity: number
  registeredCount: number
  spotsLeft: number
  isSoldOut: boolean
  badge: Exclude<PublicCampBadge, "auto">
  summary: string
  modulesIntro: string
  modules: PublicCampModule[]
  heroImageUrl: string
  skillLabel: string
  visibility: "unpublished" | "preview" | "published" | "archived"
  facility: {
    name: string
    city: string
    address: string
    courtCount: number
    photos: string[]
    notes: string
  } | null
  coach: {
    name: string
    initials: string
    role: string
    location: string
    bio: string
    duprRating: number | null
    imageUrl: string | null
  } | null
  testimonials: Array<{
    id: string
    quote: string
    name: string
    detail: string
    rating: number
  }>
}

export type PublicCampCard = {
  id: string
  title: string
  date: string
  sortDate: string
  location: string
  locationFilter: string
  format: string
  skillLevel: string
  price: string
  image: string
  badges: Array<{ text: string; variant: "default" | "destructive" | "secondary" | "accent" }>
  coach: string
  link: string
  imageEnhanced: boolean
  soldOut: boolean
  spotsRemaining?: number
  buttonText: string
}

export type PublicCampNavItem = {
  title: string
  href: string
}

const RESTORED_PUBLIC_CAMP_CARDS: PublicCampCard[] = [
  {
    id: "toronto-intermediate-intensive-sep-12-2026-3",
    title: "Toronto Intermediate Intensive",
    date: "September 12-13, 2026",
    sortDate: "2026-09-12",
    location: "The JAR Pickleball Club",
    locationFilter: "Toronto & GTA",
    format: "Camp",
    skillLevel: "3.0-3.5",
    price: "$700 CAD",
    image: "/jar3.png",
    badges: [{ text: "Just Announced", variant: "accent" }],
    coach: "Joey Manchurek",
    link: "/pickleball-camps/toronto-intermediate-intensive-sep-12-2026-3",
    imageEnhanced: false,
    soldOut: false,
    spotsRemaining: 16,
    buttonText: "Learn More",
  },
]

const RESTORED_PUBLIC_CAMP_NAV_ITEMS: PublicCampNavItem[] = RESTORED_PUBLIC_CAMP_CARDS.map((camp) => ({
  title: camp.title,
  href: camp.link,
}))

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return { url: url.replace(/\/$/, ""), key }
}

type SupabaseRestOptions = {
  revalidate?: number
}

async function supabaseRest<T>(path: string, params: Record<string, string>, options: SupabaseRestOptions = {}) {
  const config = supabaseConfig()
  if (!config) return null

  const url = new URL(`${config.url}/rest/v1/${path}`)
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value))

  const response = await fetch(url.toString(), {
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
    },
    ...(options.revalidate
      ? { next: { revalidate: options.revalidate } }
      : { cache: "no-store" as const }),
  })

  if (!response.ok) {
    const body = await response.text()
    console.error(`[public-camps] Supabase ${path} failed`, response.status, body.slice(0, 240))
    return null
  }

  return (await response.json()) as T
}

function dateLabel(startDate: string, endDate: string | null) {
  const start = new Date(`${startDate}T00:00:00Z`)
  const end = new Date(`${endDate ?? startDate}T00:00:00Z`)
  const startText = start.toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" })
  if (!endDate || startDate === endDate) {
    return `${startText}, ${start.getUTCFullYear()}`
  }
  if (start.getUTCMonth() === end.getUTCMonth() && start.getUTCFullYear() === end.getUTCFullYear()) {
    return `${startText}-${end.getUTCDate()}, ${end.getUTCFullYear()}`
  }
  const endText = end.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
  return `${startText} - ${endText}`
}

function scheduleDateLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })
}

function normalizeMeridiem(value: string) {
  return value.trim().replace(/\s*(am|pm)$/i, (_, meridiem: string) => ` ${meridiem.toUpperCase()}`)
}

function inferTime(value: string, fallback: "AM" | "PM") {
  const normalized = normalizeMeridiem(value)
  if (/\b(AM|PM)$/i.test(normalized)) return normalized
  return `${normalized} ${fallback}`
}

function parseSessionTimes(sessionLabel: string | null) {
  const fallback = {
    startTime: "Time announced",
    endTime: "Time announced",
    lunchBreakLabel: null as string | null,
  }
  if (!sessionLabel) return fallback

  const timeRange = sessionLabel.match(
    /(\d{1,2}(?::\d{2})?\s*(?:AM|PM)?)\s*[–-]\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM)?)/i,
  )
  if (!timeRange) return fallback

  const startTime = normalizeMeridiem(timeRange[1])
  const endTime = normalizeMeridiem(timeRange[2])
  const lunchRange = sessionLabel.match(
    /lunch\s+(\d{1,2}(?::\d{2})?\s*(?:AM|PM)?)\s*[–-]\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM)?)/i,
  )

  return {
    startTime,
    endTime,
    lunchBreakLabel: lunchRange
      ? `${inferTime(lunchRange[1], "AM")} - ${inferTime(lunchRange[2], "PM")}`
      : null,
  }
}

function scheduleForCamp(
  startDate: string,
  endDate: string | null,
  sessionLabel: string | null,
  breaks: CampBreak[] = [],
) {
  const start = new Date(`${startDate}T00:00:00Z`)
  const end = new Date(`${endDate ?? startDate}T00:00:00Z`)
  const parsed = parseSessionTimes(sessionLabel)
  const { startTime, endTime } = parsed
  // Prefer the structured lunch break (set in admin) over regex-parsed
  // session-label text. Falls back to the old parse for legacy camps.
  const lunchBreak = breaks.find((b) => b.type === "catered_lunch" || b.type === "byo_lunch")
  const lunchBreakLabel = lunchBreak ? lunchBreak.windowLabel : parsed.lunchBreakLabel
  const days: PublicCamp["schedule"]["days"] = []

  if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
    for (
      let current = new Date(start);
      current <= end && days.length < 14;
      current = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate() + 1))
    ) {
      days.push({
        dateLabel: scheduleDateLabel(current),
        startTime,
        endTime,
        lunchBreakLabel,
      })
    }
  }

  return {
    dailyTimeLabel: startTime === "Time announced" || endTime === "Time announced"
      ? sessionLabel ?? "Time announced after registration"
      : `${startTime} - ${endTime}`,
    lunchBreakLabel,
    days,
  }
}

function skillLabel(row: CampRow) {
  if (row.dupr_min && row.dupr_max) return `${row.dupr_min.toFixed(1)}-${row.dupr_max.toFixed(1)}`
  if (row.title.toLowerCase().includes("fund")) return "Under 3.0"
  if (row.title.toLowerCase().includes("advanced")) return "4.0+"
  return "3.0+"
}

function priceLabel(cents: number | null) {
  const dollars = Math.round((cents ?? 0) / 100)
  if (!dollars) return "Price coming soon"
  return `$${dollars.toLocaleString()} CAD`
}

function subtitleForCamp(row: CampRow) {
  const skill = skillLabel(row)
  if (row.title.toLowerCase().includes("intermediate")) {
    return `2-Day Advanced Training • Intermediate Players (${skill})`
  }
  return `${skill} skill level • ${row.location ?? "Breakaway"} camp`
}

function facilityPhotosForCamp(facility: FacilityRow | null, fallback: string) {
  if (facility?.name.toLowerCase().includes("jar")) return JAR_VENUE_PHOTOS
  const photos = [facility?.photo_url, ...(facility?.photos ?? [])].filter(Boolean) as string[]
  return photos.length > 0 ? photos : [fallback]
}

function venueCopyForCamp(facility: FacilityRow | null, venue: string) {
  if (facility?.name.toLowerCase().includes("jar")) {
    return "Hosted at The JAR Pickleball Club in Toronto, this intensive uses a polished indoor club setting built for focused reps, coached match play, lunch breaks, and a high-energy two-day training environment."
  }
  return facility?.notes || `${venue} gives the group a focused court environment for coached reps and match-play feedback.`
}

function badgeForCamp(row: CampRow, spotsLeft: number, capacity: number): Exclude<PublicCampBadge, "auto"> {
  if (spotsLeft <= 0 || row.is_sold_out_override) return "sold_out"
  if (row.badge_mode === "manual" && row.badge_label && row.badge_label !== "auto") {
    return row.badge_label
  }
  if (spotsLeft <= 2) return "almost_full"
  if (capacity > 0 && spotsLeft <= Math.floor(capacity / 2)) return "selling_fast"
  if (row.website_published_at) {
    const published = new Date(row.website_published_at).getTime()
    if (!Number.isNaN(published) && Date.now() - published < 7 * 24 * 60 * 60 * 1000) {
      return "just_announced"
    }
  }
  return "new"
}

function badgeText(badge: Exclude<PublicCampBadge, "auto">) {
  switch (badge) {
    case "almost_full":
      return "Almost full"
    case "selling_fast":
      return "Selling fast"
    case "just_announced":
      return "Just announced"
    case "sold_out":
      return "Sold out"
    case "none":
      return ""
    default:
      return "New"
  }
}

function titleCaseBadge(text: string) {
  return text.replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function badgeVariant(badge: Exclude<PublicCampBadge, "auto">): PublicCampCard["badges"][number]["variant"] {
  if (badge === "sold_out" || badge === "almost_full" || badge === "selling_fast") return "destructive"
  if (badge === "just_announced" || badge === "new") return "accent"
  return "secondary"
}

function locationFilterForCamp(camp: Pick<PublicCamp, "location" | "venue">) {
  const value = `${camp.location} ${camp.venue}`.toLowerCase()
  if (value.includes("muskoka")) return "Muskoka"
  if (value.includes("punta")) return "Punta Cana"
  if (value.includes("toronto") || value.includes("jar") || value.includes("gta")) return "Toronto & GTA"
  return camp.location
}

function priceCardLabel(price: string) {
  if (!price || price.toLowerCase().includes("coming soon")) return price
  return price.startsWith("From ") ? price : `From ${price}`
}

function publicCampToCard(camp: PublicCamp): PublicCampCard {
  const badgeLabel = publicBadgeText(camp.badge)
  return {
    id: camp.slug,
    title: camp.title,
    date: camp.dateLabel,
    sortDate: camp.startDate,
    location: camp.venue,
    locationFilter: locationFilterForCamp(camp),
    format: camp.title.toLowerCase().includes("clinic") ? "Clinic" : "Camp",
    skillLevel: camp.skillLabel,
    price: priceCardLabel(camp.priceLabel),
    image: camp.heroImageUrl,
    badges: badgeLabel
      ? [{ text: titleCaseBadge(badgeLabel), variant: badgeVariant(camp.badge) }]
      : [],
    coach: camp.coach?.name ?? "Breakaway coach",
    link: `/pickleball-camps/${camp.slug}`,
    imageEnhanced: false,
    soldOut: camp.isSoldOut,
    spotsRemaining: camp.isSoldOut ? undefined : camp.spotsLeft,
    buttonText: "Learn More",
  }
}

function dedupeCardsByLink(cards: PublicCampCard[]) {
  const seen = new Set<string>()
  return cards.filter((card) => {
    if (seen.has(card.link)) return false
    seen.add(card.link)
    return true
  })
}

function dedupeNavItemsByHref(items: PublicCampNavItem[]) {
  const seen = new Set<string>()
  return items.filter((item) => {
    if (seen.has(item.href)) return false
    seen.add(item.href)
    return true
  })
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

async function getPaymentLinks(ids: string[], options: SupabaseRestOptions = {}) {
  const linkIds = ids.filter((id) => id && !/^https?:\/\//i.test(id))
  const directUrls = ids.filter((id) => /^https?:\/\//i.test(id))
  const links = new Map<string, string>()
  directUrls.forEach((url) => links.set(url, url))

  if (linkIds.length === 0) return links

  const rows = await supabaseRest<PaymentLinkRow[]>(
    "stripe_payment_links",
    {
      select: "id,url",
      id: `in.(${linkIds.join(",")})`,
    },
    options,
  )

  for (const row of rows ?? []) {
    if (row.url) links.set(row.id, row.url)
  }
  return links
}

async function getRegisteredCount(campId: string, linkIds: string[], options: SupabaseRestOptions = {}) {
  const [checkoutRows, attendanceRows] = await Promise.all([
    linkIds.length > 0
      ? supabaseRest<CheckoutSessionRow[]>(
          "stripe_checkout_sessions",
          {
            select: "id,payment_intent_id,payment_link_id",
            payment_link_id: `in.(${linkIds.join(",")})`,
            status: "eq.complete",
            payment_status: "eq.paid",
          },
          options,
        )
      : Promise.resolve([]),
    supabaseRest<AttendanceRow[]>(
      "camp_attendance",
      {
        select: "id,attendance_status",
        camp_id: `eq.${campId}`,
      },
      options,
    ),
  ])

  const activeAttendance = (attendanceRows ?? []).filter(
    (row) => !ACTIVE_ATTENDANCE_EXCLUSIONS.includes(row.attendance_status ?? ""),
  ).length

  return Math.max(checkoutRows?.length ?? 0, activeAttendance)
}

export function publicBadgeText(badge: Exclude<PublicCampBadge, "auto">) {
  return badgeText(badge)
}

async function getPublishedCampRows(limit: number, options: SupabaseRestOptions = {}) {
  const rows = await supabaseRest<CampRow[]>(
    "camps",
    {
      select:
        "id,slug,title,full_label,start_date,end_date,venue,location,notes,dupr_min,dupr_max,status,base_price_cad,capacity,stripe_payment_link_ids,is_sold_out_override,camp_kind,session_label,landing_page_url,module_ids,public_visibility,website_published_at,badge_mode,badge_label,public_summary,public_modules_intro,hero_media_asset_id,thumbnail_media_asset_id,hero_image_url,thumbnail_image_url,facility_id,featured_coach_id,include_testimonials,breaks",
      public_visibility: "eq.published",
      slug: "not.is.null",
      // Camps that belong to a Camp Event (e.g. Muskoka Summer) are surfaced
      // through their event hub card, not as standalone cards in the main
      // grid — otherwise publishing them double-lists alongside the hub.
      event_id: "is.null",
      start_date: `gte.${todayIso()}`,
      status: "in.(upcoming,in_progress)",
      order: "start_date.asc",
      limit: String(limit),
    },
    options,
  )

  return (rows ?? []).filter((row) => Boolean(row.slug))
}

async function getRegisteredCountsForCamps(camps: CampRow[], options: SupabaseRestOptions = {}) {
  const campIds = camps.map((camp) => camp.id)
  const linkIdToCampId = new Map<string, string>()
  for (const camp of camps) {
    for (const linkId of camp.stripe_payment_link_ids ?? []) {
      if (linkId && !/^https?:\/\//i.test(linkId)) linkIdToCampId.set(linkId, camp.id)
    }
  }

  const linkIds = Array.from(linkIdToCampId.keys())
  const [checkoutRows, attendanceRows] = await Promise.all([
    linkIds.length > 0
      ? supabaseRest<CheckoutSessionRow[]>(
          "stripe_checkout_sessions",
          {
            select: "id,payment_intent_id,payment_link_id",
            payment_link_id: `in.(${linkIds.join(",")})`,
            status: "eq.complete",
            payment_status: "eq.paid",
          },
          options,
        )
      : Promise.resolve([]),
    campIds.length > 0
      ? supabaseRest<AttendanceRow[]>(
          "camp_attendance",
          {
            select: "id,camp_id,attendance_status",
            camp_id: `in.(${campIds.join(",")})`,
          },
          options,
        )
      : Promise.resolve([]),
  ])

  const checkoutCounts = new Map<string, number>()
  for (const row of checkoutRows ?? []) {
    if (!row.payment_link_id) continue
    const campId = linkIdToCampId.get(row.payment_link_id)
    if (!campId) continue
    checkoutCounts.set(campId, (checkoutCounts.get(campId) ?? 0) + 1)
  }

  const attendanceCounts = new Map<string, number>()
  for (const row of attendanceRows ?? []) {
    if (!row.camp_id || ACTIVE_ATTENDANCE_EXCLUSIONS.includes(row.attendance_status ?? "")) continue
    attendanceCounts.set(row.camp_id, (attendanceCounts.get(row.camp_id) ?? 0) + 1)
  }

  const counts = new Map<string, number>()
  for (const camp of camps) {
    counts.set(camp.id, Math.max(checkoutCounts.get(camp.id) ?? 0, attendanceCounts.get(camp.id) ?? 0))
  }
  return counts
}

async function getFacilitiesForCamps(camps: CampRow[], options: SupabaseRestOptions = {}) {
  const ids = Array.from(new Set(camps.map((camp) => camp.facility_id).filter(Boolean) as string[]))
  if (ids.length === 0) return new Map<string, FacilityRow>()

  const rows = await supabaseRest<FacilityRow[]>(
    "facilities",
    {
      select: "id,name,city,address,court_count,photo_url,photos,notes",
      id: `in.(${ids.join(",")})`,
    },
    options,
  )

  return new Map((rows ?? []).map((row) => [row.id, row]))
}

async function getCoachNamesForCamps(camps: CampRow[], options: SupabaseRestOptions = {}) {
  const campIds = camps.map((camp) => camp.id)
  const assignmentRows =
    campIds.length > 0
      ? await supabaseRest<AssignmentRow[]>(
          "camp_coach_assignments",
          {
            select: "camp_id,coach_id,assignment_role,is_partner,hours",
            camp_id: `in.(${campIds.join(",")})`,
            order: "is_partner.desc,hours.desc",
          },
          options,
        )
      : []

  const leadCoachIdByCamp = new Map<string, string>()
  for (const camp of camps) {
    const assignments = (assignmentRows ?? []).filter((assignment) => assignment.camp_id === camp.id)
    const lead =
      assignments.find((assignment) => assignment.coach_id === camp.featured_coach_id && isLeadAssignment(assignment)) ??
      assignments.find(isLeadAssignment)
    const coachId = lead?.coach_id ?? camp.featured_coach_id
    if (coachId) leadCoachIdByCamp.set(camp.id, coachId)
  }

  const coachIds = Array.from(new Set(leadCoachIdByCamp.values()))
  const coachRows =
    coachIds.length > 0
      ? await supabaseRest<CoachRow[]>(
          "coaches",
          {
            select: "id,display_name,initials,role_type,primary_location,bio,dupr_rating",
            id: `in.(${coachIds.join(",")})`,
          },
          options,
        )
      : []

  const coachById = new Map((coachRows ?? []).map((coach) => [coach.id, coach]))
  const coachByCamp = new Map<string, CoachRow>()
  for (const [campId, coachId] of leadCoachIdByCamp) {
    const coach = coachById.get(coachId)
    if (coach) coachByCamp.set(campId, coach)
  }
  return coachByCamp
}

function publicCampRowToCard(
  row: CampRow,
  registeredCount: number,
  facility: FacilityRow | null,
  coach: CoachRow | null,
): PublicCampCard {
  const capacity = row.capacity ?? 0
  const spotsLeft = row.is_sold_out_override ? 0 : Math.max(0, capacity - registeredCount)
  const badge = badgeForCamp(row, spotsLeft, capacity)
  const badgeLabel = publicBadgeText(badge)
  // Card thumbnail: admin-chosen thumbnail/hero image wins, else facility photo.
  const heroImageUrl =
    row.thumbnail_image_url ||
    row.hero_image_url ||
    facilityPhotosForCamp(facility, "/toronto-coaching-instruction.png")[0]

  return {
    id: row.slug!,
    title: row.title,
    date: dateLabel(row.start_date, row.end_date),
    sortDate: row.start_date,
    location: row.venue ?? row.location ?? "Breakaway",
    locationFilter: locationFilterForCamp({
      location: row.location ?? "Breakaway",
      venue: row.venue ?? row.location ?? "Breakaway",
    }),
    format: row.title.toLowerCase().includes("clinic") ? "Clinic" : "Camp",
    skillLevel: skillLabel(row),
    // Admin-managed standalone camps have one exact price, so show it as-is
    // (no "From" — that prefix is for the event hubs with per-player ranges).
    price: priceLabel(row.base_price_cad),
    image: heroImageUrl ?? "/toronto-coaching-instruction.png",
    badges: badgeLabel ? [{ text: titleCaseBadge(badgeLabel), variant: badgeVariant(badge) }] : [],
    coach: coach?.display_name ?? "Breakaway coach",
    link: `/pickleball-camps/${row.slug}`,
    imageEnhanced: false,
    soldOut: spotsLeft <= 0,
    spotsRemaining: spotsLeft <= 0 ? undefined : spotsLeft,
    buttonText: "Learn More",
  }
}

export async function getPublishedPublicCamps(limit = 24) {
  const rows = await getPublishedCampRows(limit, { revalidate: PUBLIC_CAMP_REVALIDATE_SECONDS })

  const slugs = rows.map((row) => row.slug).filter(Boolean) as string[]
  const camps = await Promise.all(slugs.map((slug) => getPublicCampBySlug(slug)))

  return camps
    .filter((camp): camp is PublicCamp => Boolean(camp))
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
}

export async function getPublishedPublicCampCards(limit = 24) {
  const options = { revalidate: PUBLIC_CAMP_REVALIDATE_SECONDS }
  const rows = await getPublishedCampRows(limit, options)
  const [registeredCounts, facilitiesById, coachesByCampId] = await Promise.all([
    getRegisteredCountsForCamps(rows, options),
    getFacilitiesForCamps(rows, options),
    getCoachNamesForCamps(rows, options),
  ])

  return dedupeCardsByLink([
    ...RESTORED_PUBLIC_CAMP_CARDS,
    ...rows
    .map((row) =>
      publicCampRowToCard(
        row,
        registeredCounts.get(row.id) ?? 0,
        row.facility_id ? facilitiesById.get(row.facility_id) ?? null : null,
        coachesByCampId.get(row.id) ?? null,
      ),
    )
  ]).sort((a, b) => a.sortDate.localeCompare(b.sortDate))
}

export async function getPublishedPublicCampNavItems(limit = 12): Promise<PublicCampNavItem[]> {
  const rows = await supabaseRest<Array<Pick<CampRow, "slug" | "title">>>(
    "camps",
    {
      select: "slug,title,start_date",
      public_visibility: "eq.published",
      slug: "not.is.null",
      // Event-member camps live under their hub card, not the nav list.
      event_id: "is.null",
      start_date: `gte.${todayIso()}`,
      status: "in.(upcoming,in_progress)",
      order: "start_date.asc",
      limit: String(limit),
    },
    { revalidate: PUBLIC_CAMP_REVALIDATE_SECONDS },
  )

  return dedupeNavItemsByHref([
    ...RESTORED_PUBLIC_CAMP_NAV_ITEMS,
    ...(rows ?? []).filter((row) => row.slug).map((camp) => ({
      title: camp.title,
      href: `/pickleball-camps/${camp.slug}`,
    })),
  ]).slice(0, limit)
}

export async function getPublicCampBySlug(slug: string, options: { preview?: boolean } = {}) {
  const requestOptions = options.preview ? {} : { revalidate: PUBLIC_CAMP_REVALIDATE_SECONDS }
  const rows = await supabaseRest<CampRow[]>(
    "camps",
    {
      select:
        "id,slug,title,full_label,start_date,end_date,venue,location,notes,dupr_min,dupr_max,status,base_price_cad,capacity,stripe_payment_link_ids,is_sold_out_override,camp_kind,session_label,landing_page_url,module_ids,public_visibility,website_published_at,badge_mode,badge_label,public_summary,public_modules_intro,hero_media_asset_id,thumbnail_media_asset_id,hero_image_url,thumbnail_image_url,facility_id,featured_coach_id,include_testimonials,breaks",
      slug: `eq.${slug}`,
      limit: "1",
    },
    requestOptions,
  )

  const row = rows?.[0]
  if (!row || !row.slug) return null
  const visibility = row.public_visibility ?? "unpublished"
  if (visibility !== "published" && !options.preview) return null
  if (visibility === "archived" && !options.preview) return null

  const linkIds = row.stripe_payment_link_ids ?? []
  const [linkMap, registeredCount, facilityRows, assignmentRows, directCoachRows, campTestimonialRows] = await Promise.all([
    getPaymentLinks(linkIds, requestOptions),
    getRegisteredCount(row.id, linkIds.filter((id) => !/^https?:\/\//i.test(id)), requestOptions),
    row.facility_id
      ? supabaseRest<FacilityRow[]>(
          "facilities",
          {
            select: "id,name,city,address,court_count,photo_url,photos,notes",
            id: `eq.${row.facility_id}`,
            limit: "1",
          },
          requestOptions,
        )
      : Promise.resolve([]),
    supabaseRest<AssignmentRow[]>(
      "camp_coach_assignments",
      {
        select: "camp_id,coach_id,assignment_role,is_partner,hours",
        camp_id: `eq.${row.id}`,
        order: "is_partner.desc,hours.desc",
      },
      requestOptions,
    ),
    row.featured_coach_id
      ? supabaseRest<CoachRow[]>(
          "coaches",
          {
            select: "id,display_name,initials,role_type,primary_location,bio,dupr_rating",
            id: `eq.${row.featured_coach_id}`,
            limit: "1",
          },
          requestOptions,
        )
      : Promise.resolve([]),
    row.include_testimonials
      ? supabaseRest<CampTestimonialRow[]>(
          "camp_testimonials",
          {
            select: "camp_id,testimonial_id,sort_order",
            camp_id: `eq.${row.id}`,
            order: "sort_order.asc",
          },
          requestOptions,
        )
      : Promise.resolve([]),
  ])

  const assignments = assignmentRows ?? []
  const leadAssignment =
    assignments.find((assignment) => assignment.coach_id === row.featured_coach_id && isLeadAssignment(assignment)) ??
    assignments.find(isLeadAssignment) ??
    null
  const coachRows =
    leadAssignment
      ? await supabaseRest<CoachRow[]>(
          "coaches",
          {
            select: "id,display_name,initials,role_type,primary_location,bio,dupr_rating",
            id: `eq.${leadAssignment.coach_id}`,
            limit: "1",
          },
          requestOptions,
        )
      : assignments.length === 0 && directCoachRows && directCoachRows.length > 0
      ? directCoachRows
      : []
  const testimonialIds = (campTestimonialRows ?? []).map((item) => item.testimonial_id).filter(Boolean)
  const testimonialRows =
    testimonialIds.length > 0
      ? await supabaseRest<TestimonialRow[]>(
          "testimonials",
          {
            select: "id,quote,attribution_name,attribution_detail,rating",
            id: `in.(${testimonialIds.join(",")})`,
            is_active: "eq.true",
          },
          requestOptions,
        )
      : []

  const capacity = row.capacity ?? 0
  const spotsLeft = row.is_sold_out_override ? 0 : Math.max(0, capacity - registeredCount)
  const badge = badgeForCamp(row, spotsLeft, capacity)
  const modules = getPublicCampModules(row.module_ids, row.title)
  const facility = facilityRows?.[0] ?? null
  const coach = coachRows?.[0] ?? null
  const facilityPhotos = facilityPhotosForCamp(facility, "/toronto-coaching-instruction.png")
  // A banner image chosen/uploaded in admin wins; otherwise fall back to the
  // facility's photos, then the hardcoded default.
  const heroImageUrl =
    row.hero_image_url || facilityPhotos[0] || "/toronto-coaching-instruction.png"
  const testimonialById = new Map((testimonialRows ?? []).map((testimonial) => [testimonial.id, testimonial]))
  const campBreaks = parseBreaks(row.breaks)
  const schedule = scheduleForCamp(row.start_date, row.end_date, row.session_label, campBreaks)

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    startDate: row.start_date,
    subtitle: subtitleForCamp(row),
    dateLabel: dateLabel(row.start_date, row.end_date),
    timeLabel: row.session_label || "Time announced after registration",
    schedule,
    lunchType: lunchTypeFromBreaks(campBreaks),
    location: row.location ?? "Breakaway",
    venue: row.venue ?? row.location ?? "Breakaway",
    priceLabel: priceLabel(row.base_price_cad),
    checkoutUrl: linkMap.get(linkIds[0] ?? "") ?? null,
    capacity,
    registeredCount,
    spotsLeft,
    isSoldOut: spotsLeft <= 0,
    badge,
    summary:
      row.public_summary ??
      "A small-group Breakaway camp built around coached reps, clear patterns, and practical match-play feedback.",
    modulesIntro:
      row.public_modules_intro ??
      "This camp replaces a generic daily schedule with the actual training modules you will work through on court.",
    modules,
    heroImageUrl,
    skillLabel: skillLabel(row),
    visibility,
    facility: facility
      ? {
          name: facility.name,
          city: facility.city ?? row.location ?? "",
          address: facility.address ?? "",
          courtCount: facility.court_count ?? 0,
          photos: facilityPhotos,
          notes: venueCopyForCamp(facility, row.venue ?? row.location ?? "Breakaway"),
        }
      : null,
    coach: coach
      ? {
          name: coach.display_name,
          initials: coach.initials ?? coach.display_name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
          role: coach.role_type ?? "Breakaway coach",
          location: coach.primary_location ?? row.location ?? "Breakaway",
          bio: coach.bio || (coach.display_name.toLowerCase().includes("joey") ? JOEY_TORONTO_BIO : ""),
          duprRating: coach.dupr_rating ?? null,
          imageUrl: coachImageForCamp(coach),
        }
      : null,
    testimonials: testimonialIds
      .map((id) => testimonialById.get(id))
      .filter(Boolean)
      .map((testimonial) => ({
        id: testimonial!.id,
        quote: testimonial!.quote,
        name: testimonial!.attribution_name,
        detail: testimonial!.attribution_detail ?? "",
        rating: testimonial!.rating ?? 5,
      })),
  } satisfies PublicCamp
}
