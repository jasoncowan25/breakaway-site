import type React from "react"
export default function WaiverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

export async function generateMetadata() {
  return {
    other: {
      "X-Robots-Tag": "noindex, nofollow",
    },
  }
}
