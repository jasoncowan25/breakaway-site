import type { MetadataRoute } from "next"

// Camp pages with their recap status - single source of truth for sitemap
const campPages = [
  // Active camp pages
  { slug: "toronto-core-skills-pickleball-camp", hasRecap: false, isActive: true },
  { slug: "punta-cana", hasRecap: false, isActive: true },
  // Evergreen/recurring camps (keep in sitemap for link equity)
  { slug: "kids-passover-pickleball-camp-toronto", hasRecap: true, isActive: true },
  // Completed camps with recaps
  { slug: "toronto-intermediate-pickleball-camp", hasRecap: true, isActive: false },
  { slug: "saint-martin-pickleball-clinic", hasRecap: true, isActive: false },
  { slug: "toronto-intensive-jan", hasRecap: true, isActive: false },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.breakawaypickleball.ca"

  const staticPages: MetadataRoute.Sitemap = [
    // Main pages
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pickleball-camps`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pickleball-coaches`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pickleball-camp-experience`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/schedule`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    // Muskoka Hub
    {
      url: `${baseUrl}/pickleball-camps/muskoka`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ]

  // Generate camp page URLs
  const campPageUrls: MetadataRoute.Sitemap = campPages
    .filter((camp) => camp.isActive)
    .map((camp) => ({
      url: `${baseUrl}/pickleball-camps/${camp.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }))

  // Automatically generate recap URLs for camps with hasRecap: true
  const recapUrls: MetadataRoute.Sitemap = campPages
    .filter((camp) => camp.hasRecap)
    .map((camp) => ({
      url: `${baseUrl}/pickleball-camps/${camp.slug}/recap`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))

  return [...staticPages, ...campPageUrls, ...recapUrls]
}
