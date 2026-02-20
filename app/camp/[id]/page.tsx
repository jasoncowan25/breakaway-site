"use client"

import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, Users, Video, Award, Clock } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Footer } from "@/components/Footer"
import { notFound } from "next/navigation"

const campData: Record<string, any> = {
  "toronto-intermediate-jan": {
    title: "Toronto Intermediate Intensive",
    location: "Toronto",
    coach: "Joey Manchurek",
    date: "Jan 10-11, 2026",
    price: "$800 CAD",
    spotsLeft: 0, // Updated to sold out (0 spots left)
    venue: "The Jar PickleBall Club",
    dupr: "5.0",
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
  },

  "muskoka-retreat": {
    title: "Muskoka Summer Retreat",
    location: "Muskoka",
    coach: "Multiple Coaches",
    date: "Jul 15-19, 2026",
    price: "$2,200 CAD",
    spotsLeft: 12,
    venue: "Lake Joseph PickleBarn",
    dupr: "3.5-4.5",
    coachBio:
      "Our team of expert coaches brings diverse perspectives and specialties to create a comprehensive training experience in the beautiful Muskoka setting.",
    image: "/outdoor-pickleball-courts-in-florida-sunshine.jpg",
    coachImage: "/coach-joey.jpg",
    venueImages: ["/outdoor-pickleball-courts-in-florida-sunshine.jpg", "/luxury-pickleball-resort-florida-beach.jpg"],
    curriculum: [
      {
        day: "Day 1",
        sessions: [
          { time: "9:00 AM", activity: "Welcome & Skill Assessment" },
          { time: "11:00 AM", activity: "Fundamentals Review" },
          { time: "1:00 PM", activity: "Lunch & Free Time" },
          { time: "3:00 PM", activity: "Doubles Strategy" },
          { time: "5:00 PM", activity: "Sunset Social Play" },
        ],
      },
      {
        day: "Day 2-4",
        sessions: [
          { time: "9:00 AM", activity: "Morning Drills" },
          { time: "11:00 AM", activity: "Advanced Techniques" },
          { time: "1:00 PM", activity: "Lunch & Recreation" },
          { time: "3:00 PM", activity: "Match Play" },
          { time: "5:00 PM", activity: "Video Analysis" },
        ],
      },
      {
        day: "Day 5",
        sessions: [
          { time: "9:00 AM", activity: "Tournament Prep" },
          { time: "11:00 AM", activity: "Camp Tournament" },
          { time: "1:00 PM", activity: "Awards Lunch" },
        ],
      },
    ],
  },
  "saint-martin-clinic": {
    title: "Saint Martin Pop-Up Clinic",
    location: "Saint Martin",
    coach: "Joey Manchurek",
    date: "Mar 20, 2026",
    time: "10:00 AM - 12:00 PM",
    price: "$150 USD",
    spotsLeft: 6,
    venue: "Near Anse Marcel",
    dupr: "3.0-4.0",
    checkoutUrl: "https://buy.stripe.com/9B65kCdrbcggcoQbab57W03",
    coachBio:
      "Former pro hockey player (OHL Oshawa Generals Captain; later ECHL). Grew up playing tennis & table tennis; transitioned quickly to competitive pickleball. Actively competes in tournaments; coaching focus on leadership, skill development, and helping players reach potential.",
    image: "/desert-pickleball-facility-arizona.jpg",
    coachImage: "/coach-joey.jpg",
    venueImages: ["/desert-pickleball-facility-arizona.jpg", "/outdoor-pickleball-courts-in-florida-sunshine.jpg"],
    curriculum: [
      {
        day: "Session",
        sessions: [
          {
            time: "10:00 AM - 12:00 PM",
            activity: "Skills & Shots Clinic - Master the techniques to reach your next level",
          },
        ],
      },
    ],
    description:
      "This 2-hour intensive clinic is designed for players rated 3.0 to 4.0 who want to level up their game. Learn the essential skills and shots required to compete at the next level, with personalized feedback from pro coach Joey Manchurek.",
  },
  "saint-martin-retreat": {
    title: "Saint Martin Ultimate Retreat",
    location: "Saint Martin",
    coach: "Sarah Chen",
    date: "Apr 12-16, 2026",
    price: "$2,500 USD",
    spotsLeft: 4,
    venue: "Grand Case Beach Resort",
    dupr: "3.5-4.5",
    coachBio:
      "Sarah Chen is a professional pickleball coach specializing in advanced techniques and mental game strategies, bringing luxury resort training to life.",
    image: "/professional-pickleball-training-facility.jpg",
    coachImage: "/coach-joey.jpg",
    venueImages: ["/professional-pickleball-training-facility.jpg", "/luxury-pickleball-resort-florida-beach.jpg"],
    curriculum: [
      {
        day: "Day 1-4",
        sessions: [
          { time: "8:00 AM", activity: "Beachside Yoga & Warm-up" },
          { time: "9:00 AM", activity: "Technical Training" },
          { time: "11:00 AM", activity: "Match Analysis" },
          { time: "1:00 PM", activity: "Lunch & Spa Time" },
          { time: "3:00 PM", activity: "Strategic Gameplay" },
          { time: "5:00 PM", activity: "Sunset Social" },
        ],
      },
      {
        day: "Day 5",
        sessions: [
          { time: "8:00 AM", activity: "Final Skills Session" },
          { time: "10:00 AM", activity: "Friendly Tournament" },
          { time: "12:00 PM", activity: "Celebration Brunch" },
        ],
      },
    ],
  },
  "toronto-beginner-feb": {
    title: "Toronto Beginner Fundamentals",
    location: "Toronto",
    coach: "Lisa Park",
    date: "Feb 5-6, 2026",
    price: "$600 CAD",
    spotsLeft: 10,
    venue: "The Jar PickleBall Club",
    dupr: "2.0-2.5",
    coachBio:
      "Lisa Park specializes in teaching beginners the fundamentals of pickleball with patience and clear instruction, ensuring a solid foundation.",
    image: "/beginner-pickleball-lesson-group.jpg",
    coachImage: "/coach-joey.jpg",
    venueImages: ["/jar3.png", "/jar4.png", "/jar1.png", "/jar2.png"],
    curriculum: [
      {
        day: "Day 1",
        sessions: [
          { time: "9:00 AM", activity: "Welcome & Equipment Overview" },
          { time: "10:00 AM", activity: "Basic Strokes" },
          { time: "12:00 PM", activity: "Lunch Break" },
          { time: "1:00 PM", activity: "Serving & Scoring" },
          { time: "3:00 PM", activity: "Beginner Games" },
        ],
      },
      {
        day: "Day 2",
        sessions: [
          { time: "9:00 AM", activity: "Review & Drills" },
          { time: "10:00 AM", activity: "Court Positioning" },
          { time: "12:00 PM", activity: "Lunch Break" },
          { time: "1:00 PM", activity: "Basic Strategy" },
          { time: "3:00 PM", activity: "Practice Matches" },
        ],
      },
    ],
  },
  "muskoka-advanced": {
    title: "Muskoka Advanced Training",
    location: "Muskoka",
    coach: "James Taylor",
    date: "Aug 10-12, 2026",
    price: "$1,200 CAD",
    spotsLeft: 8,
    venue: "Lake Joseph PickleBarn",
    dupr: "4.0+",
    coachBio:
      "James Taylor is a competitive player and coach who works with advanced players to refine high-level techniques and tournament strategies.",
    image: "/luxury-pickleball-resort-florida-beach.jpg",
    coachImage: "/coach-joey.jpg",
    venueImages: ["/luxury-pickleball-resort-florida-beach.jpg", "/outdoor-pickleball-courts-in-florida-sunshine.jpg"],
    curriculum: [
      {
        day: "Day 1",
        sessions: [
          { time: "9:00 AM", activity: "Advanced Warm-up & Assessment" },
          { time: "10:00 AM", activity: "High-Level Shot Making" },
          { time: "12:00 PM", activity: "Lunch Break" },
          { time: "1:00 PM", activity: "Tournament Strategy" },
          { time: "3:00 PM", activity: "Competitive Drilling" },
        ],
      },
      {
        day: "Day 2",
        sessions: [
          { time: "9:00 AM", activity: "Mental Game Training" },
          { time: "10:00 AM", activity: "Advanced Techniques" },
          { time: "12:00 PM", activity: "Lunch Break" },
          { time: "1:00 PM", activity: "Match Simulation" },
          { time: "3:00 PM", activity: "Video Analysis" },
        ],
      },
      {
        day: "Day 3",
        sessions: [
          { time: "9:00 AM", activity: "Final Drills" },
          { time: "10:00 AM", activity: "Camp Tournament" },
          { time: "12:00 PM", activity: "Closing Session" },
        ],
      },
    ],
  },
}

