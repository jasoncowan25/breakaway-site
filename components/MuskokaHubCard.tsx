"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface MuskokaHubCardProps {
  className?: string
}

export function MuskokaHubCard({ className }: MuskokaHubCardProps) {
  return (
    <Link
      href="/pickleball-camps/muskoka"
      className={cn(
        "group relative overflow-hidden rounded-lg bg-card border-2 border-accent/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
        className
      )}
    >
      {/* Desktop: Horizontal layout */}
      <div className="hidden md:flex h-full">
        {/* Left: Image */}
        <div className="relative w-[40%] min-h-[280px]">
          <img
            src="/muskoka-photos/muskoka-court-indoor.jpg"
            alt="Muskoka private indoor pickleball court"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              6 CAMPS - JULY 2026
            </span>
            <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              JOEY MANCHUREK SIGNATURE
            </span>
          </div>
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              PRIVATE FACILITY
            </span>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-accent tracking-wide mb-1">NEW - MUSKOKA HUB</p>
            <h3 className="text-2xl font-bold text-primary mb-2">Muskoka Summer Camps with Joey</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Train with a 5.0 DUPR pro in cottage country
            </p>

            {/* Stat chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                6 CAMPS
              </span>
              <span className="inline-flex items-center rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                4 PLAYERS MAX
              </span>
              <span className="inline-flex items-center rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                3 DAYS EACH
              </span>
            </div>

            {/* Date strip */}
            <p className="text-xs text-muted-foreground">
              Jul 10-12 &middot; Jul 13-15 &middot; Jul 17-19
            </p>
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div>
              <span className="text-sm text-muted-foreground">From </span>
              <span className="text-xl font-bold text-primary">$800 CAD</span>
            </div>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 group-hover:bg-accent/90">
              Explore Camps <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile: Vertical layout */}
      <div className="md:hidden">
        {/* Image */}
        <div className="relative aspect-video">
          <img
            src="/muskoka-photos/muskoka-court-indoor.jpg"
            alt="Muskoka private indoor pickleball court"
            className="w-full h-full object-cover"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              6 CAMPS - JULY 2026
            </span>
            <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              JOEY MANCHUREK SIGNATURE
            </span>
          </div>
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              PRIVATE FACILITY
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-xs font-semibold text-accent tracking-wide mb-1">NEW - MUSKOKA HUB</p>
          <h3 className="text-2xl font-bold text-primary mb-2">Muskoka Summer Camps with Joey</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Train with a 5.0 DUPR pro in cottage country
          </p>

          {/* Stat chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              6 CAMPS
            </span>
            <span className="inline-flex items-center rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              4 PLAYERS MAX
            </span>
            <span className="inline-flex items-center rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              3 DAYS EACH
            </span>
          </div>

          {/* Date strip */}
          <p className="text-xs text-muted-foreground mb-4">
            Jul 10-12 &middot; Jul 13-15 &middot; Jul 17-19
          </p>

          {/* Price */}
          <div className="mb-4">
            <span className="text-sm text-muted-foreground">From </span>
            <span className="text-xl font-bold text-primary">$800 CAD</span>
          </div>

          {/* CTA */}
          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            Explore Camps <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  )
}
