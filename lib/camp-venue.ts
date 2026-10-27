import type { ApiCampFacility } from "./breakaway-api.ts"

/** Use only the venue record attached to this camp; never guess an address. */
export function campVenueDetails(facility: ApiCampFacility | null | undefined) {
  const address = facility?.address?.trim() || null
  const destination = [facility?.name, address, facility?.city].filter(Boolean).join(", ")
  return {
    address,
    directionsUrl: address
      ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
      : null,
  }
}
