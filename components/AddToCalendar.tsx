"use client"

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react"
import { createPortal } from "react-dom"

import { Icon } from "./Icon"
import {
  buildCampCalendarDownload,
  buildGoogleCalendarUrl,
  buildOutlookCalendarUrl,
  type AddToCalendarEvent,
} from "@/lib/calendar"

type AddToCalendarProps = {
  event: AddToCalendarEvent | null
  className?: string
}

type PopoverPosition = {
  left: number
  top: number
}

export function AddToCalendar({ event, className = "b ghost" }: AddToCalendarProps) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<PopoverPosition | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const download = useMemo(() => (event ? buildCampCalendarDownload(event) : null), [event])

  const place = () => {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const width = 256
    const height = 252
    const margin = 12
    let left = Math.min(rect.left, window.innerWidth - width - margin)
    left = Math.max(margin, left)
    let top = rect.bottom + 8

    if (top + height > window.innerHeight - margin && rect.top - 8 - height > margin) {
      top = rect.top - 8 - height
    }

    top = Math.min(top, window.innerHeight - height - margin)
    top = Math.max(margin, top)
    setPosition({ left, top })
  }

  useEffect(() => {
    if (!open) return

    const reflow = () => place()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    window.addEventListener("resize", reflow)
    window.addEventListener("scroll", reflow, true)
    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("resize", reflow)
      window.removeEventListener("scroll", reflow, true)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  if (!event || !download) {
    return (
      <button className={className} type="button" disabled>
        <Icon name="cal" size={16} /> Add to Calendar
      </button>
    )
  }

  const choose = (run: () => void) => (clickEvent: MouseEvent<HTMLButtonElement>) => {
    clickEvent.stopPropagation()
    run()
    setOpen(false)
  }

  const items = [
    {
      label: "Google Calendar",
      run: () => window.open(buildGoogleCalendarUrl(event), "_blank", "noopener"),
    },
    {
      label: "Outlook",
      run: () => window.open(buildOutlookCalendarUrl(event), "_blank", "noopener"),
    },
    {
      label: "Apple Calendar",
      sub: "Downloads an .ics file",
      run: () => {
        const link = document.createElement("a")
        link.href = download.href
        link.download = download.filename
        document.body.appendChild(link)
        link.click()
        link.remove()
      },
    },
  ]

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={className}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(clickEvent) => {
          clickEvent.stopPropagation()
          if (!open) place()
          setOpen((value) => !value)
        }}
      >
        <Icon name="cal" size={16} /> Add to Calendar
      </button>
      {open && position
        ? createPortal(
            <>
              <div
                className="cal-pop-backdrop"
                onClick={(clickEvent) => {
                  clickEvent.stopPropagation()
                  setOpen(false)
                }}
              />
              <div
                className="cal-pop"
                role="menu"
                style={{ left: position.left, top: position.top }}
                onClick={(clickEvent) => clickEvent.stopPropagation()}
              >
                <div className="cal-pop-head">
                  <span className="cal-pop-ttl">Add to your calendar</span>
                  <span className="cal-pop-sub">
                    <Icon name="cal" size={13} />
                    {event.datesLabel || "Camp dates"} · {event.timeLabel || "9:00 AM - 3:00 PM"}
                  </span>
                </div>
                {items.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className="cal-pop-item"
                    role="menuitem"
                    onClick={choose(item.run)}
                  >
                    <span className="cal-pop-ic">
                      <Icon name={item.sub ? "cal" : "arrow"} size={16} />
                    </span>
                    <span className="cal-pop-lbl">
                      {item.label}
                      {item.sub ? <span className="cal-pop-isub">{item.sub}</span> : null}
                    </span>
                    <span className="cal-pop-arr">
                      <Icon name="arrow" size={16} />
                    </span>
                  </button>
                ))}
              </div>
            </>,
            document.body,
          )
        : null}
    </>
  )
}
