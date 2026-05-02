"use client"

import { useState } from "react"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Calendar, MapPin, Users, Plane, Utensils, Waves, Trophy, Video, Award, Check, Clock, ExternalLink, Palmtree, Loader2 } from "lucide-react"
import Image from "next/image"

export default function PuntaCanaPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    roomPreference: "",
    dob: "",
    email: "",
    phone: "",
    numTravellers: "",
    pickleballParticipants: "",
    comments: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [galleryImage, setGalleryImage] = useState<string | null>(null)

  const galleryImages = [
    { src: "/punta-cana-resort-aerial.jpg", alt: "TRS Turquesa aerial view with ocean" },
    { src: "/punta-cana-resort-pool.jpg", alt: "TRS Turquesa pool" },
    { src: "/punta-cana-courts-aerial.jpg", alt: "TRS Turquesa pickleball courts" },
    { src: "/punta-cana-suite.jpg", alt: "TRS Turquesa Junior Suite" },
    { src: "/punta-cana-spa.jpg", alt: "TRS Turquesa Zentropia Spa" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/punta-cana-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setIsSubmitted(true)
      } else {
        setError("Something went wrong. Please try again or email us directly.")
      }
    } catch {
      setError("Something went wrong. Please try again or email us directly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollToForm = () => {
    document.getElementById("registration-form")?.scrollIntoView({ behavior: "smooth" })
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")
    // Format as XXX-XXX-XXXX
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFormData({ ...formData, phone: formatted })
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px]">
        <Image
          src="/punta-cana-resort-pool.jpg"
          alt="TRS Turquesa Resort Pool in Punta Cana"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />

        {/* Courts inset */}
        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 flex flex-col items-end gap-2">
          <div className="relative h-32 w-32 md:h-44 md:w-44 rounded-full border-4 border-white shadow-2xl overflow-hidden">
            <Image
              src="/punta-cana-pickleball-courts.jpg"
              alt="Dedicated pickleball courts"
              fill
              className="object-cover"
            />
          </div>
          <span className="bg-white/95 text-xs font-medium px-3 py-1 rounded-full text-primary shadow-lg">
            Dedicated courts, 8–11 AM daily
          </span>
        </div>

        {/* Hero text */}
        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 max-w-xl">
          <div className="flex gap-2 mb-3">
            <Badge className="bg-accent text-accent-foreground">Just Announced</Badge>
            <Badge variant="secondary" className="flex items-center gap-1"><Palmtree className="h-3 w-3" /> Destination</Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Punta Cana Destination Retreat</h1>
          <p className="text-lg text-white/90 mb-4">An All-Inclusive Pickleball Trip at TRS Turquesa</p>

          <div className="flex flex-wrap gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full">
              <Calendar className="h-4 w-4" /> Nov 24 – Dec 1, 2026
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full">
              <MapPin className="h-4 w-4" /> TRS Turquesa, Punta Cana, DR
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full">
              <Users className="h-4 w-4" /> Limited to 20 spots
            </span>
          </div>

          <Button onClick={scrollToForm} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            Register Your Interest
          </Button>
        </div>
      </section>

      {/* Main content with sticky sidebar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 pb-24 lg:pb-12">
        <div className="lg:flex lg:gap-12">
          {/* Main content */}
          <div className="flex-1 space-y-16">
            {/* Trip Overview */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">A Tropical Reset for Serious Pickleball Players</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  Join us for 7 nights at TRS Turquesa — an adults-only, all-inclusive Caribbean resort on the pristine shores of Bávaro Beach. 
                  This isn&apos;t just a vacation with pickleball on the side; it&apos;s a focused pickleball retreat for players of all levels
                  who want to improve their game while enjoying world-class amenities. Courts will be organized by skill level to ensure fun, competitive play.
                </p>
                <p>
                  With dedicated court time every morning, daily coaching from Joey Manchurek and the Breakaway team, and afternoons free to explore 
                  the resort, beach, and local excursions, this trip delivers the perfect balance of skill development and relaxation.
                </p>
                <p className="font-medium text-foreground">
                  Spaces are capped at 20 — this trip is built around a small, focused group.
                </p>
              </div>
            </section>

            {/* Pickleball Program */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">What&apos;s in the Pickleball Program ($800 CAD pp)</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="flex items-start gap-4 p-5">
                    <Users className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">5 days of in-person coaching</p>
                      <p className="text-sm text-muted-foreground">With Head Coach Joey Manchurek and the Breakaway Pickleball Team</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="flex items-start gap-4 p-5">
                    <Trophy className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Daily clinics, drills & skill development</p>
                      <p className="text-sm text-muted-foreground">Structured sessions to elevate your game</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="flex items-start gap-4 p-5">
                    <Users className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Match play & strategy sessions</p>
                      <p className="text-sm text-muted-foreground">Apply what you learn in competitive play</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="flex items-start gap-4 p-5">
                    <Video className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Video analysis & personalized feedback</p>
                      <p className="text-sm text-muted-foreground">See your game from a new perspective</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="flex items-start gap-4 p-5">
                    <Trophy className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">End-of-week Breakaway Pickleball Tournament</p>
                      <p className="text-sm text-muted-foreground">Put your skills to the test</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="flex items-start gap-4 p-5">
                    <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Exclusive court access</p>
                      <p className="text-sm text-muted-foreground">Courts reserved for our group 8–11 AM daily</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow md:col-span-2">
                  <CardContent className="flex items-start gap-4 p-5">
                    <Award className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Breakaway Pickleball gift bag for each player</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Spouses and non-players are welcome to join the trip at the resort cost only — they won&apos;t be charged the program fee.
              </p>
            </section>

            {/* Sample Day */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">A Sample Day in Punta Cana</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-32 flex-shrink-0 text-sm font-semibold text-primary whitespace-nowrap">7:30 AM</div>
                  <div>
                    <p className="font-medium">Coffee + light breakfast at the resort</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-32 flex-shrink-0 text-sm font-semibold text-primary whitespace-nowrap">8:00–11:00 AM</div>
                  <div>
                    <p className="font-medium">Pickleball block</p>
                    <p className="text-sm text-muted-foreground">Clinic, drills, match play</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-32 flex-shrink-0 text-sm font-semibold text-primary whitespace-nowrap">11:30 AM+</div>
                  <div>
                    <p className="font-medium">Beach, pool, spa, or excursions</p>
                    <p className="text-sm text-muted-foreground">Your time to relax and explore</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-32 flex-shrink-0 text-sm font-semibold text-primary whitespace-nowrap">Evening</div>
                  <div>
                    <p className="font-medium">Group dinners and optional socials</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">Sample only — daily structure may shift across the week.</p>
            </section>

            {/* The Resort */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">The Resort: TRS Turquesa</h2>
              <p className="text-muted-foreground mb-6">
                TRS Turquesa is the adults-only, all-inclusive section of the Grand Palladium complex on Bávaro Beach — known for its pristine white sand, 
                multi-pool layout, and elevated dining and drinks.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                {galleryImages.map((img) => (
                  <button
                    key={img.src}
                    onClick={() => setGalleryImage(img.src)}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <Image src={img.src} alt={img.alt} fill className="object-cover" />
                  </button>
                ))}
              </div>
              <Button asChild variant="outline" className="bg-transparent">
                <a href="https://www.palladiumhotelgroup.com/en/hoteles/republicadominicana/puntacana/trs-turquesa-hotel" target="_blank" rel="noopener noreferrer">
                  Visit the TRS Turquesa website <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </section>

            {/* Pricing & Rooms */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">Pricing & Room Options (All-Inclusive, per person, CAD)</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-1">Garden View — Single</h3>
                    <p className="text-sm text-muted-foreground mb-4">King bed, ideal for solo travelers</p>
                    <p className="text-2xl font-bold text-primary mb-2">$3,179 CAD </p>
                    <p className="text-sm text-muted-foreground">3 rooms available</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-1">Garden View — Double</h3>
                    <p className="text-sm text-muted-foreground mb-4">King bed, ideal for couples</p>
                    <p className="text-2xl font-bold text-primary mb-2">$2,420 CAD </p>
                    <p className="text-sm text-muted-foreground">4 rooms (8 guests) available</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-1">Pool View — Double</h3>
                    <p className="text-sm text-muted-foreground mb-4">2 beds, ideal for friends sharing</p>
                    <p className="text-2xl font-bold text-primary mb-2">$2,498 CAD </p>
                    <p className="text-sm text-muted-foreground">6 rooms (12 guests) available</p>
                  </CardContent>
                </Card>
              </div>
              <Card className="border-2 border-accent">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-primary">Breakaway Pickleball Program Fee — $800 CAD per player</h3>
                  <p className="text-sm text-muted-foreground mt-1">Added to the all-inclusive price for those participating in the pickleball program. Non-players join at resort cost only.</p>
                </CardContent>
              </Card>
            </section>

            {/* What's Included */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">What&apos;s Included</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Resort & Travel</h3>
                  <ul className="space-y-3">
                    {[
                      "Round-trip direct flights with Air Transat",
                      "Checked bag, carry-on, and personal item",
                      "7 nights at TRS Turquesa (adults-only, all-inclusive)",
                      "Elevated food and drinks",
                      "Round-trip airport transfers",
                      "All taxes and fees",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-4">Pickleball</h3>
                  <ul className="space-y-3">
                    {[
                      "5 days of coaching (Joey Manchurek + Breakaway team)",
                      "Daily clinics, drills, match play",
                      "Video analysis & personalized feedback",
                      "End-of-week tournament",
                      "Exclusive court access 8–11 AM daily",
                      "Breakaway Pickleball gift bag",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Registration Form */}
            <section id="registration-form">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">Register Your Interest</h2>
              <Card>
                <CardContent className="p-6 md:p-8">
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="text-xl font-bold text-primary mb-2">Thank you for registering!</h3>
                      <p className="text-muted-foreground">We&apos;ve received your information and will be in touch soon with next steps.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            tabIndex={1}
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder="John Smith"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="roomPreference">Room Preference</Label>
                          <Select
                            value={formData.roomPreference}
                            onValueChange={(value) => setFormData({ ...formData, roomPreference: value })}
                          >
                            <SelectTrigger tabIndex={2}>
                              <SelectValue placeholder="Select your preferred room type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Garden View — Single ($3,179 CAD)">Garden View — Single ($3,179 CAD)</SelectItem>
                              <SelectItem value="Garden View — Double ($2,420 CAD)">Garden View — Double ($2,420 CAD)</SelectItem>
                              <SelectItem value="Pool View — Double ($2,498 CAD)">Pool View — Double ($2,498 CAD)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="dob">Date of Birth *</Label>
                          <Input
                            id="dob"
                            tabIndex={3}
                            type="text"
                            required
                            placeholder="MM/DD/YYYY"
                            value={formData.dob}
                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            tabIndex={4}
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone *</Label>
                          <Input
                            id="phone"
                            tabIndex={5}
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            placeholder="416-555-0123"
                            maxLength={12}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="numTravellers">Number of Travellers</Label>
                          <Input
                            id="numTravellers"
                            tabIndex={6}
                            type="number"
                            min="1"
                            value={formData.numTravellers}
                            onChange={(e) => setFormData({ ...formData, numTravellers: e.target.value })}
                            placeholder="1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pickleballParticipants">Which travellers will participate in pickleball?</Label>
                        <Input
                          id="pickleballParticipants"
                          tabIndex={7}
                          value={formData.pickleballParticipants}
                          onChange={(e) => setFormData({ ...formData, pickleballParticipants: e.target.value })}
                          placeholder="e.g. John Smith, Jane Smith"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="comments">Comments or Questions</Label>
                        <Textarea
                          id="comments"
                          tabIndex={8}
                          value={formData.comments}
                          onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                          placeholder="Anything else we should know?"
                          rows={3}
                        />
                      </div>

                      {error && (
                        <p className="text-red-600 text-sm">{error}</p>
                      )}

                      <Button 
                        type="submit" 
                        tabIndex={9}
                        size="lg" 
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Register Your Interest"
                        )}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        We&apos;ll follow up with deposit and payment details.
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">Common Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="passport">
                  <AccordionTrigger>Do I need a passport?</AccordionTrigger>
                  <AccordionContent>
                    Yes — Canadian travelers need a valid passport with at least 6 months remaining from the travel date.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="skill">
                  <AccordionTrigger>What skill level is this for?</AccordionTrigger>
                  <AccordionContent>
                    All levels are welcome! Courts will be organized by skill level to ensure fun, competitive play for everyone.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="spouse">
                  <AccordionTrigger>Can my spouse / friend come along without playing?</AccordionTrigger>
                  <AccordionContent>
                    Yes — they can join at the resort cost with no program fee. They&apos;ll have full access to the all-inclusive resort while you&apos;re on the courts.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="gear">
                  <AccordionTrigger>What about paddles and gear?</AccordionTrigger>
                  <AccordionContent>
                    Bring your own paddle; balls and on-court gear are provided.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="insurance">
                  <AccordionTrigger>Is travel insurance included?</AccordionTrigger>
                  <AccordionContent>
                    No — we strongly recommend purchasing travel insurance separately to protect your investment.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="payments">
                  <AccordionTrigger>How are payments handled?</AccordionTrigger>
                  <AccordionContent>
                    After you register, we&apos;ll send you deposit and payment details. The $800 program fee is paid via Breakaway. The remaining all-inclusive balance is invoiced and paid through travel agent Joe Dias.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
          </div>

          {/* Desktop Sticky Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <Card className="shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Nov 24 – Dec 1, 2026</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>TRS Turquesa, Punta Cana, DR</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Limited to 20 spots</span>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-lg font-bold text-primary">From $2,420 CAD</p>
                    <p className="text-sm text-muted-foreground">+ $800 program fee</p>
                  </div>
                  <Button onClick={scrollToForm} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Register Your Interest
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Questions? <a href="mailto:breakawaypickleball@gmail.com" className="text-primary hover:underline">breakawaypickleball@gmail.com</a>
                  </p>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      {/* Final CTA Banner */}
      <section className="bg-primary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">20 spots. One unforgettable week.</h2>
          <Button onClick={scrollToForm} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 mb-4">
            Register Your Interest
          </Button>
          <p className="text-white/80 text-sm">
            Questions? <a href="mailto:breakawaypickleball@gmail.com" className="text-white underline hover:text-white/80">breakawaypickleball@gmail.com</a>
          </p>
        </div>
      </section>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 lg:hidden z-50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-primary">From $2,420 CAD</p>
            <p className="text-xs text-muted-foreground">+ $800 program fee</p>
          </div>
          <Button onClick={scrollToForm} className="bg-accent text-accent-foreground hover:bg-accent/90">
            Register Interest
          </Button>
        </div>
      </div>

      <Footer hideNotifySignup={true} />

      {/* Gallery Modal */}
      <Dialog open={!!galleryImage} onOpenChange={() => setGalleryImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">Resort Image</DialogTitle>
          {galleryImage && (
            <div className="relative aspect-video">
              <Image src={galleryImage} alt="TRS Turquesa" fill className="object-contain" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
