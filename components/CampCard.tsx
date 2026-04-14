import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar } from "lucide-react"
import Image from "next/image"

interface CampCardProps {
  id: string
  title: string
  date: string
  location: string
  price: string
  image: string
  badges?: Array<{ text: string; variant: "default" | "destructive" | "secondary" }>
  coach?: string
  link?: string // Added optional link prop to override default camp URL
  buttonText?: string // Added buttonText prop to customize Book Camp button
  imageEnhanced?: boolean // Apply CSS filters to enhance image colors
  compact?: boolean // Simplified card format for recaps - no price, location, coach
}

export function CampCard({ id, title, date, location, price, image, badges, coach, link, buttonText, imageEnhanced, compact }: CampCardProps) {
  const campLink = link || `/pickleball-camps/${id}`

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
          {badges && badges.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {badges.map((badge, idx) => (
                <Badge
                  key={idx}
                  variant={badge.variant}
                  className={
                    badge.variant === "destructive"
                      ? "bg-red-600 text-white"
                      : badge.variant === "secondary"
                        ? "bg-primary text-primary-foreground"
                        : ""
                  }
                >
                  {badge.text}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-accent transition-colors">{title}</h3>

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
