import type { Metadata } from "next"
import type { PublicCamp, PublicCampCard } from "@/lib/public-camps"

export const SITE_URL = "https://www.breakawaypickleball.ca"
export const DEFAULT_OG_IMAGE = "/images/screenshot-202025-09-07-20at-2010.png"
export const DEFAULT_OG_IMAGE_ALT = "Pickleball player in action at Breakaway camp"

export type JsonLdObject = Record<string, unknown>

export function absoluteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

export const defaultOpenGraphImage: NonNullable<Metadata["openGraph"]>["images"] = [
  {
    url: DEFAULT_OG_IMAGE,
    width: 1200,
    height: 630,
    alt: DEFAULT_OG_IMAGE_ALT,
  },
]

export function organizationJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: "Breakaway Pickleball Camps",
    url: SITE_URL,
    logo: absoluteUrl("/breakaway-text-logo-on-white.png"),
    sport: "Pickleball",
    areaServed: ["Toronto", "Greater Toronto Area", "Muskoka"],
    email: "hello@breakawaypickleball.ca",
  }
}

export function personJsonLd({
  name,
  jobTitle,
  image,
  description,
}: {
  name: string
  jobTitle: string
  image?: string
  description: string
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    description,
    image: image ? absoluteUrl(image) : undefined,
    worksFor: {
      "@type": "SportsOrganization",
      name: "Breakaway Pickleball Camps",
      url: SITE_URL,
    },
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

function priceFromLabel(label: string) {
  const match = label.replace(/,/g, "").match(/\$([0-9]+(?:\.[0-9]+)?)/)
  return match ? match[1] : undefined
}

export function eventJsonLd({
  name,
  description,
  path,
  startDate,
  endDate,
  image,
  locationName,
  address,
  priceLabel,
  availability = "https://schema.org/InStock",
}: {
  name: string
  description: string
  path: string
  startDate: string
  endDate?: string
  image: string
  locationName: string
  address?: string
  priceLabel?: string
  availability?: string
}): JsonLdObject {
  const price = priceLabel ? priceFromLabel(priceLabel) : undefined
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    url: absoluteUrl(path),
    startDate,
    endDate: endDate ?? startDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: [absoluteUrl(image)],
    location: {
      "@type": "Place",
      name: locationName,
      address: address || locationName,
    },
    organizer: {
      "@type": "SportsOrganization",
      name: "Breakaway Pickleball Camps",
      url: SITE_URL,
    },
    offers: price
      ? {
          "@type": "Offer",
          url: absoluteUrl(path),
          price,
          priceCurrency: "CAD",
          availability,
        }
      : undefined,
  }
}

export function campEventJsonLd(camp: PublicCamp): JsonLdObject {
  return eventJsonLd({
    name: camp.title,
    description: camp.summary,
    path: `/pickleball-camps/${camp.slug}`,
    startDate: camp.startDate,
    image: camp.heroImageUrl,
    locationName: camp.venue,
    address: camp.facility?.address,
    priceLabel: camp.priceLabel,
    availability: camp.isSoldOut ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
  })
}

export function itemListJsonLd(items: Array<Pick<PublicCampCard, "title" | "link">>): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      url: absoluteUrl(item.link),
    })),
  }
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}
