"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ChevronDown } from "lucide-react"

interface FooterNotifySignupProps {
  showViewCampsButton?: boolean
}

export function FooterNotifySignup({ showViewCampsButton = false }: FooterNotifySignupProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [email, setEmail] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [skillLevels, setSkillLevels] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSkillLevelChange = (level: string, checked: boolean) => {
    if (checked) {
      setSkillLevels([...skillLevels, level])
    } else {
      setSkillLevels(skillLevels.filter((l) => l !== level))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)

    try {
      await fetch("https://hooks.zapier.com/hooks/catch/22788039/ugfdooi/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          postalCode,
          skillLevels: skillLevels.join(", "),
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error("Failed to submit to Zapier:", error)
    }

    setIsSubmitting(false)
    setIsSuccess(true)

    // Collapse after success
    setTimeout(() => {
      setIsExpanded(false)
      // Reset form after collapse animation
      setTimeout(() => {
        setEmail("")
        setPostalCode("")
        setSkillLevels([])
        setIsSuccess(false)
      }, 300)
    }, 2000)
  }

  return (
    <div className="w-full border-b border-[#E5E7EB] bg-white">
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Collapsed State */}
        <div
          className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${isExpanded ? "mb-4" : ""}`}
        >
          <p className="text-[#111827] text-sm md:text-base font-medium">Get notified when a camp goes live</p>
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {showViewCampsButton && (
              <Link href="/pickleball-camps">
                <Button className="bg-lime-400 text-blue-950 hover:bg-lime-500 w-full md:w-auto">
                  View Upcoming Camps
                </Button>
              </Link>
            )}
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="outline"
              className="border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a]/10 w-full md:w-auto"
            >
              Notify Me
              <ChevronDown
                className={`ml-2 h-4 w-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* Expanded State */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {isSuccess ? (
            <div className="py-6 text-center">
              <p className="text-[#1e3a8a] font-semibold text-lg">You're on the list.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="pt-4 border-t border-[#E5E7EB]">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="notify-email" className="text-sm text-[#374151]">
                    Email address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="notify-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-[#D1D5DB] focus:border-[#1e3a8a] focus:ring-[#1e3a8a]"
                  />
                </div>

                {/* Postal Code */}
                <div className="space-y-2">
                  <Label htmlFor="notify-postal" className="text-sm text-[#374151]">
                    Postal code <span className="text-[#9CA3AF]">(optional)</span>
                  </Label>
                  <Input
                    id="notify-postal"
                    type="text"
                    placeholder="M6S"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="border-[#D1D5DB] focus:border-[#1e3a8a] focus:ring-[#1e3a8a]"
                  />
                </div>
              </div>

              {/* Skill Level */}
              <div className="mt-4 space-y-3">
                <Label className="text-sm text-[#374151]">
                  Skill level <span className="text-[#9CA3AF]">(select all that apply)</span>
                </Label>
                <div className="flex flex-col gap-3">
                  {[
                    { id: "beginner", label: "Beginner (2.5–3.0)" },
                    { id: "intermediate", label: "Intermediate (3.0–3.5)" },
                    { id: "advanced", label: "Advanced (4.0+)" },
                    { id: "kids", label: "Kids Camps (Ages 8-16)" },
                  ].map((level) => (
                    <div key={level.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={`skill-${level.id}`}
                        checked={skillLevels.includes(level.id)}
                        onCheckedChange={(checked) => handleSkillLevelChange(level.id, checked as boolean)}
                        className="h-5 w-5 border-[#D1D5DB] data-[state=checked]:bg-[#1e3a8a] data-[state=checked]:border-[#1e3a8a]"
                      />
                      <Label htmlFor={`skill-${level.id}`} className="text-sm text-[#374151] cursor-pointer">
                        {level.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <Button
                  type="submit"
                  disabled={!email || isSubmitting}
                  className="w-full md:w-auto bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Notify Me"}
                </Button>
              </div>

              {/* Microcopy */}
              <p className="mt-4 text-xs text-[#6B7280]">
                We'll only email you when a camp matching your level goes live. No spam.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
