import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { fetchPublicCampBySlug } from "@/lib/breakaway-api"
import {
  KIDS_WEEKLY_DEFAULT_PROGRAM,
  KIDS_WEEKLY_PROGRAM_KEYS,
  KIDS_WEEKLY_PROGRAMS,
  buildKidsWeeklyProgram,
  canRenderKidsWeeklyLanding,
} from "@/lib/kids-weekly-camp"

import { KidsWeeklyLanding } from "./kids-weekly-landing"

const canonical = "/pickleball-camps/kids-weekly-pickleball-camp-toronto"

export const metadata: Metadata = {
  title: "Kids Weekly Pickleball Camp Toronto | Winter 2027",
  description:
    "Weekly pickleball sessions for kids ages 9–14. Mondays or Thursdays at The JAR Pickleball Club in Toronto, or Tuesdays at The Picklr Toronto West in Etobicoke.",
  alternates: { canonical },
  openGraph: {
    title: "Kids Weekly Pickleball Camp — Winter 2027",
    description: "Weekly pro-led coaching for ages 9–14 in Toronto and Etobicoke.",
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
  const camps = await Promise.all(
    KIDS_WEEKLY_PROGRAM_KEYS.map((key) =>
      fetchPublicCampBySlug(KIDS_WEEKLY_PROGRAMS[key].slug, { noStore: true, preview }),
    ),
  )

  if (!canRenderKidsWeeklyLanding(camps, preview)) notFound()

  return (
    <KidsWeeklyLanding
      programs={KIDS_WEEKLY_PROGRAM_KEYS.map((key, index) => buildKidsWeeklyProgram(key, camps[index]))}
      defaultKey={KIDS_WEEKLY_DEFAULT_PROGRAM}
    />
  )
}
