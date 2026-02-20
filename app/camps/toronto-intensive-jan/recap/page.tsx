import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Users, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TorontoIntensiveRecapPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section with Group Photo */}
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden bg-blue-950">
        <Image
          src="/images/jan2026camp.jpeg"
          alt="Toronto Intensive Intensive group photo"
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
            Toronto Intermediate Intensive
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground md:gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>January 10–11, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>The Jar Pickleball Club</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>6:1 Player Ratio</span>
            </div>
          </div>

          <div className="mt-4 inline-flex items-center gap-3">
            <span className="rounded-full bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive">
              Sold Out
            </span>
            <span className="rounded-full bg-blue-950/10 px-3 py-1 text-sm font-medium text-blue-950">
              Pro-Led Training
            </span>
          </div>
        </div>

        {/* Intro */}
        <div className="prose prose-lg mb-12 max-w-none">
          <p className="text-pretty leading-relaxed text-muted-foreground">
            Our first-ever Breakaway Pickleball Camp brought together a full group of intermediate players for two
            focused, high-rep days of technical training, game awareness, and competitive play. The emphasis throughout
            the weekend was simple: build better habits, understand patterns, and apply them in real games.
          </p>
        </div>

        <hr className="my-12 border-t border-border" />

        {/* Day 1 */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-blue-950 md:text-3xl">
            Day 1 — Net Control & Transitioning Forward
          </h2>

          <p className="mb-6 text-pretty leading-relaxed text-muted-foreground">
            Day 1 was all about owning the kitchen and earning your way to the net. Players worked through net play
            fundamentals in the morning — cross-court dinks, volleys, and speed-ups — then shifted to drives, drops, and
            transition play in the afternoon, finishing with live gameplay to apply their new skills.
          </p>

          <div className="rounded-lg bg-muted/50 p-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-950">Key Themes</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime-400" />
                <span>Kitchen control and offensive dinking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime-400" />
                <span>Volleys and speed-ups with intention</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime-400" />
                <span>3rd-shot drives vs drops</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime-400" />
                <span>Transitioning forward and winning points at the net</span>
              </li>
            </ul>
          </div>
        </section>

        <hr className="my-12 border-t border-border" />

        {/* Day 2 */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-blue-950 md:text-3xl">
            Day 2 — Defense, Lobs & Competitive Play
          </h2>

          <p className="mb-6 text-pretty leading-relaxed text-muted-foreground">
            Day 2 built on Day 1 by focusing on defense, overheads, and problem-solving under pressure. The morning
            covered overhead smashes, two-handed backhand volleys, and defending smashes, followed by lobs and lob
            retrieval work in the afternoon, and wrapped with a structured tournament to test their new skills in
            competitive play.
          </p>

          <div className="rounded-lg bg-muted/50 p-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-950">Key Themes</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime-400" />
                <span>Smashes and smash defense</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime-400" />
                <span>Two-handed backhand development</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime-400" />
                <span>Lobs, retrieval, and recovery</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime-400" />
                <span>Applying skills in competitive match play</span>
              </li>
            </ul>
          </div>
        </section>

        <hr className="my-12 border-t border-border" />

        {/* Tournament Results */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-blue-950 md:text-3xl">Tournament Champions</h2>

          <p className="mb-6 text-pretty leading-relaxed text-muted-foreground">
            The weekend wrapped up with a competitive tournament where players put their new skills to the test. After
            some incredible matches, we crowned our champions.
          </p>

          <div className="rounded-lg bg-gradient-to-br from-lime-400/20 to-lime-400/5 p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Trophy className="h-6 w-6 text-lime-600" />
              <h3 className="text-lg font-semibold text-blue-950">Final Results</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-lime-400 text-lg font-bold text-blue-950">
                  1st
                </div>
                <div>
                  <p className="text-lg font-semibold text-blue-950">Lynda Gilroy</p>
                  <p className="text-sm text-muted-foreground">Tournament Champion</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-950/10 text-lg font-semibold text-blue-950">
                  2nd
                </div>
                <div>
                  <p className="text-lg font-semibold text-blue-950">Clifton Griffin</p>
                  <p className="text-sm text-muted-foreground">Runner-Up</p>
                </div>
              </div>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Congratulations to Lynda and Clifton, and to everyone who competed with great spirit and sportsmanship!
            </p>
          </div>
        </section>

        <hr className="my-12 border-t border-border" />

        {/* Thank You */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-blue-950 md:text-3xl">A Huge Thank You</h2>

          <p className="mb-4 text-pretty leading-relaxed text-muted-foreground">
            Thank you to everyone who joined us and helped make our first Breakaway camp such a success. The energy,
            effort, and willingness to learn made for an incredible weekend on court.
          </p>

          <p className="mb-6 text-pretty leading-relaxed text-muted-foreground">
            More camps are coming soon — and past attendees will always get first access.
          </p>

          <p className="font-medium text-blue-950">Next camps opening shortly.</p>
        </section>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/pickleball-camps">
            <Button size="lg" className="bg-lime-400 text-blue-950 hover:bg-lime-500">
              View Upcoming Camps
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
