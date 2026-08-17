export function mergePublicCampCards<T extends { link: string }>(staticCards: T[], liveCards: T[]): T[] {
  const seen = new Set<string>()
  return [...liveCards, ...staticCards].filter((card) => {
    if (seen.has(card.link)) return false
    seen.add(card.link)
    return true
  })
}
