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
  Quote,
} from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function TorontoBeginnerCampClient() {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const camp = {
    title: "Toronto Beginner Pickleball Intensive",
    subtitle: "2-Day Foundation Training • Beginner Players (2.5-2.75)",
    location: "Toronto",
    coach: "Joey Manchurek",
    date: "May 23-24, 2026",
    price: "$800 CAD",
    spotsLeft: 16,
    venue: "The Jar PickleBall Club",
    checkoutUrl: "https://book.stripe.com/7sY7sLcvW46zgX44lYf3a03",
    coachBio:
      "Former pro hockey player (OHL Oshawa Generals Captain; later ECHL). Grew up playing tennis & table tennis; transitioned quickly to competitive pickleball. Actively competes in tournaments; coaching focus on leadership, skill development, and helping players reach potential.",
    image: "/toronto-beginner-intensive-may-2026.png",
    coachImage: "/coach-joey.jpg",
    venueImages: ["/jar3.png", "/jar4.png", "/jar1.png", "/jar2.png"],
    curriculum: [
      {
        day: "Day 1",
        sessions: [
          { time: "9:00 AM", activity: "Welcome & Orientation\nIntroductions, goals, and camp flow" },
          { time: "9:30 AM", activity: "Dynamic Warm-Up\nMovement, activation, and court prep" },
          { time: "10:00 AM", activity: "Dink Fundamentals\nGrip, stance, and soft game basics" },
          { time: "12:00 PM", activity: "Lunch & Classroom Session\nRecap, video, and strategy discussion" },
          { time: "1:00 PM", activity: "The Third Shot Drop\nBuilding consistency and touch" },
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
          { time: "10:00 AM", activity: "Serve & Return Fundamentals\nBuilding a reliable serve and return game" },
          { time: "12:00 PM", activity: "Lunch & Classroom Session\nVideo review and tactical prep" },
          { time: "1:00 PM", activity: "Kitchen Play & Positioning\nNet play basics and court awareness" },
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
      <section className="relative h-[500px] md:h-[400px] bg-gradient-to-br from-primary to-primary/80">
        <div className="absolute inset-0">
          <Image
            src="/toronto-beginner-intensive-may-2026.png"
            alt="Joey Manchurek coaching beginner players at The Jar pickleball club in Toronto"
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="mx-auto max-w-7xl">
            <Badge className="mb-4 bg-accent text-accent-foreground">New</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{camp.title}</h1>
            <p className="text-xl text-white/90">{camp.subtitle}</p>
            <div className="flex items-center gap-4 mt-3 text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{camp.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{camp.venue}</span>
              </div>
            </div>
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
                      <div className="font-semibold text-primary mb-1">Dink Technique</div>
                      <div className="text-sm text-muted-foreground">Soft game fundamentals and consistent touch at the net</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Move className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-primary mb-1">Third Shot Drops</div>
                      <div className="text-sm text-muted-foreground">
                        Building the foundation for transitioning to the net
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Send className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-primary mb-1">Serve and Return</div>
                      <div className="text-sm text-muted-foreground">
                        Developing consistent, reliable serves and high-percentage returns
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <TrendingUp className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-primary mb-1">Court Positioning</div>
                      <div className="text-sm text-muted-foreground">
                        Understanding where to be and when to move on the court
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

            {/* From the Court */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-6">From the Court</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Testimonial 1 - Leadership */}
                <Card className="p-6 relative">
                  <Quote className="absolute top-6 left-6 h-8 w-8 text-accent opacity-20" />
                  <div className="relative">
                    <p className="text-lg text-foreground mb-6 leading-relaxed">
                      "Leadership and coaching style is of the highest caliber"
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-950 to-lime-400" />
                      <div>
                        <p className="font-semibold text-sm text-primary">Toronto Camp Participant</p>
                        <p className="text-xs text-muted-foreground">Jan 2026</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Testimonial 2 - Stamina */}
                <Card className="p-6 relative">
                  <Quote className="absolute top-6 left-6 h-8 w-8 text-accent opacity-20" />
                  <div className="relative">
                    <p className="text-lg text-foreground mb-6 leading-relaxed">
                      "I was surprised at my stamina and at the end of the 2 days I felt completely invigorated"
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-950 to-lime-400" />
                      <div>
                        <p className="font-semibold text-sm text-primary">Toronto Camp Participant</p>
                        <p className="text-xs text-muted-foreground">Jan 2026</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Testimonial 3 - Loved Everything */}
                <Card className="p-6 relative">
                  <Quote className="absolute top-6 left-6 h-8 w-8 text-accent opacity-20" />
                  <div className="relative">
                    <p className="text-lg text-foreground mb-6 leading-relaxed">
                      "I loved everything about the camp and will be recommending it to all my pickleball friends"
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-950 to-lime-400" />
                      <div>
                        <p className="font-semibold text-sm text-primary">Toronto Camp Participant</p>
                        <p className="text-xs text-muted-foreground">Jan 2026</p>
                      </div>
                    </div>
                  </div>
                </Card>
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

                  <div className="bg-accent/10 rounded-lg p-3">
                    <p className="text-sm font-semibold text-accent-foreground">
                      Only {camp.spotsLeft} spots left
                    </p>
                  </div>

                  <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white text-lg py-6">
                    <a href={camp.checkoutUrl} target="_blank" rel="noopener noreferrer">
                      Book Now
                    </a>
                  </Button>

                  <div className="pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed className="h-4 w-4" />
                      <span>Lunch included both days</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>4:1 small group instruction</span>
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
            <div className="text-xs text-muted-foreground">
              Only {camp.spotsLeft} spots left
            </div>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 text-white px-8">
            <a href={camp.checkoutUrl} target="_blank" rel="noopener noreferrer">
              Book Now
            </a>
          </Button>
        </div>
      </div>

      {/* Add padding to prevent content from being hidden behind mobile sticky bar */}
      <div className="lg:hidden h-20" />

      <Footer hideNotifySignup={true} />
    </div>
  )
}
