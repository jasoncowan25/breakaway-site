"use client"

export function HeroVideo() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#1e3a8a]">
      {/* Local MP4 video with autoplay, mute, loop for background effect */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      
      {/* Dark navy blue overlay on the left side - gradient from solid to transparent */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to right, #1e3a8a 0%, #1e3a8a 15%, rgba(30, 58, 138, 0.85) 30%, rgba(30, 58, 138, 0.4) 50%, transparent 70%)"
        }}
        aria-hidden="true" 
      />
      
      {/* Additional overall darkening for text readability */}
      <div 
        className="absolute inset-0 z-10 bg-black/30 pointer-events-none"
        aria-hidden="true" 
      />
    </div>
  )
}
