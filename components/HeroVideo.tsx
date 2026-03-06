"use client"

import { useRef, useEffect } from "react"

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Ensure muted (required for autoplay in browsers)
    video.muted = true

    const playVideo = async () => {
      try {
        await video.play()
      } catch {
        // Autoplay blocked - video will show poster instead
      }
    }

    // Try playing immediately
    playVideo()

    // Also try when video data is loaded
    video.addEventListener("canplay", playVideo)
    video.addEventListener("loadeddata", playVideo)

    return () => {
      video.removeEventListener("canplay", playVideo)
      video.removeEventListener("loadeddata", playVideo)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      src="/images/joey-coaching-hero.mp4"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster="/images/joey-video-poster.jpg"
      className="absolute inset-0 w-full h-full object-cover object-top"
    />
  )
}
