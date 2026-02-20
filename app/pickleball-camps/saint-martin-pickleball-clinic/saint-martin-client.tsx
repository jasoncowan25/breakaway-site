"use client"

import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, Clock, Award, Users, Target } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function SaintMartinClinic() {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const clinic = {
    title: "Saint Martin Pickleball Clinic",
    subtitle: "2-Hour Intensive Skills Clinic",
    location: "Saint Martin",
    coach: "Joey Manchurek",
    date: "Mar 20, 2026",
    time: "10:00 AM - 12:00 PM",
    price: "$150 USD",
    spotsLeft: 10,
    venue: "Near Anse Marcel",
    skillLevel: "3.0 - 4.0",
    checkoutUrl: "https://buy.stripe.com/4gM5kDgMc9qTcGO5q2f3a01",
    coachBio:
      "Former pro hockey player (OHL Oshawa Generals Captain; later ECHL). Grew up playing tennis & table tennis; transitioned quickly to competitive pickleball. Actively competes in tournaments; coaching focus on leadership, skill development, and helping players reach potential.",
    image: "/desert-pickleball-facility-arizona.jpg",
    coachImage: "/coach-joey.jpg",
    venueImages: ["/desert-pickleball-facility-arizona.jpg", "/outdoor-pickleball-courts-in-florida-sunshine.jpg"],
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[520px] md:h-[400px] bg-gradient-to-br from-primary to-primary/80">
        <div className="absolute inset-0">
          <Image
            src={clinic.image || "/placeholder.svg"}
            alt="Saint Martin pickleball courts"
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="mx-auto max-w-7xl">
            <Badge className="mb-4 bg-accent text-accent-foreground">Pop-Up Clinic</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{clinic.title}</h1>
            <p className="text-xl text-white/90">
              {clinic.subtitle} • Skill Level {clinic.skillLevel}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{clinic.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{clinic.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{clinic.venue}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* About This Clinic */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-6">About This Clinic</h2>
              <Card className="p-6">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Join pro coach Joey Manchurek for an intensive 2-hour clinic designed specifically for players rated
                  3.0 to 4.0 who want to level up their game. This focused session will teach you the essential skills
                  and shots required to compete at the next level.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex gap-3">
                    <Target className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-primary mb-1">Skill Development</div>
                      <div className="text-sm text-muted-foreground">
                        Master the shots that separate 3.0 from 4.0+ players
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Award className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-primary mb-1">Pro Instruction</div>
                      <div className="text-sm text-muted-foreground">
                        Personalized feedback from certified coach Joey Manchurek
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Users className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-primary mb-1">Small Group</div>
                      <div className="text-sm text-muted-foreground">
                        Limited spots for maximum individual attention
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* What You'll Learn */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-6">What You'll Learn</h2>
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-accent/20 rounded-full p-2">
                        <Clock className="h-5 w-5 text-accent-foreground" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-primary mb-1">Third Shot Drop Mastery</div>
                      <div className="text-muted-foreground">
                        Learn to consistently execute the most important shot in pickleball
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-accent/20 rounded-full p-2">
                        <Clock className="h-5 w-5 text-accent-foreground" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-primary mb-1">Dinking Strategy</div>
                      <div className="text-muted-foreground">Control the kitchen line with precision and patience</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-accent/20 rounded-full p-2">
                        <Clock className="h-5 w-5 text-accent-foreground" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-primary mb-1">Transition Zone Play</div>
                      <div className="text-muted-foreground">
                        Navigate the most challenging area of the court with confidence
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-accent/20 rounded-full p-2">
                        <Clock className="h-5 w-5 text-accent-foreground" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-primary mb-1">Advanced Serves & Returns</div>
                      <div className="text-muted-foreground">
                        Start every point with an advantage through better serves and returns
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Meet Your Coach */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-6">Meet Your Coach</h2>
              <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative h-48 w-48 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={clinic.coachImage || "/placeholder.svg"}
                      alt={clinic.coach}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-primary">{clinic.coach}</h3>
                      <Badge variant="secondary" className="bg-primary text-primary-foreground">
                        <Award className="h-3 w-3 mr-1" />
                        Pro Coach
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{clinic.coachBio}</p>
                  </div>
                </div>
              </Card>
            </section>

            {/* The Venue */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-6">The Venue</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {clinic.venueImages.map((img, idx) => (
                  <div key={idx} className="relative h-64 rounded-lg overflow-hidden">
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`Venue photo ${idx + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>{clinic.venue}</span>
              </div>
            </section>
          </div>

          {/* Booking Widget - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className={`${isSticky ? "fixed top-24 w-80" : ""}`}>
              <Card className="p-6 border-2 border-primary/20">
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-1">{clinic.price}</div>
                    <div className="text-sm text-muted-foreground">Per person</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{clinic.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{clinic.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{clinic.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span>Skill Level: {clinic.skillLevel}</span>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm font-semibold text-red-800">Only {clinic.spotsLeft} spots left</p>
                  </div>

                  <Button
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6"
                    onClick={() => window.open(clinic.checkoutUrl, "_blank")}
                  >
                    Book Now
                  </Button>

                  <div className="pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>2-hour intensive session</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      <span>Personalized feedback</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Small group setting</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 shadow-lg z-50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-bold text-primary">{clinic.price}</div>
            <div className="text-xs text-muted-foreground">Only {clinic.spotsLeft} spots left</div>
          </div>
          <Button
            className="bg-accent text-accent-foreground hover:bg-accent/90 px-8"
            onClick={() => window.open(clinic.checkoutUrl, "_blank")}
          >
            Book Now
          </Button>
        </div>
      </div>

      <div className="lg:hidden h-20" />

      <Footer hideNotifySignup={true} />
    </div>
  )
}
