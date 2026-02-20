import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Waiver Sign | Breakaway Pickleball Camps",
  description: "Confirm your waiver acceptance for Breakaway Pickleball Camps",
  robots: {
    index: false,
    follow: false,
  },
}

export default function WaiverSignLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <meta httpEquiv="X-Robots-Tag" content="noindex, nofollow" />
      {children}
    </>
  )
}
