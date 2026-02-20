"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react"

export default function WaiverSignPage() {
  const [fullName, setFullName] = useState("")
  const [accepted, setAccepted] = useState(false)
  const [honeypot, setHoneypot] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate
    if (!fullName.trim()) {
      setError("Please enter your full name")
      return
    }

    if (!accepted) {
      setError("You must accept the waiver to continue")
      return
    }

    setIsSubmitting(true)

    // Honeypot check - if filled, show success but don't send
    if (honeypot) {
      setTimeout(() => {
        setIsSubmitting(false)
        setIsSuccess(true)
      }, 1000)
      return
    }

    // Build payload
    const payload = {
      full_name: fullName.trim(),
      accepted: true,
      accepted_at: new Date().toISOString(),
      event_type: "Pickleball",
      event_dates: "January 10–11, 2026",
      venue: "The Jar Pickleball Club, 900 Caledonia Rd #5, Toronto, ON",
      waiver_version: "2026-01-05",
      source: "waiver-sign",
      page_url: typeof window !== "undefined" ? window.location.href : "",
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    }

    try {
      const response = await fetch("https://hooks.zapier.com/hooks/catch/22788039/uw8aplq/", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      setIsSuccess(true)
    } catch (err) {
      console.error("[v0] Waiver submission error:", err)
      setError("Something went wrong submitting your waiver. Please try again.")
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="mx-auto max-w-[560px]">
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <div className="mb-4 flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-lime-400" />
            </div>
            <h1 className="mb-3 font-serif text-2xl font-semibold text-foreground">
              Thanks — your waiver has been recorded
            </h1>
            <p className="text-muted-foreground">No further action is required. We'll see you on court.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="mx-auto max-w-[560px]">
        <div className="mb-8 text-center">
          <h1 className="mb-3 font-serif text-3xl font-bold text-foreground">Complete your waiver</h1>
          <p className="text-muted-foreground">
            Please confirm your waiver acceptance below. This is required to participate in the camp.
          </p>
        </div>

        <div className="mb-6 text-center">
          <Link
            href="/waiver"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-950 underline underline-offset-4 hover:text-blue-800"
          >
            View the full waiver
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-border bg-card p-8">
          {/* Honeypot field - hidden from users */}
          <div style={{ position: "absolute", left: "-9999px" }}>
            <label htmlFor="company">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Checkbox
                id="accept"
                checked={accepted}
                onCheckedChange={(checked) => setAccepted(checked === true)}
                disabled={isSubmitting}
                className="mt-0.5"
              />
              <Label htmlFor="accept" className="cursor-pointer text-sm leading-relaxed text-foreground">
                I have read and agree to the Breakaway Pickleball Camps Release of Liability, Waiver of Claims &
                Assumption of Risk.
              </Label>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={!accepted || isSubmitting}
            size="lg"
            className="w-full bg-lime-400 hover:bg-lime-500 text-blue-950 font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "I Agree & Submit"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
