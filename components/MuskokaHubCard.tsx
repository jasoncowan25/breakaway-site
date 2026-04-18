"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
        "group relative overflow-hidden rounded-lg bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col",
        className
      )}
    >
      {/* Top: Image */}
      <div className="relative h-48">
        <img
          src="/muskoka-photos/muskoka-path.jpg"
          alt="Muskoka cottage country autumn scenery"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge variant="accent">Just Announced</Badge>
          <Badge variant="default">Joey Signature</Badge>
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge variant="secondary">New Private Facility</Badge>
        </div>
      </div>

      {/* Bottom: Content */}
      <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
        <div>
          
          <h3 className="text-xl md:text-2xl font-bold text-primary mb-2">Muskoka Adult Pickleball Camps</h3>
          <p className="text-muted-foreground text-sm mb-4">
            with Joey Manchurek at our private Muskoka facility
          </p>

          {/* Stat chips */}
          

          {/* Date strip */}
          <p className="text-xs text-muted-foreground">
            July 10–12 · July 13–15 · July 17–19
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
    </Link>
  )
}
