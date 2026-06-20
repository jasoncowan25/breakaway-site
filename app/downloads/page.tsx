import type { Metadata } from "next"
import { Download } from "lucide-react"

export const metadata: Metadata = {
  title: "Download Kids Camp Page | Breakaway Pickleball",
  description: "Download the standalone Kids Summer Pickleball Camp page with all images.",
  robots: { index: false, follow: false },
}

export default function DownloadsPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-sm p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-primary text-balance">Kids Summer Camp Page</h1>
          <p className="text-muted-foreground leading-relaxed">
            A standalone HTML version of the camp page, bundled with all images. Unzip and open
            {" "}
            <span className="font-medium text-foreground">index.html</span> in any browser — it works fully offline.
          </p>
        </div>

        <a
          href="/downloads/kids-summer-camp.zip"
          download="kids-summer-camp.zip"
          className="flex items-center justify-center gap-2 min-h-[44px] bg-accent text-accent-foreground hover:bg-accent/90 font-semibold rounded-md px-6 py-3 transition-colors"
        >
          <Download className="h-5 w-5" />
          Download ZIP (7.2 MB)
        </a>

        <p className="text-sm text-muted-foreground">
          Includes the camp page plus 8 images: hero, Baseline logo, coach photo, video thumbnail, and four venue photos.
        </p>
      </div>
    </main>
  )
}
