const CHROMELESS_ROUTE_PREFIXES = [
  "/checkout",
  "/waiver",
  "/waiver-sign",
  "/waiver-u18",
  "/preferences",
  "/thank-you",
  "/countdown",
  "/countdown-b",
  "/design-system",
] as const

function matchesRoutePrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

export function shouldRenderSiteChrome(pathname: string) {
  return !CHROMELESS_ROUTE_PREFIXES.some((prefix) => matchesRoutePrefix(pathname, prefix))
}
