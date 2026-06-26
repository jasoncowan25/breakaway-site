"use client"

import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  UtensilsCrossed,
  Award,
  Shield,
  Camera,
  CalendarRange,
  Gamepad2,
  Heart,
  Trophy,
  Play,
} from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function KidsSummerCampClient() {
  const [isSticky, setIsSticky] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const camp = {
    title: "Baseline x Breakaway Kids Summer Pickleball Camp",
    subtitle: "3-Week Youth Camp • Ages 8–14 • All Skill Levels • No Experience Required",
    location: "Toronto",
    coach: "Joey Manchurek and the Breakaway x Baseline team",
    date: "August 17 – September 4, 2026",
    price: "$575 CAD / week",
    priceNote: "per week (5 days)",
    totalPrice: "Full 3-week program also available",
    venue: "The Jar PickleBall Club",
    checkoutUrl: "https://baselinerec.com/products/youth-summer-camp",
    coachBio:
      "Former pro hockey player (OHL Oshawa Generals Captain; later ECHL). Grew up playing tennis & table tennis; transitioned quickly to competitive pickleball and now competes at an elite 5.0 level. His coaching focus is on leadership, skill development, and helping every player reach their potential while having a blast.",
    image: "/kids-passover-camp-hero.webp",
    coachImage: "/coach-joey.jpg",
    venueImages: ["/jar3.png", "/jar4.png", "/jar1.png", "/jar2.png"],
  }

  const dailySchedule = [
    { time: "9:00 – 10:30 AM", activity: "Warmup Games — high-energy group activities to get moving and build camaraderie" },
    { time: "10:30 AM – 12:30 PM", activity: "Pickleball Clinic — skill-based drills, strategy, and live play across all 6 courts" },
    { time: "12:30 – 1:30 PM", activity: "Lunch + Movie — a midday reset to recharge with a packed lunch" },
    { time: "1:30 – 3:00 PM", activity: "Daily Tournament — friendly bracket-style play to close each day" },
  ]

  const whatsIncluded = [
    {
      icon: Award,
      title: "Professional Instruction",
      description: "Led by experienced Breakaway + Baseline youth coaches",
    },
    {
      icon: Trophy,
      title: "Equipment Provided",
      description: "All paddles and balls provided, just show up and play",
    },
    {
      icon: Shield,
      title: "Safe Environment",
      description: "Fully supervised facility with certified staff on-site at all times",
    },
    {
      icon: Users,
      title: "Skill-Based Groups",
      description: "Players placed in groups by ability for personalized training",
    },
    {
      icon: Gamepad2,
      title: "Daily Tournament",
      description: "Afternoon bracket-style tournament play to close each day",
    },
    {
      icon: UtensilsCrossed,
      title: "Lunch + Movie Reset",
      description: "Midday break with a movie. On-site fridges available — please pack lunch, snacks, and a water bottle",
    },
    {
      icon: CalendarRange,
      title: "Flexible Scheduling",
      description: "Choose single weeks, the full 3-week program, or single-day drop-ins",
    },
    {
      icon: Camera,
      title: "Community Energy",
      description: "A warm, inclusive environment where kids improve fast and make friends",
    },
    {
      icon: Heart,
      title: "Activities & Fun",
      description: "Team-building games, on and off court activities, and tons of fun",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[400px] bg-gradient-to-br from-primary to-primary/80">
        <div className="absolute inset-0">
          <Image
            src={camp.image}
            alt="Kids playing pickleball at Breakaway Summer Camp"
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="mx-auto max-w-7xl">
            <Badge className="mb-4 bg-accent text-accent-foreground">Ages 8-14</Badge>
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
            {/* Collaboration Banner */}
            <Card className="p-6 border-2 border-primary/10">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <a href="https://baselinerec.com" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                  <Image
                    src="/baseline-rec-league-logo.webp"
                    alt="Baseline Rec Pickleball League logo"
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </a>
                <div className="text-center sm:text-left">
                  <p className="text-sm font-semibold text-primary uppercase tracking-wide">In Collaboration With</p>
                  <p className="text-lg font-bold text-primary">Baseline Rec Pickleball League</p>
                  <p className="text-sm text-muted-foreground">Bringing community-driven pickleball programming to young players across Toronto</p>
                </div>
              </div>
            </Card>

            {/* About the Camp */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-4 mt-6">About the Camp</h2>
              <div className="prose prose-muted max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Breakaway Pickleball Camps and <a href="https://baselinerec.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">Baseline Rec Pickleball League</a> are teaming up for a summer camp like no other &mdash; a 3-week youth program running August 17 to September 4 at The Jar PickleBall Club in Toronto. Designed for ages 8-14, all skill levels are welcome and no experience is required. This isn&rsquo;t babysitting with paddles &mdash; it&rsquo;s structured, skill-based development led by experienced youth coaches in a high-energy, inclusive environment. With just 36 campers per day across 6 dedicated courts, your child gets real attention, real reps, and real growth. Choose the days and weeks that work best for your family&rsquo;s schedule &mdash; spots are limited and will fill quickly.
                </p>
              </div>
            </section>

            {/* Daily Schedule */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-6">Daily Schedule</h2>
              <Card className="p-6">
                <div className="space-y-4">
                  {dailySchedule.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="bg-accent/20 rounded-full p-2">
                          <Clock className="h-5 w-5 text-accent-foreground" />
                        </div>
                      </div>
                      <div className="flex-1 border-l-2 border-muted pl-4 pb-4">
                        <div className="font-semibold text-primary">{item.time}</div>
                        <div className="text-muted-foreground">{item.activity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            {/* What's Included */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-6">{"What’s Included"}</h2>
              <Card className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {whatsIncluded.map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                      <item.icon className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-semibold text-primary mb-1">{item.title}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            {/* Meet Your Coach */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-6">Meet Your Coach</h2>
              <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative h-48 w-48 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image src={camp.coachImage} alt={camp.coach} fill className="object-cover" />
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
                {/* See the Camp Space Video */}
                <button
                  type="button"
                  onClick={() => setVideoOpen(true)}
                  className="relative h-64 rounded-lg overflow-hidden block group cursor-pointer text-left w-full"
                >
                  <Image
                    src="/see-the-camp-space-thumb.png"
                    alt="See the Camp Space at The Jar PickleBall Club"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <div className="bg-white rounded-full p-3 shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="h-6 w-6 text-primary fill-primary" />
                    </div>
                    <span className="text-white font-semibold text-base">See the Camp Space</span>
                  </div>
                </button>
                {camp.venueImages.map((img, idx) => (
                  <div key={idx} className="relative h-64 rounded-lg overflow-hidden">
                    <Image
                      src={img}
                      alt={`The Jar PickleBall Club venue photo ${idx + 1}`}
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
                    <div className="text-sm text-muted-foreground">{camp.priceNote}</div>
                    <div className="text-sm font-semibold text-accent-foreground">{camp.totalPrice}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{camp.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>9:00 AM &ndash; 3:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{camp.venue}</span>
                    </div>
                  </div>

                  <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6">
                    <a href={camp.checkoutUrl} target="_blank" rel="noopener noreferrer">
                      Register Now
                    </a>
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Single weeks, full 3-week program, and single-day drop-ins available at checkout
                  </p>

                  <div className="pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed className="h-4 w-4" />
                      <span>Lunch + movie break daily</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="h-4 w-4" />
                      <span>Activities on/off court</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>36 kids max per day</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      <span>Equipment provided</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      <span>Daily tournament</span>
                    </div>
                  </div>

                  {/* Baseline collaboration badge */}
                  <div className="pt-4 border-t border-border flex items-center justify-center gap-2">
                    <a href="https://baselinerec.com" target="_blank" rel="noopener noreferrer">
                      <Image
                        src="/baseline-rec-league-logo.webp"
                        alt="Baseline Rec Pickleball League"
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </a>
                    <span className="text-xs text-muted-foreground">In collaboration with <a href="https://baselinerec.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">Baseline Rec League</a></span>
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
            <div className="text-xs text-muted-foreground font-semibold">
              Ages 8&ndash;14 &bull; All levels
            </div>
          </div>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 px-8">
            <a href={camp.checkoutUrl} target="_blank" rel="noopener noreferrer">
              Register Now
            </a>
          </Button>
        </div>
      </div>

      {/* Add padding to prevent content from being hidden behind mobile sticky bar */}
      <div className="lg:hidden h-20" />

      <Footer hideNotifySignup={true} />

      {/* Video Modal */}
      <Dialog open={videoOpen} onOpenChange={(open) => { setVideoOpen(open) }}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-black border-none">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            {videoOpen && (
              <iframe
                src="https://www.youtube.com/embed/pvRbB-JDsIA?autoplay=1"
                title="See the Camp Space - The Jar PickleBall Club"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
