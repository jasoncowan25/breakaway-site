import { Metadata } from "next"
import CampsPageClient from "./camps-page-client"

export const metadata: Metadata = {
  title: "Pickleball Camps | Find Your Camp | Breakaway",
  description: "Discover upcoming pickleball camps and clinics across North America led by top pros",
}

export default function CampsPage() {
  return <CampsPageClient />
}
