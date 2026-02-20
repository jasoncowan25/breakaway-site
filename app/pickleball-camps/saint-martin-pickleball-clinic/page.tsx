import { Metadata } from "next"
import SaintMartinClinicClient from "./saint-martin-client"

export const metadata: Metadata = {
  title: "Saint Martin Pickleball Clinic | 2-Hour Skills Training | Breakaway",
  description: "Join our intensive 2-hour pickleball clinic in Saint Martin. Perfect for 3.0-4.0 players looking to level up. Pro coaching, small groups, limited spots.",
}

export default function SaintMartinClinicPage() {
  return <SaintMartinClinicClient />
}
