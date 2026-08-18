import Image from 'next/image'
import Link from 'next/link'

import { coachRoster } from './coaches-data'

export function CoachRoster() {
  return (
    <main className="min-h-screen bg-slate-50/70">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-9 lg:px-8">
        <header className="mx-auto mb-6 max-w-5xl text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-primary md:text-[44px]">
            Meet Our Pickleball Coaches
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Experienced competitors. Patient teachers. Coaching built around helping you improve.
          </p>
        </header>

        <div className="grid items-stretch gap-6 md:grid-cols-2">
          {coachRoster.map((coach) => (
            <article
              key={coach.slug}
              id={coach.slug}
              className="flex h-full scroll-mt-24 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100 sm:h-52">
                <Image
                  src={coach.image}
                  alt={`${coach.name}, Breakaway Pickleball coach`}
                  fill
                  priority
                  sizes="(max-width: 767px) 100vw, 50vw"
                  className="object-cover"
                  style={{ objectPosition: coach.imagePosition }}
                />
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="mb-3">
                  <h2 className="text-2xl font-bold tracking-tight text-primary">{coach.name}</h2>
                  <p className="mt-1 text-sm font-medium text-slate-500">{coach.role}</p>
                </div>

                <div className="mb-3 flex flex-wrap gap-2" aria-label={`${coach.name} credentials`}>
                  {coach.badges.map((badge) => (
                    <span
                      key={badge.label}
                      className={
                        badge.tone === 'signature'
                          ? 'inline-flex min-h-8 items-center rounded-full bg-accent px-3.5 py-1 text-xs font-bold text-accent-foreground'
                          : 'inline-flex min-h-8 items-center rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary'
                      }
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>

                <p className="text-sm leading-[1.55] text-slate-600">{coach.bio}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-5 rounded-2xl bg-primary px-6 py-7 text-center sm:flex-row sm:px-8 sm:text-left">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">Private coaching & camps</p>
            <h2 className="mt-1 text-2xl font-bold text-white">Train With Our Coaches</h2>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/pickleball-lessons"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/70 bg-transparent px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              Private Lessons
            </Link>
            <Link
              href="/pickleball-camps"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-bold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              Find Your Camp
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
