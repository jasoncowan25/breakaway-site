import { Metadata } from "next"
import TorontoCoreSkillsCampClient from "./core-skills-camp-client"

export const metadata: Metadata = {
  title: "Toronto Pickleball Camp | Intermediate Intensive Training | Breakaway",
  description: "A premium intermediate pickleball camp in Toronto for 3.5 players. Small groups, pro coaching, and focused on elevating your game.",
  alternates: {
    canonical: "/pickleball-camps/toronto-intermediate-intensive-june-2026",
  },
  openGraph: {
    url: "/pickleball-camps/toronto-intermediate-intensive-june-2026",
  },
}

export default function TorontoCoreSkillsCampPage() {
  return <TorontoCoreSkillsCampClient />
}
