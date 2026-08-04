"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  ArrowRight,
  Award,
  CalendarDays,
  CheckCircle2,
  Clock3,
  HeartPulse,
  MapPin,
  Users,
} from "lucide-react"

import type { buildKidsWeeklyProgram } from "@/lib/kids-weekly-camp"

import styles from "./kids-weekly.module.css"

type Program = ReturnType<typeof buildKidsWeeklyProgram>

type Props = {
  allLevels: Program
  experienced: Program
}

const experienceSteps = [
  ["Warm-Up & Footwork", "Dynamic warm-up, paddle handling and movement work to get everyone loose and on the same page."],
  ["Skill Of The Week", "One focus per session — serve, return, dinking, volleys or court positioning — coached in small groups."],
  ["Games & Match Play", "Rally games, team challenges and supervised match play so the new skill gets used the same night."],
]

const faqs = [
  ["Which program should my child join?", "If they've played a year or more, choose Experienced. Everyone else — including complete beginners — should start in All Skill Levels."],
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
  const allLevels = program.key === "allLevels"
  const includes = allLevels
    ? [program.scheduleLabel, program.dateLabel, program.sessionsLabel, "Fundamentals: serve, return, dinking, volleys", "Paddles available to borrow"]
    : [program.scheduleLabel, program.dateLabel, program.sessionsLabel, "Strategy, court positioning and shot selection", "Capped at 10 players for more court time"]

  return (
    <article className={styles.programCard}>
      <div className={styles.cardHeading}>
        <h3>{program.name}</h3>
        <span>{program.spotsLabel}</span>
      </div>
      <div className={styles.whoFor}>
        <Users size={19} aria-hidden="true" />
        <div><span>Who it&apos;s for</span><strong>{allLevels ? "Brand new, or playing under a year" : "Playing one year or more"}</strong></div>
      </div>
      <p>{allLevels ? "Start with grip, serve and rally, then build into real game play by the end of the season." : "Longer sessions built around sharper drills, strategy and match play for kids who know the game."}</p>
      <div className={styles.cardPrice}><strong>{program.priceLabel.replace(" CAD", "")}</strong><span>CAD / 15 weeks</span></div>
      <span className={styles.durationBadge}><Clock3 size={13} aria-hidden="true" />{allLevels ? "1-hour sessions" : "2-hour sessions"}</span>
      <ProgramCta program={program} compact />
      <div className={styles.includes}>
        <b>This program includes:</b>
        {includes.map((item) => <span key={item}><CheckCircle2 size={18} aria-hidden="true" />{item}</span>)}
      </div>
    </article>
  )
}

