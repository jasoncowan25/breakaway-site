import { RecapContentSchema, type RecapContent } from './schema'

export type PublicRecap = { campId: string; slug: string; title: string; startDate: string; endDate: string | null; venue: string | null; location: string | null; duprMin: number | null; duprMax: number | null; publishedAt: string; content: RecapContent }
const apiBase = (process.env.NEXT_PUBLIC_BREAKAWAY_API_URL ?? process.env.BREAKAWAY_API_URL ?? 'https://api.breakawaypickleball.ca').replace(/\/$/, '')

async function fetchRecaps(path: string) {
  const response = await fetch(`${apiBase}/api/v1/public/recaps${path}`, { cache: 'no-store', signal: AbortSignal.timeout(10000) })
  if (response.status === 404) return null
  if (!response.ok) throw new Error('Camp recaps are temporarily unavailable.')
  return (await response.json()).data
}
export async function getRecap(slug: string): Promise<PublicRecap | null> {
  const data = await fetchRecaps(`/${encodeURIComponent(slug)}`)
  if (!data?.recap) return null
  const content = RecapContentSchema.safeParse(data.recap.content)
  if (!content.success) throw new Error('Invalid camp recap.')
  return { ...data.recap, content: content.data }
}
export async function getRecaps(): Promise<PublicRecap[]> {
  try {
    const data = await fetchRecaps('')
    return (data?.recaps ?? []).filter((recap: PublicRecap) => RecapContentSchema.safeParse(recap.content).success)
  } catch (error) { console.error('[recaps]', error); return [] }
}
export function recapDateLabel(start: string, end: string | null) {
  const date = (value: string) => new Date(`${value.slice(0, 10)}T12:00:00Z`)
  const formatter = new Intl.DateTimeFormat('en-CA', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  return end && end.slice(0, 10) !== start.slice(0, 10) ? formatter.formatRange(date(start), date(end)) : formatter.format(date(start))
}
export function recapCard(recap: PublicRecap) {
  return {
    id: recap.campId, title: recap.title, date: recapDateLabel(recap.startDate, recap.endDate), sortDate: recap.startDate,
    location: recap.venue || recap.location || '', locationFilter: /toronto|gta/i.test(recap.location ?? '') ? 'Toronto & GTA' : recap.location ?? '',
    format: /clinic/i.test(recap.title) ? 'Clinic' : 'Camp', skillLevel: recap.duprMin != null ? `${recap.duprMin}–${recap.duprMax ?? recap.duprMin}` : '',
    price: '', image: recap.content.photos[recap.content.coverIndex].url,
    badges: [{ text: 'Completed', variant: 'secondary' as const }], coach: '',
    link: `/pickleball-camps/${recap.slug}/recap`, buttonText: 'View Recap', compact: true,
  }
}
