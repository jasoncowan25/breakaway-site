'use client'

/* Breakaway Lessons — private-lesson booking page, ported verbatim from the
   approved Claude Design template (templates/lesson-booking/
   LessonBooking.dc.html): 3-step coach → dates → details flow with 1–3
   player pricing, ranked date choices, texting consent, sticky summary and
   success state. The prototype's one-click slot picker stays off
   (config.oneClickBookingsEnabled = false), so only the request flow ships.
   Submissions POST to /api/lesson-requests (same-origin proxy → breakaway
   API), which stores the request, emails the customer + coach, and raises
   the coach's admin alert. */

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'

import * as D from './lessons-data'
import { CoachPhotosLightbox } from './CoachPhotosLightbox'

/* ---------- small kit primitives (marketing-site UI kit) ---------- */

function Chevron({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="m6 9 6 6 6-6" /></svg>
  )
}

function Tick() {
  return (
    <span className="tick">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
    </span>
  )
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label className="bp-field">
        <span className="bp-label">
          {label}
          {required && <span className="bp-req"> *</span>}
        </span>
        {children}
      </label>
      {error && (
        <p className="err" style={{ marginTop: 7 }} role="alert">{error}</p>
      )}
    </div>
  )
}

/* ---------- date helpers (ported from the template logic) ---------- */

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const ORD = ['First', 'Second', 'Third']
const ORDL = ['first', 'second', 'third']
const ORDN = ['1st', '2nd', '3rd']

function iso(d: Date): string {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}
function fromIso(s: string): Date {
  const p = String(s).split('-')
  return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]))
}
function shortDate(isoStr: string): string {
  const d = fromIso(isoStr)
  return DOW[d.getDay()] + ', ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()] + ' ' + d.getDate()
}
function pretty(isoStr: string): string {
  const d = fromIso(isoStr)
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate()
}
function weekStart(d: Date): Date {
  const s = new Date(d)
  s.setDate(s.getDate() - ((s.getDay() + 6) % 7))
  return s
}

interface Choice {
  date: string | null
  times: string[]
}

const EMPTY_CHOICES: Choice[] = [
  { date: null, times: [] },
  { date: null, times: [] },
  { date: null, times: [] },
]

const FAQ_DATA: [string, string][] = [
  ['How do I book a lesson?', 'Choose a coach and submit your preferred dates and times. We will confirm the coach and court before sending you a secure payment link. When instant booking is available, you may also select directly from the listed lesson times.'],
  ['Can I book a lesson with a friend?', 'Yes. A private lesson can include up to three players, including you. Each additional player adds $20 per hour to the lesson rate. We send one payment link to the person who submitted the request — they pay the full lesson total, and the other players can repay them separately.'],
  ['When do I pay?', 'Lessons are prepaid, but no payment is required when you submit a lesson request. After your lesson is confirmed, we will send you a secure credit-card payment link.'],
  ['How quickly will I hear back?', 'We usually respond to lesson requests within 24 hours.'],
  ['Where are lessons offered?', 'Lessons are offered in Toronto throughout the year. Muskoka lessons are offered during June, July and August.'],
  ['What happens if I need to cancel?', 'You can cancel up to 72 hours before your lesson for a full refund. Lessons cancelled less than 72 hours before the start time are non-refundable, but they may be transferred to someone who can attend at the scheduled time.'],
  ['Do I need to know my pickleball rating?', 'No. You do not need to submit a pickleball rating when requesting a lesson.'],
  ['Can each player pay their own share?', 'Not at the moment. We send one payment link to the person who submitted the request, so that person pays the full lesson total and the other players can repay them separately.'],
]

