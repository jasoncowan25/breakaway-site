"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Share2, ExternalLink, Copy, MessageCircle, Mail } from "lucide-react"
import { AddToCalendar } from "@/components/AddToCalendar"
import { EVENT_TITLE, REGISTRATION_OPEN_AT, SITE_URL } from "@/lib/launch"

interface ActionRowProps {
  className?: string
}

export function ActionRow({ className }: ActionRowProps) {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const registrationEnd = new Date(REGISTRATION_OPEN_AT.getTime() + 30 * 60 * 1000)

  const calendarEvent = {
    id: "registration-opens",
    title: EVENT_TITLE,
    startAt: REGISTRATION_OPEN_AT,
    endAt: registrationEnd,
    description: `${SITE_URL} - Limited to 16 spots. First come, first serve.`,
    url: SITE_URL,
    datesLabel: "Registration opens",
    timeLabel: REGISTRATION_OPEN_AT.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }),
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: EVENT_TITLE,
          text: "Join me at the Breakaway Pickleball Camp! Registration opens soon.",
          url: SITE_URL,
        })
        setShowShareMenu(false)
      } catch (error) {
        // User cancelled or error occurred, show fallback menu
        setShowShareMenu(true)
      }
    } else {
      setShowShareMenu(true)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(SITE_URL)
      setShowShareMenu(false)
    } catch (error) {
      console.error("Failed to copy link:", error)
    }
  }

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Join me at the Breakaway Pickleball Camp! ${SITE_URL}`)}`,
    messenger: `https://www.messenger.com/t/?link=${encodeURIComponent(SITE_URL)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join me at the Breakaway Pickleball Camp!`)}&url=${encodeURIComponent(SITE_URL)}`,
    email: `mailto:?subject=${encodeURIComponent(EVENT_TITLE)}&body=${encodeURIComponent(`Join me at the Breakaway Pickleball Camp! ${SITE_URL}`)}`,
  }

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <div className="relative">
        <AddToCalendar
          event={calendarEvent}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-primary ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
        />
      </div>

      <div className="relative">
        <Button
          variant="outline"
          onClick={handleShare}
          aria-label="Share registration page"
          className="w-full sm:w-auto focus-visible:ring-2 focus-visible:ring-primary bg-transparent"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>

        {showShareMenu && (
          <Card className="absolute top-full mt-2 z-10 w-48 shadow-lg">
            <CardContent className="p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyLink}
                className="w-full justify-start"
                aria-label="Copy link to clipboard"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(shareLinks.whatsapp, "_blank")}
                className="w-full justify-start"
                aria-label="Share on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(shareLinks.messenger, "_blank")}
                className="w-full justify-start"
                aria-label="Share on Messenger"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Messenger
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(shareLinks.twitter, "_blank")}
                className="w-full justify-start"
                aria-label="Share on X (Twitter)"
              >
                <ExternalLink className="w-4 h-4 mr-2" />X / Twitter
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(shareLinks.email, "_blank")}
                className="w-full justify-start"
                aria-label="Share via email"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Click outside to close menus */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowShareMenu(false)
          }}
        />
      )}
    </div>
  )
}
