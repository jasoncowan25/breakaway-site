import { getRecaps } from "@/lib/recaps/get"
import type { MetadataRoute } from "next"
import { getPublishedPublicCampCards } from "@/lib/public-camps"
import { absoluteUrl } from "@/lib/seo"

export const dynamic = "force-dynamic"

// Completed events stay discoverable through recaps instead of old booking pages.
const recapSlugs = [
  "kids-passover-pickleball-camp-toronto",
  "toronto-intermediate-pickleball-camp",
  "saint-martin-pickleball-clinic",
  "toronto-intensive-jan",
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
    sitemapEntry("/pickleball-lessons", "weekly", 0.9),
    sitemapEntry("/pickleball-coaches", "monthly", 0.8),
    sitemapEntry("/schedule", "weekly", 0.85),
    // Muskoka Hub
    sitemapEntry("/pickleball-camps/muskoka", "weekly", 0.9),
    sitemapEntry("/pickleball-camps/muskoka/recap", "monthly", 0.7),
  ]

  const publishedCampCards = await getPublishedPublicCampCards(48).catch(() => [])
  const dynamicCampPaths = publishedCampCards
    .map((camp) => normalizeCampPath(camp.link))
    .filter((path) => path.startsWith("/pickleball-camps/"))

  // The feed excludes camps whose end date has passed in Toronto.
  const currentCampUrls = dynamicCampPaths.map((path) => sitemapEntry(path, "weekly", 0.9))
  const recapUrls = recapSlugs.map((slug) =>
    sitemapEntry(`/pickleball-camps/${slug}/recap`, "monthly", 0.7),
  )

  const managedRecaps = (await getRecaps()).map(recap => ({ ...sitemapEntry(`/pickleball-camps/${recap.slug}/recap`, "monthly", 0.7), lastModified: new Date(recap.publishedAt) }))
  return dedupeSitemap([...staticPages, ...currentCampUrls, ...managedRecaps, ...recapUrls])
}
