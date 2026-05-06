"use client"

export function HeroVideo() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#1e3a8a]">
      {/* Local MP4 video with autoplay, mute, loop for background effect */}
      {/* Nudged up with -translate-y-[45%] instead of -50% to show more of the bottom */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] min-w-full min-h-full w-auto h-auto object-cover"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      
      {/* Dark navy blue solid block on the left side with hard diagonal edge */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          clipPath: "polygon(0 0, 25% 0, 35% 100%, 0 100%)",
          backgroundColor: "#1e3a8a"
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
