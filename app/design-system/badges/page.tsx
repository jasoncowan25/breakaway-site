"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, MapPin } from "lucide-react"

export default function BadgeDesignSystemPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Badge Design System</h1>
          <p className="text-muted-foreground">
            Reference for all badge variants used across the Breakaway Pickleball site.
          </p>
        </div>

        {/* Base Badge Variants */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">Base Variants</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Core badge variants from the shadcn/ui Badge component.
          </p>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-6">
                <div className="space-y-2 text-center">
                  <Badge variant="default">Default</Badge>
                  <p className="text-xs text-muted-foreground">default</p>
                </div>
                <div className="space-y-2 text-center">
                  <Badge variant="secondary">Secondary</Badge>
                  <p className="text-xs text-muted-foreground">secondary</p>
                </div>
                <div className="space-y-2 text-center">
                  <Badge variant="accent">Accent</Badge>
                  <p className="text-xs text-muted-foreground">accent</p>
                </div>
                <div className="space-y-2 text-center">
                  <Badge variant="destructive">Destructive</Badge>
                  <p className="text-xs text-muted-foreground">destructive</p>
                </div>
                <div className="space-y-2 text-center">
                  <Badge variant="outline">Outline</Badge>
                  <p className="text-xs text-muted-foreground">outline</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Camp Level Badges */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">Camp Level Badges</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Used to indicate skill level requirements for camps.
          </p>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4">
                <div className="space-y-2 text-center">
                  <Badge variant="secondary">Fundamentals (Under 3.0)</Badge>
                  <p className="text-xs text-muted-foreground">secondary</p>
                </div>
                <div className="space-y-2 text-center">
                  <Badge variant="secondary">Intermediate (3.0+)</Badge>
                  <p className="text-xs text-muted-foreground">secondary</p>
                </div>
                <div className="space-y-2 text-center">
                  <Badge variant="secondary">Advanced (3.5+)</Badge>
                  <p className="text-xs text-muted-foreground">secondary</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Status Badges */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">Status Badges</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Used to indicate camp status like new offerings, limited availability, or sold out.
          </p>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4">
                <div className="space-y-2 text-center">
                  <Badge className="bg-accent text-accent-foreground">New</Badge>
                  <p className="text-xs text-muted-foreground">accent (custom)</p>
                </div>
                <div className="space-y-2 text-center">
                  <Badge className="bg-accent text-accent-foreground">One Spot Left</Badge>
                  <p className="text-xs text-muted-foreground">accent (custom)</p>
                </div>
                <div className="space-y-2 text-center">
                  <Badge variant="destructive">Sold Out</Badge>
                  <p className="text-xs text-muted-foreground">destructive</p>
                </div>
                <div className="space-y-2 text-center">
                  <Badge className="bg-primary text-primary-foreground">Past Camp</Badge>
                  <p className="text-xs text-muted-foreground">primary (custom)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Age/Audience Badges */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">Audience Badges</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Used to indicate target audience or age groups.
          </p>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4">
                <div className="space-y-2 text-center">
                  <Badge className="bg-accent text-accent-foreground">Ages 8-16</Badge>
                  <p className="text-xs text-muted-foreground">accent (custom)</p>
                </div>
                <div className="space-y-2 text-center">
                  <Badge variant="secondary">Adults</Badge>
                  <p className="text-xs text-muted-foreground">secondary</p>
                </div>
                <div className="space-y-2 text-center">
                  <Badge variant="secondary">All Ages</Badge>
                  <p className="text-xs text-muted-foreground">secondary</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Availability Badges */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">Availability Badges</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Dynamic badges showing remaining spots for camp sessions.
          </p>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <div className="space-y-2 text-center">
                  <Badge variant="outline" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />4 Spots Left
                  </Badge>
                  <p className="text-xs text-muted-foreground">outline (default)</p>
                </div>
                <div className="space-y-2 text-center">
                  <Badge variant="outline" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />3 Spots Left
                  </Badge>
                  <p className="text-xs text-muted-foreground">outline (default)</p>
                </div>
                <div className="space-y-2 text-center">
                  <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">
                    <Users className="h-3 w-3 mr-1" />2 Spots Left
                  </Badge>
                  <p className="text-xs text-muted-foreground">outline + orange</p>
                </div>
                <div className="space-y-2 text-center">
                  <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">
                    <Users className="h-3 w-3 mr-1" />1 Spot Left
                  </Badge>
                  <p className="text-xs text-muted-foreground">outline + orange</p>
                </div>
                <div className="space-y-2 text-center">
                  <Badge variant="destructive" className="text-xs">
                    Sold Out
                  </Badge>
                  <p className="text-xs text-muted-foreground">destructive</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Card Image Badges */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">Card Image Overlay Badges</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Badges positioned on card images to highlight key info.
          </p>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4">
                <div className="space-y-2 text-center">
                  <Badge className="bg-red-600 text-white">Sold Out</Badge>
                  <p className="text-xs text-muted-foreground">custom red</p>
                </div>
                <div className="space-y-2 text-center">
                  <Badge className="bg-primary text-primary-foreground">Recap Available</Badge>
                  <p className="text-xs text-muted-foreground">primary (custom)</p>
                </div>
                <div className="space-y-2 text-center">
                  <Badge variant="secondary">Upcoming</Badge>
                  <p className="text-xs text-muted-foreground">secondary</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Full Card Examples */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">Full Card Examples</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Examples of badges in context within camp cards.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Available - 4 spots */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Intermediate (3.0+)</Badge>
                  <Badge variant="outline" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />4 Spots Left
                  </Badge>
                </div>
                <CardTitle className="text-lg">Intermediate Camp</CardTitle>
                <CardDescription>July 10-12, 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-2xl font-bold text-primary">$800 CAD</span>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Book</Button>
                </div>
              </CardContent>
            </Card>

            {/* Low Stock - 2 spots */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Fundamentals (Under 3.0)</Badge>
                  <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">
                    <Users className="h-3 w-3 mr-1" />2 Spots Left
                  </Badge>
                </div>
                <CardTitle className="text-lg">Fundamentals Camp</CardTitle>
                <CardDescription>July 13-15, 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-2xl font-bold text-primary">$800 CAD</span>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Book</Button>
                </div>
              </CardContent>
            </Card>

            {/* Last Spot */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Intermediate (3.0+)</Badge>
                  <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">
                    <Users className="h-3 w-3 mr-1" />1 Spot Left
                  </Badge>
                </div>
                <CardTitle className="text-lg">Intermediate Camp</CardTitle>
                <CardDescription>July 17-19, 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-2xl font-bold text-primary">$800 CAD</span>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Book</Button>
                </div>
              </CardContent>
            </Card>

            {/* Sold Out */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Intermediate (3.0+)</Badge>
                  <Badge variant="destructive" className="text-xs">Sold Out</Badge>
                </div>
                <CardTitle className="text-lg">Intermediate Camp</CardTitle>
                <CardDescription>July 10-12, 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-2xl font-bold text-primary">$800 CAD</span>
                  <Button disabled variant="outline">Sold Out</Button>
                </div>
              </CardContent>
            </Card>

            {/* New Camp */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-accent text-accent-foreground">New</Badge>
                  <Badge variant="outline" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />4 Spots Left
                  </Badge>
                </div>
                <CardTitle className="text-lg">Core Skills Intensive</CardTitle>
                <CardDescription>May 23-24, 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-2xl font-bold text-primary">$675 CAD</span>
                  <Button className="bg-primary hover:bg-primary/90 text-white">Book Camp</Button>
                </div>
              </CardContent>
            </Card>

            {/* Kids Camp */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-accent text-accent-foreground">Ages 8-16</Badge>
                  <Badge variant="destructive" className="text-xs">Sold Out</Badge>
                </div>
                <CardTitle className="text-lg">Kids Passover Camp</CardTitle>
                <CardDescription>April 7-10, 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-2xl font-bold text-primary">$472 CAD</span>
                  <Button disabled variant="outline">Sold Out</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">Usage Guidelines</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-primary mb-2">Availability Badges</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>4 spots: Default outline style</li>
                  <li>3 spots: Default outline style</li>
                  <li>2 spots: Orange border/text to indicate urgency</li>
                  <li>1 spot: Orange border/text to indicate high urgency</li>
                  <li>0 spots: Red destructive badge with "Sold Out" text</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">Level Badges</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Use <code className="bg-muted px-1 rounded">secondary</code> variant for all skill level badges</li>
                  <li>Include DUPR rating range in parentheses when applicable</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">Status Badges</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Use <code className="bg-muted px-1 rounded">accent</code> for positive statuses (New, Ages 8-16)</li>
                  <li>Use <code className="bg-muted px-1 rounded">destructive</code> for sold out status</li>
                  <li>Use <code className="bg-muted px-1 rounded">primary</code> for neutral info (Past Camp, Recap Available)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Color Reference */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">Color Reference</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <div className="h-12 rounded bg-primary" />
                  <p className="text-xs text-muted-foreground">Primary (Navy)</p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 rounded bg-secondary" />
                  <p className="text-xs text-muted-foreground">Secondary (Gray)</p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 rounded bg-accent" />
                  <p className="text-xs text-muted-foreground">Accent (Lime)</p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 rounded bg-destructive" />
                  <p className="text-xs text-muted-foreground">Destructive (Red)</p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 rounded bg-orange-500" />
                  <p className="text-xs text-muted-foreground">Orange (Low Stock)</p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 rounded border-2 border-border" />
                  <p className="text-xs text-muted-foreground">Outline (Border)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
