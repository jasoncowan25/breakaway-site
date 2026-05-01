"use client"

import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calendar, MapPin, Users, Plane, Utensils, Waves, Trophy, Video, Award, Check, Clock, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const STRIPE_DEPOSIT_URL = "https://buy.stripe.com/REPLACE_ME_PUNTA_CANA_DEPOSIT"

export default function PuntaCanaPage() {
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
            <Badge variant="secondary">Destination</Badge>
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
              <Users className="h-4 w-4" /> Limited to 25 spots
            </span>
          </div>

          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href={STRIPE_DEPOSIT_URL}>Reserve Your Spot — $150 CAD Deposit</Link>
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
                  This isn&apos;t just a vacation with pickleball on the side; it&apos;s a focused pickleball retreat designed for Intermediate and Advanced players 
                  who want to improve their game while enjoying world-class amenities.
                </p>
                <p>
                  With dedicated court time every morning, daily coaching from Joey Manchurek and the Breakaway team, and afternoons free to explore 
                  the resort, beach, and local excursions, this trip delivers the perfect balance of skill development and relaxation.
                </p>
                <p className="font-medium text-foreground">
                  Spaces are capped at 25 — this trip is built around a small, focused group.
                </p>
              </div>
            </section>

            {/* Pickleball Program */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">What&apos;s in the Pickleball Program ($800 CAD pp)</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="flex items-start gap-4 p-5">
                    <Award className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
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
                  <div className="w-24 flex-shrink-0 text-sm font-semibold text-primary">7:30 AM</div>
                  <div>
                    <p className="font-medium">Coffee + light breakfast at the resort</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-24 flex-shrink-0 text-sm font-semibold text-primary">8:00–11:00 AM</div>
                  <div>
                    <p className="font-medium">Pickleball block</p>
                    <p className="text-sm text-muted-foreground">Clinic, drills, match play</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-24 flex-shrink-0 text-sm font-semibold text-primary">11:30 AM+</div>
                  <div>
                    <p className="font-medium">Beach, pool, spa, or excursions</p>
                    <p className="text-sm text-muted-foreground">Your time to relax and explore</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-24 flex-shrink-0 text-sm font-semibold text-primary">Evening</div>
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
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image src="/punta-cana-resort-pool.jpg" alt="TRS Turquesa pool" fill className="object-cover" />
                </div>
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image src="/punta-cana-suite.jpg" alt="TRS Turquesa Junior Suite" fill className="object-cover" />
                </div>
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image src="/punta-cana-spa.jpg" alt="TRS Turquesa Zentropia Spa" fill className="object-cover" />
                </div>
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
                    <p className="text-2xl font-bold text-primary mb-2">$3,179 CAD <span className="text-sm font-normal text-muted-foreground">pp</span></p>
                    <p className="text-sm text-muted-foreground">3 rooms available</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-1">Garden View — Double</h3>
                    <p className="text-sm text-muted-foreground mb-4">King bed, ideal for couples</p>
                    <p className="text-2xl font-bold text-primary mb-2">$2,420 CAD <span className="text-sm font-normal text-muted-foreground">pp</span></p>
                    <p className="text-sm text-muted-foreground">4 rooms (8 guests) available</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-1">Pool View — Double</h3>
                    <p className="text-sm text-muted-foreground mb-4">2 beds, ideal for friends sharing</p>
                    <p className="text-2xl font-bold text-primary mb-2">$2,498 CAD <span className="text-sm font-normal text-muted-foreground">pp</span></p>
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

            {/* Reserve Your Spot */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">Reserve Your Spot — Payment Schedule</h2>
              <Card className="text-center">
                <CardContent className="p-8">
                  <p className="text-xl font-semibold mb-6">Lock in your spot with a $150 CAD deposit.</p>
                  <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 mb-6">
                    <Link href={STRIPE_DEPOSIT_URL}>Reserve Your Spot — $150 CAD Deposit</Link>
                  </Button>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>$150 CAD deposit per person</strong> — due July 24, 2026</p>
                    <p><strong>Final payment</strong> — due September 17, 2026 (covers the remaining all-inclusive balance, handled by travel agent Joe Dias, plus the $800 CAD Breakaway program fee)</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* How It Works */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">How It Works After You Deposit</h2>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</span>
                  <p className="text-muted-foreground pt-1">You&apos;ll receive a confirmation email</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</span>
                  <p className="text-muted-foreground pt-1">We&apos;ll follow up to collect your passport details (full name as on passport, DOB, room preference, phone, email)</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</span>
                  <p className="text-muted-foreground pt-1">Travel agent Joe Dias sends a registration form for the all-inclusive package</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">4</span>
                  <p className="text-muted-foreground pt-1">Final payment due September 17, 2026</p>
                </li>
              </ol>
              <p className="text-sm text-muted-foreground mt-6">
                Travel logistics: <a href="mailto:jdias@expediacruises.com" className="text-primary hover:underline">jdias@expediacruises.com</a>
              </p>
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
                    Intermediate & Advanced — roughly 3.0+. This trip is designed for players who already have a solid foundation and want to take their game to the next level.
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
                    The $150 deposit and $800 program fee are paid via the Breakaway website. The remaining all-inclusive balance is invoiced and paid through travel agent Joe Dias.
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
                      <span>Limited to 25 spots</span>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-lg font-bold text-primary">From $2,420 CAD pp</p>
                    <p className="text-sm text-muted-foreground">+ $800 program fee</p>
                  </div>
                  <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href={STRIPE_DEPOSIT_URL}>Reserve Your Spot — $150 CAD Deposit</Link>
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Deposit due July 24, 2026 · Final due September 17, 2026
                  </p>
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
          <h2 className="text-3xl font-bold text-white mb-6">25 spots. One unforgettable week.</h2>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 mb-4">
            <Link href={STRIPE_DEPOSIT_URL}>Reserve Your Spot — $150 CAD Deposit</Link>
          </Button>
          <p className="text-white/80 text-sm">
            Questions? Email <a href="mailto:breakawaypickleball@gmail.com" className="underline hover:text-white">breakawaypickleball@gmail.com</a>
          </p>
        </div>
      </section>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 lg:hidden z-50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-primary">From $2,420 CAD pp</p>
            <p className="text-xs text-muted-foreground">+ $800 program fee</p>
          </div>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href={STRIPE_DEPOSIT_URL}>Reserve — $150 Deposit</Link>
          </Button>
        </div>
      </div>

      <Footer hideNotifySignup={true} />
    </div>
  )
}
