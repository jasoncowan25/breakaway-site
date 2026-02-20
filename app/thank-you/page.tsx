import type { Metadata } from "next"
import ThankYouClient from "./thank-you-client"

export const metadata: Metadata = {
  title: "Thank You | Breakaway Pickleball Camps",
  description: "Thank you for registering for Breakaway Pickleball Camp. We'll send you all the details soon!",
  robots: "noindex,nofollow",
}

export default function ThankYouPage() {
  return <ThankYouClient />
}
