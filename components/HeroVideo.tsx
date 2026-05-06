"use client"

export function HeroVideo() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#1e3a8a]">
      {/* Local MP4 video with autoplay, mute, loop for background effect */}
      {/* Centered vertically to show the main action */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover object-center"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      
      {/* Dark navy blue overlay on the left side - lighter gradient for better video visibility */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to right, #1e3a8a 0%, #1e3a8a 10%, rgba(30, 58, 138, 0.6) 25%, rgba(30, 58, 138, 0.2) 40%, transparent 55%)"
        }}
        aria-hidden="true" 
      />
      
      {/* Reduced overall darkening for better video visibility */}
      <div 
        className="absolute inset-0 z-10 bg-black/15 pointer-events-none"
        aria-hidden="true" 
      />
    </div>
  )
}
