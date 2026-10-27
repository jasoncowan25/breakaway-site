import { Metadata } from "next"
import { campHasNotEnded } from "@/lib/upcoming-camps"
import TorontoIntermediateCampClient from "./toronto-camp-client"

export const metadata: Metadata = {
  title: "Toronto Pickleball Camp | Intermediate Intensive Training | Breakaway",
  description: "A premium intermediate pickleball camp in Toronto for 3.0–3.5 players. Small groups, pro coaching, and focused on real skill progression.",
}

export const dynamic = "force-dynamic"

export default function TorontoIntermediateCampPage() {
  return <TorontoIntermediateCampClient isCompleted={!campHasNotEnded({ startDate: "2026-04-11", endDate: "2026-04-12" })} />
}
