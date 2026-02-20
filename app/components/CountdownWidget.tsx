"use client"
import { useEffect, useMemo, useState } from "react"
import { getTargetDate, diffParts, formatOpenLabel } from "@/app/lib/countdown"

export default function CountdownWidget() {
  const target = useMemo(getTargetDate, [])
  const [now, setNow] = useState<number>(() => Date.now())

  // Set the label once (or when target changes)
  useEffect(() => {
    const el = document.getElementById("cd-open-label")
    if (el) el.textContent = target ? formatOpenLabel(target) : "Opens: TBA"
  }, [target])

  // Tick every second if we have a valid target
  useEffect(() => {
    if (!target) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])

  // Update numbers or switch to OPEN/TBA states
  useEffect(() => {
    const wrap = document.getElementById("cd-wrapper") as HTMLElement | null
    if (!wrap) return

    const cells = [
      document.getElementById("cd-days")?.parentElement,
      document.getElementById("cd-hours")?.parentElement,
      document.getElementById("cd-minutes")?.parentElement,
      document.getElementById("cd-seconds")?.parentElement,
    ].filter(Boolean) as HTMLElement[]

    const showCells = (show: boolean) => cells.forEach((c) => (c.style.display = show ? "" : "none"))

    if (!target) {
      showCells(false)
      return
    }

    const remaining = target.getTime() - now
    if (remaining <= 0) {
      showCells(false)
      if (!document.getElementById("cd-open-msg")) {
        const msg = document.createElement("div")
        msg.id = "cd-open-msg"
        msg.className = "text-2xl font-bold text-green-600"
        msg.textContent = "Registration is now OPEN!"
        wrap.appendChild(msg)
      }
      return
    }

    showCells(true)
    const { days, hours, minutes, seconds } = diffParts(now, target.getTime())
    const setTxt = (id: string, v: string | number) => {
      const el = document.getElementById(id)
      if (el) el.textContent = String(v)
    }
    setTxt("cd-days", days)
    setTxt("cd-hours", String(hours).padStart(2, "0"))
    setTxt("cd-minutes", String(minutes).padStart(2, "0"))
    setTxt("cd-seconds", String(seconds).padStart(2, "0"))
  }, [now, target])

  return null // No new markup; we only bind to existing DOM
}
