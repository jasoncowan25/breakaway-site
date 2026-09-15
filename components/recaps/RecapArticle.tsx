'use client'

import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronLeft, ChevronRight, Instagram, MapPin, Target } from 'lucide-react'
import { useState } from 'react'
import { normalizeInstagramUrl, type RecapContent } from '@/lib/recaps/schema'

export type RecapArticleProps = { title: string; dateLabel: string; venue: string; skillLabel?: string; content: RecapContent }
const medalStyles = [
  { background: 'linear-gradient(145deg,#f8e695 0%,#dcae3e 52%,#a87c1b 100%)', borderColor: '#b8891f', color: '#5f430b', width: 84, height: 84 },
  { background: 'linear-gradient(145deg,#f6f8fa 0%,#c7cfd7 52%,#96a0aa 100%)', borderColor: '#a9b2ba', color: '#4e5863', width: 70, height: 70 },
  { background: 'linear-gradient(145deg,#f0c6a1 0%,#c27c47 52%,#8d5525 100%)', borderColor: '#9c6134', color: '#54300f', width: 64, height: 64 },
]

export function RecapArticle({ title, dateLabel, venue, skillLabel, content }: RecapArticleProps) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const cover = content.photos[content.coverIndex]
  const gallery = content.photos.filter((_, i) => i !== content.coverIndex)
  const photo = gallery[photoIndex % Math.max(gallery.length, 1)]
  const instagramUrl = content.instagramEnabled ? normalizeInstagramUrl(content.instagramUrl) : null
  const podium = content.podium.filter(p => p.players.some(Boolean)).sort((a, b) => [2, 1, 3].indexOf(a.rank) - [2, 1, 3].indexOf(b.rank))
  return <article className="bg-white text-[#111827]">
    <div className="relative h-[320px] overflow-hidden bg-[#0f3d65] md:h-[520px]">
      {cover && <img src={cover.url} alt={cover.alt || `${title} group photo`} className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f3d65]/60 via-[#0f3d65]/20 to-[#0f3d65]/20" />
      <div className="relative mx-auto flex h-full max-w-[1280px] flex-col justify-between px-5 py-6 md:px-10">
        <a href="/pickleball-camps?view=completed" className="flex w-fit items-center gap-3 font-medium !text-white hover:!text-[#90D123]"><ArrowLeft className="size-5" />Back to Camps</a>
        <span className="flex w-fit items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-bold tracking-wide text-[#124A7A]"><Check className="size-4 text-[#6EA626]" />CAMP RECAP</span>
      </div>
    </div>
    <div className="mx-auto max-w-[860px] px-5 pt-12 md:px-10 md:pt-16">
      <h1 className="mb-6 text-[34px] font-extrabold leading-[1.05] tracking-tight !text-[#124A7A] md:text-[52px]">{title}</h1>
      <div className="mb-5 flex flex-wrap gap-x-8 gap-y-3 text-base text-[#6b7280]"><span className="flex items-center gap-2"><CalendarDays className="size-4 text-[#9ca3af]" />{dateLabel}</span>{venue && <span className="flex items-center gap-2"><MapPin className="size-4 text-[#9ca3af]" />{venue}</span>}</div>
      <div className="mb-8 flex flex-wrap gap-2 text-xs font-semibold"><span className="rounded-md bg-[#124A7A] px-3 py-2 text-white">Completed</span>{skillLabel && <span className="rounded-md bg-[#f3f4f6] px-3 py-2 text-[#374151]">{skillLabel}</span>}<span className="rounded-md bg-[#f3f4f6] px-3 py-2 text-[#374151]">Pro-Led Training</span></div>
      {content.body.split(/\n\s*\n/).filter(Boolean).map((text, index) => <p key={index} className="mb-6 whitespace-pre-line text-lg leading-[1.75] text-[#4b5563] md:text-[19px]">{text}</p>)}
      {(content.shotsTrained.length > 0 || content.shotRequests.length > 0) && <div className="mt-11 grid gap-9 border-t border-[#eef0f2] pt-11 sm:grid-cols-2">
        {content.shotsTrained.length > 0 && <div><h2 className="mb-4 text-xs font-extrabold tracking-widest !text-[#9ca3af]">WHAT WE WORKED ON</h2><div className="flex flex-wrap gap-2">{content.shotsTrained.map(shot => <span key={shot} className="flex items-center gap-2 rounded-full border border-[#d9f99d] bg-[#f7fee7] px-3.5 py-2 text-sm font-semibold text-[#3f6212]"><Check className="size-3 shrink-0 text-[#6EA626]" />{shot}</span>)}</div></div>}
        {content.shotRequests.length > 0 && <div><h2 className="mb-4 text-xs font-extrabold tracking-widest !text-[#9ca3af]">SHOTS YOU ASKED FOR</h2><div className="flex flex-wrap gap-2">{content.shotRequests.map(shot => <span key={shot} className="flex items-center gap-2 rounded-full border border-[#cfe0f0] bg-[#eff6ff] px-3.5 py-2 text-sm font-semibold text-[#0f3d65]"><Target className="size-3 shrink-0" />{shot}</span>)}</div></div>}
      </div>}
    </div>
    {content.tournamentEnabled && podium.length > 0 && <section aria-labelledby="recap-podium" className="mx-auto max-w-[1160px] px-5 pt-16 md:px-10"><div className="rounded-[20px] border border-[#eef0f2] bg-[#fbfcfd] px-5 pb-8 pt-10 md:px-9 md:pb-11">
      <div className="mb-9 text-center"><p className="mb-2 text-xs font-extrabold tracking-widest text-[#9ca3af]">CAMP TOURNAMENT</p><h2 id="recap-podium" className="text-3xl font-extrabold tracking-tight !text-[#124A7A]">Podium</h2></div>
      <div className="mx-auto flex max-w-[720px] flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-end">
        {podium.map(place => <div key={place.rank} className={`flex min-w-0 flex-1 flex-col items-center ${place.rank === 1 ? 'order-first sm:order-none' : ''}`}>
          <div aria-hidden="true" className="flex shrink-0 items-center justify-center rounded-full border-[3px] text-4xl font-extrabold" style={{ ...medalStyles[place.rank - 1], boxShadow: 'inset 0 2px 5px rgba(255,255,255,.55),inset 0 -3px 7px rgba(0,0,0,.18),0 6px 16px -6px rgba(0,0,0,.35)' }}>{place.rank}</div>
          <h3 className="mb-2 mt-3 text-xs font-extrabold tracking-wider !text-[#9ca3af]">{['1ST PLACE', '2ND PLACE', '3RD PLACE'][place.rank - 1]}</h3>
          <div className="mb-4 min-h-11 text-center text-base font-bold leading-snug">{place.players.filter(Boolean).map(name => <p key={name}>{name}</p>)}</div>
          <div aria-hidden="true" className="hidden w-full rounded-t-xl border border-b-0 sm:block" style={{ height: [140, 96, 72][place.rank - 1], background: ['#124A7A', '#e8eef5', '#f1f3f5'][place.rank - 1], borderColor: ['#0f3d65', '#d8e3ee', '#e5e8eb'][place.rank - 1] }} />
        </div>)}
      </div>
    </div></section>}
    {instagramUrl && <section aria-labelledby="recap-instagram-title" className="mx-auto max-w-[1000px] px-5 pt-16 md:px-10">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-xs font-extrabold tracking-widest text-[#9ca3af]">FROM THE CAMP</p><h2 id="recap-instagram-title" className="text-[26px] font-extrabold tracking-tight !text-[#124A7A]">Our Instagram recap</h2></div><a href={instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-[#e5e7eb] px-4 py-3 text-sm font-semibold !text-[#111827] hover:border-[#124A7A]"><Instagram className="size-4" />Open on Instagram</a></div>
      <div className="overflow-hidden rounded-2xl border border-[#eef0f2] bg-[#f8f9fb] p-2 sm:p-6"><iframe title={`${title} Instagram recap`} src={`${instagramUrl}embed/`} className="mx-auto h-[760px] w-full max-w-[540px] rounded-lg border-0 bg-white" loading="lazy" allow="encrypted-media; clipboard-write; fullscreen" referrerPolicy="strict-origin-when-cross-origin" /></div>
      <p className="mt-3 text-center text-xs text-[#6b7280]">If the embed is unavailable, <a href={instagramUrl} target="_blank" rel="noreferrer" className="underline">view the recap on Instagram</a>.</p>
    </section>}
    {photo && <section aria-label="Camp photos" className="mx-auto max-w-[1000px] px-5 pt-14 md:px-10"><div className="relative overflow-hidden rounded-2xl bg-[#f3f4f6]"><img src={photo.url} alt={photo.alt || `${title} photo ${photoIndex + 1}`} className="aspect-[16/10] w-full object-cover" loading="lazy" />{gallery.length > 1 && <><button aria-label="Previous camp photo" onClick={() => setPhotoIndex(i => (i - 1 + gallery.length) % gallery.length)} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-3 text-[#124A7A]"><ChevronLeft className="size-5" /></button><button aria-label="Next camp photo" onClick={() => setPhotoIndex(i => (i + 1) % gallery.length)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-3 text-[#124A7A]"><ChevronRight className="size-5" /></button><span aria-live="polite" className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">{photoIndex + 1} / {gallery.length}</span></>}</div></section>}
    <section className="mx-auto max-w-[860px] px-5 pb-24 pt-20 text-center md:px-10"><h2 className="mb-3 text-3xl font-extrabold tracking-tight !text-[#124A7A]">Want in on the next one?</h2><p className="mx-auto mb-7 max-w-[560px] text-lg leading-relaxed text-[#6b7280]">Find your next camp in Toronto or Muskoka and keep building your game.</p><a href="/pickleball-camps" className="inline-flex items-center gap-3 rounded-xl bg-[#124A7A] px-7 py-4 text-base font-bold !text-white hover:bg-[#0f3d65]">View upcoming camps<ArrowRight className="size-5 text-[#90D123]" /></a></section>
  </article>
}
