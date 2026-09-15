import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { getRecap } from '@/lib/recaps/get'
import { PublishedRecap, recapMetadata } from '@/components/recaps/PublishedRecap'
export const dynamic = 'force-dynamic'
const readRecap = cache(getRecap)
type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const recap = await readRecap((await params).slug)
  return recap ? recapMetadata(recap) : { title: 'Camp recap not found', robots: { index: false } }
}
export default async function CampRecapPage({ params }: Props) {
  const recap = await readRecap((await params).slug)
  if (!recap) notFound()
  return <PublishedRecap recap={recap} />
}
