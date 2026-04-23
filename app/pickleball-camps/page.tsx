import { Metadata } from "next"
import CampsPageClient from "./camps-page-client"

export const metadata: Metadata = {
  title: "Pickleball Camps | Find Your Camp | Breakaway",
  description: "Discover upcoming pickleball camps and clinics across Toronto, the GTA and Muskoka led by top pros",
  alternates: {
    canonical: "/pickleball-camps",
  },
  openGraph: {
    url: "/pickleball-camps",
  },
}

export default function CampsPage() {
  return <CampsPageClient />
}
