"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface CountdownProps {
  target: Date
  onOpen?: () => void
  children?: React.ReactNode
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function Countdown({ target, onOpen, children }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isOpen, setIsOpen] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    try {
      console.log("[v0] Countdown useEffect - target:", target)
      console.log("[v0] Countdown useEffect - target type:", typeof target)
      console.log("[v0] Countdown useEffect - is Date:", target instanceof Date)

      // Early return if target is invalid
      if (!target) {
        console.log("[v0] Target is falsy, returning early")
        setHasError(true)
        return
      }

      if (!(target instanceof Date)) {
        console.log("[v0] Target is not a Date instance, returning early")
        setHasError(true)
        return
      }

      if (isNaN(target.getTime())) {
        console.log("[v0] Target is invalid Date, returning early")
        setHasError(true)
        return
      }

      // Reset error state if we get here
      setHasError(false)

      const calculateTimeLeft = (): TimeLeft => {
        try {
          const difference = target.getTime() - new Date().getTime()

          if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 }
          }

          return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          }
        } catch (error) {
          console.log("[v0] Error in calculateTimeLeft:", error)
          return { days: 0, hours: 0, minutes: 0, seconds: 0 }
        }
      }

      const timer = setInterval(() => {
        try {
          const newTimeLeft = calculateTimeLeft()
          setTimeLeft(newTimeLeft)

          // Check if countdown has reached zero
          if (
            newTimeLeft.days === 0 &&
            newTimeLeft.hours === 0 &&
            newTimeLeft.minutes === 0 &&
            newTimeLeft.seconds === 0 &&
            !isOpen
          ) {
            setIsOpen(true)
            onOpen?.()
            clearInterval(timer)
          }
        } catch (error) {
          console.log("[v0] Error in timer interval:", error)
          clearInterval(timer)
        }
      }, 1000)

      // Initial calculation
      const initialTimeLeft = calculateTimeLeft()
      setTimeLeft(initialTimeLeft)

      // Check if already open
      if (
        initialTimeLeft.days === 0 &&
        initialTimeLeft.hours === 0 &&
        initialTimeLeft.minutes === 0 &&
        initialTimeLeft.seconds === 0
      ) {
        setIsOpen(true)
        onOpen?.()
      }

      return () => clearInterval(timer)
    } catch (error) {
      console.log("[v0] Error in useEffect:", error)
      setHasError(true)
    }
  }, [target, onOpen, isOpen])

  if (hasError || !target || !(target instanceof Date) || isNaN(target.getTime())) {
    console.log("[v0] Render - Invalid target or error, showing loading")
    return (
      <div className="text-center text-gray-500">
        <p>Loading countdown...</p>
      </div>
    )
  }

  if (isOpen && children) {
    return <div aria-live="polite">{children}</div>
  }

  return (
    <div className="grid grid-cols-4 gap-4 text-center" aria-live="polite">
      <div className="flex flex-col">
        <div className="text-4xl md:text-6xl font-bold tracking-tight text-primary">
          {String(timeLeft.days).padStart(2, "0")}
        </div>
        <div className="text-xs uppercase opacity-70 mt-1">Days</div>
      </div>
      <div className="flex flex-col">
        <div className="text-4xl md:text-6xl font-bold tracking-tight text-primary">
          {String(timeLeft.hours).padStart(2, "0")}
        </div>
        <div className="text-xs uppercase opacity-70 mt-1">Hours</div>
      </div>
      <div className="flex flex-col">
        <div className="text-4xl md:text-6xl font-bold tracking-tight text-primary">
          {String(timeLeft.minutes).padStart(2, "0")}
        </div>
        <div className="text-xs uppercase opacity-70 mt-1">Minutes</div>
      </div>
      <div className="flex flex-col">
        <div className="text-4xl md:text-6xl font-bold tracking-tight text-primary">
          {String(timeLeft.seconds).padStart(2, "0")}
        </div>
        <div className="text-xs uppercase opacity-70 mt-1">Seconds</div>
      </div>
    </div>
  )
}
