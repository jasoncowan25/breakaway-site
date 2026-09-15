import type { Metadata } from 'next'
import { RecapArticle } from './RecapArticle'
import { getRecap, recapDateLabel, type PublicRecap } from '@/lib/recaps/get'

export function recapMetadata(recap: PublicRecap): Metadata {
  const path = `/pickleball-camps/${recap.slug}/recap`
  return { title: `${recap.title} Recap | Breakaway Pickleball`, description: recap.content.body.slice(0, 160), alternates: { canonical: path }, openGraph: { title: `${recap.title} Recap`, description: recap.content.body.slice(0, 160), url: path, images: [recap.content.photos[recap.content.coverIndex].url], type: 'article' } }
}

export async function PublishedRecap({ recap }: { recap: PublicRecap }) {
  return <main><RecapArticle title={recap.title} dateLabel={recapDateLabel(recap.startDate, recap.endDate)} venue={recap.venue || recap.location || ''} skillLabel={recap.duprMin != null ? `${recap.duprMin}–${recap.duprMax ?? recap.duprMin}` : undefined} content={recap.content} /></main>
}

/** Existing editorial recaps remain available if no managed version exists. */
export async function legacyRecapOverride(slug: string) {
  try { return await getRecap(slug) } catch { return null }
}
