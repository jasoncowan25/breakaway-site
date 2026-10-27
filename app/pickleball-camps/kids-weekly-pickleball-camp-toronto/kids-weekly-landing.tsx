"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  ArrowRight,
  Award,
  CalendarDays,
  CalendarOff,
  CheckCircle2,
  Clock3,
  HeartPulse,
  MapPin,
  Users,
} from "lucide-react"

import type { KidsWeeklyProgramKey, buildKidsWeeklyProgram } from "@/lib/kids-weekly-camp"

import styles from "./kids-weekly.module.css"

type Program = ReturnType<typeof buildKidsWeeklyProgram>

type Props = {
  /** Landing-page order. */
  programs: Program[]
  defaultKey: KidsWeeklyProgramKey
}

const experienceSteps = [
  ["Warm-Up & Footwork", "Dynamic warm-up, paddle handling and movement work to get everyone loose and on the same page."],
  ["Skill Of The Week", "One focus per session — serve, return, dinking, volleys or court positioning — coached in small groups."],
  ["Games & Match Play", "Rally games, team challenges and supervised match play so the new skill gets used the same night."],
]

const faqs = [
  ["Which program should my child join?", "All three are the same All Skill Levels program, and complete beginners are welcome. Pick the night and club that suit your week: Mondays or Thursdays at The JAR in Toronto, or Tuesdays at The Picklr Toronto West in Etobicoke."],
  ["What do they need to bring?", "Indoor court shoes, a water bottle, and a paddle if they have one. We keep loaner paddles and balls at the club."],
  ["What if we miss a week?", "Sessions build week to week but stand on their own, so a missed night is fine. Let us know in advance and we'll catch them up."],
  ["Can siblings or friends register together?", "Yes. Add siblings joining the same program in one checkout. Friends can register separately and email us their names — we'll group them where the skill match works."],
]

function ProgramCta({ program, compact = false }: { program: Program; compact?: boolean }) {
  if (program.ctaDisabled) {
    return <button className={compact ? styles.cardCta : styles.primaryCta} disabled>{program.ctaLabel}</button>
  }
  return (
    <Link className={compact ? styles.cardCta : styles.primaryCta} href={program.checkoutHref}>
      {program.ctaLabel}
      {!compact && <ArrowRight size={17} aria-hidden="true" />}
    </Link>
  )
}

function ProgramCard({ program }: { program: Program }) {
  return (
    <article className={styles.programCard}>
      <div className={styles.cardHeading}>
        <div>
          <span className={styles.cardEyebrow}>
            {program.eyebrow}
            {program.badge && <em>{program.badge}</em>}
          </span>
          <h3>{program.name}</h3>
        </div>
        <span className={styles.spotsPill}>{program.spotsLabel}</span>
      </div>
      <div className={styles.whoFor}>
        <Users size={19} aria-hidden="true" />
        <div><span>Who it&apos;s for</span><strong>{program.whoFor}</strong></div>
      </div>
      <div className={styles.whoFor}>
        <MapPin size={19} aria-hidden="true" />
        <div><span>Where</span><strong>{program.venue} · {program.city}</strong></div>
      </div>
      <p>{program.description}</p>
      <div className={styles.cardPrice}><strong>{program.priceLabel.replace(" CAD", "")}</strong><span>CAD / {program.weeksLabel}</span></div>
      <span className={styles.durationBadge}><Clock3 size={13} aria-hidden="true" />{program.durationBadge}</span>
      <ProgramCta program={program} compact />
      <div className={styles.includes}>
        <b>This program includes:</b>
        {program.includes.map((item) => <span key={item}><CheckCircle2 size={18} aria-hidden="true" />{item}</span>)}
      </div>
    </article>
  )
}

