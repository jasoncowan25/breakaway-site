import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "U18 Waiver | Breakaway Pickleball Camps",
  description: "Review the Breakaway Pickleball Camps U18 (minor) parent/guardian waiver and assumption of risk.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function WaiverU18Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
