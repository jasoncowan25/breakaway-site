import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Footer } from "@/components/Footer"
import { Navigation } from "@/components/Navigation"
import { fetchPublicCampBySlug } from "@/lib/breakaway-api"
import {
  KIDS_WEEKLY_PROGRAMS,
  buildKidsWeeklyProgram,
  canRenderKidsWeeklyLanding,
} from "@/lib/kids-weekly-camp"
import { getPublishedPublicCampNavItems } from "@/lib/public-camps"

import { KidsWeeklyLanding } from "./kids-weekly-landing"

const canonical = "/pickleball-camps/kids-weekly-pickleball-camp-toronto"

export const metadata: Metadata = {
  title: "Kids Weekly Pickleball Camp Toronto | Fall 2026",
  description:
    "Weekly pickleball sessions for kids ages 9–14 at The JAR Pickleball Club in Toronto. Choose All Skill Levels or Experienced.",
  alternates: { canonical },
  openGraph: {
    title: "Kids Weekly Pickleball Camp — Fall 2026",
    description: "Weekly pro-led coaching for ages 9–14 at The JAR Pickleball Club in Toronto.",
    url: canonical,
    images: [
      {
        url: "/images/kids-weekly/kids-camp-group.png",
        width: 1372,
        height: 753,
        alt: "Breakaway kids pickleball camp group on court",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/kids-weekly/kids-camp-group.png"],
  },
}

export const dynamic = "force-dynamic"

type PageProps = {
  searchParams?: Promise<{ preview?: string }>
}

function canPreview(token: string | undefined) {
  if (!token) return false
  if (process.env.NODE_ENV !== "production" && token === "local") return true
  return Boolean(process.env.PUBLIC_CAMP_PREVIEW_TOKEN && token === process.env.PUBLIC_CAMP_PREVIEW_TOKEN)
}

export default async function KidsWeeklyCampPage({ searchParams }: PageProps) {
  const query = await (searchParams ?? Promise.resolve({} as { preview?: string }))
  const preview = canPreview(query.preview)
  const [allLevelsCamp, experiencedCamp, navCampItems] = await Promise.all([
    fetchPublicCampBySlug(KIDS_WEEKLY_PROGRAMS.allLevels.slug, { noStore: true, preview }),
    fetchPublicCampBySlug(KIDS_WEEKLY_PROGRAMS.experienced.slug, { noStore: true, preview }),
    getPublishedPublicCampNavItems(),
  ])

  if (!canRenderKidsWeeklyLanding(allLevelsCamp, experiencedCamp, preview)) notFound()

  return (
    <>
      <Navigation campItems={navCampItems} />
      <KidsWeeklyLanding
        allLevels={buildKidsWeeklyProgram("allLevels", allLevelsCamp)}
        experienced={buildKidsWeeklyProgram("experienced", experiencedCamp)}
      />
      <Footer />
    </>
  )
}
