"use client"

import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  UtensilsCrossed,
  MessageSquare,
  Target,
  Move,
  Send,
  TrendingUp,
  Award,
} from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function TorontoIntensiveJan() {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const camp = {
    title: "Toronto Intermediate Intensive",
    subtitle: "2-Day Advanced Training • Intermediate to Advanced Players",
    location: "Toronto",
    coach: "Joey Manchurek",
    date: "Jan 10-11, 2026",
    price: "$800 CAD",
    spotsLeft: 0, // Updated to sold out (0 spots left)
    venue: "The Jar PickleBall Club",
    checkoutUrl: "https://buy.stripe.com/6oUdR85YJbcc0G8cef57W00",
    coachBio:
      "Former pro hockey player (OHL Oshawa Generals Captain; later ECHL). Grew up playing tennis & table tennis; transitioned quickly to competitive pickleball. Actively competes in tournaments; coaching focus on leadership, skill development, and helping players reach potential.",
    image: "/joey_coaching_jar.jpg",
    coachImage: "/coach-joey.jpg",
    venueImages: ["/jar3.png", "/jar4.png", "/jar1.png", "/jar2.png"],
    curriculum: [
      {
        day: "Day 1",
        sessions: [
          { time: "9:00 AM", activity: "Welcome & Orientation\nIntroductions, goals, and camp flow" },
          { time: "9:30 AM", activity: "Dynamic Warm-Up\nMovement, activation, and court prep" },
          { time: "10:00 AM", activity: "Net Play & Court Control\nPositioning, touch, and consistency" },
          { time: "12:00 PM", activity: "Lunch & Classroom Session\nRecap, video, and strategy discussion" },
          { time: "1:00 PM", activity: "Transitioning Forward\nGetting to the net with purpose" },
          {
            time: "3:00 PM",
            activity: "Guided Match Play & Q&A\nApplying concepts in live games and wrap-up discussions",
          },
          { time: "5:00 PM", activity: "Day 1 Complete" },
        ],
      },
      {
        day: "Day 2",
        sessions: [
          { time: "9:00 AM", activity: "Review & Daily Focus\nDay 1 recap and objectives" },
          { time: "9:30 AM", activity: "Dynamic Warm-Up\nMovement and timing refresh" },
          { time: "10:00 AM", activity: "Offense & Defense\nAttacking, defending, and recovery" },
          { time: "12:00 PM", activity: "Lunch & Classroom Session\nVideo review and tactical prep" },
          { time: "1:00 PM", activity: "Lobs & Counter Play\nSituational awareness and positioning" },
          {
            time: "3:00 PM",
            activity: "Competitive Match Play & Q&A\nTournament-style games, final questions, and wrap-up",
          },
          { time: "5:00 PM", activity: "Camp Complete" },
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-br from-primary to-primary/80">
        <div className="absolute inset-0">
          <Image
            src="/joey_coaching_jar.jpg"
            alt="Joey Manchurek coaching at The Jar"
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="mx-auto max-w-7xl">
            <Badge className="mb-4 bg-accent text-accent-foreground">Joey Manchurek Signature</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{camp.title}</h1>
            <p className="text-xl text-white/90">{camp.subtitle}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* The Curriculum */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-6">2-Day Curriculum</h2>
              <div className="space-y-6">
                {camp.curriculum.map((day, idx) => (
                  <Card key={idx} className="p-6">
                    <h3 className="text-xl font-bold text-primary mb-4">{day.day}</h3>
                    <div className="space-y-4">
                      {day.sessions.map((session, sessionIdx) => (
                        <div key={sessionIdx} className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="bg-accent/20 rounded-full p-2">
                              <Clock className="h-5 w-5 text-accent-foreground" />
                            </div>
                          </div>
                          <div className="flex-1 border-l-2 border-muted pl-4 pb-4">
                            <div className="font-semibold text-primary">{session.time}</div>
                            <div className="text-muted-foreground whitespace-pre-line">{session.activity}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* What You'll Master */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-6">What You'll Master</h2>
              <Card className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex gap-3">
                    <Target className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-primary mb-1">Shot Selection</div>
                      <div className="text-sm text-muted-foreground">When to drive, drop, and speed up</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Move className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-primary mb-1">Court Positioning</div>
                      <div className="text-sm text-muted-foreground">
                        Optimal positioning for offense, defense, and transition play
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Send className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-primary mb-1">Serve and Return</div>
                      <div className="text-sm text-muted-foreground">
                        Developing consistent, strategic serves and high-percentage returns
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <TrendingUp className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-primary mb-1">Lobs</div>
                      <div className="text-sm text-muted-foreground">
                        Offensive and defensive lob techniques for all court situations
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
                    <Image src={camp.coachImage || "/placeholder.svg"} alt={camp.coach} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-primary">{camp.coach}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{camp.coachBio}</p>
                  </div>
                </div>
              </Card>
            </section>

            {/* The Venue */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-6">The Venue</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {camp.venueImages.map((img, idx) => (
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
                <span>{camp.venue}</span>
              </div>
            </section>
          </div>

          {/* Booking Widget - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className={`${isSticky ? "fixed top-24 w-80" : ""}`}>
              <Card className="p-6 border-2 border-primary/20">
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-1">{camp.price}</div>
                    <div className="text-sm text-muted-foreground">Per person</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{camp.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{camp.venue}</span>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm font-semibold text-red-800">Sold Out</p>{" "}
                    {/* Updated message for sold out status */}
                  </div>

                  <Button
                    disabled // Disabled button for sold out status
                    className="w-full bg-gray-300 text-gray-500 cursor-not-allowed text-lg py-6"
                  >
                    Sold Out
                  </Button>

                  <div className="pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed className="h-4 w-4" />
                      <span>Lunch included both days</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Small group instruction</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Scrimmage sessions with coaching feedback</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      <span>Prizes & giveaways</span>
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
            <div className="text-2xl font-bold text-primary">{camp.price}</div>
            <div className="text-xs text-red-800 font-semibold">Sold Out</div> {/* Updated mobile message */}
          </div>
          <Button
            disabled // Disabled mobile button
            className="bg-gray-300 text-gray-500 cursor-not-allowed px-8"
          >
            Sold Out
          </Button>
        </div>
      </div>

      {/* Add padding to prevent content from being hidden behind mobile sticky bar */}
      <div className="lg:hidden h-20" />

      <Footer />
    </div>
  )
}
