import { getPublicCampModules, type PublicCampModule } from "@/lib/public-camp-modules"

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
  facility_id: string | null
  featured_coach_id: string | null
  include_testimonials: boolean | null
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
  subtitle: string
  dateLabel: string
  timeLabel: string
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

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return { url: url.replace(/\/$/, ""), key }
}

async function supabaseRest<T>(path: string, params: Record<string, string>) {
  const config = supabaseConfig()
  if (!config) return null

  const url = new URL(`${config.url}/rest/v1/${path}`)
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value))

  const response = await fetch(url.toString(), {
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    console.error(`[public-camps] Supabase ${path} failed`, response.status, await response.text())
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

async function getPaymentLinks(ids: string[]) {
  const linkIds = ids.filter((id) => id && !/^https?:\/\//i.test(id))
  const directUrls = ids.filter((id) => /^https?:\/\//i.test(id))
  const links = new Map<string, string>()
  directUrls.forEach((url) => links.set(url, url))

  if (linkIds.length === 0) return links

  const rows = await supabaseRest<PaymentLinkRow[]>("stripe_payment_links", {
    select: "id,url",
    id: `in.(${linkIds.join(",")})`,
  })

  for (const row of rows ?? []) {
    if (row.url) links.set(row.id, row.url)
  }
  return links
}

async function getRegisteredCount(campId: string, linkIds: string[]) {
  const [checkoutRows, attendanceRows] = await Promise.all([
    linkIds.length > 0
      ? supabaseRest<CheckoutSessionRow[]>("stripe_checkout_sessions", {
          select: "id,payment_intent_id,payment_link_id",
          payment_link_id: `in.(${linkIds.join(",")})`,
          status: "eq.complete",
          payment_status: "eq.paid",
        })
      : Promise.resolve([]),
    supabaseRest<AttendanceRow[]>("camp_attendance", {
      select: "id,attendance_status",
      camp_id: `eq.${campId}`,
    }),
  ])

  const activeAttendance = (attendanceRows ?? []).filter(
    (row) => !["cancelled", "refunded", "credit_on_file", "credit_applied"].includes(row.attendance_status ?? ""),
  ).length

  return Math.max(checkoutRows?.length ?? 0, activeAttendance)
}

export function publicBadgeText(badge: Exclude<PublicCampBadge, "auto">) {
  return badgeText(badge)
}

export async function getPublicCampBySlug(slug: string, options: { preview?: boolean } = {}) {
  const rows = await supabaseRest<CampRow[]>("camps", {
    select:
      "id,slug,title,full_label,start_date,end_date,venue,location,notes,dupr_min,dupr_max,status,base_price_cad,capacity,stripe_payment_link_ids,is_sold_out_override,camp_kind,session_label,landing_page_url,module_ids,public_visibility,website_published_at,badge_mode,badge_label,public_summary,public_modules_intro,hero_media_asset_id,thumbnail_media_asset_id,facility_id,featured_coach_id,include_testimonials",
    slug: `eq.${slug}`,
    limit: "1",
  })

  const row = rows?.[0]
  if (!row || !row.slug) return null
  const visibility = row.public_visibility ?? "unpublished"
  if (visibility !== "published" && !options.preview) return null
  if (visibility === "archived" && !options.preview) return null

  const linkIds = row.stripe_payment_link_ids ?? []
  const [linkMap, registeredCount, facilityRows, assignmentRows, directCoachRows, campTestimonialRows] = await Promise.all([
    getPaymentLinks(linkIds),
    getRegisteredCount(row.id, linkIds.filter((id) => !/^https?:\/\//i.test(id))),
    row.facility_id
      ? supabaseRest<FacilityRow[]>("facilities", {
          select: "id,name,city,address,court_count,photo_url,photos,notes",
          id: `eq.${row.facility_id}`,
          limit: "1",
        })
      : Promise.resolve([]),
    supabaseRest<AssignmentRow[]>("camp_coach_assignments", {
      select: "camp_id,coach_id,assignment_role,is_partner,hours",
      camp_id: `eq.${row.id}`,
      order: "is_partner.desc,hours.desc",
    }),
    row.featured_coach_id
      ? supabaseRest<CoachRow[]>("coaches", {
          select: "id,display_name,initials,role_type,primary_location,bio,dupr_rating",
          id: `eq.${row.featured_coach_id}`,
          limit: "1",
        })
      : Promise.resolve([]),
    row.include_testimonials
      ? supabaseRest<CampTestimonialRow[]>("camp_testimonials", {
          select: "camp_id,testimonial_id,sort_order",
          camp_id: `eq.${row.id}`,
          order: "sort_order.asc",
        })
      : Promise.resolve([]),
  ])

  const leadAssignment =
    (assignmentRows ?? []).find((assignment) => assignment.coach_id === row.featured_coach_id) ??
    (assignmentRows ?? []).find((assignment) => assignment.assignment_role === "lead" || assignment.is_partner) ??
    (assignmentRows ?? [])[0]
  const coachRows =
    directCoachRows && directCoachRows.length > 0
      ? directCoachRows
      : leadAssignment
        ? await supabaseRest<CoachRow[]>("coaches", {
            select: "id,display_name,initials,role_type,primary_location,bio,dupr_rating",
            id: `eq.${leadAssignment.coach_id}`,
            limit: "1",
          })
        : []
  const testimonialIds = (campTestimonialRows ?? []).map((item) => item.testimonial_id).filter(Boolean)
  const testimonialRows =
    testimonialIds.length > 0
      ? await supabaseRest<TestimonialRow[]>("testimonials", {
          select: "id,quote,attribution_name,attribution_detail,rating",
          id: `in.(${testimonialIds.join(",")})`,
          is_active: "eq.true",
        })
      : []

  const capacity = row.capacity ?? 0
  const spotsLeft = row.is_sold_out_override ? 0 : Math.max(0, capacity - registeredCount)
  const badge = badgeForCamp(row, spotsLeft, capacity)
  const modules = getPublicCampModules(row.module_ids, row.title)
  const facility = facilityRows?.[0] ?? null
  const coach = coachRows?.[0] ?? null
  const facilityPhotos = facilityPhotosForCamp(facility, "/toronto-coaching-instruction.png")
  const heroImageUrl = facilityPhotos[0] ?? "/toronto-coaching-instruction.png"
  const testimonialById = new Map((testimonialRows ?? []).map((testimonial) => [testimonial.id, testimonial]))

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: subtitleForCamp(row),
    dateLabel: dateLabel(row.start_date, row.end_date),
    timeLabel: row.session_label || "Time announced after registration",
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
