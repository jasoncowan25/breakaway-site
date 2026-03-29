import { Metadata } from "next"
import TorontoBeginnerCampClient from "./beginner-camp-client"

export const metadata: Metadata = {
  title: "Toronto Pickleball Camp | Core Skills Intensive Training | Breakaway",
  description: "A premium core skills pickleball camp in Toronto for 2.5-2.75 players. Small groups, pro coaching, and focused on building strong fundamentals.",
}

export default function TorontoBeginnerCampPage() {
  return <TorontoBeginnerCampClient />
}
