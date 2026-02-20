export const REGISTRATION_OPEN_AT = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
export const PRICE_LABEL = "Reserve Your Spot — $800 CAD"
export const SPOTS_LABEL = "Only 16 spots"
export const EVENT_TITLE = "Breakaway Pickleball Camp — Registration Opens"
export const SITE_URL = "https://v0-pickle-camp.vercel.app"

export const FORMATTED_OPEN_DATE = REGISTRATION_OPEN_AT.toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
})

export const LAUNCH_CONFIG = {
  launchAt: REGISTRATION_OPEN_AT,
  localTime: "3:00 PM EST",
  formattedDate: FORMATTED_OPEN_DATE,
  priceLabel: PRICE_LABEL,
  spotsLabel: SPOTS_LABEL,
  eventTitle: EVENT_TITLE,
  siteUrl: SITE_URL,
}
