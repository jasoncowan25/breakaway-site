"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"

import { Footer } from "@/components/Footer"
import { Navigation } from "@/components/Navigation"
import type { PublicCampNavItem } from "@/lib/public-camps"
import { shouldRenderSiteChrome } from "@/lib/site-chrome"

export function SiteChrome({
  children,
  campItems,
}: {
  children: ReactNode
  campItems: PublicCampNavItem[]
}) {
  const pathname = usePathname()

  if (!shouldRenderSiteChrome(pathname)) return <>{children}</>

  return (
    <>
      <Navigation campItems={campItems} />
      {children}
      <Footer />
    </>
  )
}
