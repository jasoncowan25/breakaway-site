import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { fetchPublicCampBySlug } from "@/lib/breakaway-api"
import {
  KIDS_WEEKLY_DEFAULT_HERO_IMAGE,
  KIDS_WEEKLY_DEFAULT_PROGRAM,
  KIDS_WEEKLY_PROGRAM_KEYS,
  KIDS_WEEKLY_PROGRAMS,
  buildKidsWeeklyProgram,
  canRenderKidsWeeklyLanding,
  kidsWeeklyHeroImage,
} from "@/lib/kids-weekly-camp"

import { KidsWeeklyLanding } from "./kids-weekly-landing"

const canonical = "/pickleball-camps/kids-weekly-pickleball-camp-toronto"

export const dynamic = "force-dynamic"

type PageProps = {
  searchParams?: Promise<{ preview?: string }>
}

function canPreview(token: string | undefined) {
  if (!token) return false
  if (process.env.NODE_ENV !== "production" && token === "local") return true
  return Boolean(process.env.PUBLIC_CAMP_PREVIEW_TOKEN && token === process.env.PUBLIC_CAMP_PREVIEW_TOKEN)
}

// The program camps, read live so a photo or price saved in admin shows on the next load.
function fetchProgramCamps(preview: boolean) {
  return Promise.all(
    KIDS_WEEKLY_PROGRAM_KEYS.map((key) =>
      fetchPublicCampBySlug(KIDS_WEEKLY_PROGRAMS[key].slug, { noStore: true, preview }),
    ),
  )
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const query = await (searchParams ?? Promise.resolve({} as { preview?: string }))
  const heroImage = kidsWeeklyHeroImage(await fetchProgramCamps(canPreview(query.preview)))
  const image = heroImage === KIDS_WEEKLY_DEFAULT_HERO_IMAGE
    ? { url: heroImage, width: 1372, height: 753, alt: "Breakaway kids pickleball camp group on court" }
    : { url: heroImage, alt: "Breakaway kids pickleball camp on court" }
  return {
    title: "Kids Weekly Pickleball Camp Toronto | Winter 2027",
    description:
      "Weekly pickleball sessions for kids ages 9–17. Mondays or Thursdays at The JAR Pickleball Club in Toronto, or Tuesdays at The Picklr Toronto West in Etobicoke.",
    alternates: { canonical },
    openGraph: {
      title: "Kids Weekly Pickleball Camp — Winter 2027",
      description: "Weekly pro-led coaching for ages 9–17 in Toronto and Etobicoke.",
      url: canonical,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      images: [heroImage],
    },
  }
}

export default async function KidsWeeklyCampPage({ searchParams }: PageProps) {
  const query = await (searchParams ?? Promise.resolve({} as { preview?: string }))
  const preview = canPreview(query.preview)
  const camps = await fetchProgramCamps(preview)

  if (!canRenderKidsWeeklyLanding(camps, preview)) notFound()

  return (
    <KidsWeeklyLanding
      programs={KIDS_WEEKLY_PROGRAM_KEYS.map((key, index) => buildKidsWeeklyProgram(key, camps[index]))}
      defaultKey={KIDS_WEEKLY_DEFAULT_PROGRAM}
      heroImageUrl={kidsWeeklyHeroImage(camps)}
    />
  )
}
