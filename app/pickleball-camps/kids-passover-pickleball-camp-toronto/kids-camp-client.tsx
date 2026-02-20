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
  ClipboardList,
  Gamepad2,
  Heart,
  Trophy,
  Play,
} from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function KidsPassoverCampClient() {
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
    title: "Breakaway Kids Passover Pickleball Camp",
    subtitle: "4-Day Youth Camp \u2022 Ages 8\u201316 \u2022 All Skill Levels \u2022 No Experience Required",
    location: "Toronto",
    coach: "Joey Manchurek",
    date: "April 7\u201310, 2026",
    price: "$118 CAD",
    priceNote: "per day (4 days)",
    totalPrice: "$472 CAD total",
    venue: "The Jar PickleBall Club",
    checkoutUrl: "https://baselinerec.com/products/passover-pickleball-camp",
    coachBio:
      "Former pro hockey player (OHL Oshawa Generals Captain; later ECHL). Grew up playing tennis & table tennis; transitioned quickly to competitive pickleball. Actively competes in tournaments; coaching focus on leadership, skill development, and helping players reach potential.",
    image: "/kids-pickleball-training.jpg",
    coachImage: "/coach-joey.jpg",
    venueImages: ["/jar3.png", "/jar4.png", "/jar1.png", "/jar2.png"],
  }

  const dailySchedule = [
    { time: "9:00 \u2013 10:30 AM", activity: "Warmup Games (No Pickleball)" },
    { time: "10:30 AM \u2013 12:30 PM", activity: "Pickleball Training and Clinics" },
    { time: "12:30 \u2013 1:30 PM", activity: "Lunch and Video" },
    { time: "1:30 \u2013 3:00 PM", activity: "Games, Tournaments and Prizes" },
  ]

  const whatsIncluded = [
    {
      icon: Award,
      title: "Professional Instruction",
      description: "Led by certified pickleball coaches with youth training experience",
    },
    {
      icon: Trophy,
      title: "Equipment Provided",
      description: "All paddles and equipment provided, just show up and play",
    },
    {
      icon: Shield,
      title: "Safe Environment",
      description: "Fully supervised facility with Standard First Aid + CPR-C certified staff on-site at all times",
    },
    {
      icon: Users,
      title: "Skill-Based Groups",
      description: "Players placed in groups by ability for personalized training",
    },
    {
      icon: Camera,
      title: "Photos & Videos",
      description: "Professional highlights of your child's progress and tournament play",
    },
    {
      icon: ClipboardList,
      title: "Progress Notes",
      description: "Daily feedback and end-of-camp skills summary for each child",
    },
    {
      icon: Gamepad2,
      title: "Daily Tournament",
      description: "Afternoon tournament-style games with prizes and giveaways",
    },
    {
      icon: UtensilsCrossed,
      title: "Lunch + Video Reset",
      description: "Mid-day break with lunch and a video session. On-site fridges available \u2014 please pack a Kosher for Passover lunch",
    },
    {
      icon: Heart,
      title: "Activities & Fun",
      description: "On and off court activities plus prizes and giveaways",
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
            alt="Kids playing pickleball at Breakaway Camp"
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="mx-auto max-w-7xl">
            <Badge className="mb-4 bg-accent text-accent-foreground">Ages 8-16</Badge>
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
                  Breakaway Pickleball Camps and <a href="https://baselinerec.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">Baseline Rec Pickleball League</a> are teaming up for the Kids Passover Pickleball Camp -- a 4-day youth program running April 7-10 at The Jar PickleBall Club in Toronto. Designed for ages 8-16, all skill levels are welcome and no experience is required. With 6 dedicated courts and a maximum of 36 kids per day, campers receive personalized attention through skill-based group placement. Each day features a mix of warmup games, professional pickleball instruction, lunch, and exciting tournament-style play with prizes.
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
              <h2 className="text-3xl font-bold text-primary mb-6">{"What\u2019s Included"}</h2>
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
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{camp.venue}</span>
                    </div>
                  </div>

                  <div className="bg-accent/10 rounded-lg p-3">
                    <p className="text-sm font-semibold text-accent-foreground">
                      Limited Spots
                    </p>
                  </div>

                  <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white text-lg py-6">
                    <a href={camp.checkoutUrl} target="_blank" rel="noopener noreferrer">
                      Book Now
                    </a>
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Single day, 2-day, and 3-day options also available at checkout
                  </p>

                  <div className="pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed className="h-4 w-4" />
                      <span>Lunch break daily</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="h-4 w-4" />
                      <span>Activities on/off court</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Limited spots</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      <span>Equipment provided</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      <span>Prizes & giveaways</span>
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
            <div className="text-2xl font-bold text-primary">{camp.price}/day</div>
            <div className="text-xs text-muted-foreground">
              {camp.totalPrice} &middot; Limited spots
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
