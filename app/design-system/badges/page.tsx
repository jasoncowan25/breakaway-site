import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function BadgePreviewPage() {
  const spotStates = [
    { spots: 4, label: "4 Spots Left" },
    { spots: 3, label: "3 Spots Left" },
    { spots: 2, label: "2 Spots Left" },
    { spots: 1, label: "1 Spot Left" },
    { spots: 0, label: "Sold Out" },
  ]

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-2">Badge Design System</h1>
        <p className="text-muted-foreground mb-8">
          Preview of availability badges for Muskoka camp sessions
        </p>

        {/* Badge States */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Availability Badges</h2>
          <div className="flex flex-wrap gap-4 mb-6">
            {spotStates.map((state) => {
              const isSoldOut = state.spots === 0
              const isLowStock = state.spots > 0 && state.spots <= 2

              return (
                <div key={state.spots} className="text-center">
                  {isSoldOut ? (
                    <Badge variant="destructive" className="text-xs">
                      Sold Out
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className={`text-xs ${isLowStock ? "border-orange-500 text-orange-600" : ""}`}
                    >
                      <Users className="h-3 w-3 mr-1" />
                      {state.label}
                    </Badge>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {isSoldOut ? "0 spots" : `${state.spots} spots`}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Full Card Examples */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Card Examples</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spotStates.map((state) => {
              const isSoldOut = state.spots === 0
              const isLowStock = state.spots > 0 && state.spots <= 2

              return (
                <Card key={state.spots} className="overflow-hidden">
                  <CardContent className="p-5">
                    {/* Badges */}
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary">Intermediate (3.0+)</Badge>
                      {isSoldOut ? (
                        <Badge variant="destructive" className="text-xs">
                          Sold Out
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className={`text-xs ${isLowStock ? "border-orange-500 text-orange-600" : ""}`}
                        >
                          <Users className="h-3 w-3 mr-1" />
                          {state.label}
                        </Badge>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-primary mb-3">
                      Intermediate Camp
                    </h3>

                    {/* Price & CTA */}
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">$800 CAD</span>
                        {isSoldOut ? (
                          <Button disabled variant="outline">
                            Sold Out
                          </Button>
                        ) : (
                          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                            Book
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Color Reference */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Color Reference</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border">
              <div className="h-8 w-full rounded bg-background border mb-2" />
              <p className="text-sm font-medium">Default (3-4 spots)</p>
              <p className="text-xs text-muted-foreground">outline variant</p>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="h-8 w-full rounded border-2 border-orange-500 mb-2" />
              <p className="text-sm font-medium">Low Stock (1-2 spots)</p>
              <p className="text-xs text-muted-foreground">orange border/text</p>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="h-8 w-full rounded bg-destructive mb-2" />
              <p className="text-sm font-medium">Sold Out (0 spots)</p>
              <p className="text-xs text-muted-foreground">destructive variant</p>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="h-8 w-full rounded bg-secondary mb-2" />
              <p className="text-sm font-medium">Level Badge</p>
              <p className="text-xs text-muted-foreground">secondary variant</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
