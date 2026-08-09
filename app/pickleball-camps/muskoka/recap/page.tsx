import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Calendar, MapPin, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MUSKOKA_RECAP } from "@/lib/muskoka-recap"

export const metadata: Metadata = {
  title: "Our First Summer in Muskoka | Breakaway Pickleball",
  description:
    "A recap of Breakaway Pickleball's first Muskoka summer: 12 days of connected training, great people, and active time in cottage country from July 10 to August 6, 2026.",
  alternates: { canonical: "/pickleball-camps/muskoka/recap" },
  openGraph: {
    title: "Our First Summer in Muskoka",
    description:
      "Twelve days of pickleball training, community, and cottage-country energy with Joey Manchurek.",
    url: "/pickleball-camps/muskoka/recap",
    images: [MUSKOKA_RECAP.heroImage],
  },
  twitter: {
    card: "summary_large_image",
    images: [MUSKOKA_RECAP.heroImage],
  },
}

export default function MuskokaSummerRecapPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative min-h-[520px] overflow-hidden bg-blue-950 sm:min-h-[600px]">
        <Image
          src={MUSKOKA_RECAP.heroImage}
          alt={MUSKOKA_RECAP.heroAlt}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/45 to-blue-950/20" />

        <div className="absolute left-4 top-5 z-10 sm:left-6 sm:top-6 lg:left-8">
          <Button asChild variant="outline" className="border-white/40 bg-white/90 backdrop-blur-sm hover:bg-white">
            <Link href="/pickleball-camps">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Camps
            </Link>
          </Button>
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
            <Badge className="mb-4 bg-accent text-accent-foreground hover:bg-accent">Completed</Badge>
            <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {MUSKOKA_RECAP.title}
            </h1>
            <div className="mt-5 flex flex-col gap-3 text-sm text-white/90 sm:flex-row sm:flex-wrap sm:gap-6 sm:text-base">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {MUSKOKA_RECAP.dateLabel}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {MUSKOKA_RECAP.location}
              </span>
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Coached by Joey Manchurek
              </span>
            </div>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <p className="text-pretty text-xl leading-8 text-muted-foreground sm:text-2xl sm:leading-9">
          {MUSKOKA_RECAP.intro}
        </p>

        <hr className="my-12 border-border" />

        <section aria-labelledby="training-heading">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent-foreground">
              The training progression
            </p>
            <h2 id="training-heading" className="text-3xl font-bold text-primary sm:text-4xl">
              12 Days of Nonstop Action
            </h2>
          </div>

          <div className="grid gap-5">
            {MUSKOKA_RECAP.trainingDays.map((day, index) => (
              <div key={day.title} className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-accent-foreground">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-primary sm:text-2xl">{day.title}</h3>
                    <p className="mt-3 text-pretty leading-7 text-muted-foreground">{day.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="my-12 border-border" />

        <section className="grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-primary sm:text-3xl">A New Muskoka Home</h2>
            <p className="mt-4 text-pretty leading-7 text-muted-foreground">{MUSKOKA_RECAP.facility}</p>
          </div>
          <div className="rounded-2xl bg-blue-950 p-6 text-white sm:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-lime-300">
              {MUSKOKA_RECAP.joeyHeading}
            </h2>
            <p className="mt-4 text-pretty text-lg leading-8 text-white/90">{MUSKOKA_RECAP.joeyRecap}</p>
          </div>
        </section>

        <hr className="my-12 border-border" />

        <section className="rounded-2xl bg-muted/50 p-7 text-center sm:p-10">
          <h2 className="text-3xl font-bold text-primary">We&apos;ll Be Back</h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty leading-7 text-muted-foreground">
            {MUSKOKA_RECAP.closing}
          </p>
          <Button asChild size="lg" className="mt-7 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/pickleball-camps/muskoka">
              Explore Muskoka Camps
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>
      </article>
    </main>
  )
}
