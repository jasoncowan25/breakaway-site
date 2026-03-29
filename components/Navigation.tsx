"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/breakaway-text-logo-tight.png"
              alt="Breakaway Pickleball Camps"
              width={200}
              height={50}
              className="h-10 w-auto mb-0 mt-1"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Camps <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/pickleball-camps">All Camps</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pickleball-camps/toronto-beginner-pickleball-camp">Toronto Beginner Intensive</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pickleball-camps/toronto-intermediate-pickleball-camp">Toronto Intermediate Intensive</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pickleball-camps/kids-passover-pickleball-camp-toronto">Kids Passover Camp</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/pickleball-coaches" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Coaches
            </Link>
            <Link
              href="/pickleball-camp-experience"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              The Experience
            </Link>
            {/* <Link href="/schedule" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Schedule
            </Link> */}
          </div>

          {/* CTA Button */}
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/pickleball-camps">Find Your Camp</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
