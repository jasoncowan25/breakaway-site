"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CampCard } from "@/components/CampCard"
import { MuskokaHubCard } from "@/components/MuskokaHubCard"
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react"
import Link from "next/link"

export default function CardsDesignSystemPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Camp Cards Design System</h1>
          <p className="text-muted-foreground">
            Reference for camp card variants and button patterns used across the Breakaway Pickleball site.
          </p>
        </div>

        {/* Button Variants Section */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">Card Button Variants</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Three primary button patterns used in camp cards based on camp status and type.
          </p>
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Book Camp */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-primary">Book Camp</h3>
                  <p className="text-xs text-muted-foreground">
                    Used for upcoming individual camps. Primary action for registration.
                  </p>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                    >
                      Book Camp
                    </Button>
                    <code className="block text-xs bg-muted p-2 rounded">
                      variant=&quot;outline&quot; + border-primary
                    </code>
                  </div>
                </div>

                {/* Explore Camps */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-primary">Explore Camps</h3>
                  <p className="text-xs text-muted-foreground">
                    Used for hub pages (e.g., Muskoka) that contain multiple camps. Links to overview page.
                  </p>
                  <div className="space-y-3">
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                      Explore Camps <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <code className="block text-xs bg-muted p-2 rounded">
                      bg-accent + ArrowRight icon
                    </code>
                  </div>
                </div>

                {/* View Recap */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-primary">View Recap</h3>
                  <p className="text-xs text-muted-foreground">
                    Used for completed camps with available recap content. Links to recap page.
                  </p>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                    >
                      View Recap
                    </Button>
                    <code className="block text-xs bg-muted p-2 rounded">
                      variant=&quot;outline&quot; + border-primary
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Button States */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">Button States</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Different button states based on camp availability.
          </p>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-3 text-center">
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                  >
                    Book Camp
                  </Button>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
                <div className="space-y-3 text-center">
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                  >
                    View Recap
                  </Button>
                  <p className="text-xs text-muted-foreground">Completed + Recap</p>
                </div>
                <div className="space-y-3 text-center">
                  <Button disabled variant="outline" className="w-full">
                    Sold Out
                  </Button>
                  <p className="text-xs text-muted-foreground">Sold Out</p>
                </div>
                <div className="space-y-3 text-center">
                  <Button disabled variant="outline" className="w-full">
                    Completed
                  </Button>
                  <p className="text-xs text-muted-foreground">Completed (No Recap)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Book Camp Card Examples */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">Book Camp Card</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Standard camp card with &quot;Book Camp&quot; CTA for upcoming camps.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CampCard
              id="example-upcoming"
              title="Toronto Core Skills Intensive"
              date="May 23-24, 2026"
              location="Ace Pickleball Club, Toronto"
              price="$675 CAD"
              image="/camps/toronto-bootcamp.jpg"
              badges={[{ text: "Intermediate (3.0+)", variant: "secondary" }]}
              coach="Joey Manchurek"
              buttonText="Book Camp"
              spotsRemaining={4}
            />
            <CampCard
              id="example-low-stock"
              title="Toronto Core Skills Intensive"
              date="May 23-24, 2026"
              location="Ace Pickleball Club, Toronto"
              price="$675 CAD"
              image="/camps/toronto-bootcamp.jpg"
              badges={[{ text: "Intermediate (3.0+)", variant: "secondary" }]}
              coach="Joey Manchurek"
              buttonText="Book Camp"
              spotsRemaining={2}
            />
            <CampCard
              id="example-sold-out"
              title="Toronto Core Skills Intensive"
              date="May 23-24, 2026"
              location="Ace Pickleball Club, Toronto"
              price="$675 CAD"
              image="/camps/toronto-bootcamp.jpg"
              badges={[{ text: "Intermediate (3.0+)", variant: "secondary" }]}
              coach="Joey Manchurek"
              buttonText="Book Camp"
              soldOut={true}
            />
          </div>
        </section>

        {/* View Recap Card Examples */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">View Recap Card</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Card for completed camps with recap pages. Uses &quot;View Recap&quot; CTA and compact layout (no price/location).
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CampCard
              id="toronto-intermediate-pickleball-camp"
              title="Toronto Intermediate Camp"
              date="April 11-13, 2025"
              location="Toronto"
              price=""
              image="/camps/toronto-bootcamp.jpg"
              badges={[{ text: "Past Camp", variant: "default" }]}
              coach="Joey Manchurek"
              buttonText="View Recap"
              link="/pickleball-camps/toronto-intermediate-pickleball-camp/recap"
              compact={true}
            />
            <CampCard
              id="saint-martin-pickleball-clinic"
              title="Saint Martin Clinic"
              date="March 18-22, 2025"
              location="Saint Martin"
              price=""
              image="/camps/st-martin-1.jpg"
              badges={[{ text: "Past Camp", variant: "default" }]}
              coach="Joey Manchurek"
              buttonText="View Recap"
              link="/pickleball-camps/saint-martin-pickleball-clinic/recap"
              compact={true}
            />
            <CampCard
              id="toronto-intensive-jan"
              title="Toronto January Intensive"
              date="January 18-19, 2025"
              location="Toronto"
              price=""
              image="/camps/toronto-bootcamp.jpg"
              badges={[{ text: "Past Camp", variant: "default" }]}
              coach="Joey Manchurek"
              buttonText="View Recap"
              link="/pickleball-camps/toronto-intensive-jan/recap"
              compact={true}
            />
          </div>
        </section>

        {/* Explore Camps Card (Hub) */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">Explore Camps Card (Hub Style)</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Special card format for hub pages that contain multiple camp sessions. Uses &quot;Explore Camps&quot; CTA with arrow icon and accent styling.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <MuskokaHubCard />
            
            {/* Custom hub card example */}
            <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-48">
                <img
                  src="/muskoka-photos/muskoka-path.jpg"
                  alt="Camp location"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <Badge variant="accent">Just Announced</Badge>
                  <Badge variant="default">Joey Signature</Badge>
                </div>
              </div>
              <CardContent className="p-5">
                <CardTitle className="text-xl text-primary mb-2">Hub Card Pattern</CardTitle>
                <CardDescription className="mb-4">
                  with Coach Name at Location
                </CardDescription>
                <p className="text-xs text-muted-foreground mb-4">
                  Date Range 1 &middot; Date Range 2 &middot; Date Range 3
                </p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <span className="text-sm text-muted-foreground">From </span>
                    <span className="text-xl font-bold text-primary">$XXX CAD</span>
                  </div>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Explore Camps <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">Usage Guidelines</h2>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-primary mb-2">When to Use Each Button</h3>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Book Camp:</strong> Upcoming camps that are available for registration</li>
                  <li><strong>Explore Camps:</strong> Hub pages linking to multiple camp sessions (e.g., Muskoka)</li>
                  <li><strong>View Recap:</strong> Completed camps with hasRecap: true or recapUrl defined</li>
                  <li><strong>Sold Out:</strong> Upcoming camps with 0 spots remaining (disabled button)</li>
                  <li><strong>Completed:</strong> Completed camps without a recap (disabled button or no button)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-primary mb-2">Card Props Reference</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4 font-semibold">Prop</th>
                        <th className="text-left py-2 pr-4 font-semibold">Type</th>
                        <th className="text-left py-2 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b">
                        <td className="py-2 pr-4"><code>buttonText</code></td>
                        <td className="py-2 pr-4">string</td>
                        <td className="py-2">Custom button text (default: &quot;Book Camp&quot;)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4"><code>link</code></td>
                        <td className="py-2 pr-4">string</td>
                        <td className="py-2">Override default /pickleball-camps/{`{id}`} link</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4"><code>compact</code></td>
                        <td className="py-2 pr-4">boolean</td>
                        <td className="py-2">Hide price, location, coach for recap cards</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4"><code>spotsRemaining</code></td>
                        <td className="py-2 pr-4">number</td>
                        <td className="py-2">Show availability badge</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4"><code>soldOut</code></td>
                        <td className="py-2 pr-4">boolean</td>
                        <td className="py-2">Display sold out state</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4"><code>imageEnhanced</code></td>
                        <td className="py-2 pr-4">boolean</td>
                        <td className="py-2">Apply CSS filters to enhance image colors</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-primary mb-2">Button Logic Decision Tree</h3>
                <div className="bg-muted p-4 rounded-lg text-sm font-mono">
                  <pre className="whitespace-pre-wrap">{`if (camp.isHub) {
  button = "Explore Camps" + ArrowRight
  style = bg-accent
} else if (camp.isCompleted && camp.hasRecap) {
  button = "View Recap"
  link = camp.recapUrl
  style = outline + border-primary
} else if (camp.isCompleted && !camp.hasRecap) {
  button = disabled "Completed" or no button
} else if (camp.soldOut) {
  button = disabled "Sold Out"
} else {
  button = "Book Camp"
  style = outline + border-primary
}`}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Implementation Examples */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">Implementation Examples</h2>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-primary mb-2">Book Camp Card</h3>
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`<CampCard
  id="toronto-core-skills"
  title="Toronto Core Skills Intensive"
  date="May 23-24, 2026"
  location="Ace Pickleball Club, Toronto"
  price="$675 CAD"
  image="/camps/toronto-bootcamp.jpg"
  badges={[{ text: "Intermediate (3.0+)", variant: "secondary" }]}
  coach="Joey Manchurek"
  buttonText="Book Camp"
  spotsRemaining={4}
/>`}
                </pre>
              </div>
              
              <div>
                <h3 className="font-semibold text-primary mb-2">View Recap Card</h3>
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`<CampCard
  id="toronto-intermediate-pickleball-camp"
  title="Toronto Intermediate Camp"
  date="April 11-13, 2025"
  location="Toronto"
  price=""
  image="/camps/toronto-bootcamp.jpg"
  badges={[{ text: "Past Camp", variant: "default" }]}
  buttonText="View Recap"
  link="/pickleball-camps/toronto-intermediate-pickleball-camp/recap"
  compact={true}
/>`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-primary mb-2">Explore Camps (Hub Card)</h3>
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`<MuskokaHubCard />

// Or custom implementation:
<Button className="bg-accent text-accent-foreground hover:bg-accent/90">
  Explore Camps <ArrowRight className="ml-2 h-4 w-4" />
</Button>`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
