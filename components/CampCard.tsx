import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Calendar, Users, Palmtree } from "lucide-react"
import Image from "next/image"

interface CampCardProps {
  id: string
  title: string
  date: string
  location: string
  price: string
  image: string
  badges?: Array<{ text: string; variant: "default" | "destructive" | "secondary" | "accent" }>
  coach?: string
  link?: string // Added optional link prop to override default camp URL
  buttonText?: string // Added buttonText prop to customize Book Camp button
  imageEnhanced?: boolean // Apply CSS filters to enhance image colors
  compact?: boolean // Simplified card format for recaps - no price, location, coach
  spotsRemaining?: number // Number of spots remaining for availability display
  isLoadingAvailability?: boolean // Show skeleton while loading availability
  soldOut?: boolean // Whether the camp is sold out
}

export function CampCard({ id, title, date, location, price, image, badges, coach, link, buttonText, imageEnhanced, compact, spotsRemaining, isLoadingAvailability, soldOut }: CampCardProps) {
  const campLink = link || `/pickleball-camps/${id}`
  const showAvailability = spotsRemaining !== undefined || isLoadingAvailability

  return (
    <Link href={campLink} scroll={true} className="group">
      <div className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow">
        {/* Image with badges */}
        <div className="relative h-48 bg-muted">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${imageEnhanced ? "saturate-[1.15] contrast-[1.05] brightness-[1.02]" : ""}`}
          />
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            {/* Left side badges */}
            {badges && badges.length > 0 && (
              <div className="flex flex-col gap-2">
                {badges.filter(b => b.text !== "4 Players Max" && !b.text.includes("Spots Left") && b.text !== "Sold Out").map((badge, idx) => (
                  <Badge
                    key={idx}
                    variant={badge.variant === "accent" ? "default" : badge.variant}
                    className={`flex items-center gap-1 ${
                      badge.variant === "destructive"
                        ? "bg-red-600 text-white"
                        : badge.variant === "secondary"
                          ? "bg-primary text-primary-foreground"
                          : badge.variant === "accent"
                            ? "bg-accent text-accent-foreground"
                            : ""
                    }`}
                  >
                    {badge.text === "Destination" && <Palmtree className="h-3 w-3" />}
                    {badge.text}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Right side availability badge */}
            {showAvailability && (
              <div className="ml-auto">
                {isLoadingAvailability ? (
                  <Skeleton className="h-5 w-20" />
                ) : soldOut ? (
                  <Badge variant="destructive" className="text-xs bg-red-600 text-white">
                    Sold Out
                  </Badge>
                ) : spotsRemaining !== undefined ? (
                  <Badge 
                    variant="outline" 
                    className={`text-xs bg-white/90 ${spotsRemaining <= 2 ? "border-orange-500 text-orange-600" : "border-border text-foreground"}`}
                  >
                    <Users className="h-3 w-3 mr-1" />
                    {spotsRemaining} {spotsRemaining === 1 ? "Spot" : "Spots"} Left
                  </Badge>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-accent transition-colors whitespace-pre-line">{title}</h3>

          {!compact && coach && <p className="text-sm text-muted-foreground mb-2">with {coach}</p>}

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>

          {!compact && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          )}

          {/* Footer */}
          <div className={`flex items-center justify-between ${compact ? "pt-2" : "pt-4 border-t border-border"}`}>
            {!compact && <span className="text-2xl font-bold text-primary">{price}</span>}
            <Button
              variant="outline"
              className={`border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent ${compact ? "w-full" : ""}`}
            >
              {buttonText || "Book Camp"}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
