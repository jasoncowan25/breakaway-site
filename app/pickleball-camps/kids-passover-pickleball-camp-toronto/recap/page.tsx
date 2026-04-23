import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FooterNotifySignup } from "@/components/FooterNotifySignup"

export const metadata = {
  title: "Kids Passover Camp Recap | Breakaway Pickleball",
  description:
    "Recap of our Kids Passover Pickleball Camp at The Jar PickleBall Club. New skills, new friendships, and lots of fun on the court!",
  alternates: {
    canonical: "/pickleball-camps/kids-passover-pickleball-camp-toronto/recap",
  },
  openGraph: {
    url: "/pickleball-camps/kids-passover-pickleball-camp-toronto/recap",
  },
}

export default function KidsPassoverCampRecapPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section with Group Photo */}
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden bg-blue-950">
        <Image
          src="/images/kids-camp-group-photo.png"
          alt="Kids Passover Pickleball Camp group photo"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/60 to-transparent" />

        {/* Back Button */}
        <div className="absolute left-4 top-4 md:left-8 md:top-8">
          <Link href="/">
            <Button variant="outline" className="gap-2 bg-white/90 backdrop-blur-sm hover:bg-white">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        {/* Title & Meta */}
        <div className="mb-12">
          <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight text-blue-950 md:text-5xl">
            Kids Passover Pickleball Camp
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground md:gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>April 7-10, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>The Jar Pickleball Club</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Ages 8-16</span>
            </div>
          </div>

          <div className="mt-4 inline-flex items-center gap-3">
            <Badge variant="destructive">Sold Out</Badge>
            <Badge variant="secondary">Youth Program</Badge>
          </div>
        </div>

        {/* Intro */}
        <div className="prose prose-lg mb-12 max-w-none">
          <p className="text-pretty leading-relaxed text-muted-foreground">
            What an incredible week at our Kids Passover Pickleball Camp! New skills, new friendships, and lots of fun
            on the court. We couldn&apos;t have asked for a better group!
          </p>
        </div>

        <hr className="my-12 border-t border-border" />

        {/* Camp Highlights */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-blue-950 md:text-3xl">Camp Highlights</h2>

          <p className="mb-6 text-pretty leading-relaxed text-muted-foreground">
            Over four action-packed days, our young players dove into the fundamentals of pickleball while building
            confidence, teamwork, and a love for the game. From learning proper grip and stance to playing their first
            competitive matches, every camper showed tremendous growth.
          </p>

          <div className="rounded-lg bg-muted/50 p-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-950">What We Covered</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime-400" />
                <span>Pickleball fundamentals: grip, stance, and court positioning</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime-400" />
                <span>Forehand and backhand technique</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime-400" />
                <span>Serving and return of serve</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime-400" />
                <span>Introduction to dinking and net play</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime-400" />
                <span>Game rules and scoring</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime-400" />
                <span>Fun games, tournaments, and prizes</span>
              </li>
            </ul>
          </div>
        </section>

        <hr className="my-12 border-t border-border" />

        {/* Fun & Friendships */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-blue-950 md:text-3xl">New Skills, New Friends</h2>

          <p className="mb-6 text-pretty leading-relaxed text-muted-foreground">
            Beyond the skills training, what made this camp special was watching the kids connect with each other. By
            the end of the week, they were cheering each other on, high-fiving after great rallies, and making plans to
            play together again.
          </p>

          <div className="rounded-lg bg-gradient-to-br from-lime-400/20 to-lime-400/5 p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Star className="h-6 w-6 text-lime-600" />
              <h3 className="text-lg font-semibold text-blue-950">Camp Memories</h3>
            </div>

            <div className="space-y-4 text-muted-foreground">
              <p>
                Every day started with warm-ups and skill stations, moved into drills and mini-games, and ended with
                match play where the kids could put their new skills to the test.
              </p>
              <p>
                Lunch breaks were filled with laughter and conversation as the campers bonded over their shared love of
                the game. By the final day, we had a mini tournament with prizes for everyone.
              </p>
            </div>
          </div>
        </section>

        <hr className="my-12 border-t border-border" />

        {/* Thank You */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-blue-950 md:text-3xl">Thank You!</h2>

          <p className="mb-4 text-pretty leading-relaxed text-muted-foreground">
            A huge thank you to all the parents who entrusted us with their kids, and to the campers themselves for
            bringing such amazing energy every single day. Your enthusiasm made this camp unforgettable!
          </p>

          <p className="mb-6 text-pretty leading-relaxed text-muted-foreground">
            We&apos;re already planning more kids camps for the future. Stay tuned for announcements!
          </p>

          <p className="font-medium text-blue-950">More kids camps coming soon.</p>
        </section>
      </div>

      {/* CTA & Notify Signup */}
      <FooterNotifySignup showViewCampsButton />
    </main>
  )
}
