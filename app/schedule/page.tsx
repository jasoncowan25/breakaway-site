import { Navigation } from "@/components/Navigation"
import { CampCard } from "@/components/CampCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Footer } from "@/components/Footer"

export default function SchedulePage() {
  const campsByLocation = {
    toronto: [],
    saintMartin: [
      {
        id: "saint-martin-clinic",
        title: "Saint Martin Pop-Up Clinic",
        date: "Mar 20, 2025",
        location: "Saint Martin",
        price: "$150 USD",
        image: "/desert-pickleball-facility-arizona.jpg",
        coach: "Joey Manchurek",
        link: "/pickleball-camps/saint-martin-pickleball-clinic",
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Camp Schedule</h1>
          <p className="text-xl text-muted-foreground">Browse camps by location and find your perfect dates</p>
        </div>

        <Tabs defaultValue="toronto" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="toronto">Toronto</TabsTrigger>
            <TabsTrigger value="saintMartin">Saint Martin</TabsTrigger>
          </TabsList>

          <TabsContent value="toronto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campsByLocation.toronto.map((camp) => (
                <CampCard key={camp.id} {...camp} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saintMartin">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campsByLocation.saintMartin.map((camp) => (
                <CampCard key={camp.id} {...camp} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
