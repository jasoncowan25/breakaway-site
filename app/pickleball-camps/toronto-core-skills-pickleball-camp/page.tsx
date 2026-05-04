import { Metadata } from "next"
import TorontoCoreSkillsCampClient from "./core-skills-camp-client"

export const metadata: Metadata = {
  title: "Toronto Pickleball Camp | Core Skills Intensive Training | Breakaway",
  description: "A premium core skills pickleball camp in Toronto for 3.0 players. Small groups, pro coaching, and focused on building strong fundamentals.",
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
