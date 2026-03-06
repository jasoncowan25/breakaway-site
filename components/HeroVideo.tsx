"use client"

// YouTube video ID extracted from https://youtu.be/FrCsK8RlN28
const YOUTUBE_VIDEO_ID = "FrCsK8RlN28"

export function HeroVideo() {
  // YouTube embed with autoplay, mute, loop, no controls for background video effect
  // playlist param set to same video ID enables looping
  const embedUrl = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&disablekb=1`

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Scale up iframe to hide YouTube UI and create full-bleed effect */}
      <iframe
        src={embedUrl}
        title="Breakaway Pickleball Camp"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[200%] min-w-[100vw] min-h-[100vh] pointer-events-none"
        style={{ border: 0 }}
      />
    </div>
  )
}
