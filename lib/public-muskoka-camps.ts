import { fetchPublicCampEvent, PUBLIC_CAMP_REVALIDATE_SECONDS } from "@/lib/breakaway-api"
import { mapEventCampsToMuskoka } from "@/lib/muskoka-feed"
import { muskokaCamps, type MuskokaCamp } from "@/lib/muskoka-camps"
import { currentAndUpcomingCamps } from "@/lib/upcoming-camps"

export async function getUpcomingMuskokaCamps(): Promise<MuskokaCamp[]> {
  const event = await fetchPublicCampEvent("muskoka", {
    revalidate: PUBLIC_CAMP_REVALIDATE_SECONDS,
  })
  const camps = event ? mapEventCampsToMuskoka(event.camps) : muskokaCamps

  return currentAndUpcomingCamps(camps)
}