export default function CampDetailPage({ params }: { params: { id: string } }) {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const camp = campData[params.id]

  if (!camp) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[400px] bg-muted">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover object-top"
          poster={camp.image}
        >
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/files-blob/public/images/breakaway-vid-notext-trimmed-FATj7zi6S1KrshTt4d5fZHkxGT1m4l.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {camp.title} - {camp.location}
            </h1>
            <p className="text-xl text-white/90">Hosted by Coach {camp.coach}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* The Curriculum */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-6">The Curriculum</h2>
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
                            <div className="text-muted-foreground">{session.activity}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Meet Your Pro */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-6">Meet Your Pro</h2>
              <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative h-48 w-48 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image src={camp.coachImage || "/placeholder.svg"} alt={camp.coach} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-primary">{camp.coach}</h3>
                      <Badge variant="secondary" className="bg-primary text-primary-foreground">
                        <Award className="h-3 w-3 mr-1" />
                        DUPR {camp.dupr}
                      </Badge>
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

            {/* Event Details */}
            {camp.eventDetails && (
              <section>
                <h2 className="text-3xl font-bold text-primary mb-6">Event Details</h2>
                <ul className="list-disc list-inside space-y-2">
                  {camp.eventDetails.map((detail, idx) => (
                    <li key={idx} className="text-muted-foreground">
                      {detail}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Clinic Description */}
            {camp.description && (
              <section>
                <h2 className="text-3xl font-bold text-primary mb-6">Clinic Description</h2>
                <p className="text-muted-foreground leading-relaxed">{camp.description}</p>
              </section>
            )}
          </div>

          {/* Booking Widget - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className={`${isSticky ? "fixed top-24 w-80" : ""} z-10`}>
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

                  <div
                    className={`bg-red-50 border border-red-200 rounded-lg p-3 ${camp.spotsLeft === 0 ? "bg-red-500" : ""}`}
                  >
                    <p className="text-sm font-semibold text-red-800">Only {camp.spotsLeft} spots left</p>
                  </div>

                  {camp.checkoutUrl && (
                    <Button
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6 cursor-pointer"
                      onClick={() => window.open(camp.checkoutUrl, "_blank")}
                    >
                      {camp.spotsLeft === 0 ? "Sold Out" : "Book Now"}
                    </Button>
                  )}

                  <div className="pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Maximum 16 players</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      <span>Video analysis included</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-bold text-primary">{camp.price}</div>
            <div className="text-xs text-muted-foreground">Only {camp.spotsLeft} spots left</div>
          </div>
          {camp.checkoutUrl && (
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-lg cursor-pointer"
              onClick={() => window.open(camp.checkoutUrl, "_blank")}
            >
              {camp.spotsLeft === 0 ? "Sold Out" : "Book Now"}
            </Button>
          )}
        </div>
      </div>

      {/* Add padding to prevent content from being hidden behind mobile sticky bar */}
      <div className="lg:hidden h-20" />

      {/* Footer Component */}
      <Footer />
    </div>
  )
}
