import { notFound } from "next/navigation"

import { fetchPublicCampBySlug, type ApiCamp } from "@/lib/breakaway-api"

import { CheckoutClient, type CheckoutCampView } from "./checkout-client"
import "@/styles/tokens.css"
import "@/styles/checkout.css"
import "@/styles/checkout-integration.css"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ preview?: string }>
}

function canPreview(token: string | undefined) {
  if (!token) return false
  if (process.env.NODE_ENV !== "production" && token === "local") return true
  return Boolean(process.env.PUBLIC_CAMP_PREVIEW_TOKEN && token === process.env.PUBLIC_CAMP_PREVIEW_TOKEN)
}

function formatMoney(cents: number | null) {
  if (cents == null) return "Price announced after registration"
  return `$${Math.round(cents / 100).toLocaleString("en-CA")} CAD`
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`))
}

function formatDateRange(startDate: string, endDate: string | null) {
  if (!endDate || endDate === startDate) return formatDate(startDate)

  const start = new Date(`${startDate}T00:00:00Z`)
  const end = new Date(`${endDate}T00:00:00Z`)
  const sameMonth = start.getUTCFullYear() === end.getUTCFullYear() && start.getUTCMonth() === end.getUTCMonth()

  if (sameMonth) {
    const month = new Intl.DateTimeFormat("en-CA", { month: "long", timeZone: "UTC" }).format(start)
    return `${month} ${start.getUTCDate()}-${end.getUTCDate()}, ${end.getUTCFullYear()}`
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

function heroImageForCamp(camp: ApiCamp) {
  const text = `${camp.title} ${camp.venue ?? ""} ${camp.location ?? ""}`.toLowerCase()
  if (text.includes("muskoka") || text.includes("bracebridge")) return "/muskoka-photos/muskoka-court-indoor.jpg"
  if (text.includes("jar") || text.includes("toronto")) return "/jar3.png"
  return "/toronto-coaching-instruction.png"
}

function skillLabelForCamp(camp: ApiCamp) {
  if (camp.duprMin != null && camp.duprMax != null) return `${camp.duprMin.toFixed(1)}-${camp.duprMax.toFixed(1)}`
  const text = `${camp.title} ${camp.fullLabel} ${camp.publicSummary ?? ""}`.toLowerCase()
  if (text.includes("fundamentals") || text.includes("beginner")) return "Beginner"
  if (text.includes("intermediate")) return "3.0-3.5"
  if (text.includes("advanced")) return "Advanced"
  return "All levels"
}

function subtitleForCamp(camp: ApiCamp) {
  if (camp.publicSummary) return camp.publicSummary
  const skill = skillLabelForCamp(camp)
  if (skill === "Beginner") return "Small-group fundamentals camp for confident point construction."
  if (skill === "3.0-3.5") return "Advanced training for intermediate players (3.0-3.5)."
  return camp.fullLabel
}

function toCheckoutCampView(camp: ApiCamp): CheckoutCampView | null {
  if (!camp.slug) return null

  const capacity = camp.capacity ?? 0
  const spotsLeft = camp.spotsLeft ?? capacity
  const skillLabel = skillLabelForCamp(camp)
  const subtitle = subtitleForCamp(camp)
  const coach = camp.coaches.find((item) => item.isFeatured) ?? camp.coaches[0]

  return {
    id: camp.id,
    slug: camp.slug,
    title: camp.title,
    subtitle,
    dateLabel: formatDateRange(camp.startDate, camp.endDate),
    timeLabel: camp.sessionLabel ?? "Time announced after registration",
    venue: camp.venue ?? camp.facility?.name ?? "Breakaway",
    location: camp.location ?? camp.facility?.city ?? "Breakaway",
    priceLabel: formatMoney(camp.basePriceCents),
    capacity,
    spotsLeft,
    isSoldOut: camp.isSoldOut,
    heroImageUrl: heroImageForCamp(camp),
    skillLabel,
    coachName: coach?.displayName ?? "Breakaway coach",
    isKidsCamp: camp.childrenEligible,
    collectTshirtSizes: camp.collectTshirtSizes,
    lunchType: camp.lunchType,
  }
}

function localPreviewCamp(slug: string): CheckoutCampView | null {
  if (process.env.NODE_ENV === "production") return null
  if (slug !== "toronto-intermediate-intensive-sep-12-2026-3") return null

  return {
    id: "local-preview-toronto-intensive",
    slug,
    title: "Toronto Intermediate Intensive",
    subtitle: "2-Day Advanced Training for Intermediate Players (3.0-3.5)",
    dateLabel: "September 12-13, 2026",
    timeLabel: "9:00 AM - 4:00 PM",
    venue: "The JAR Pickleball Club",
    location: "Toronto & GTA",
    priceLabel: "$700 CAD",
    capacity: 16,
    spotsLeft: 16,
    isSoldOut: false,
    heroImageUrl: "/jar3.png",
    skillLabel: "3.0-3.5",
    coachName: "Joey Manchurek",
    isKidsCamp: false,
    collectTshirtSizes: true,
    lunchType: "catered",
  }
}

export default async function CheckoutPage({ params, searchParams }: PageProps) {
  const [{ slug }, query] = await Promise.all([
    params,
    searchParams ?? Promise.resolve({} as { preview?: string }),
  ])
  const preview = canPreview(query.preview)
  const camp = await fetchPublicCampBySlug(slug, { noStore: true })

  if (!camp) {
    const fallback = preview ? localPreviewCamp(slug) : null
    if (!fallback) notFound()
    return <CheckoutClient camp={fallback} />
  }

  const view = toCheckoutCampView(camp)
  if (!view) notFound()

  return <CheckoutClient camp={view} />
}
