"use client"

import { useState } from "react"
import { Navigation } from "@/components/Navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, MapPin, Clock, Users, Calendar, ArrowRight } from "lucide-react"
import { Footer } from "@/components/Footer"
import Link from "next/link"

// Experience page with two selectable camp experiences
export default function ExperiencePage() {
  const [selectedExperience, setSelectedExperience] = useState<"toronto" | "muskoka">("toronto")

  const sharedFeatures = [
    "Small group instruction",
    "Video analysis",
    "Personalized skill development",
    "Professional-grade facilities",
    "All equipment provided",
  ]

  const torontoSchedule = [
    { time: "9:00 AM", title: "Intro & Camp Flow", description: "Dynamic warm-up and orientation" },
    { time: "9:30 AM", title: "Skill Block 1", description: "Fundamentals and technique work" },
    { time: "11:30 AM", title: "Lunch & Video Analysis", description: "Meal break with game review (lunch 11:30–12:30)" },
    { time: "12:30 PM", title: "Skill Block 2", description: "Shot selection, consistency, situational play" },
    { time: "1:30 PM", title: "Game Play", description: "Applying concepts in live match situations" },
    { time: "3:00 PM", title: "Day Complete", description: "Wrap-up and takeaways" },
  ]

  const muskokaSchedule = {
    day1: {
      title: "Day 1 — Net Play & Kitchen Focus",
      items: [
        { time: "9:00 AM – 11:00 AM", title: "Kitchen Work", description: "Dinks, volleys, and speed-ups" },
        { time: "11:00 AM – 12:00 PM", title: "Live Gameplay", description: "Apply kitchen skills in match play" },
      ],
    },
    day2: {
      title: "Day 2 — Transitioning to the Net",
      items: [
        { time: "9:00 AM – 11:00 AM", title: "Drives & Drops", description: "Moving forward with purpose" },
        { time: "11:00 AM – 12:00 PM", title: "Live Gameplay", description: "Transition practice in match situations" },
      ],
    },
    day3: {
      title: "Day 3 — Offence to Defence",
      items: [
        { time: "9:00 AM – 11:00 AM", title: "Smashes & Lobs", description: "Smashes, returning smashes, lobs, and retrievals" },
        { time: "11:00 AM – 12:00 PM", title: "Live Gameplay", description: "Full-court offence/defence in match play" },
      ],
    },
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">The Breakaway Experience</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Immersive training designed to transform your game in just days
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative h-96 rounded-lg overflow-hidden mb-16">
          <Image src="/hero-action.jpg" alt="Breakaway Camp Experience" fill className="object-cover" />
        </div>

        {/* What's Included - Shared */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-primary mb-8">What&apos;s Included</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sharedFeatures.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Selector */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">Choose Your Experience</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Toronto Card */}
            <button
              onClick={() => setSelectedExperience("toronto")}
              className={`text-left p-6 rounded-xl border-2 transition-all duration-300 ${
                selectedExperience === "toronto"
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <MapPin className="h-4 w-4" />
                <span>The Jar, Toronto</span>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">Toronto Intensive</h3>
              <p className="text-muted-foreground mb-4">
                2-day camp at The Jar PickleBall Club, small group instruction, 9 AM – 3 PM
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>2 Days</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>9 AM – 3 PM</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Small Group</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <span className="text-sm text-accent font-medium">Catered lunches included</span>
              </div>
            </button>

            {/* Muskoka Card */}
            <button
              onClick={() => setSelectedExperience("muskoka")}
              className={`text-left p-6 rounded-xl border-2 transition-all duration-300 ${
                selectedExperience === "muskoka"
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <MapPin className="h-4 w-4" />
                <span>Muskoka, Off Lake Joseph Rd</span>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">Muskoka Adult Camp</h3>
              <p className="text-muted-foreground mb-4">
                3-day camp on a private indoor court in Muskoka, 4 players maximum
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>3 Days</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>3 Hours/Day</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>4 Players Max</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">Bring your own lunch</span>
              </div>
            </button>
          </div>
        </section>

        {/* Toronto Experience Details */}
        <div
          className={`transition-all duration-500 overflow-hidden ${
            selectedExperience === "toronto" ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <section className="mb-16">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">The Jar, Toronto</span>
            </div>
            <h2 className="text-3xl font-bold text-primary mb-2">Toronto Intensive — Typical Day</h2>
            <p className="text-muted-foreground mb-8">2-Day format, 9:00 AM – 3:00 PM both days, catered lunch included</p>
            
            <Card>
              <CardContent className="p-6">
                <div className="space-y-1">
                  {torontoSchedule.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 pt-1">
                        <div className="bg-accent/20 rounded-full p-2">
                          <Clock className="h-4 w-4 text-accent" />
                        </div>
                      </div>
                      <div className={`flex-1 border-l-2 border-muted pl-4 ${idx < torontoSchedule.length - 1 ? "pb-6" : "pb-2"}`}>
                        <div className="text-sm font-medium text-muted-foreground">{item.time}</div>
                        <div className="font-semibold text-primary">{item.title}</div>
                        <div className="text-muted-foreground text-sm">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/pickleball-camps">
                  See Available Dates
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>
        </div>

        {/* Muskoka Experience Details */}
        <div
          className={`transition-all duration-500 overflow-hidden ${
            selectedExperience === "muskoka" ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <section className="mb-16">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">Muskoka, Off Lake Joseph Rd</span>
            </div>
            <h2 className="text-3xl font-bold text-primary mb-2">Muskoka Adult Camp — Typical Day</h2>
            <p className="text-muted-foreground mb-8">3-Day format, private indoor court, 4 players maximum, 3 hours per day of focused coaching</p>
            
            <div className="space-y-8">
              {Object.values(muskokaSchedule).map((day, dayIdx) => (
                <Card key={dayIdx}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-primary mb-4">{day.title}</h3>
                    <div className="space-y-1">
                      {day.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="flex-shrink-0 pt-1">
                            <div className="bg-accent/20 rounded-full p-2">
                              <Clock className="h-4 w-4 text-accent" />
                            </div>
                          </div>
                          <div className={`flex-1 border-l-2 border-muted pl-4 ${idx < day.items.length - 1 ? "pb-6" : "pb-2"}`}>
                            <div className="text-sm font-medium text-muted-foreground">{item.time}</div>
                            <div className="font-semibold text-primary">{item.title}</div>
                            <div className="text-muted-foreground text-sm">{item.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-sm text-muted-foreground mt-6 text-center italic">
              Afternoon sessions (1:00 PM – 4:00 PM) follow the same curriculum, shifted by 4 hours.
            </p>

            <div className="mt-8 text-center">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/pickleball-camps/muskoka">
                  See Available Dates
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
