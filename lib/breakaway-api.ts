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
  try {
    const res = await fetch(url, {
      headers: { accept: "application/json" },
      ...(options.preview
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
