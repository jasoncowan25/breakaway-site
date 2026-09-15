import { z } from 'zod'

/** Accept a post/reel URL or the shortcode shown after instagram.com/p/. */
export function normalizeInstagramUrl(value: string): string | null {
  const input = value.trim()
  if (!input) return null
  if (/^[A-Za-z0-9_-]{5,100}$/.test(input)) return `https://www.instagram.com/p/${input}/`
  try {
    const url = new URL(input)
    if (url.protocol !== 'https:' || !['instagram.com', 'www.instagram.com'].includes(url.hostname) || url.username || url.password || url.port) return null
    const match = url.pathname.match(/^\/(p|reel)\/([A-Za-z0-9_-]{5,100})\/?$/)
    return match ? `https://www.instagram.com/${match[1]}/${match[2]}/` : null
  } catch { return null }
}

export function isRecapImageUrl(value: string): boolean {
  if (/^\/(?!\/)[^\s\\]+$/.test(value)) return true
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password } catch { return false }
}

const titleList = z.array(z.string().trim().min(1).max(120)).max(50)
export const RecapContentSchema = z.object({
  photos: z.array(z.object({ url: z.string().max(2000).refine(isRecapImageUrl, 'Choose a valid photo.'), alt: z.string().trim().max(200) })).max(12),
  coverIndex: z.number().int().min(0).max(11),
  body: z.string().trim().max(12000),
  shotsTrained: titleList,
  shotRequests: titleList,
  instagramEnabled: z.boolean(),
  instagramUrl: z.string().trim().max(1000),
  tournamentEnabled: z.boolean(),
  podium: z.array(z.object({ rank: z.number().int().min(1).max(3), players: z.array(z.string().trim().max(100)).min(1).max(2) })).max(3),
})
export type RecapContent = z.infer<typeof RecapContentSchema>
export type RecapRecord = { camp_id: string; draft: RecapContent; published: RecapContent | null; published_at: string | null; updated_at: string; revision: number }

export function publicationError(content: RecapContent): string | null {
  if (!content.photos[content.coverIndex]) return 'Choose a cover photo before publishing.'
  if (!content.body.trim()) return 'Add a recap before publishing.'
  if (content.instagramEnabled && !normalizeInstagramUrl(content.instagramUrl)) return 'Enter a valid Instagram post or reel link.'
  if (content.tournamentEnabled) {
    if (!content.podium.length || !content.podium.some(p => p.rank === 1)) return 'Add a first-place finisher or turn off tournament results.'
    const ranks = new Set<number>(), names = new Set<string>()
    for (const place of content.podium) {
      if (ranks.has(place.rank)) return 'Each podium place can only appear once.'
      ranks.add(place.rank)
      if (!place.players[0]?.trim()) return `Add a player for place ${place.rank}, or remove that place.`
      for (const name of place.players.filter(Boolean)) {
        const key = name.trim().toLocaleLowerCase()
        if (names.has(key)) return 'A player can only appear once on the podium.'
        names.add(key)
      }
    }
  }
  return null
}

export function initialRecap(camp: { name: string; venue?: string | null; location: string; shots?: { title: string; sortOrder: number }[] }, requests: string[] = []): RecapContent {
  const shotsTrained = [...(camp.shots ?? [])].sort((a, b) => a.sortOrder - b.sortOrder).map(s => s.title)
  const shotRequests = [...new Set(requests.filter(Boolean))]
  const body = [
    `${camp.name} brought players together for purposeful training at ${camp.venue || camp.location}.`,
    shotsTrained.length ? `On court we worked through ${listify(shotsTrained)} — with drills built to connect back to real game situations.` : '',
    shotRequests.length ? `Campers asked to work on ${listify(shotRequests)}.` : '',
  ].filter(Boolean).join('\n\n')
  return { photos: [], coverIndex: 0, body, shotsTrained, shotRequests, instagramEnabled: false, instagramUrl: '', tournamentEnabled: false, podium: [{ rank: 1, players: ['', ''] }, { rank: 2, players: ['', ''] }] }
}
function listify(values: string[]) { return values.length < 2 ? values[0] : `${values.slice(0, -1).join(', ')} and ${values.at(-1)}` }
