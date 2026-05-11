import { Metadata } from "next"
import TorontoCoreSkillsCampClient from "./core-skills-camp-client"

export const metadata: Metadata = {
  title: "Toronto Pickleball Camp | Intermediate Intensive Training | Breakaway",
  description: "A premium intermediate pickleball camp in Toronto for 3.5 players. Small groups, pro coaching, and focused on elevating your game.",
  alternates: {
    canonical: "/pickleball-camps/toronto-core-skills-pickleball-camp",
  },
  openGraph: {
    url: "/pickleball-camps/toronto-core-skills-pickleball-camp",
  },
}

export default function TorontoCoreSkillsCampPage() {
  return <TorontoCoreSkillsCampClient />
}
