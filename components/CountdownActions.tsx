"use client"
import { usePathname } from "next/navigation"
import type React from "react"

import { useState } from "react"
import { googleCalendarUrl } from "@/lib/calendarLinks"

const OPEN_AT = process.env.NEXT_PUBLIC_OPEN_AT_ISO!

export default function CountdownActions() {
  const pathname = usePathname()
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : "")
  const shareUrl = `${siteUrl}${pathname || "/pickleball-camps"}`

  const gcalHref = googleCalendarUrl({ openAtISO: OPEN_AT })
  const icsHref = "/api/calendar.ics"

  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setMessage("")
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok || !data?.ok) throw new Error()
      setStatus("success")
      setMessage("Thanks! We'll notify you when registration opens.")
      setEmail("")
    } catch {
      setStatus("error")
      setMessage("Hmm, that didn't go through. Please try again.")
    }
  }

  async function onShare() {
    const shareData = {
      title: "Breakaway Pickleball Camp — Registration Opens",
      text: "Get ready — registration opens soon!",
      url: shareUrl,
    }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareUrl)
      alert("Link copied!")
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <a
          href={gcalHref}
          className="rounded-md px-4 py-2 font-medium text-white bg-blue-900 hover:bg-blue-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Calendar
        </a>
        <button
          type="button"
          onClick={onShare}
          className="rounded-md px-4 py-2 font-medium text-white bg-blue-900 hover:bg-blue-700"
        >
          Share
        </button>
      </div>

      <form onSubmit={submit} className="flex gap-3 items-start">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-md border px-3 py-2"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-md px-4 py-2 font-medium text-white bg-blue-900 whitespace-nowrap"
        >
          {status === "loading" ? "Submitting..." : <span className="hidden sm:inline">Notify me</span>}
          {status === "loading" ? "" : <span className="sm:hidden">Notify</span>}
        </button>
      </form>

      {status === "success" && <p className="text-green-700">{message}</p>}
      {status === "error" && <p className="text-red-600">{message}</p>}
    </div>
  )
}
