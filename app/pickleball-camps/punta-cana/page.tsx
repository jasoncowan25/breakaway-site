import type { Metadata } from "next"
import { JsonLd } from "@/components/JsonLd"
import { getPublishedPublicCampNavItems } from "@/lib/public-camps"
import { breadcrumbJsonLd, eventJsonLd, faqJsonLd } from "@/lib/seo"
import { PuntaCanaPageClient } from "./punta-cana-page-client"

const puntaCanaFaq = [
  {
    question: "What skill level is the Punta Cana pickleball retreat for?",
    answer:
      "All levels are welcome. Courts will be organized by skill level so players can get useful coaching and competitive play throughout the week.",
  },
  {
    question: "Can a spouse or friend join without playing pickleball?",
    answer:
      "Yes. Non-players can join at the resort cost and will not be charged the Breakaway pickleball program fee.",
  },
  {
    question: "What is included in the pickleball program?",
    answer:
      "The program includes five days of coaching, daily clinics, drills, match play, video analysis, personalized feedback, exclusive court access, and an end-of-week tournament.",
  },
  {
    question: "Where is the retreat hosted?",
    answer:
      "The retreat is hosted at TRS Turquesa in Punta Cana, Dominican Republic, with dedicated morning pickleball court time for the Breakaway group.",
  },
]

export const metadata: Metadata = {
  title: "Punta Cana Pickleball Retreat | Breakaway Pickleball",
  description:
    "Join Breakaway's Nov 24-Dec 1, 2026 Punta Cana pickleball retreat at TRS Turquesa with Joey Manchurek. All-inclusive resort stay, daily coaching, and pricing from $2,420 CAD.",
  alternates: {
    canonical: "/pickleball-camps/punta-cana",
  },
  openGraph: {
    title: "Punta Cana Pickleball Retreat | Breakaway Pickleball",
    description:
      "All-inclusive Punta Cana pickleball retreat at TRS Turquesa, Nov 24-Dec 1, 2026. Daily coaching, match play, video analysis, and limited spots.",
    url: "/pickleball-camps/punta-cana",
    images: [
      {
        url: "/punta-cana-resort-pool.jpg",
        width: 1200,
        height: 630,
        alt: "TRS Turquesa resort pool in Punta Cana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/punta-cana-resort-pool.jpg"],
  },
}

export default async function PuntaCanaPage() {
  const navCampItems = await getPublishedPublicCampNavItems()

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Pickleball Camps", path: "/pickleball-camps" },
            { name: "Punta Cana Pickleball Retreat", path: "/pickleball-camps/punta-cana" },
          ]),
          eventJsonLd({
            name: "Punta Cana Destination Retreat",
            description:
              "A seven-night all-inclusive pickleball retreat at TRS Turquesa in Punta Cana with Joey Manchurek and the Breakaway team.",
            path: "/pickleball-camps/punta-cana",
            startDate: "2026-11-24",
            endDate: "2026-12-01",
            image: "/punta-cana-resort-pool.jpg",
            locationName: "TRS Turquesa, Punta Cana, Dominican Republic",
            address: "TRS Turquesa, Punta Cana, Dominican Republic",
            priceLabel: "From $2,420 CAD",
          }),
          faqJsonLd(puntaCanaFaq),
        ]}
      />
      <PuntaCanaPageClient navCampItems={navCampItems} />
    </>
  )
}
