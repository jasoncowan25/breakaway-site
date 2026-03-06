"use client"

import { useRef, useEffect } from "react"

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Ensure muted (required for autoplay)
    video.muted = true

    const playVideo = async () => {
      try {
        await video.play()
      } catch (err) {
        // Autoplay was prevented, retry after interaction
        console.log("[v0] Video autoplay blocked, waiting for interaction")
      }
    }

    // Try playing immediately
    playVideo()

    // Also try on canplay event in case video wasn't loaded yet
    video.addEventListener("canplay", playVideo)

    return () => {
      video.removeEventListener("canplay", playVideo)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster="/images/joey-video-poster.jpg"
      className="absolute inset-0 w-full h-full object-cover object-top"
    >
      <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_dNRbXKeOHgjR8Yf7RyWy7VpFVGjy/ZG-enGq8hhvV9X9uslBRgV/public/images/joey-coaching-hero.mp4" type="video/mp4" />
    </video>
  )
}
