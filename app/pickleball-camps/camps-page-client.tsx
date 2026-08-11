"use client"

import { useState } from "react"
import { CampCard } from "@/components/CampCard"
import { MuskokaHubCard } from "@/components/MuskokaHubCard"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Filter } from "lucide-react"
import { useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { PublicCampCard } from "@/lib/public-camps"
import type { MuskokaCamp } from "@/lib/muskoka-camps"
import {
  CAMP_SKILL_FILTERS,
  COMPLETED_CAMP_CARDS,
  RELATED_CAMP_LINKS,
  campMatchesFilters,
  shouldShowMuskokaHub,
} from "@/lib/camp-discovery"

type CampsPageClientProps = {
  publishedCampCards?: PublicCampCard[]
  muskokaCamps?: MuskokaCamp[]
  initialSelectedLocations?: string[]
  initialSelectedSkillLevels?: string[]
  initialView?: "upcoming" | "completed"
}

function CampsPageContent({
  publishedCampCards = [],
  muskokaCamps = [],
  initialSelectedLocations = [],
  initialSelectedSkillLevels = [],
  initialView = "upcoming",
}: CampsPageClientProps) {
  const router = useRouter()
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSkillLevels, setSelectedSkillLevels] = useState<string[]>(initialSelectedSkillLevels)
  const [selectedLocations, setSelectedLocations] = useState<string[]>(initialSelectedLocations)
  const [selectedFormats, setSelectedFormats] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState<"upcoming" | "completed">(initialView)

  const setView = (view: "upcoming" | "completed") => {
    setDateFilter(view)
    const params = new URLSearchParams(window.location.search)
    if (view === "completed") {
      params.set("view", "completed")
    } else {
      params.delete("view")
    }
    const queryString = params.toString()
    router.replace(queryString ? `/pickleball-camps?${queryString}` : "/pickleball-camps", { scroll: false })
  }

  const upcomingCamps = [
    ...publishedCampCards,
    {
      id: "punta-cana-2026",
      title: "Punta Cana Destination Retreat",
      date: "Nov 24 – Dec 1, 2026",
      sortDate: new Date("2026-11-24"),
      location: "TRS Turquesa, Punta Cana, DR",
      locationFilter: "Punta Cana",
      format: "Camp",
      skillLevel: "2.5-2.75,3.0,3.5,4.0+",
      price: "Contact for trip details",
      image: "/punta-cana-resort-pool.jpg",
      badges: [
        { text: "Few spots left", variant: "destructive" as const },
        { text: "Destination", variant: "secondary" as const },
      ],
      coach: "Joey Manchurek",
      link: "/pickleball-camps/punta-cana",
      imageEnhanced: true,
      soldOut: false,
      buttonText: "Learn More",
    },
  ].sort((a, b) => {
    // Sort by date
    return new Date(a.sortDate).getTime() - new Date(b.sortDate).getTime()
  })

  const filterCamps = <T extends { locationFilter: string; format: string; skillLevel: string }>(camps: T[]) =>
    camps.filter((camp) =>
      campMatchesFilters(camp, {
        locations: selectedLocations,
        formats: selectedFormats,
        skillLevels: selectedSkillLevels,
      }),
    )

  const filteredUpcomingCamps = filterCamps(upcomingCamps)
  const filteredCompletedCamps = filterCamps(COMPLETED_CAMP_CARDS)
  const showMuskokaHub = shouldShowMuskokaHub({
    campCount: muskokaCamps.length,
    locations: selectedLocations,
    formats: selectedFormats,
    skillLevels: selectedSkillLevels,
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
              {CAMP_SKILL_FILTERS.map((level) => (
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

      <div className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Pickleball Camps</h1>
          <p className="text-muted-foreground">
            Discover upcoming pickleball camps and clinics across Toronto, the GTA & Muskoka
          </p>
          <div className="mt-4 grid gap-2 text-sm sm:flex sm:flex-wrap sm:gap-x-4">
            {RELATED_CAMP_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mb-6 flex gap-2 border-b">
          <Button
            variant="ghost"
            className={`rounded-none border-b-2 ${
              dateFilter === "upcoming"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground"
            }`}
            onClick={() => setView("upcoming")}
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
            onClick={() => setView("completed")}
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
                {showMuskokaHub && (
                  <MuskokaHubCard camps={muskokaCamps} />
                )}
              </div>
              {filteredUpcomingCamps.length === 0 && !showMuskokaHub && (
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

    </div>
  )
}

export default function CampsPageClient(props: CampsPageClientProps) {
  return <CampsPageContent {...props} />
}
