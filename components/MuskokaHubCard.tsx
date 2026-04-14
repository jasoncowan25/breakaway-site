"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MapPin, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface MuskokaHubCardProps {
  className?: string
}

export function MuskokaHubCard({ className }: MuskokaHubCardProps) {
  return (
    <Link
      href="/pickleball-camps/muskoka"
      className={cn(
        "group block",
        className
      )}
    >
      <div className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow">
        {/* Image with badges - same structure as CampCard */}
        <div className="relative h-48 bg-muted">
          <Image
            src="/muskoka-photos/muskoka-court-indoor.jpg"
            alt="Muskoka private indoor pickleball facility"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge variant="default" className="bg-accent text-accent-foreground">
              Just Announced
            </Badge>
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              Joey Signature
            </Badge>
          </div>
        </div>

        {/* Content - matching CampCard structure */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-accent transition-colors">
            Muskoka Summer Camps (3.0+ & Under 3.0)
          </h3>

          <p className="text-sm text-muted-foreground mb-2">with Joey Manchurek</p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            <span>Jul 10-12, Jul 13-15, Jul 17-19</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <MapPin className="h-4 w-4" />
            <span>Private Facility, Muskoka</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <span className="text-sm text-muted-foreground">From </span>
              <span className="text-2xl font-bold text-primary">$800 CAD</span>
            </div>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
            >
              View Camps <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
