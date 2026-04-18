import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Users, Trophy, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Metadata } from "next"
import { FooterNotifySignup } from "@/components/FooterNotifySignup"

export const metadata: Metadata = {
  title: "Saint Martin Clinic Recap | Breakaway Pickleball",
  description: "Recap of our Saint Martin pop-up pickleball clinic at the American Tennis Club. 16 players reviewed fundamentals, core shots, and enjoyed beautiful Caribbean weather.",
}

export default function SaintMartinClinicRecapPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section with Action Photo */}
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden bg-blue-950">
        <Image
          src="/saint-martin-clinic-group.jpg"
          alt="Saint Martin pickleball clinic action shot"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/60 to-transparent" />

        {/* Back Button */}
        <div className="absolute left-4 top-4 md:left-8 md:top-8">
          <Link href="/pickleball-camps">
            <Button variant="outline" className="gap-2 bg-white/90 backdrop-blur-sm hover:bg-white">
              <ArrowLeft className="h-4 w-4" />
              Back to Camps
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        {/* Title & Meta */}
        <div className="mb-12">
          <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight text-blue-950 md:text-5xl">
            Saint Martin Pop-Up Clinic
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground md:gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>March 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>American Tennis Club, Saint Martin</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>16 Players</span>
            </div>
          </div>

          <div className="mt-4 inline-flex items-center gap-3">
            <Badge variant="accent">Completed</Badge>
            <Badge variant="secondary">Pop-Up Clinic</Badge>
          </div>
        </div>

        {/* Intro */}
        <div className="prose prose-lg mb-12 max-w-none">
          <p className="text-pretty leading-relaxed text-muted-foreground">
            Our Saint Martin pop-up clinic brought together 16 players under the Caribbean sun for a focused session of 
            fundamentals review, core shot development, and competitive games. The beautiful weather at the American Tennis 
            Club made for an unforgettable experience on and off the court.
          </p>
        </div>

        {/* Second Image */}
        <div className="relative mb-12 aspect-[4/3] w-full overflow-hidden rounded-xl">
          <Image
            src="/saint-martin-clinic-action-game.jpg"
            alt="Players practicing at the American Tennis Club"
            fill
            className="object-cover"
          />
        </div>

        <hr className="my-12 border-t border-border" />

        {/* What We Covered */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-blue-950 md:text-3xl">
            What We Covered
          </h2>

          <p className="mb-6 text-pretty leading-relaxed text-muted-foreground">
            The clinic focused on building strong fundamentals and reinforcing core shots that players can take back to 
            their home courts. We balanced technical instruction with plenty of game play to put new skills into practice.
          </p>

          <div className="rounded-lg bg-muted/50 p-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-950">Session Highlights</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime-400" />
                <span>Fundamentals review and technique refinement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime-400" />
                <span>Core shot development and consistency drills</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime-400" />
                <span>Competitive game play and point construction</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime-400" />
                <span>Strategy discussions and shot selection</span>
              </li>
            </ul>
          </div>
        </section>

        <hr className="my-12 border-t border-border" />

        {/* Awards */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-blue-950 md:text-3xl">Clinic Awards</h2>

          <p className="mb-6 text-pretty leading-relaxed text-muted-foreground">
            We recognized two standout players from the clinic for their exceptional performance and growth.
          </p>

          <div className="rounded-lg bg-gradient-to-br from-lime-400/20 to-lime-400/5 p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Trophy className="h-6 w-6 text-lime-600" />
              <h3 className="text-lg font-semibold text-blue-950">Player Recognition</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-lime-400">
                  <Trophy className="h-5 w-5 text-blue-950" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-blue-950">A. Grand</p>
                  <p className="text-sm text-muted-foreground">Clinic MVP</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-950/10">
                  <Award className="h-5 w-5 text-blue-950" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-blue-950">V. Karwala</p>
                  <p className="text-sm text-muted-foreground">Most Improved</p>
                </div>
              </div>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Congratulations to both players for their outstanding effort and dedication throughout the clinic!
            </p>
          </div>
        </section>

        <hr className="my-12 border-t border-border" />

        {/* Thank You */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-blue-950 md:text-3xl">A Huge Thank You</h2>

          <p className="mb-4 text-pretty leading-relaxed text-muted-foreground">
            A big thank you to the <strong>American Tennis Club in Saint Martin</strong> for hosting us and providing such 
            a beautiful venue. The courts, facilities, and hospitality made this pop-up clinic a truly special experience.
          </p>

          <p className="mb-6 text-pretty leading-relaxed text-muted-foreground">
            Thank you to all 16 players who joined us and brought such great energy to the court. The combination of 
            focused training and Caribbean sunshine made for an unforgettable session.
          </p>

          <p className="font-medium text-blue-950">Stay tuned for more pop-up clinics in exciting locations.</p>
        </section>

        </div>

      {/* CTA & Notify Signup */}
      <FooterNotifySignup showViewCampsButton />
    </main>
  )
}
