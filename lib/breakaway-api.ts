// Thin client for the Breakaway public API (api.breakawaypickleball.ca).
//
// This replaces the site's old direct Supabase + Stripe reads. The API returns
// flattened public-camp data with availability + checkout URL already computed
// server-side, so the marketing site never needs Supabase/Stripe credentials.

const API_BASE = (
  process.env.NEXT_PUBLIC_BREAKAWAY_API_URL ??
  process.env.BREAKAWAY_API_URL ??
  "https://api.breakawaypickleball.ca"
).replace(/\/$/, "")

// Default ISR window for camp data (seconds).
export const PUBLIC_CAMP_REVALIDATE_SECONDS = 300

export type ApiCampBadge =
  | "auto"
  | "none"
  | "new"
  | "just_announced"
  | "selling_fast"
  | "almost_full"
  | "sold_out"

export interface ApiCampCoach {
  id: string
  displayName: string
  initials: string | null
  roleType: string | null
  primaryLocation: string | null
  bio: string | null
  duprRating: number | null
  assignmentRole: string | null
  isPartner: boolean
  isFeatured: boolean
}

export interface ApiCampFacility {
  id: string
  name: string
  city: string | null
  address: string | null
  courtCount: number | null
  notes: string | null
}

export interface ApiCampTestimonial {
  id: string
  quote: string
  attributionName: string
  attributionDetail: string | null
  rating: number | null
  sortOrder: number
}

export interface ApiCampBreak {
  type: "snack" | "hydration" | "byo_lunch" | "catered_lunch"
  start: string
  durationMinutes: number
  windowLabel: string
}

export interface ApiCamp {
  id: string
  slug: string | null
  title: string
  fullLabel: string
  startDate: string
  endDate: string | null
  venue: string | null
  location: string | null
  notes: string | null
  duprMin: number | null
  duprMax: number | null
  status: string
  publicVisibility: "unpublished" | "preview" | "published" | "archived"
  websitePublishedAt: string | null
  basePriceCents: number | null
  capacity: number | null
  campKind: string | null
  sessionLabel: string | null
  landingPageUrl: string | null
  badgeMode: "auto" | "manual" | null
  badgeLabel: ApiCampBadge | null
  isSoldOutOverride: boolean
  publicSummary: string | null
  publicModulesIntro: string | null
  heroMediaAssetId: string | null
  thumbnailMediaAssetId: string | null
  includeTestimonials: boolean
  moduleIds: string[]
  eventId: string | null
  breaks: ApiCampBreak[]
  lunchType: "catered" | "byo" | null
  registeredCount: number
  spotsLeft: number | null
  isSoldOut: boolean
  checkoutUrl: string | null
  facility: ApiCampFacility | null
  coaches: ApiCampCoach[]
  testimonials: ApiCampTestimonial[]
}

interface Envelope<T> {
  data: T | null
  error: { code: string; message: string } | null
}

interface FetchOptions {
  revalidate?: number
  preview?: boolean
}

async function apiGet<T>(path: string, options: FetchOptions = {}): Promise<T | null> {
  const url = `${API_BASE}${path}`
  // In local/preview dev we want the page to mirror the database immediately so
  // admin edits (add/remove/publish a camp) are visible on the next refresh.
  // Production keeps ISR caching for performance.
  const liveInDev = process.env.NODE_ENV !== "production"
  try {
    const res = await fetch(url, {
      headers: { accept: "application/json" },
      ...(options.preview || liveInDev
        ? { cache: "no-store" as const }
        : { next: { revalidate: options.revalidate ?? PUBLIC_CAMP_REVALIDATE_SECONDS } }),
    })
    if (!res.ok) {
      if (res.status !== 404) {
        console.error(`[breakaway-api] ${path} -> ${res.status}`)
      }
      return null
    }
    const body = (await res.json()) as Envelope<T>
    if (body.error || body.data == null) return null
    return body.data
  } catch (err) {
    console.error(`[breakaway-api] ${path} fetch failed`, err)
    return null
  }
}

/** All public camps (the API returns preview + published; callers filter). */
export async function fetchPublicCamps(options: FetchOptions = {}): Promise<ApiCamp[]> {
  const data = await apiGet<{ camps: ApiCamp[] }>("/api/v1/public/camps", options)
  return data?.camps ?? []
}

/** A single public camp by slug, or null if not found. */
export async function fetchPublicCampBySlug(
  slug: string,
  options: FetchOptions = {},
): Promise<ApiCamp | null> {
  const data = await apiGet<{ camp: ApiCamp }>(
    `/api/v1/public/camps/${encodeURIComponent(slug)}`,
    options,
  )
  return data?.camp ?? null
}

// ── Camp shots ───────────────────────────────────────────────────────────────
// A camp's "What You'll Master" list, resolved from camp_shots → shots, each
// tagged with its family (Shots / Defense / Strategy & Positioning) so the site
// can render the fixed family icon.

export type ApiShotFamily = "shots" | "defense" | "strategy_positioning"

export interface ApiCampShot {
  id: string
  title: string
  family: ApiShotFamily
}

/** A camp's published shots in declared order, or [] if none / not found. */
export async function fetchPublicCampShots(
  slug: string,
  options: FetchOptions = {},
): Promise<ApiCampShot[]> {
  const data = await apiGet<{ shots: ApiCampShot[] }>(
    `/api/v1/public/camps/${encodeURIComponent(slug)}/shots`,
    options,
  )
  return data?.shots ?? []
}

// ── Camp Events ────────────────────────────────────────────────────────────
// A Camp Event groups bookable camps under one facility. The landing page is
// custom-coded on the marketing site; this feeds its camps grid.

export interface ApiCampEventFacility {
  id: string
  name: string
  city: string | null
  address: string | null
  courtCount: number | null
  notes: string | null
}

/** A camp in an event feed, with its focus list resolved from training modules. */
export type ApiCampEventCamp = ApiCamp & { focus: string[] }

export interface ApiCampEvent {
  id: string
  slug: string
  title: string
  facility: ApiCampEventFacility | null
  camps: ApiCampEventCamp[]
}

/** A Camp Event + its camps feed, or null if not found / not public. */
export async function fetchPublicCampEvent(
  slug: string,
  options: FetchOptions = {},
): Promise<ApiCampEvent | null> {
  const data = await apiGet<{ event: ApiCampEvent }>(
    `/api/v1/public/camp-events/${encodeURIComponent(slug)}`,
    options,
  )
  return data?.event ?? null
}