export function LessonsPageClient() {
  const [step, setStep] = useState(1)
  const [city, setCity] = useState('toronto')
  const [form, setForm] = useState<D.LessonForm>(() => D.emptyForm())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'error' | 'success'>('idle')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [weekOffset, setWeekOffset] = useState(0)
  const [flexible, setFlexible] = useState(false)
  const [choices, setChoices] = useState<Choice[]>(EMPTY_CHOICES)
  const [openChoice, setOpenChoice] = useState(0)
  const [policyOpen, setPolicyOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState(-1)
  const [submittedName, setSubmittedName] = useState('')
  const [photoCoach, setPhotoCoach] = useState<string | null>(null)
  const [month, setMonth] = useState(8)
  useEffect(() => setMonth(D.currentMonth()), [])

  const f = form
  const mus = D.cityState('muskoka', month)
  const success = status === 'success'
  const sel = f.coach && f.coach !== 'none' ? D.coach(f.coach) : null
  const price = D.pricing(f.coach, f.players)

  const setF = (patch: Partial<D.LessonForm>) => setForm((prev) => ({ ...prev, ...patch }))
  const clearErr = (k: string) =>
    setErrors((prev) => {
      if (!prev[k]) return prev
      const e = { ...prev }
      delete e[k]
      return e
    })

  const prefs = useMemo(() => {
    const out: { date: string; time: string; rank: number }[] = []
    choices.forEach((c, i) => {
      if (c.date) c.times.forEach((t) => out.push({ date: c.date!, time: t, rank: i }))
    })
    return out
  }, [choices])

  const todayIso = useMemo(() => iso(new Date()), [])
  const earliestIso = useMemo(
    () => D.earliestRequestDate(f.coach, city, todayIso),
    [f.coach, city, todayIso],
  )
  const earliest = useMemo(() => fromIso(earliestIso), [earliestIso])

  const setChoice = (i: number, patch: Partial<Choice>) =>
    setChoices((prev) => {
      const next = prev.map((c, ix) => (ix === i ? { ...c, ...patch } : c))
      setErrors({})
      return next
    })
  const clearChoice = (i: number) =>
    setChoices((prev) => {
      const next = prev.filter((_, ix) => ix !== i)
      next.push({ date: null, times: [] })
      setErrors({})
      return next
    })

  const chooseCoach = (coachId: string) => {
    if (f.coach !== coachId) {
      setChoices(EMPTY_CHOICES.map((choice) => ({ ...choice, times: [] })))
      setOpenChoice(0)
      setWeekOffset(0)
    }
    setF({ coach: coachId })
    clearErr('coach')
  }

  const goStep = (n: number) => {
    if (n === 2 && !f.coach) {
      setErrors({ coach: 'Please select a coach or choose no preference.' })
      return
    }
    if (n === 3 && !prefs.length) {
      setErrors({ slots: 'Please choose at least one requested date and time.' })
      return
    }
    setStep(n)
    setErrors({})
    setStatus('idle')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submit = async (e?: { preventDefault?: () => void }) => {
    e?.preventDefault?.()
    const checkForm = { ...f, slots: prefs.map((p) => ({ date: p.date, time: p.time, flexible })) }
    const validationErrors = D.validate(checkForm, month)
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      setStatus('error')
      D.track('lesson_request_error', { fields: Object.keys(validationErrors) })
      return
    }
    setErrors({})
    setStatus('sending')
    const slots = choices
      .filter((c) => c.date && c.times.length)
      .map((c) => ({ date: c.date!, times: c.times }))
    try {
      const res = await fetch('/api/lesson-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: f.firstName.trim(),
          lastName: f.lastName.trim(),
          email: f.email.trim(),
          phone: f.phone,
          consent: !!f.consent,
          players: f.players || 1,
          playerNames: f.playerNames.trim() || null,
          city,
          coach: f.coach,
          slots,
          flexible,
          notes: f.notes.trim() || null,
        }),
      })
      const json = (await res.json().catch(() => null)) as { ok?: boolean } | null
      if (!res.ok || !json?.ok) throw new Error('request_failed')
      setStatus('success')
      setSubmittedName(f.firstName.trim())
      D.track('lesson_request_submitted', { coach: f.coach, city, players: f.players || 1 })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setStatus('error')
      D.track('lesson_request_error', { fields: ['network'] })
    }
  }

  const reset = () => {
    setStatus('idle')
    setStep(1)
    setForm(D.emptyForm())
    setChoices(EMPTY_CHOICES)
    setOpenChoice(0)
    setWeekOffset(0)
    setFlexible(false)
    setErrors({})
    setSubmittedName('')
  }

  const pickPlayers = (n: number) => {
    setF(n === 1 ? { players: 1, playerNames: '' } : { players: n })
    D.track('lesson_players_selected', { players: n })
  }

  const crumbLabels = ['Coach', 'Dates', 'Details']
  const summaryTimes = choices
    .map((c, i) =>
      c.date && c.times.length
        ? { badge: `${i + 1}.`, first: i === 0, label: `${shortDate(c.date)} · ${c.times.join(', ')}`, index: i }
        : null,
    )
    .filter((x): x is NonNullable<typeof x> => x !== null)

  const photoCoachObj = photoCoach ? D.coach(photoCoach) : null

  const eIso = earliestIso
  const stripBase = weekStart(earliest)

  const sectionMax: CSSProperties = { maxWidth: 1280, margin: '0 auto' }

  return (
    <div className="bp-lessons" style={{ minHeight: '60vh' }}>
      {/* ─── Page header: progress + heading + city ─── */}
      {!success && (
        <section id="top" style={{ background: 'var(--neutral-50)', borderBottom: '1px solid var(--border-default)', padding: '44px 24px 0' }}>
          <div style={sectionMax}>
            <nav aria-label="Progress" className="bp-stepper">
              {crumbLabels.map((label, i) => {
                const n = i + 1
                const cur = step === n
                const done = step > n
                return (
                  <div key={label} className="bp-stepper__segment" data-last={i === crumbLabels.length - 1 ? 'true' : 'false'}>
                    <button
                      type="button"
                      data-crumb=""
                      data-state={cur ? 'current' : done ? 'done' : 'locked'}
                      onClick={() => { if (n < step) goStep(n) }}
                      disabled={n > step}
                      aria-current={cur ? 'step' : undefined}
                    >
                      <span data-dot="">{n}</span>
                      <span>{label}</span>
                    </button>
                    {i < crumbLabels.length - 1 && <span data-step-line="" data-state={done ? 'done' : 'upcoming'} />}
                  </div>
                )
              })}
            </nav>
            <div data-m="stack" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px 32px', alignItems: 'flex-end', paddingBottom: 26 }}>
              <div style={{ flex: '1 1 460px', minWidth: 0 }}>
                <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, letterSpacing: '.09em', textTransform: 'uppercase', color: 'var(--lime-700)' }}>Private Pickleball Coaching</p>
                <h1 style={{ margin: '0 0 12px', fontSize: 'clamp(28px,3.8vw,44px)', lineHeight: 1.08, letterSpacing: '-.02em', color: 'var(--brand-navy)', textWrap: 'balance', fontWeight: 700 }}>Request a private pickleball lesson</h1>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: 'var(--fg-muted)', maxWidth: 620, textWrap: 'pretty' }}>One-on-one or small-group coaching in Toronto year-round and Muskoka in summer.</p>
              </div>
              <div style={{ flex: '0 0 auto', minWidth: 250 }}>
                <label className="bp-field">
                  <span className="bp-label">Lesson city</span>
                  <span className="bp-select">
                    <select
                      value={city}
                      onChange={(e) => {
                        const v = e.target.value
                        if (!v || (v === 'muskoka' && !mus.open)) return
                        setCity(v)
                        setF({ city: v, coach: '' })
                        setChoices(EMPTY_CHOICES.map((choice) => ({ ...choice, times: [] })))
                        setOpenChoice(0)
                        setWeekOffset(0)
                        D.track('lesson_city_selected', { city: v })
                      }}
                    >
                      {D.cities.map((c) => {
                        const cs = D.cityState(c.id, month)
                        return (
                          <option key={c.id} value={c.id}>
                            {c.name + (cs.open ? '' : ' — Returns in June')}
                          </option>
                        )
                      })}
                    </select>
                    <Chevron size={16} />
                  </span>
                </label>
              </div>
            </div>
            {city === 'muskoka' && !mus.open && (
              <div style={{ margin: '0 0 22px', background: 'var(--warning-bg)', border: '1px solid var(--warning-border)', borderRadius: 'var(--radius-lg)', padding: '16px 18px', display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
                <div style={{ flex: '1 1 320px', minWidth: 0 }}>
                  <p style={{ margin: '0 0 3px', fontSize: 15, fontWeight: 700, color: '#7c3a06' }}>{mus.heading}</p>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--warning-fg)' }}>{mus.message}</p>
                </div>
                <button type="button" className="bp-btn bp-btn--primary bp-btn--lg" onClick={() => { setCity('toronto'); setF({ city: 'toronto' }) }}>View Toronto Lessons</button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── Flow + summary ─── */}
      <section id="request" style={{ background: '#fff', padding: '34px 24px 64px' }}>
        <div data-m="stack" style={{ ...sectionMax, display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 560px', minWidth: 0 }}>
            {/* ── Success ── */}
            {success && (
              <div style={{ maxWidth: 880, margin: '0 auto', padding: '36px 0 20px' }}>
                <div role="status" style={{ border: '1px solid var(--lime-200)', background: 'var(--lime-50)', borderRadius: 'var(--radius-xl)', padding: '44px 32px', animation: 'bpFade .25s ease' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 9999, background: 'var(--brand-lime)', color: 'var(--navy-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <h2 style={{ margin: '0 0 12px', fontSize: 'clamp(23px,2.8vw,30px)', color: 'var(--brand-navy)', fontWeight: 700 }}>Your lesson request has been sent.</h2>
                  <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: 'var(--neutral-700)', maxWidth: 540 }}>
                    Thanks, {submittedName || 'there'}. We will review your requested times and usually get back to you within 24 hours. Once your lesson is confirmed, we will send you a secure payment link to complete the booking.
                  </p>
                </div>
                <div style={{ marginTop: 16, borderRadius: 'var(--radius-xl)', background: 'var(--brand-navy)', padding: '30px 32px', animation: 'bpFade .25s ease .05s both' }}>
                  <div data-m="stack" style={{ display: 'flex', flexWrap: 'wrap', gap: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: '1 1 330px', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 11, color: 'var(--brand-lime)' }}>
                        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" stroke="none" /></svg>
                        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase' }}>While you wait</span>
                      </div>
                      <h3 style={{ margin: '0 0 9px', fontSize: 'clamp(19px,2.1vw,23px)', lineHeight: 1.25, color: '#fff', fontWeight: 700 }}>Free tips from Joey every week</h3>
                      <p style={{ margin: '0 0 18px', fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,.78)', maxWidth: '46ch' }}>One skill per reel — ATPs, third-shot drops, resets and drills you can take straight to the court before your first lesson.</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 18px', alignItems: 'center' }}>
                        <a href="https://www.instagram.com/breakawaypickleball/" target="_blank" rel="noopener" data-igfollow="" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 44, padding: '0 22px', borderRadius: 'var(--radius-md)', background: 'var(--brand-lime)', color: 'var(--navy-900)', fontSize: 14, fontWeight: 700, textDecoration: 'none', transition: 'background 150ms ease' }}>
                          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" stroke="none" /></svg>
                          Follow @breakawaypickleball
                        </a>
                        <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,.62)' }}>36 reels · 300+ players following</span>
                      </div>
                      <button type="button" onClick={reset} data-resetlink="" style={{ margin: '18px 0 0', padding: 0, border: 0, background: 'none', font: 'inherit', fontSize: 13.5, fontWeight: 600, color: 'rgba(255,255,255,.6)', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>Book another lesson</button>
                    </div>
                    <div aria-hidden="true" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, flex: '0 0 auto' }}>
                      {[
                        { src: '/images/lessons/coach-joey-1.png', label: 'Hitting an ATP' },
                        { src: '/images/lessons/coach-joey-3.jpg', label: 'Third-shot drop' },
                        { src: '/images/lessons/coach-sam-3.jpg', label: 'Reset off the bounce' },
                      ].map((reel) => (
                        <div key={reel.label} style={{ position: 'relative', width: 96, height: 140, borderRadius: 10, overflow: 'hidden', background: 'rgba(255,255,255,.08)' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={reel.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(6,26,48,.86) 0%,rgba(6,26,48,0) 58%)' }} />
                          <svg viewBox="0 0 24 24" width="24" height="24" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-60%)' }}><circle cx="12" cy="12" r="11" fill="rgba(255,255,255,.9)" /><path d="M9.7 8.1 16 12l-6.3 3.9z" fill="#0b2d55" /></svg>
                          <span style={{ position: 'absolute', left: 8, right: 8, bottom: 8, fontSize: 10.5, fontWeight: 700, letterSpacing: '.02em', lineHeight: 1.25, color: '#fff' }}>{reel.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 1 · Choose your coach ── */}
            {!success && step === 1 && (
              <div>
                <h2 style={{ margin: '0 0 20px', fontSize: 23, color: 'var(--brand-navy)', fontWeight: 700 }}>Choose your coach</h2>
                <fieldset style={{ border: 0, padding: 0, margin: '0 0 24px' }}>
                  <legend style={{ padding: 0, margin: '0 0 9px', fontSize: 14, fontWeight: 600, color: 'var(--neutral-700)', display: 'flex', alignItems: 'center', gap: 8 }}>Players in lesson</legend>
                  <div data-m="stack" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 22px', alignItems: 'center' }}>
                    <div
                      className="chips"
                      role="radiogroup"
                      aria-label="Players including you"
                      onKeyDown={(e) => {
                        const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }
                        const dir = keys[e.key]
                        if (!dir) return
                        e.preventDefault()
                        const list = D.playerCounts
                        const cur = list.indexOf(price.players)
                        const next = list[(cur + dir + list.length) % list.length]
                        pickPlayers(next)
                        const group = e.currentTarget
                        const btn = group.querySelectorAll<HTMLButtonElement>('[role="radio"]')[list.indexOf(next)]
                        setTimeout(() => btn?.focus(), 0)
                      }}
                    >
                      {D.playerCounts.map((n) => (
                        <button key={n} type="button" className="chip" role="radio" aria-checked={(f.players || 1) === n} tabIndex={0} onClick={() => pickPlayers(n)}>
                          <Tick />
                          {n === 1 ? '1 player' : `${n} players`}
                        </button>
                      ))}
                    </div>
                    <p className="hint" style={{ fontSize: 13.5, maxWidth: '42ch' }}>+$20/hour per additional player</p>
                  </div>
                </fieldset>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {D.coachesForCity(city).map((c) => {
                    const on = f.coach === c.id
                    const ex = expanded === c.id
                    const p = D.pricing(c.id, f.players)
                    return (
                      <div key={c.id} data-coachcard="" data-sel={on ? 'true' : 'false'} style={{ borderRadius: 'var(--radius-lg)', background: '#fff', transition: 'border-color 150ms ease' }}>
                        <div data-m="stack" style={{ display: 'flex', gap: 18, alignItems: 'flex-start', padding: 20 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, flexShrink: 0 }}>
                            <button type="button" data-cpopen="" onClick={() => { setPhotoCoach(c.id); D.track('coach_photos_opened', { coach: c.id }) }} title={`View photos of ${c.firstName} (${D.photos(c.id).length})`} aria-label={`View photos of ${c.firstName} (${D.photos(c.id).length})`} style={{ position: 'relative', display: 'block', width: 96, height: 96, padding: 0, border: 0, borderRadius: 10, overflow: 'hidden', background: 'var(--neutral-100)', cursor: 'pointer' }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={c.image} alt={c.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }} />
                              <span data-cppill="" style={{ position: 'absolute', right: 5, bottom: 5, display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(10,42,70,.84)', color: '#fff', borderRadius: 9999, padding: '4px 7px', fontSize: 11, fontWeight: 700, lineHeight: 1, transition: 'background 160ms ease' }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="14" height="14" rx="2" /><path d="M7 4h12a2 2 0 0 1 2 2v12" /></svg>
                                {D.photos(c.id).length}
                              </span>
                            </button>
                          </div>
                          <button type="button" onClick={() => { chooseCoach(c.id); D.track('coach_selected', { coach: c.id, source: 'step1' }) }} aria-pressed={on} style={{ flex: 1, minWidth: 0, display: 'flex', gap: 18, alignItems: 'flex-start', background: 'none', border: 0, padding: 0, cursor: 'pointer', textAlign: 'left' }}>
                            <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                              <span style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 12px', alignItems: 'baseline' }}>
                                <span style={{ fontSize: 19, fontWeight: 700, color: 'var(--brand-navy)' }}>{c.name}</span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--lime-800)', background: 'var(--lime-50)', border: '1px solid var(--lime-200)', borderRadius: 9999, padding: '3px 10px' }}>{c.levelLabel}</span>
                              </span>
                              <span style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--neutral-600)' }}>{c.description}</span>
                              <span style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', fontSize: 13.5, color: 'var(--fg-muted)', paddingTop: 2 }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6EA626" strokeWidth="1.8"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 11h18" /></svg>
                                  Next available: {shortDate(D.earliestRequestDate(c.id, city, todayIso))}
                                </span>
                                <span>{c.ratingLabel || c.playerRating}</span>
                              </span>
                            </span>
                            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
                              <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--brand-navy)' }}>{p.total == null ? 'Rate on match' : D.money(p.total) + '/hour'}</span>
                              <span style={{ fontSize: 11.5, lineHeight: 1.35, color: 'var(--neutral-400)', textAlign: 'right', maxWidth: '16ch' }}>{p.splitLabel}</span>
                              <span data-check="" style={{ width: 24, height: 24, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="m5 13 4.5 4.5L19 7" /></svg>
                              </span>
                            </span>
                          </button>
                        </div>
                        <div style={{ borderTop: '1px solid var(--neutral-100)', padding: '12px 20px', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                          <button type="button" onClick={() => { const nx = ex ? null : c.id; setExpanded(nx); if (nx) D.track('coach_profile_viewed', { coach: c.id }) }} aria-expanded={ex} style={{ background: 'none', border: 0, padding: '6px 2px', fontSize: 13.5, fontWeight: 600, color: 'var(--brand-navy)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, minHeight: 40 }}>
                            {ex ? 'Hide profile' : `About ${c.firstName}`}
                            <span data-chev="" style={{ display: 'flex', flexShrink: 0, color: 'var(--fg-muted)', transition: 'transform 200ms ease' }}><Chevron /></span>
                          </button>
                          <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
                            {city === 'toronto'
                              ? 'Includes court fees at local Toronto facility.'
                              : 'Includes court fees at our Muskoka facility.'}
                          </span>
                        </div>
                        {ex && (
                          <div style={{ borderTop: '1px solid var(--neutral-100)', padding: 20, background: 'var(--neutral-50)', animation: 'bpFade .18s ease' }}>
                            <div style={{ marginBottom: 12 }}>
                              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--brand-navy)' }}>About {c.firstName}</h3>
                            </div>
                            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: 'var(--neutral-600)', maxWidth: '70ch', textWrap: 'pretty' }}>{c.bio}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                  <button type="button" onClick={() => { chooseCoach('none'); D.track('coach_selected', { coach: 'none', source: 'step1' }) }} aria-pressed={f.coach === 'none'} data-nopref="" style={{ display: 'flex', alignItems: 'center', gap: 14, borderRadius: 'var(--radius-lg)', padding: '18px 20px', minHeight: 64, cursor: 'pointer', transition: 'all 150ms ease' }}>
                    <span style={{ width: 44, height: 44, borderRadius: 9999, background: 'var(--navy-100)', color: 'var(--brand-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>?</span>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'left' }}>
                      <span style={{ fontSize: 16.5, fontWeight: 700, color: 'var(--brand-navy)' }}>No preference</span>
                      <span style={{ fontSize: 14, color: 'var(--fg-muted)' }}>Match me with the best available coach</span>
                    </span>
                  </button>
                </div>
                {errors.coach && <p className="err" style={{ marginTop: 8 }} role="alert">{errors.coach}</p>}
              </div>
            )}

            {/* ── Step 2 · Choose your dates ── */}
            {!success && step === 2 && (
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 6 }}>
                  <h2 style={{ margin: 0, fontSize: 23, color: 'var(--brand-navy)', fontWeight: 700 }}>Choose your dates</h2>
                </div>
                <p style={{ margin: '0 0 22px', fontSize: 15, lineHeight: 1.6, color: 'var(--fg-muted)', maxWidth: 600 }}>Add up to 3 options. We&rsquo;ll confirm the first available.</p>
                <div>
                  <div style={{ display: 'flex', gap: 13, alignItems: 'center', border: '1px solid var(--warning-border)', background: 'var(--warning-bg)', borderRadius: 'var(--radius-lg)', padding: '13px 17px', marginBottom: 22 }}>
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                    <p style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: 'var(--warning-fg)' }}>Currently booking: {MONTHS[earliest.getMonth()]} {earliest.getDate()} and later</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                    {choices.map((c, i) => {
                      const open = openChoice === i
                      const filled = !!(c.date && c.times.length)
                      const prev = i === 0 ? null : choices[i - 1]
                      const locked = !filled && !!prev && !(prev.date && prev.times.length)
                      const summary = filled
                        ? `${pretty(c.date!)} · ${c.times.join(', ')}`
                        : c.date
                          ? `${pretty(c.date)} · pick a time of day`
                          : i === 0
                            ? 'Required'
                            : 'Optional'
                      const ws = new Date(stripBase)
                      ws.setDate(ws.getDate() + weekOffset * 7)
                      const wEnd = new Date(ws)
                      wEnd.setDate(wEnd.getDate() + 6)
                      const monthLabel =
                        wEnd.getMonth() === ws.getMonth()
                          ? `${MONTHS[ws.getMonth()]} ${ws.getFullYear()}`
                          : `${MONTHS[ws.getMonth()]}${wEnd.getFullYear() !== ws.getFullYear() ? ' ' + ws.getFullYear() : ''} – ${MONTHS[wEnd.getMonth()]} ${wEnd.getFullYear()}`
                      let activeIso = c.date
                      if (!activeIso) {
                        const taken: Record<string, boolean> = {}
                        choices.forEach((o, ix) => { if (ix !== i && o.date) taken[o.date] = true })
                        const g = new Date(earliest)
                        let guard = 0
                        while (taken[iso(g)] && guard < 21) { g.setDate(g.getDate() + 1); guard++ }
                        activeIso = iso(g)
                      }
                      const dateCells = Array.from({ length: 7 }, (_, k) => {
                        const d = new Date(ws)
                        d.setDate(d.getDate() + k)
                        const dIso = iso(d)
                        const before = dIso < eIso
                        const allowed = D.isRequestDateAllowed(f.coach, city, dIso, todayIso)
                        const other = choices.reduce((acc, o, ix) => (ix !== i && o.date === dIso ? ix : acc), -1)
                        return {
                          dow: DOW[d.getDay()],
                          day: d.getDate(),
                          iso: dIso,
                          selected: activeIso === dIso,
                          disabled: !allowed,
                          kind: !allowed ? 'booked' : other > -1 ? 'taken' : 'open',
                          note: before ? 'Too soon' : !allowed ? 'Unavailable' : other > -1 ? ORDN[other] : '',
                        }
                      })
                      return (
                        <div key={i} data-choice="" data-open={open ? 'true' : 'false'} style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                          <button type="button" onClick={() => { setOpenChoice(open ? -1 : i); setWeekOffset(0) }} disabled={locked} aria-expanded={open} data-choicehead="" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '15px 17px', minHeight: 68, textAlign: 'left' }}>
                            <span data-rank="" data-filled={filled ? 'true' : 'false'} style={{ width: 32, height: 32, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{ORDN[i]}</span>
                            <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                              <span style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--brand-navy)' }}>{ORD[i]} choice</span>
                              <span data-choicesum="" data-filled={filled ? 'true' : 'false'} style={{ fontSize: 13.5, lineHeight: 1.4 }}>{summary}</span>
                            </span>
                            <span data-choiceaction="" style={{ fontSize: 13.5, fontWeight: 600, flexShrink: 0 }}>{locked ? '' : open ? 'Close' : filled ? 'Edit' : 'Add'}</span>
                          </button>
                          {open && (
                            <div style={{ padding: '0 17px 18px' }}>
                              <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--neutral-700)' }}>{monthLabel}</h4>
                                  <div style={{ display: 'flex', gap: 6 }}>
                                    <button type="button" onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))} disabled={weekOffset === 0} aria-label="Previous dates" data-nav="" style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="m15 18-6-6 6-6" /></svg>
                                    </button>
                                    <button type="button" onClick={() => setWeekOffset(weekOffset + 1)} aria-label="Next dates" data-nav="" style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="m9 6 6 6-6 6" /></svg>
                                    </button>
                                  </div>
                                </div>
                                {weekOffset === 0 && (
                                  <div data-void="" style={{ display: 'flex', alignItems: 'center', gap: 9, borderRadius: 9, padding: '9px 12px', marginBottom: 9 }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.4" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="m15 18-6-6 6-6" /></svg>
                                    <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg-muted)' }}>Booking starts {MONTHS[earliest.getMonth()].slice(0, 3)} {earliest.getDate()}</span>
                                  </div>
                                )}
                                <div role="group" aria-label="Requested date" style={{ display: 'grid', gridTemplateColumns: 'repeat(7,minmax(0,1fr))', gap: 8, marginBottom: 22 }}>
                                  {dateCells.map((d) => (
                                    <button key={d.iso} type="button" onClick={() => { if (!d.disabled) setChoice(i, { date: d.iso }) }} disabled={d.disabled} aria-pressed={d.selected} data-date="" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, borderRadius: 'var(--radius-md)', padding: '10px 4px', minHeight: 76, transition: 'all 150ms ease' }}>
                                      <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', opacity: 0.7 }}>{d.dow}</span>
                                      <span style={{ fontSize: 18, fontWeight: 700 }}>{d.day}</span>
                                      <span data-datenote="" data-kind={d.kind} style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', minHeight: 12 }}>{d.note}</span>
                                    </button>
                                  ))}
                                </div>
                                <h4 style={{ margin: '0 0 12px', fontSize: 14.5, fontWeight: 700, color: 'var(--neutral-700)' }}>Preferred time</h4>
                                <div className="chips">
                                  {D.timeOptions.map((t) => {
                                    const on = c.times.indexOf(t) !== -1
                                    return (
                                      <button key={t} type="button" className="chip" onClick={() => {
                                        const times = c.times.slice()
                                        const ix = times.indexOf(t)
                                        if (ix === -1) { times.push(t); D.track('lesson_date_added', { date: activeIso, time: t, rank: i + 1 }) } else times.splice(ix, 1)
                                        setChoice(i, { date: c.date || activeIso, times })
                                      }} aria-pressed={on}>
                                        <Tick />
                                        {t}
                                      </button>
                                    )
                                  })}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 18, alignItems: 'center' }}>
                                  <button type="button" className="bp-btn bp-btn--primary bp-btn--lg" onClick={() => { setOpenChoice(i < 2 ? i + 1 : -1); setWeekOffset(0) }} disabled={!filled}>
                                    {i < 2 ? `Add ${ORDL[i + 1]} choice` : 'Done'}
                                  </button>
                                  {filled && (
                                    <button type="button" className="bp-btn bp-btn--ghost bp-btn--lg" onClick={() => clearChoice(i)}>Clear this choice</button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <label className="bp-check-row">
                    <span className={`bp-check${flexible ? ' bp-check--on' : ''}`}>
                      {flexible && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                    </span>
                    <input type="checkbox" checked={flexible} onChange={(e) => setFlexible(e.target.checked)} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }} />
                    I&rsquo;m flexible within an hour or two of my preferred times
                  </label>
                  {errors.slots && <p className="err" style={{ marginTop: 10 }} role="alert">{errors.slots}</p>}
                </div>
              </div>
            )}

            {/* ── Step 3 · Your details ── */}
            {!success && step === 3 && (
              <div>
                <h2 style={{ margin: '0 0 6px', fontSize: 23, color: 'var(--brand-navy)', fontWeight: 700 }}>Your details</h2>
                <p style={{ margin: '0 0 24px', fontSize: 15, lineHeight: 1.6, color: 'var(--fg-muted)' }}>We use these to confirm your lesson and send your secure payment link.</p>
                {status === 'error' && (
                  <div role="alert" style={{ border: '1px solid #fecaca', background: '#fef2f2', borderRadius: 'var(--radius-md)', padding: '18px 20px', marginBottom: 24, display: 'flex', gap: 14, animation: 'bpFade .2s ease' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></svg>
                    <div>
                      <h3 style={{ margin: '0 0 5px', fontSize: 16, color: '#b91c1c', fontWeight: 700 }}>We couldn&rsquo;t send your request.</h3>
                      <p style={{ margin: '0 0 12px', fontSize: 14.5, lineHeight: 1.55, color: '#7f1d1d' }}>Please check the highlighted fields and try again. If the problem continues, contact Breakaway directly and we will help arrange your lesson.</p>
                      <button type="button" className="bp-btn bp-btn--primary bp-btn--md" onClick={() => submit()}>Try Again</button>
                    </div>
                  </div>
                )}
                <form onSubmit={(e) => submit(e)} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 18 }}>
                    <Field label="First name" required error={errors.firstName}>
                      <input className="bp-input" type="text" value={f.firstName} onChange={(e) => { setF({ firstName: e.target.value }); clearErr('firstName') }} placeholder="Enter your first name" aria-invalid={!!errors.firstName} />
                    </Field>
                    <Field label="Last name" required error={errors.lastName}>
                      <input className="bp-input" type="text" value={f.lastName} onChange={(e) => { setF({ lastName: e.target.value }); clearErr('lastName') }} placeholder="Enter your last name" aria-invalid={!!errors.lastName} />
                    </Field>
                    <Field label="Email address" required error={errors.email}>
                      <input className="bp-input" type="email" value={f.email} onChange={(e) => { setF({ email: e.target.value }); clearErr('email') }} placeholder="you@example.com" aria-invalid={!!errors.email} />
                    </Field>
                    <Field label="Cell phone" required error={errors.phone}>
                      <input className="bp-input" type="tel" inputMode="tel" autoComplete="tel" maxLength={14} value={f.phone} onChange={(e) => { setF({ phone: D.formatPhone(e.target.value) }); clearErr('phone') }} placeholder="(416) 555-0142" aria-invalid={!!errors.phone} />
                    </Field>
                  </div>
                  <div style={{ position: 'relative', background: 'linear-gradient(180deg,#f6fce9 0%,#fbfef4 100%)', border: '2px solid var(--brand-lime)', borderRadius: 'var(--radius-md)', padding: '20px 22px', boxShadow: '0 2px 10px rgba(144,209,35,.18)' }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 10, background: 'var(--brand-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-lime)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-3-.5L4 21l1.6-4.2A8.2 8.2 0 0 1 3.6 11.5 8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4z" /></svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap', marginBottom: 5 }}>
                          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--brand-navy)', letterSpacing: '-.01em' }}>Confirm faster by text</h3>
                          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--brand-navy)', background: 'var(--brand-lime)', borderRadius: 999, padding: '3px 9px' }}>Recommended</span>
                        </div>
                        <p style={{ margin: '0 0 14px', fontSize: 14.5, lineHeight: 1.55, color: 'var(--neutral-600)', maxWidth: '62ch' }}>Coaches are often on court. Texting helps them confirm your time sooner.</p>
                        <div style={{ background: '#fff', border: '1px solid rgba(144,209,35,.55)', borderRadius: 10, padding: '13px 15px' }}>
                          <label className="bp-check-row">
                            <span className={`bp-check${f.consent ? ' bp-check--on' : ''}`}>
                              {f.consent && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                            </span>
                            <input type="checkbox" checked={f.consent} onChange={(e) => setF({ consent: e.target.checked })} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }} />
                            Yes, text me about this lesson.
                          </label>
                        </div>
                        <p style={{ margin: '10px 0 0', fontSize: 13, lineHeight: 1.5, color: 'var(--neutral-400)' }}>Lesson updates only. No marketing.</p>
                      </div>
                    </div>
                  </div>
                  {price.players > 1 && (
                    <div className="field">
                      <label className="lbl" htmlFor="lbPlayerNames">Other players&rsquo; names <span className="opt">(optional)</span></label>
                      <input className="inp" id="lbPlayerNames" type="text" value={f.playerNames} onChange={(e) => setF({ playerNames: e.target.value })} placeholder="Add the names of the other players" />
                      <p className="hint">Helps your coach plan the session. You can add names later if you are not sure yet.</p>
                    </div>
                  )}
                  <div className="field">
                    <label className="lbl" htmlFor="lbNotes">Anything else? <span className="opt">(optional)</span></label>
                    <textarea className="inp" id="lbNotes" rows={4} value={f.notes} onChange={(e) => setF({ notes: e.target.value })} placeholder="Goals, scheduling notes, or questions for your coach." />
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* ── Sticky summary ── */}
          {!success && (
            <aside data-m="full" style={{ flex: '0 0 348px', minWidth: 0, position: 'sticky', top: 24 }}>
              <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', background: '#fff', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
                <div style={{ padding: 20, borderBottom: '1px solid var(--border-default)', display: 'flex', gap: 14, alignItems: 'center' }}>
                  <span style={{ width: 46, height: 46, borderRadius: 9999, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, overflow: 'hidden', background: 'var(--navy-100)', color: 'var(--brand-navy)', border: '1.5px solid var(--border-default)' }}>
                    {sel?.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={sel.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }} />
                    ) : (
                      sel ? sel.firstName.charAt(0) : '?'
                    )}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 700, color: 'var(--brand-navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {sel ? sel.name : f.coach === 'none' ? 'No preference' : 'Choose a coach'}
                    </p>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-muted)' }}>
                      {sel ? sel.selectorDescriptor : f.coach === 'none' ? 'Best available coach' : 'Step 1 of 3'}
                    </p>
                  </div>
                </div>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 14.5 }}>
                    <span style={{ color: 'var(--fg-muted)' }}>Lesson city</span>
                    <span style={{ fontWeight: 600, color: 'var(--fg-default)' }}>{city === 'muskoka' ? 'Muskoka' : 'Toronto'}</span>
                  </div>
                  <div style={{ borderTop: '1px solid var(--neutral-100)', paddingTop: 14 }}>
                    <p style={{ margin: '0 0 9px', fontSize: 13, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Requested times</p>
                    {summaryTimes.length ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {summaryTimes.map((t) => (
                          <div key={t.badge} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--neutral-50)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '10px 12px' }}>
                            <span data-tbadge="" data-first={t.first ? 'true' : 'false'} style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', borderRadius: 9999, padding: '4px 8px', flexShrink: 0 }}>{t.badge}</span>
                            <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 600, color: 'var(--fg-default)' }}>{t.label}</span>
                            <button type="button" onClick={() => clearChoice(t.index)} aria-label="Remove this time" style={{ background: 'none', border: 0, padding: 6, cursor: 'pointer', color: 'var(--fg-muted)', display: 'flex', flexShrink: 0 }}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: 'var(--neutral-400)' }}>No dates selected yet</p>
                    )}
                  </div>
                  <div style={{ borderTop: '1px solid var(--neutral-100)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                      <span style={{ fontSize: 13.5, color: 'var(--fg-muted)' }}>Players</span>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg-default)', textAlign: 'right' }}>{price.playersLabel}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                      <span style={{ fontSize: 13.5, color: 'var(--fg-muted)' }}>Coach rate</span>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg-default)' }}>{price.baseLabel}</span>
                    </div>
                    {price.players > 1 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                        <span style={{ fontSize: 13.5, color: 'var(--fg-muted)' }}>
                          Additional players
                          <span style={{ display: 'block', fontSize: 12, color: 'var(--neutral-400)' }}>{price.extraDetail}</span>
                        </span>
                        <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg-default)' }}>{price.extraLabel}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ borderTop: '1px solid var(--neutral-100)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-default)' }}>{summaryTimes.length && price.total != null ? 'Estimated total' : 'Hourly rate'}</span>
                    <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--brand-navy)', letterSpacing: '-.015em' }}>{price.total == null ? '—' : D.money(price.total) + '/hour'}</span>
                  </div>
                  {price.players > 1 && price.splitLabel && (
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-muted)' }}>{price.splitLabel}</p>
                  )}
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--fg-muted)', display: 'flex', gap: 9 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6EA626" strokeWidth="1.9" style={{ flexShrink: 0, marginTop: 1 }}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /></svg>
                    <span>No charge today. Payment is due once your lesson is confirmed.</span>
                  </p>
                  {price.players > 1 && (
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--neutral-600)' }}>The person submitting the request pays the full lesson total after the coach confirms. Other players can repay them separately.</p>
                  )}
                  <button type="button" className="bp-btn bp-btn--primary bp-btn--lg bp-btn--block bp-btn--tall" onClick={() => { if (step < 3) goStep(step + 1); else submit() }} disabled={status === 'sending'}>
                    {status === 'sending' && <span style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,.35)', borderTopColor: '#fff', borderRadius: 9999, display: 'inline-block', animation: 'bpSpin .7s linear infinite' }} />}
                    {status === 'sending' ? 'Sending Request…' : step === 3 ? 'Request My Lesson' : 'Continue'}
                  </button>
                  {step > 1 && (
                    <button type="button" className="bp-btn bp-btn--ghost bp-btn--lg bp-btn--block" onClick={() => goStep(step - 1)}>Back</button>
                  )}
                </div>
                <div style={{ borderTop: '1px solid var(--border-default)' }}>
                  <button type="button" onClick={() => setPolicyOpen(!policyOpen)} aria-expanded={policyOpen} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: 'var(--neutral-50)', border: 0, padding: '16px 20px', cursor: 'pointer', textAlign: 'left', minHeight: 52 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--brand-navy)' }}>Payment &amp; cancellation</span>
                    <span data-chev="" style={{ display: 'flex', flexShrink: 0, color: 'var(--fg-muted)', transition: 'transform 200ms ease' }}><Chevron size={16} /></span>
                  </button>
                  {policyOpen && (
                    <div style={{ padding: '4px 20px 20px', background: 'var(--neutral-50)', display: 'flex', flexDirection: 'column', gap: 11 }}>
                      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--neutral-600)' }}>Lessons are prepaid. Once your coach, court, date and time have been confirmed, we will send you a secure link to complete your booking by credit card.</p>
                      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--neutral-600)' }}>Lessons may be cancelled up to 72 hours before the scheduled start time for a full refund.</p>
                      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--neutral-600)' }}>Cancellations made less than 72 hours before the lesson are non-refundable because the court booking can no longer be cancelled. However, the lesson may be transferred to another person who can attend at the originally scheduled time.</p>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          )}
        </div>
      </section>

      {/* ─── Value props + FAQ ─── */}
      {!success && (
        <>
          <section style={{ background: 'var(--brand-navy)', padding: '56px 24px' }}>
            <div data-m="onecol" style={{ ...sectionMax, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 40 }}>
              <div>
                <h2 style={{ margin: '0 0 14px', fontSize: 'clamp(24px,2.8vw,32px)', color: '#fff', letterSpacing: '-.02em', fontWeight: 700 }}>Focused coaching. Faster progress.</h2>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: 'rgba(255,255,255,.84)', textWrap: 'pretty' }}>Private lessons give your coach the time to focus entirely on your game. Bring a friend or two and the lesson still stays personal — your coach adjusts the drills so everyone on court is working on something that matters to them.</p>
              </div>
              <div>
                <h3 style={{ margin: '0 0 6px', fontSize: 16.5, color: 'var(--brand-lime)', fontWeight: 700 }}>Coaching built around you</h3>
                <p style={{ margin: '0 0 20px', fontSize: 14.5, lineHeight: 1.6, color: 'rgba(255,255,255,.78)' }}>Work on the skills and situations that will make the greatest difference in your game.</p>
                <h3 style={{ margin: '0 0 6px', fontSize: 16.5, color: 'var(--brand-lime)', fontWeight: 700 }}>Immediate feedback</h3>
                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: 'rgba(255,255,255,.78)' }}>Understand what needs to change and make adjustments while the movement is still fresh.</p>
              </div>
              <div>
                <h3 style={{ margin: '0 0 6px', fontSize: 16.5, color: 'var(--brand-lime)', fontWeight: 700 }}>Bring one or two friends</h3>
                <p style={{ margin: '0 0 20px', fontSize: 14.5, lineHeight: 1.6, color: 'rgba(255,255,255,.78)' }}>Lessons can include up to three players. Each additional player adds $20 per hour to the lesson rate.</p>
                <h3 style={{ margin: '0 0 6px', fontSize: 16.5, color: 'var(--brand-lime)', fontWeight: 700 }}>We usually respond within 24 hours</h3>
                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: 'rgba(255,255,255,.78)' }}>Once your coach and court are confirmed, we send a secure link to complete your booking.</p>
              </div>
            </div>
          </section>
          <section style={{ background: '#fff', padding: '56px 24px 24px' }}>
            <div style={sectionMax}>
              <h2 style={{ margin: '0 0 26px', fontSize: 'clamp(24px,2.6vw,30px)', color: 'var(--brand-navy)', letterSpacing: '-.02em', fontWeight: 700 }}>Frequently asked questions</h2>
              <div data-m="onecol" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '0 44px' }}>
                {FAQ_DATA.map(([q, a], i) => (
                  <div key={q} style={{ borderBottom: '1px solid var(--border-default)' }}>
                    <button type="button" onClick={() => setFaqOpen(faqOpen === i ? -1 : i)} aria-expanded={faqOpen === i} style={{ width: '100%', display: 'flex', gap: 14, alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 0, padding: '17px 2px', textAlign: 'left', cursor: 'pointer', minHeight: 54 }}>
                      <span style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--brand-navy)' }}>{q}</span>
                      <span data-chev="" style={{ display: 'flex', flexShrink: 0, color: 'var(--fg-muted)', transition: 'transform 200ms ease' }}><Chevron size={17} /></span>
                    </button>
                    {faqOpen === i && (
                      <p style={{ margin: 0, padding: '0 2px 20px', fontSize: 14.5, lineHeight: 1.65, color: 'var(--neutral-600)' }}>{a}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ─── Coach photos lightbox ─── */}
      {photoCoachObj && (
        <CoachPhotosLightbox
          photos={D.photos(photoCoachObj.id)}
          coachName={photoCoachObj.name}
          coachId={photoCoachObj.id}
          onClose={() => setPhotoCoach(null)}
        />
      )}
    </div>
  )
}
