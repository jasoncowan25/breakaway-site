import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.breakawaypickleball.ca"

  return [
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
    // Live camp pages
    {
      url: `${baseUrl}/pickleball-camps/toronto-core-skills-pickleball-camp`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pickleball-camps/kids-passover-pickleball-camp-toronto`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    // Recap pages (only ones that exist)
    {
      url: `${baseUrl}/pickleball-camps/kids-passover-pickleball-camp-toronto/recap`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]
}
