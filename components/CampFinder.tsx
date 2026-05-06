"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { ChevronDown, X } from "lucide-react"

export function CampFinder() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [skillLevel, setSkillLevel] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.set("location", location)
    if (skillLevel) params.set("skill", skillLevel)
    router.push(`/pickleball-camps?${params.toString()}`)
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl max-w-4xl mx-auto overflow-hidden transition-all duration-300">
      {/* Header - always visible, clickable to toggle */}
      <button 
        onClick={() => setIsMinimized(!isMinimized)}
        className="w-full p-4 md:p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
      >
        <h2 className="text-xl font-bold text-primary text-center md:text-left flex-1">Find Your Perfect Camp</h2>
        <span className="text-primary ml-2">
          {isMinimized ? <ChevronDown className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </span>
      </button>
      
      {/* Collapsible content */}
      <div className={`transition-all duration-300 ease-in-out ${isMinimized ? "max-h-0 opacity-0 overflow-hidden" : "max-h-96 opacity-100"}`}>
        <div className="px-4 pb-4 md:px-6 md:pb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">Location</label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toronto-gta">Toronto & GTA</SelectItem>
                  <SelectItem value="muskoka">Muskoka</SelectItem>
                  <SelectItem value="punta-cana">Punta Cana</SelectItem>
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
                  <SelectItem value="2.5">2.5 (Under 3.0)</SelectItem>
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
      </div>
    </div>
  )
}
