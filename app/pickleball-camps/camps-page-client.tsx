"use client"

import { useState, Suspense, useEffect } from "react"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { CampCard } from "@/components/CampCard"
import { MuskokaHubCard } from "@/components/MuskokaHubCard"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Filter } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

function CampsPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showFilters, setShowFilters] = useState(false)
  
  // Parse URL params for initial filter state
  const locationParam = searchParams.get("location")
  const skillParam = searchParams.get("skill")
  const viewParam = searchParams.get("view")
  
  // Map URL location values to filter values
  const getInitialLocations = (): string[] => {
    if (!locationParam) return []
    if (locationParam === "toronto-gta") return ["Toronto & GTA"]
    if (locationParam === "muskoka") return ["Muskoka"]
    return []
  }
  
  const getInitialSkillLevels = (): string[] => {
    if (!skillParam) return []
    return [skillParam]
  }
  
  const [selectedSkillLevels, setSelectedSkillLevels] = useState<string[]>(getInitialSkillLevels)
  const [selectedLocations, setSelectedLocations] = useState<string[]>(getInitialLocations)
  const [selectedFormats, setSelectedFormats] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState<"upcoming" | "completed">(
    viewParam === "completed" ? "completed" : "upcoming"
  )

  // Sync dateFilter with URL
  useEffect(() => {
    const currentView = searchParams.get("view")
    if (dateFilter === "completed" && currentView !== "completed") {
      const params = new URLSearchParams(searchParams.toString())
      params.set("view", "completed")
      router.replace(`/pickleball-camps?${params.toString()}`, { scroll: false })
    } else if (dateFilter === "upcoming" && currentView === "completed") {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("view")
      const queryString = params.toString()
      router.replace(queryString ? `/pickleball-camps?${queryString}` : "/pickleball-camps", { scroll: false })
    }
  }, [dateFilter, searchParams, router])

  const upcomingCamps = [
    {
      id: "toronto-beginner-may",
      title: "Toronto Fundamentals Intensive\n(2.5–2.75)",
      date: "May 30-31, 2026",
      sortDate: new Date("2026-05-30"),
      location: "The Jar PickleBall Club",
      locationFilter: "Toronto & GTA",
      format: "Camp",
      skillLevel: "2.5-2.75",
      price: "$675 CAD",
      image: "/toronto-beginner-intensive-may-2026.png",
      badges: [
        { text: "Just Announced", variant: "accent" as const },
        { text: "Joey Manchurek Signature", variant: "secondary" as const },
      ],
      coach: "Joey Manchurek",
      link: "/pickleball-camps/toronto-core-skills-pickleball-camp",
      imageEnhanced: true,
      soldOut: false,
    },
    {
      id: "punta-cana-2026",
      title: "Punta Cana Destination Retreat",
      date: "Nov 24 – Dec 1, 2026",
      sortDate: new Date("2026-11-24"),
      location: "TRS Turquesa, Punta Cana, DR",
      locationFilter: "Punta Cana",
      format: "Camp",
      skillLevel: "2.5-2.75,3.0,3.5,4.0+",
      price: "From $2,420 CAD",
      image: "/punta-cana-resort-pool.jpg",
      badges: [
        { text: "Just Announced", variant: "accent" as const },
        { text: "Destination", variant: "secondary" as const },
      ],
      coach: "Joey Manchurek",
      link: "/pickleball-camps/punta-cana",
      imageEnhanced: true,
      soldOut: false,
    },
  ].sort((a, b) => {
    // Sort by date
    return a.sortDate.getTime() - b.sortDate.getTime()
  })

  // Only kids passover camp has a recap - other camps show as "Completed" without recap button
  const completedCamps = [
    {
      id: "toronto-april",
      title: "Toronto Intermediate Intensive (3.0-3.5)",
      date: "April 11-12, 2026",
      location: "The Jar PickleBall Club",
      locationFilter: "Toronto & GTA",
      format: "Camp",
      price: "",
      image: "/images/toronto-intermediate-april-group.jpg",
      badges: [{ text: "Completed", variant: "secondary" as const }],
      coach: "Joey Manchurek",
      link: "/pickleball-camps/toronto-intermediate-pickleball-camp/recap",
      buttonText: "View Recap",
      compact: true,
    },
    {
      id: "kids-passover-camp",
      title: "Kids Passover Pickleball Camp",
      date: "April 7-10, 2026",
      location: "The Jar PickleBall Club",
      locationFilter: "Toronto & GTA",
      format: "Camp",
      price: "",
      image: "/images/kids-camp-group-photo.png",
      badges: [
        { text: "Completed", variant: "secondary" as const },
        { text: "Ages 8-16", variant: "secondary" as const },
      ],
      coach: "Joey Manchurek",
      link: "/pickleball-camps/kids-passover-pickleball-camp-toronto/recap",
      buttonText: "View Recap",
      compact: true,
    },
    {
      id: "saint-martin-clinic",
      title: "Saint Martin Pop-Up Clinic",
      date: "Mar 2026",
      location: "American Tennis Club, Saint Martin",
      locationFilter: "Saint Martin",
      format: "Clinic",
      price: "",
      image: "/saint-martin-clinic-action-1.jpg",
      badges: [{ text: "Completed", variant: "secondary" as const }],
      coach: "Joey Manchurek",
      link: "/pickleball-camps/saint-martin-pickleball-clinic/recap",
      buttonText: "View Recap",
      compact: true,
    },
    {
      id: "toronto-intermediate-jan",
      title: "Toronto Intermediate Intensive",
      date: "Jan 10-11, 2026",
      location: "The Jar PickleBall Club",
      locationFilter: "Toronto & GTA",
      format: "Camp",
      price: "",
      image: "/images/screenshot-202026-01-12-20at-204.png",
      badges: [{ text: "Completed", variant: "secondary" as const }],
      coach: "Joey Manchurek",
      link: "/pickleball-camps/toronto-intensive-jan/recap",
      buttonText: "View Recap",
      compact: true,
    },
  ]

  const filterCamps = (camps: typeof upcomingCamps | typeof completedCamps) => {
    return camps.filter((camp) => {
      if (selectedLocations.length > 0 && !selectedLocations.includes(camp.locationFilter)) {
        return false
      }
      if (selectedFormats.length > 0 && !selectedFormats.includes(camp.format)) {
        return false
      }
      if (selectedSkillLevels.length > 0 && "skillLevel" in camp && camp.skillLevel) {
        const matchesSkillLevel = selectedSkillLevels.some((level) => {
          // "2.5" filter should match "Under 3.0" and "2.5-2.75"
          if (level === "2.5") {
            return camp.skillLevel?.includes("Under 3.0") || camp.skillLevel?.includes("2.5")
          }
          return camp.skillLevel?.includes(level)
        })
        if (!matchesSkillLevel) {
          return false
        }
      }
      return true
    })
  }

  const filteredUpcomingCamps = filterCamps(upcomingCamps)
  const filteredCompletedCamps = filterCamps(completedCamps)

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) => (prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]))
  }

  const toggleSkillLevel = (level: string) => {
    setSelectedSkillLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  const toggleFormat = (format: string) => {
    setSelectedFormats((prev) => (prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]))
  }

  const handleApplyFilters = () => {
    setShowFilters(false)
  }

  const FilterSidebar = () => (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={["locations", "skill", "format"]}>
        <AccordionItem value="locations">
          <AccordionTrigger className="text-sm font-semibold">Locations</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {["Toronto & GTA", "Muskoka", "Punta Cana"].map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location}`}
                    checked={selectedLocations.includes(location)}
                    onCheckedChange={() => toggleLocation(location)}
                  />
                  <Label htmlFor={`location-${location}`} className="text-sm cursor-pointer">
                    {location}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skill">
          <AccordionTrigger className="text-sm font-semibold">Skill Level</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {["2.5", "3.0", "3.5", "4.0+"].map((level) => (
                <Button
                  key={level}
                  variant={selectedSkillLevels.includes(level) ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => toggleSkillLevel(level)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="format">
          <AccordionTrigger className="text-sm font-semibold">Format</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {["Camp", "Clinic"].map((format) => (
                <div key={format} className="flex items-center space-x-2">
                  <Checkbox
                    id={`format-${format}`}
                    checked={selectedFormats.includes(format)}
                    onCheckedChange={() => toggleFormat(format)}
                  />
                  <Label htmlFor={`format-${format}`} className="text-sm cursor-pointer">
                    {format}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="coach">
          <AccordionTrigger className="text-sm font-semibold">Coach</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {["Joey Manchurek"].map((coach) => (
                <div key={coach} className="flex items-center space-x-2">
                  <Checkbox id={`coach-${coach}`} />
                  <Label htmlFor={`coach-${coach}`} className="text-sm cursor-pointer">
                    {coach}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navigation />

      <div className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Pickleball Camps</h1>
          <p className="text-muted-foreground">
            Discover upcoming pickleball camps and clinics across Toronto, the GTA & Muskoka
          </p>
        </div>

        <div className="mb-6 flex gap-2 border-b">
          <Button
            variant="ghost"
            className={`rounded-none border-b-2 ${
              dateFilter === "upcoming"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground"
            }`}
            onClick={() => setDateFilter("upcoming")}
            aria-selected={dateFilter === "upcoming"}
            role="tab"
          >
            Upcoming Camps
          </Button>
          <Button
            variant="ghost"
            className={`rounded-none border-b-2 ${
              dateFilter === "completed"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground"
            }`}
            onClick={() => setDateFilter("completed")}
            aria-selected={dateFilter === "completed"}
            role="tab"
          >
            Recently Completed
          </Button>
        </div>

        {/* Mobile Filter Button */}
        <div className="md:hidden mb-6">
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full bg-transparent">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] flex flex-col">
              <SheetHeader>
                <SheetTitle>Filter Camps</SheetTitle>
              </SheetHeader>
              <div className="mt-6 px-4 flex-1 overflow-y-auto">
                <FilterSidebar />
              </div>
              <div className="p-4 border-t bg-background">
                <Button onClick={handleApplyFilters} className="w-full" size="lg">
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          {/* Camp Grid - SSR renders both sections, visibility toggled via hidden attribute */}
          <div className="flex-1">
            {/* Upcoming Camps Section */}
            <div
              role="tabpanel"
              aria-label="Upcoming Camps"
              hidden={dateFilter !== "upcoming"}
              className={dateFilter !== "upcoming" ? "hidden" : undefined}
            >
              <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                {filteredUpcomingCamps.map((camp) => (
                  <CampCard key={camp.id} {...camp} />
                ))}
                {/* Show Muskoka Hub Card for upcoming camps - Muskoka has camps for all skill levels */}
                {(selectedLocations.length === 0 || selectedLocations.includes("Muskoka")) && 
                  (selectedFormats.length === 0 || selectedFormats.includes("Camp")) && (
                  <MuskokaHubCard />
                )}
              </div>
              {filteredUpcomingCamps.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No upcoming camps match your selected filters.</p>
                </div>
              )}
            </div>

            {/* Completed Camps Section */}
            <div
              role="tabpanel"
              aria-label="Recently Completed Camps"
              hidden={dateFilter !== "completed"}
              className={dateFilter !== "completed" ? "hidden" : undefined}
            >
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {filteredCompletedCamps.map((camp) => (
                  <CampCard key={camp.id} {...camp} />
                ))}
              </div>
              {filteredCompletedCamps.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No completed camps match your selected filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function CampsPageClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CampsPageContent />
    </Suspense>
  )
}
