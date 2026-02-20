import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>

        {/* Mobile Filter Button Skeleton */}
        <div className="md:hidden mb-6">
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Sidebar Skeleton */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>
          </aside>

          {/* Camp Grid Skeleton */}
          <div className="flex-1">
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-lg border overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
