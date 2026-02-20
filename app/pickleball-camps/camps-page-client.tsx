"use client"

import { useState, Suspense } from "react"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { CampCard } from "@/components/CampCard"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Filter } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

function CampsPageContent() {
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSkillLevels, setSelectedSkillLevels] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedFormats, setSelectedFormats] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState<"upcoming" | "completed">("upcoming")

  const upcomingCamps = [
    {
      id: "toronto-april",
      title: "Toronto Intermediate Intensive (3.0-3.5)",
      date: "April 11-12, 2026",
      location: "The Jar PickleBall Club",
      locationFilter: "Toronto",
      format: "Camp",
      skillLevel: "3.0-3.5",
      price: "$900 CAD",
      image: "/toronto-coaching-instruction.png",
      badges: [
        { text: "New", variant: "accent" as const },
        { text: "Joey Manchurek Signature", variant: "secondary" as const },
      ],
      coach: "Joey Manchurek",
      link: "/pickleball-camps/toronto-intermediate-pickleball-camp",
    },

    {
      id: "saint-martin-clinic",
      title: "Saint Martin Pop-Up Clinic",
      date: "Mar 20, 2026",
      location: "Saint Martin",
      locationFilter: "Saint Martin",
      format: "Clinic",
      price: "$150 USD",
      image: "/desert-pickleball-facility-arizona.jpg",
      badges: [{ text: "Joey Manchurek Signature", variant: "secondary" as const }],
      coach: "Joey Manchurek",
      link: "/pickleball-camps/saint-martin-pickleball-clinic",
    },
  ]

  const completedCamps = [
    {
      id: "toronto-intermediate-jan",
      title: "Toronto Intermediate Intensive",
      date: "Jan 10-11, 2026",
      location: "The Jar PickleBall Club",
      locationFilter: "Toronto",
      format: "Camp",
      price: "$800 CAD",
      image: "/images/screenshot-202026-01-12-20at-204.png",
      badges: [{ text: "Sold Out", variant: "destructive" as const }],
      coach: "Joey Manchurek",
      link: "/pickleball-camps/toronto-intensive-jan/recap",
      buttonText: "View Recap",
    },
  ]

  const allCamps = dateFilter === "upcoming" ? upcomingCamps : completedCamps

  const filteredCamps = allCamps.filter((camp) => {
    if (selectedLocations.length > 0 && !selectedLocations.includes(camp.locationFilter)) {
      return false
    }
    if (selectedFormats.length > 0 && !selectedFormats.includes(camp.format)) {
      return false
    }
    if (
      selectedSkillLevels.length > 0 &&
      camp.skillLevel &&
      !selectedSkillLevels.some((level) => camp.skillLevel?.includes(level))
    ) {
      return false
    }
    return true
  })

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
              {["Toronto", "Saint Martin"].map((location) => (
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
              {["3.0", "3.5", "4.0+"].map((level) => (
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
            Discover upcoming pickleball camps and clinics across North America
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

          {/* Camp Grid */}
          <div className="flex-1">
            <div
              className={`grid ${
                dateFilter === "completed" ? "md:grid-cols-1 lg:grid-cols-2" : "md:grid-cols-2"
              } gap-6 lg:gap-8`}
            >
              {filteredCamps.map((camp) => (
                <CampCard key={camp.id} {...camp} />
              ))}
            </div>
            {filteredCamps.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No camps match your selected filters.</p>
              </div>
            )}
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