export function KidsWeeklyLanding({ allLevels, experienced }: Props) {
  const [selected, setSelected] = useState<"allLevels" | "experienced">("allLevels")
  const program = selected === "allLevels" ? allLevels : experienced
  const totalSpots = [allLevels, experienced].reduce((sum, item) => {
    const value = Number.parseInt(item.spotsLabel, 10)
    return sum + (Number.isFinite(value) ? value : 0)
  }, 0)

  return (
    <div className={styles.page}>
      <main>
        <section id="top" className={styles.hero}>
          <Image className={styles.heroImage} src="/images/kids-weekly/kids-camp-group.png" alt="The full Breakaway kids camp group on court at The JAR Pickleball Club" fill sizes="100vw" priority />
          <div className={styles.heroOverlay} />
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>Ages 9–14 · Fall 2026</span>
              <h1>Kids Weekly Pickleball Camp</h1>
              <p>Kids learn real pickleball skills and put them straight into games. Pro-led coaching every week at The JAR Pickleball Club — a great way to stay active with friends through the fall.</p>
              <div className={styles.heroPills}>
                <span><Users size={15} aria-hidden="true" />Ages 9–14</span>
                <span><CalendarDays size={15} aria-hidden="true" />15 Weekly Sessions</span>
                <span><MapPin size={15} aria-hidden="true" />The JAR Pickleball Club</span>
              </div>
            </div>

            <aside id="book" className={styles.bookingCard} aria-label="Reserve a spot">
              <div className={styles.bookingHeading}><h2>Reserve A Spot</h2><span>{program.ctaDisabled ? "Check availability" : "Registration Open"}</span></div>
              <div className={styles.programTabs} role="tablist" aria-label="Choose a program">
                <button role="tab" aria-selected={selected === "allLevels"} onClick={() => setSelected("allLevels")}>All Skill Levels</button>
                <button role="tab" aria-selected={selected === "experienced"} onClick={() => setSelected("experienced")}>Experienced</button>
              </div>
              <div className={styles.bookingFacts}>
                <div><span><CalendarDays size={17} aria-hidden="true" /></span><div><strong>{program.scheduleLabel.split(" · ")[0]}</strong><p>{program.dateLabel}</p></div></div>
                <div><span><Clock3 size={17} aria-hidden="true" /></span><div><strong>{program.scheduleLabel.split(" · ").slice(1).join(" · ")}</strong><p>{program.sessionsLabel}</p></div></div>
                <div><span><MapPin size={17} aria-hidden="true" /></span><div><strong>The JAR Pickleball Club</strong><p>Toronto, ON</p></div></div>
              </div>
              <div className={styles.bookingPrice}>
                <div><strong>{program.priceLabel}</strong><span>/ 15 weeks</span></div>
                <span>{program.spotsLabel}</span>
              </div>
              <span className={styles.durationBadge}><Clock3 size={13} aria-hidden="true" />{program.key === "allLevels" ? "1-hour sessions" : "2-hour sessions"}</span>
              <ProgramCta program={program} />
              <p className={styles.secureCopy}>Secure checkout. Your spot is confirmed instantly.</p>
            </aside>
          </div>
        </section>

        <section className={styles.values} aria-label="Program benefits">
          <div><span><Award aria-hidden="true" /></span><h3>Pro-Led Coaching</h3><p>Every session is run by Joey Manchurek and the Breakaway coaching staff</p></div>
          <div><span><HeartPulse aria-hidden="true" /></span><h3>Skills Then Games</h3><p>Kids drill the fundamentals, then play them out in rally games and match play</p></div>
          <div><span><Users aria-hidden="true" /></span><h3>Active With Friends</h3><p>Weekly court time that builds confidence, friendships and a love of the game</p></div>
        </section>

        <section id="session" className={styles.experience}>
          <div className={styles.sectionIntro}><span>The Experience</span><h2>Here&apos;s How A Session Runs</h2><p>Every week follows the same rhythm, so kids know what to expect and can focus on getting better.</p></div>
          <div className={styles.steps}>{experienceSteps.map(([title, body], index) => <div key={title}><span>{index + 1}</span><h3>{title}</h3><p>{body}</p></div>)}</div>
        </section>

        <section id="programs" className={styles.programs}>
          <div className={styles.sectionIntro}><h2>Choose Your Program</h2><p>Two weekly options for ages 9 to 14, both running 15 weeks through fall 2026.</p></div>
          <div className={styles.programGrid}><ProgramCard program={allLevels} /><ProgramCard program={experienced} /></div>
        </section>

        <section id="coach" className={styles.coach}>
          <div className={styles.coachPhoto}><Image src="/images/kids-weekly/kids-camp-joey.jpg" alt="Joey Manchurek briefing a group of young players before a session" fill sizes="(max-width: 800px) 90vw, 50vw" /></div>
          <div className={styles.coachCopy}>
            <span className={styles.eyebrowDark}>Lead Instructor</span><h2>Coached By Joey Manchurek</h2><p>Joey runs every Breakaway kids program himself. Sessions are built the way a pro trains — clear focus, real reps, and enough game play that kids leave wanting the next week.</p>
            <div className={styles.stats}><div><strong>5.0</strong><span>DUPR Rating</span></div><div><strong>500+</strong><span>Players Coached</span></div><div><strong>15</strong><span>Weeks Of Progression</span></div></div>
          </div>
        </section>

        <section className={styles.faq}>
          <h2>Parent Questions</h2>
          <div>{faqs.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}</div>
        </section>

        <section className={styles.closingCta}>
          <Image src="/images/kids-weekly/kids-camp-joey.jpg" alt="" fill sizes="100vw" />
          <div><h2>Give Them A Game They&apos;ll Keep Playing</h2><p>{totalSpots || 30} spots across both programs. Registration closes when the courts are full.</p><Link href="#book">Book Now <ArrowRight size={17} aria-hidden="true" /></Link></div>
        </section>
      </main>
    </div>
  )
}
