import Link from "next/link"

export function CompletedCampNotice({ recapHref }: { recapHref: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-4">
      <p className="font-semibold text-primary">This camp is completed. Registration is closed.</p>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-primary">
        <Link className="underline underline-offset-4" href={recapHref}>View recap</Link>
        <Link className="underline underline-offset-4" href="/pickleball-camps">Browse upcoming camps</Link>
      </div>
    </div>
  )
}
