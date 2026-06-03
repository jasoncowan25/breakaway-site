"use client"

import { useEffect, useRef, useState } from "react"
import styles from "@/app/camp-alerts/camp-alerts.module.css"

const SKILLS = [
  { id: "beginner", label: "Beginner (2.5–3.0)" },
  { id: "intermediate", label: "Intermediate (3.0–3.5)" },
  { id: "advanced", label: "Advanced (4.0+)" },
  { id: "kids", label: "Kids Camps (Ages 8–16)" },
]

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export function CampAlertsForm() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [skills, setSkills] = useState<string[]>([])

  const [errFirst, setErrFirst] = useState(false)
  const [errEmail, setErrEmail] = useState(false)
  const [errSkill, setErrSkill] = useState(false)
  const [shake, setShake] = useState<Record<string, boolean>>({})

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [successLabels, setSuccessLabels] = useState<string[]>([])
  const [successHasPhone, setSuccessHasPhone] = useState(false)

  const utm = useRef<Record<string, string>>({})
  const referrer = useRef<string>("")

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const captured: Record<string, string> = {}
      for (const k of UTM_KEYS) {
        const v = params.get(k)
        if (v) captured[k] = v
      }
      utm.current = captured
      referrer.current = document.referrer || ""
    } catch {
      /* no-op */
    }
  }, [])

  function toggleSkill(id: string) {
    setErrSkill(false)
    setShake((s) => ({ ...s, chips: false }))
    setSkills((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function onPhoneChange(value: string) {
    const d = value.replace(/\D/g, "").slice(0, 10)
    let out = ""
    if (d.length > 0) out = "(" + d.slice(0, 3)
    if (d.length >= 4) out += ") " + d.slice(3, 6)
    if (d.length >= 7) out += "-" + d.slice(6, 10)
    setPhone(out)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    const okFirst = firstName.trim().length > 0
    const okEmail = isEmail(email)
    const okSkill = skills.length > 0

    setErrFirst(!okFirst)
    setErrEmail(!okEmail)
    setErrSkill(!okSkill)

    if (!okFirst || !okEmail || !okSkill) {
      setShake({ firstName: !okFirst, email: !okEmail, chips: !okSkill && okFirst && okEmail })
      return
    }

    setSubmitting(true)
    try {
      await fetch("/api/camp-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim() || null,
          email: email.trim(),
          phone: phone.replace(/\D/g, "").length === 10 ? phone : null,
          skillLevels: skills,
          source: utm.current.utm_source || "camp_alerts",
          utm: utm.current,
          referrer: referrer.current || null,
        }),
      })
    } catch {
      /* Best-effort: still confirm to the visitor; the API dedupes on retry. */
    }

    setSuccessHasPhone(phone.replace(/\D/g, "").length === 10)
    setSuccessLabels(SKILLS.filter((s) => skills.includes(s.id)).map((s) => s.label))
    setSubmitting(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className={styles.success} aria-live="polite">
        <div className={styles.badge}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2 className={styles.successTitle}>You&apos;re on the List</h2>
        <p className={styles.successText}>
          {successHasPhone
            ? "We'll text or email you the moment the next camp goes live."
            : "We'll email you the moment the next camp goes live."}
        </p>
        <div className={styles.tags}>
          {successLabels.map((l) => (
            <span key={l} className={styles.tag}>
              {l}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className={`${styles.field} ${styles.row}`}>
        <div>
          <label className={styles.lbl} htmlFor="firstName">
            First Name<span className={styles.req}>*</span>
          </label>
          <input
            className={`${styles.inp} ${errFirst ? styles.invalid : ""} ${shake.firstName ? styles.shake : ""}`}
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="Jordan"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value)
              setErrFirst(false)
            }}
            onAnimationEnd={() => setShake((s) => ({ ...s, firstName: false }))}
          />
        </div>
        <div>
          <label className={styles.lbl} htmlFor="lastName">
            Last Name <span className={styles.opt}>(optional)</span>
          </label>
          <input
            className={styles.inp}
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Lee"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.lbl} htmlFor="email">
          Email Address<span className={styles.req}>*</span>
        </label>
        <input
          className={`${styles.inp} ${errEmail ? styles.invalid : ""} ${shake.email ? styles.shake : ""}`}
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setErrEmail(false)
          }}
          onAnimationEnd={() => setShake((s) => ({ ...s, email: false }))}
        />
        <span className={`${styles.err} ${errEmail ? styles.show : ""}`}>
          Enter a valid email so we can reach you.
        </span>
      </div>

      <div className={styles.field}>
        <label className={styles.lbl} htmlFor="phone">
          Cell Phone <span className={styles.opt}>(optional)</span>
        </label>
        <input
          className={styles.inp}
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(416) 555-0142"
          maxLength={14}
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
        />
        <span className={styles.hint}>Optional — for text alerts when camps open.</span>
      </div>

      <div className={styles.field}>
        <label className={styles.lbl}>
          Skill Level<span className={styles.req}>*</span> <span className={styles.opt}>(select all that apply)</span>
        </label>
        <div className={`${styles.chips} ${shake.chips ? styles.shake : ""}`} role="group" aria-label="Skill level" onAnimationEnd={() => setShake((s) => ({ ...s, chips: false }))}>
          {SKILLS.map((s) => {
            const on = skills.includes(s.id)
            return (
              <button
                key={s.id}
                type="button"
                className={`${styles.chip} ${on ? styles.chipOn : ""}`}
                aria-pressed={on}
                onClick={() => toggleSkill(s.id)}
              >
                <span className={styles.tick}>
                  <Check />
                </span>
                {s.label}
              </button>
            )
          })}
        </div>
        <span className={`${styles.err} ${errSkill ? styles.show : ""}`}>
          Please pick at least one skill level so we can match you.
        </span>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? "Submitting…" : "Notify Me"}
          {!submitting && (
            <svg className={styles.arrow} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          )}
        </button>
        <p className={styles.footnote}>No spam, ever. Unsubscribe anytime in one tap.</p>
      </div>
    </form>
  )
}
