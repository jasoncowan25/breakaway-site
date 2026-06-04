"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ChevronDown } from "lucide-react"

interface FooterNotifySignupProps {
  showViewCampsButton?: boolean
}

// Canonical camp-alert skill bands — kept in sync with /camp-alerts and the API.
const SKILLS = [
  { id: "beginner", label: "Beginner (2.5–3.0)" },
  { id: "intermediate", label: "Intermediate (3.0–3.5)" },
  { id: "advanced", label: "Advanced (3.75+)" },
  { id: "kids", label: "Kids Camps (all levels)" },
]

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
}

export function FooterNotifySignup({ showViewCampsButton = false }: FooterNotifySignupProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [skillLevels, setSkillLevels] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const utm = useRef<Record<string, string>>({})
  const referrer = useRef<string>("")

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const captured: Record<string, string> = {}
      for (const k of UTM_KEYS) {
        const v = params.get(k)
        if (v) captured[k] = v
      }
      utm.current = captured
      referrer.current = document.referrer || ""
    } catch {
      /* no-op */
    }
  }, [])

  const handleSkillLevelChange = (level: string, checked: boolean) => {
    setError(null)
    if (checked) {
      setSkillLevels([...skillLevels, level])
    } else {
      setSkillLevels(skillLevels.filter((l) => l !== level))
    }
  }

  const handlePhoneChange = (value: string) => {
    const d = value.replace(/\D/g, "").slice(0, 10)
    let out = ""
    if (d.length > 0) out = "(" + d.slice(0, 3)
    if (d.length >= 4) out += ") " + d.slice(3, 6)
    if (d.length >= 7) out += "-" + d.slice(6, 10)
    setPhone(out)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firstName.trim()) {
      setError("Please enter your first name.")
      return
    }
    if (!isEmail(email)) {
      setError("Enter a valid email so we can reach you.")
      return
    }
    if (skillLevels.length === 0) {
      setError("Pick at least one skill level so we can match you.")
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      await fetch("/api/camp-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim() || null,
          email: email.trim(),
          phone: phone.replace(/\D/g, "").length === 10 ? phone : null,
          skillLevels,
          source: utm.current.utm_source || "footer_notify",
          utm: utm.current,
          referrer: referrer.current || null,
        }),
      })
    } catch (err) {
      // Best-effort: still confirm to the visitor; the API dedupes on retry.
      console.error("Failed to submit camp alert:", err)
    }

    setIsSubmitting(false)
    setIsSuccess(true)

    // Collapse after success
    setTimeout(() => {
      setIsExpanded(false)
      // Reset form after collapse animation
      setTimeout(() => {
        setFirstName("")
        setLastName("")
        setEmail("")
        setPhone("")
        setSkillLevels([])
        setIsSuccess(false)
      }, 300)
    }, 2500)
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
            isExpanded ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {isSuccess ? (
            <div className="py-6 text-center">
              <p className="text-[#1e3a8a] font-semibold text-lg">You&apos;re on the list.</p>
              <p className="text-[#6B7280] text-sm mt-1">
                {phone.replace(/\D/g, "").length === 10
                  ? "We'll text or email you the moment a matching camp goes live."
                  : "We'll email you the moment a matching camp goes live."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="pt-4 border-t border-[#E5E7EB]">
              <div className="grid gap-4 md:grid-cols-2">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="notify-first" className="text-sm text-[#374151]">
                    First name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="notify-first"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Jordan"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value)
                      setError(null)
                    }}
                    required
                    className="border-[#D1D5DB] focus:border-[#1e3a8a] focus:ring-[#1e3a8a]"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="notify-last" className="text-sm text-[#374151]">
                    Last name <span className="text-[#9CA3AF]">(optional)</span>
                  </Label>
                  <Input
                    id="notify-last"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Lee"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border-[#D1D5DB] focus:border-[#1e3a8a] focus:ring-[#1e3a8a]"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="notify-email" className="text-sm text-[#374151]">
                    Email address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="notify-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError(null)
                    }}
                    required
                    className="border-[#D1D5DB] focus:border-[#1e3a8a] focus:ring-[#1e3a8a]"
                  />
                </div>

                {/* Cell Phone */}
                <div className="space-y-2">
                  <Label htmlFor="notify-phone" className="text-sm text-[#374151]">
                    Cell phone <span className="text-[#9CA3AF]">(optional)</span>
                  </Label>
                  <Input
                    id="notify-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="(416) 555-0142"
                    maxLength={14}
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="border-[#D1D5DB] focus:border-[#1e3a8a] focus:ring-[#1e3a8a]"
                  />
                  <p className="text-xs text-[#6B7280]">Optional — for text alerts when camps open.</p>
                </div>
              </div>

              {/* Skill Level */}
              <div className="mt-4 space-y-3">
                <Label className="text-sm text-[#374151]">
                  Skill level <span className="text-red-500">*</span>{" "}
                  <span className="text-[#9CA3AF]">(select all that apply)</span>
                </Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {SKILLS.map((level) => (
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

              {/* Error */}
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              {/* Submit Button */}
              <div className="mt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Notify Me"}
                </Button>
              </div>

              {/* Microcopy */}
              <p className="mt-4 text-xs text-[#6B7280]">
                We&apos;ll only email you when a camp matching your level goes live. No spam.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
