import { getPublishedPublicCampNavItems } from "@/lib/public-camps"
import { PuntaCanaPageClient } from "./punta-cana-page-client"

export default async function PuntaCanaPage() {
  const navCampItems = await getPublishedPublicCampNavItems()

  return <PuntaCanaPageClient navCampItems={navCampItems} />
}
