import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Users, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Toronto 3.0-3.5 Camp Recap | April 2026 | Breakaway Pickleball",
  description: "Recap of the Toronto Intermediate Intensive pickleball camp held April 11-12, 2026 at The Jar PickleBall Club.",
}

export default function TorontoIntermediateAprilRecapPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] w-full">
        <Image
          src="/images/toronto-intermediate-april-group.jpg"
          alt="Toronto Intermediate Intensive April 2026 group photo"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/60 to-transparent" />
        
        <div className="absolute top-6 left-6">
          <Button asChild variant="ghost" className="text-white/90 backdrop-blur-sm hover:bg-white/10">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </section>

      {/* Content */}
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Title & Meta */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Toronto 3.0-3.5 Camp
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>April 11-12, 2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>The Jar PickleBall Club</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>6:1 Player Ratio</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <span className="inline-flex items-center rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
              Sold Out
            </span>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Pro-Led Training
            </span>
          </div>
        </header>

        {/* Intro */}
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Two full days of high-intensity, purposeful training at The Jar. This camp took players through a structured progression — from net control and transitioning, to overhead defense and lob work — with every drill designed to build skills that connect to real game situations. The weekend wrapped with a competitive tournament that brought it all together.
        </p>

        <hr className="my-12 border-t border-border" />

        {/* Day 1 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Day 1 — Net Control & Transitioning Forward
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            The morning focused on owning the kitchen — cross-court dinks, forehand and one-handed backhand volleys, and speed-ups off the bounce — all built through high-rep basket drills followed by game-situation application. After lunch, the focus shifted to earning your way to the net with drives, drops, and the 7/11 drill, which challenged players to find their path forward using third-shot drives and fifth-shot drops. The day closed with live gameplay to put it all into practice.
          </p>
          
          <div className="rounded-lg bg-muted/50 p-6">
            <h3 className="font-semibold text-primary mb-3">Key Themes</h3>
            <ul className="space-y-2">
              {[
                "Offensive dinking and kitchen control",
                "Volleys and speed-ups with deception",
                "3rd-shot drives and 5th-shot drops",
                "Transitioning forward and winning points at the net"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <hr className="my-12 border-t border-border" />

        {/* Day 2 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Day 2 — Smashes, Defense & Competitive Play
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Day 2 built on the foundation with overhead smashes, two-handed backhand volleys, and smash defense — training players to handle pressure from both sides of the ball. The afternoon introduced kitchen lobs and lob retrieval, then tied everything together with drills that combined smashing, defending, lobbing, and recovering. The camp finished with a round-robin tournament that put two full days of training to the test under game pressure.
          </p>
          
          <div className="rounded-lg bg-muted/50 p-6">
            <h3 className="font-semibold text-primary mb-3">Key Themes</h3>
            <ul className="space-y-2">
              {[
                "Overhead smashes and smash defense",
                "Two-handed backhand volley development",
                "Kitchen lobs, retrieval, and recovery",
                "Applying all skills under competitive match pressure"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <hr className="my-12 border-t border-border" />

        {/* Tournament Results */}
        <section className="mb-12">
          <div className="rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-primary">Final Results</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-primary font-bold text-sm">1</span>
                <div>
                  <span className="font-semibold text-primary">Derrick & David</span>
                  <span className="text-muted-foreground ml-2">— Tournament Champions</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">2</span>
                <div>
                  <span className="font-semibold text-primary">Lynn & Viive</span>
                  <span className="text-muted-foreground ml-2">— Silver</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-700/20 text-amber-700 font-bold text-sm">3</span>
                <div>
                  <span className="font-semibold text-primary">Anita & Murray</span>
                  <span className="text-muted-foreground ml-2">— Bronze</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4">
              Congratulations to all the competitors — the level of play across the board was impressive.
            </p>
          </div>
        </section>

        <hr className="my-12 border-t border-border" />

        {/* Thank You */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-4">A Huge Thank You</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Incredibly grateful for the energy, commitment, and trust from every athlete who showed up to level up their game. Two days of focused, purposeful training — and you brought it every session.
          </p>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Stay tuned — more camps and new destinations coming soon. Past attendees always get first access.
          </p>
          <p className="font-semibold text-primary">
            Next camps opening shortly.
          </p>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Button asChild size="lg" className="bg-accent text-primary hover:bg-accent/90">
            <Link href="/pickleball-camps">
              View Upcoming Camps
            </Link>
          </Button>
        </div>
      </article>
    </main>
  )
}