export function KidsWeeklyLanding({ programs, defaultKey }: Props) {
  const [selected, setSelected] = useState<KidsWeeklyProgramKey>(defaultKey)
  const program = programs.find((item) => item.key === selected) ?? programs[0]
  const totalSpots = programs.reduce((sum, item) => {
    const value = Number.parseInt(item.spotsLabel, 10)
    return sum + (Number.isFinite(value) ? value : 0)
  }, 0)
  const sessionCounts = programs.map((item) => item.sessionCount).filter((count) => count > 0)
  const shortestProgram = sessionCounts.length > 0 ? Math.min(...sessionCounts) : null
  const longestProgram = sessionCounts.length > 0 ? Math.max(...sessionCounts) : null
  const sessionRange = shortestProgram === longestProgram
    ? String(shortestProgram ?? "Weekly")
    : `${shortestProgram}–${longestProgram}`

  return (
    <div className={styles.page}>
      <main>
        <section id="top" className={styles.hero}>
          <Image className={styles.heroImage} src="/images/kids-weekly/kids-camp-group.png" alt="The full Breakaway kids camp group on court" fill sizes="100vw" priority />
          <div className={styles.heroOverlay} />
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>Ages 9–14 · Winter 2027</span>
              <h1>Kids Weekly Pickleball Camp</h1>
              <p>Kids learn real pickleball skills and put them straight into games. Pro-led coaching every week in Toronto and Etobicoke — a great way to stay active with friends through the winter.</p>
              <div className={styles.heroPills}>
                <span><Users size={15} aria-hidden="true" />Ages 9–14</span>
                <span><CalendarDays size={15} aria-hidden="true" />{sessionRange} Weekly Sessions</span>
                <span><MapPin size={15} aria-hidden="true" />Toronto &amp; Etobicoke</span>
              </div>
            </div>

            <aside id="book" className={styles.bookingCard} aria-label="Reserve a spot">
              <div className={styles.bookingHeading}><h2>Reserve A Spot</h2><span>{program.ctaDisabled ? "Check availability" : "Registration Open"}</span></div>
              <div className={styles.programTabs} role="tablist" aria-label="Choose a program">
                {programs.map((item) => (
                  <button key={item.key} role="tab" aria-selected={selected === item.key} onClick={() => setSelected(item.key)}>
                    <span>{item.shortName}</span>
                    <small>{item.day}</small>
                  </button>
                ))}
              </div>
              <div className={styles.bookingFacts}>
                <div><span><CalendarDays size={17} aria-hidden="true" /></span><div><strong>{program.day}</strong><p>{program.dateLabel}</p></div></div>
                <div><span><Clock3 size={17} aria-hidden="true" /></span><div><strong>{program.timeLabel}</strong><p>{program.sessionsLabel}</p></div></div>
                {program.skippedLabel && (
                  <div><span><CalendarOff size={17} aria-hidden="true" /></span><div><strong>No class</strong><p>{program.skippedLabel}</p></div></div>
                )}
                <div><span><MapPin size={17} aria-hidden="true" /></span><div><strong>{program.venue}</strong><p>{program.city}</p></div></div>
              </div>
              <div className={styles.bookingPrice}>
                <div><strong>{program.priceLabel}</strong><span>/ {program.weeksLabel}</span></div>
                <span>{program.spotsLabel}</span>
              </div>
              <span className={styles.durationBadge}><Clock3 size={13} aria-hidden="true" />{program.durationBadge}</span>
              <ProgramCta program={program} />
              <p className={styles.secureCopy}>Secure checkout. Your spot is confirmed instantly.</p>
            </aside>
          </div>
        </section>

        <section className={styles.values} aria-label="Program benefits">
          <div><span><Award aria-hidden="true" /></span><h3>Pro-Led Coaching</h3><p>Taught by Breakaway&apos;s pro coaches, on a program built by Joey Manchurek</p></div>
          <div><span><HeartPulse aria-hidden="true" /></span><h3>Skills Then Games</h3><p>Kids drill the fundamentals, then play them out in rally games and match play</p></div>
          <div><span><Users aria-hidden="true" /></span><h3>Active With Friends</h3><p>A weekly indoor program that keeps kids moving all through the winter</p></div>
        </section>

        <section id="session" className={styles.experience}>
          <div className={styles.sectionIntro}><span>The Experience</span><h2>Here&apos;s How A Session Runs</h2><p>The same structure every week, so kids know what to expect and coaches can build on last week&apos;s work.</p></div>
          <div className={styles.steps}>{experienceSteps.map(([title, body], index) => <div key={title}><span>{index + 1}</span><h3>{title}</h3><p>{body}</p></div>)}</div>
        </section>

        <section id="programs" className={styles.programs}>
          <div className={styles.sectionIntro}><h2>Choose Your Program</h2><p>Three weekly options for ages 9 to 14 at two clubs. Pick the night and location that fit your week.</p></div>
          <div className={styles.programGrid}>{programs.map((item) => <ProgramCard key={item.key} program={item} />)}</div>
        </section>

        <section id="coach" className={styles.coach}>
          <div className={styles.coachPhoto}><Image src="/images/kids-weekly/kids-camp-joey.jpg" alt="Joey Manchurek briefing a group of young players before a session" fill sizes="(max-width: 800px) 90vw, 50vw" /></div>
          <div className={styles.coachCopy}>
            <span className={styles.eyebrowDark}>Head Coach</span><h2>Built By Joey Manchurek</h2><p>Joey designs every Breakaway kids program and coaches it alongside the Breakaway team. Sessions are built the way a pro trains — clear focus, real reps, and enough game play that kids leave wanting the next week.</p>
            <div className={styles.stats}><div><strong>5.0</strong><span>DUPR Rating</span></div><div><strong>500+</strong><span>Players Coached</span></div><div><strong>{sessionRange}</strong><span>Weeks Of Progression</span></div></div>
          </div>
        </section>

        <section className={styles.faq}>
          <h2>Parent Questions</h2>
          <div>{faqs.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}</div>
        </section>

        <section className={styles.closingCta}>
          <Image src="/images/kids-weekly/kids-camp-joey.jpg" alt="" fill sizes="100vw" />
          <div><h2>Give Them A Game They&apos;ll Keep Playing</h2><p>{totalSpots || 50} spots across all three programs. Registration closes when the courts are full.</p><Link href="#book">Book Now <ArrowRight size={17} aria-hidden="true" /></Link></div>
        </section>
      </main>
    </div>
  )
}
