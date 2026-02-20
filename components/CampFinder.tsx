"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export function CampFinder() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [skillLevel, setSkillLevel] = useState("")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.set("location", location)
    if (skillLevel) params.set("skill", skillLevel)
    router.push(`/pickleball-camps?${params.toString()}`)
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-primary mb-4 text-center md:text-left">Find Your Perfect Camp</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-foreground mb-2 block">Location</label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="toronto">Toronto</SelectItem>
              <SelectItem value="saint-martin">Saint Martin</SelectItem>
              <div className="px-2 py-1.5 text-sm text-muted-foreground italic border-t mt-1 pt-2">
                More locations coming soon
              </div>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label className="text-sm font-medium text-foreground mb-2 block">Skill Level</label>
          <Select value={skillLevel} onValueChange={setSkillLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Select skill level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3.0">3.0</SelectItem>
              <SelectItem value="3.5">3.5</SelectItem>
              <SelectItem value="4.0">4.0+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button
            onClick={handleSearch}
            className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8"
          >
            Search Camps
          </Button>
        </div>
      </div>
    </div>
  )
}
