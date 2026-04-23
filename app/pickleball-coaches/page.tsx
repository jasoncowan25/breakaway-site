import { Metadata } from "next"
import { Navigation } from "@/components/Navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Footer } from "@/components/Footer"

export const metadata: Metadata = {
  title: "Pickleball Coaches | Pro-Led Training | Breakaway Camps",
  description: "Learn from experienced, certified pickleball coaches who are passionate about elevating your game",
  alternates: {
    canonical: "/pickleball-coaches",
  },
  openGraph: {
    url: "/pickleball-coaches",
  },
}

export default function CoachesPage() {
  const coaches = [
    {
      name: "Joey Manchurek",
      slug: "joey-manchurek",
      title: "Founder & Lead Coach",
      image: "/coach-joey.jpg",
      bio: "Former pro hockey player (OHL Oshawa Generals Captain; later ECHL). Grew up playing tennis & table tennis; transitioned quickly to competitive pickleball. Actively competes in tournaments; coaching focus on leadership, skill development, and helping players reach potential.",
      credentials: ["5.0 Rated"],
      signature: true,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Meet Our Pickleball Coaches</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn from experienced, certified pickleball coaches who are passionate about elevating your game
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {coaches.map((coach) => (
            <Card key={coach.name} id={coach.slug} className="overflow-hidden scroll-mt-24">
              <CardContent className="p-0">
                <div className="relative h-80">
                  <Image
                    src={coach.image || "/placeholder.svg"}
                    alt={coach.name}
                    fill
                    className="object-cover object-top"
                  />
                  {coach.signature && (
                    <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">Signature Coach</Badge>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-primary mb-1">{coach.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{coach.title}</p>
                  <p className="text-foreground mb-4">{coach.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {coach.credentials.map((credential) => (
                      <Badge key={credential} variant="outline">
                        {credential}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
