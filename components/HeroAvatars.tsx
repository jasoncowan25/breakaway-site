"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const coaches = [{ name: "Joey Manchurek", image: "/coach-joey.jpg", position: "object-top", slug: "joey-manchurek" }]

export function HeroAvatars() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="flex justify-center mb-2">
      {coaches.map((coach, index) => (
        <div
          key={coach.name}
          className="relative"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <Link href={`/pickleball-coaches#${coach.slug}`}>
            <div
              className={`relative w-[34px] h-[34px] rounded-full border-2 border-white overflow-hidden transition-transform duration-200 cursor-pointer ${
                hoveredIndex === index ? "scale-125 z-10" : ""
              }`}
            >
              <Image
                src={coach.image || "/placeholder.svg"}
                alt={coach.name}
                fill
                className={`object-cover ${coach.position}`}
              />
            </div>
          </Link>

          {/* Tooltip */}
          {hoveredIndex === index && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-white text-primary text-sm font-medium rounded-md shadow-lg whitespace-nowrap z-20">
              {coach.name}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
