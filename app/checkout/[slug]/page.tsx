import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { fetchPublicCampBySlug, fetchPublicCheckoutLink, type ApiCamp } from "@/lib/breakaway-api"
import {
  checkoutLinkUnavailableMessage,
  checkoutOfferFromLink,
  looksLikeCheckoutLinkCode,
} from "@/lib/checkout-links"
import { resolveCheckoutOffer, type CheckoutOffer } from "@/lib/checkout-offers"
import { formatRecurringCampDates, formatSessionTime } from "@/lib/session-time"

import { CheckoutClient, type CheckoutCampView } from "./checkout-client"
import "@/styles/tokens.css"
import "@/styles/checkout.css"
import "@/styles/checkout-integration.css"

export const dynamic = "force-dynamic"
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ preview?: string; offer?: string }>
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
  if (text.includes("experienced")) return "Experienced"
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

function toCheckoutCampView(
  camp: ApiCamp,
  offer: CheckoutOffer | null,
  options: { bypassCapacity?: boolean } = {},
): CheckoutCampView | null {
  if (!camp.slug) return null

  const capacity = camp.capacity ?? 0
  // A custom link with seat counting turned off books regardless of how full
  // the camp is (the admin accepted the oversubscription when creating it).
  const spotsLeft = options.bypassCapacity ? Math.max(1, capacity || 6) : (camp.spotsLeft ?? capacity)
  const skillLabel = skillLabelForCamp(camp)
  const subtitle = subtitleForCamp(camp)
  const coach = camp.coaches.find((item) => item.isFeatured) ?? camp.coaches[0]
  const recurring = formatRecurringCampDates(
    offer?.sessionDates ?? camp.sessionDates,
    offer?.sessionLabel ?? camp.sessionLabel,
  )

  return {
    id: camp.id,
    slug: camp.slug,
    title: camp.title,
    subtitle,
    dateLabel: recurring?.dateLabel ?? formatDateRange(camp.startDate, camp.endDate),
    timeLabel: recurring
      ? [recurring.scheduleLabel, recurring.sessionCountLabel, offer?.scheduleNote]
          .filter(Boolean)
          .join(" · ")
      : formatSessionTime(camp.sessionLabel) ?? "Time announced after registration",
    venue: camp.venue ?? camp.facility?.name ?? "Breakaway",
    location: camp.location ?? camp.facility?.city ?? "Breakaway",
    priceLabel: formatMoney(offer?.unitPriceCents ?? camp.basePriceCents),
    offerCode: offer?.code ?? null,
    offerLabel: offer?.label ?? null,
    capacity,
    spotsLeft,
    isSoldOut: options.bypassCapacity ? false : camp.isSoldOut,
    heroImageUrl: camp.childrenEligible && recurring ? "/images/kids-camp-group-photo.png" : heroImageForCamp(camp),
    skillLabel,
    coachName: coach?.displayName ?? "Breakaway coach",
    isKidsCamp: camp.childrenEligible,
    collectTshirtSizes: camp.collectTshirtSizes,
    lunchType: camp.lunchType,
    isRecurring: Boolean(recurring),
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
    offerCode: null,
    offerLabel: null,
    capacity: 16,
    spotsLeft: 16,
    isSoldOut: false,
    heroImageUrl: "/jar3.png",
    skillLabel: "3.0-3.5",
    coachName: "Joey Manchurek",
    isKidsCamp: false,
    collectTshirtSizes: true,
    lunchType: "catered",
    isRecurring: false,
  }
}

function CheckoutLinkUnavailable({
  message,
  campTitle,
  campSlug,
}: {
  message: string
  campTitle: string
  campSlug: string | null
}) {
  return (
    <div className="co-scope">
      <div className="backdrop bg-clean" style={{ justifyContent: "center" }}>
        <div className="shell view" style={{ maxWidth: 560, margin: "0 auto", padding: "48px 20px" }}>
          <div
            className="panel"
            style={{ padding: "36px 32px", textAlign: "center", borderRadius: 16, background: "#fff", border: "1px solid #e5e7eb" }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                margin: "0 auto 18px",
                borderRadius: 999,
                background: "#eef4fb",
                color: "#124A7A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                <path d="m2 2 20 20" />
              </svg>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 8px", color: "#111827" }}>
              Checkout link unavailable
            </h1>
            <p style={{ fontSize: 15, color: "#4b5563", margin: "0 0 6px", lineHeight: 1.5 }}>{message}</p>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 22px" }}>{campTitle}</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="mailto:hello@breakawaypickleball.ca?subject=Camp%20registration"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 42,
                  padding: "0 18px",
                  borderRadius: 10,
                  background: "#124A7A",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: "none",
                }}
              >
                Contact us to register
              </a>
              {campSlug && (
                <a
                  href={`/pickleball-camps/${campSlug}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    height: 42,
                    padding: "0 18px",
                    borderRadius: 10,
                    border: "1px solid #d1d5db",
                    color: "#111827",
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                    background: "#fff",
                  }}
                >
                  View camp page
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function CheckoutPage({ params, searchParams }: PageProps) {
  const [{ slug }, query] = await Promise.all([
    params,
    searchParams ?? Promise.resolve({} as { preview?: string; offer?: string }),
  ])
  const preview = canPreview(query.preview)
  const camp = await fetchPublicCampBySlug(slug, { noStore: true })

  if (!camp) {
    // /checkout/<code> — a private custom checkout link minted from the admin.
    if (looksLikeCheckoutLinkCode(slug)) {
      const resolved = await fetchPublicCheckoutLink(slug)
      if (resolved) {
        if (!resolved.link.available) {
          return (
            <CheckoutLinkUnavailable
              message={checkoutLinkUnavailableMessage(resolved.link.unavailableReason)}
              campTitle={resolved.camp.title}
              campSlug={resolved.camp.slug}
            />
          )
        }
        const linkOffer = checkoutOfferFromLink(resolved.link, resolved.camp.sessionLabel)
        const linkView = toCheckoutCampView(resolved.camp, linkOffer, {
          bypassCapacity: !resolved.link.countsTowardCapacity,
        })
        if (!linkView) notFound()
        return <CheckoutClient camp={linkView} />
      }
    }
    if (query.offer) notFound()
    const fallback = preview ? localPreviewCamp(slug) : null
    if (!fallback) notFound()
    return <CheckoutClient camp={fallback} />
  }

  const offer = resolveCheckoutOffer(camp.id, query.offer)
  if (query.offer && !offer) notFound()

  const view = toCheckoutCampView(camp, offer)
  if (!view) notFound()

  return <CheckoutClient camp={view} />
}
