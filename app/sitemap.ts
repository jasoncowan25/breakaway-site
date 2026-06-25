import type { MetadataRoute } from "next"
import { getPublishedPublicCampCards } from "@/lib/public-camps"
import { absoluteUrl } from "@/lib/seo"

// Camp pages with their recap status - single source of truth for sitemap
const campPages = [
  // Active camp pages
  { slug: "punta-cana", hasRecap: false, isActive: true },
  // Evergreen/recurring camps (keep in sitemap for link equity)
  { slug: "kids-passover-pickleball-camp-toronto", hasRecap: true, isActive: true },
  // Completed camps with recaps
  { slug: "toronto-intermediate-pickleball-camp", hasRecap: true, isActive: false },
  { slug: "saint-martin-pickleball-clinic", hasRecap: true, isActive: false },
  { slug: "toronto-intensive-jan", hasRecap: true, isActive: false },
]

const currentStandaloneCampPaths = [
  "/pickleball-camps/toronto-intermediate-intensive-sep-12-2026-3",
  "/pickleball-camps/toronto-intermediate-intensive-oct-24-2026",
]

function normalizeCampPath(path: string) {
  if (path === "/pickleball-camps/toronto-intermediate-intensive-oct-17-2026") {
    return "/pickleball-camps/toronto-intermediate-intensive-oct-24-2026"
  }
  return path
}

function sitemapEntry(path: string, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"], priority: number) {
  return {
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency,
    priority,
  }
}

function dedupeSitemap(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const seen = new Set<string>()
  return entries.filter((entry) => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    // Main pages
    sitemapEntry("/", "weekly", 1.0),
    sitemapEntry("/pickleball-camps", "weekly", 0.9),
    sitemapEntry("/pickleball-coaches", "monthly", 0.8),
    sitemapEntry("/pickleball-camp-experience", "monthly", 0.8),
    sitemapEntry("/schedule", "weekly", 0.85),
    // Muskoka Hub
    sitemapEntry("/pickleball-camps/muskoka", "weekly", 0.9),
  ]

  const publishedCampCards = await getPublishedPublicCampCards(48).catch(() => [])
  const dynamicCampPaths = publishedCampCards
    .map((camp) => normalizeCampPath(camp.link))
    .filter((path) => path.startsWith("/pickleball-camps/"))

  // Generate camp page URLs
  const campPageUrls: MetadataRoute.Sitemap = campPages
    .filter((camp) => camp.isActive)
    .map((camp) => sitemapEntry(`/pickleball-camps/${camp.slug}`, "weekly", 0.9))

  const currentCampUrls: MetadataRoute.Sitemap = [
    ...currentStandaloneCampPaths,
    ...dynamicCampPaths,
  ].map((path) => sitemapEntry(path, "weekly", 0.9))

  // Automatically generate recap URLs for camps with hasRecap: true
  const recapUrls: MetadataRoute.Sitemap = campPages
    .filter((camp) => camp.hasRecap)
    .map((camp) => sitemapEntry(`/pickleball-camps/${camp.slug}/recap`, "monthly", 0.7))

  return dedupeSitemap([...staticPages, ...campPageUrls, ...currentCampUrls, ...recapUrls])
}
