"use client"

import { useEffect, useRef, useState } from "react"
import styles from "@/app/preferences/preferences.module.css"

// Canonical bands — labels match the signup form, emails, and admin. The stored
// values are the lowercase keys; only the display text lives here.
const SKILLS = [
  { key: "beginner", label: "Beginner (2.5–3.0)" },
  { key: "intermediate", label: "Intermediate (3.0–3.5)" },
  { key: "advanced", label: "Advanced (3.75+)" },
  { key: "kids", label: "Kids Camps (all levels)" },
]

const REGIONS = [
  { key: "toronto", label: "Toronto & GTA" },
  { key: "muskoka", label: "Muskoka" },
]

const skillLabel = (k: string) => SKILLS.find((s) => s.key === k)?.label ?? k
const regionLabel = (k: string) => REGIONS.find((r) => r.key === k)?.label ?? k

type View = "prefs" | "saved" | "unsubbed"

interface PrefsState {
  email: string
  channels: { email: boolean; sms: boolean }
  skillLevels: string[]
  regions: string[]
  phone: string | null
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}
function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function formatPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 10)
  let out = ""
  if (d.length > 0) out = "(" + d.slice(0, 3)
  if (d.length >= 4) out += ") " + d.slice(3, 6)
  if (d.length >= 7) out += "-" + d.slice(6, 10)
  return out
}

export function PreferencesManager() {
  const tokenRef = useRef<string>("")
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [email, setEmail] = useState("")
  const [emailOn, setEmailOn] = useState(true)
  const [textOn, setTextOn] = useState(false)
  const [phone, setPhone] = useState("")
  const [phoneErr, setPhoneErr] = useState(false)
  const [phoneShake, setPhoneShake] = useState(false)
  const [skills, setSkills] = useState<string[]>([])
  const [regions, setRegions] = useState<string[]>([])
  const [skillErr, setSkillErr] = useState(false)
  const [skillShake, setSkillShake] = useState(false)

  const [view, setView] = useState<View>("prefs")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [savedMsg, setSavedMsg] = useState("")
  const [savedTags, setSavedTags] = useState<string[]>([])

  const phoneInputRef = useRef<HTMLInputElement>(null)

  // ---- Load current preferences from the signed link ----
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token") || params.get("t") || ""
    tokenRef.current = token
    if (!token) {
      setLoadError("This link is missing its access token. Open the link from your email again.")
      setLoading(false)
      return
    }
    let cancelled = false
    fetch(`/api/preferences?token=${encodeURIComponent(token)}`)
      .then(async (r) => {
        const json = await r.json().catch(() => ({}))
        if (!r.ok || !json?.ok) throw new Error(json?.error || "load_failed")
        return json.data as PrefsState
      })
      .then((data) => {
        if (cancelled) return
        setEmail(data.email)
        setEmailOn(data.channels.email)
        setTextOn(data.channels.sms)
        setPhone(data.phone ? formatPhone(data.phone) : "")
        setSkills(data.skillLevels ?? [])
        setRegions(data.regions ?? [])
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setLoadError("We couldn't open your preferences. The link may have expired — try the link in your latest email.")
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  function toggleText() {
    setTextOn((on) => {
      const next = !on
      if (next) {
        window.setTimeout(() => phoneInputRef.current?.focus(), 280)
      } else {
        setPhoneErr(false)
      }
      return next
    })
  }

  function onPhoneChange(value: string) {
    setPhone(formatPhone(value))
    setPhoneErr(false)
  }

  function toggleIn(list: string[], setList: (v: string[]) => void, key: string) {
    setList(list.includes(key) ? list.filter((k) => k !== key) : [...list, key])
  }

  async function post(body: Record<string, unknown>): Promise<PrefsState | null> {
    const res = await fetch("/api/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: tokenRef.current, ...body }),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok || !json?.ok) return null
    return json.data as PrefsState
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault()

    if (textOn) {
      const valid = phone.replace(/\D/g, "").length === 10
      if (!valid) {
        setPhoneErr(true)
        setPhoneShake(false)
        window.requestAnimationFrame(() => setPhoneShake(true))
        phoneInputRef.current?.focus()
        return
      }
    }
    if ((emailOn || textOn) && skills.length === 0) {
      setSkillErr(true)
      setSkillShake(false)
      window.requestAnimationFrame(() => setSkillShake(true))
      return
    }

    setSubmitting(true)
    const result = await post({
      action: "save",
      channels: { email: emailOn, sms: textOn },
      phone: phone.replace(/\D/g, "").length === 10 ? phone : null,
      skillLevels: skills,
      regions,
    })
    setSubmitting(false)

    // Build the saved summary regardless of network result (best-effort UX),
    // but prefer server-confirmed state when present.
    const tags: string[] = []
    if (emailOn) tags.push("Email")
    if (textOn) tags.push("Text")
    skills.forEach((s) => tags.push(skillLabel(s)))
    regions.forEach((r) => tags.push(regionLabel(r)))

    if (!emailOn && !textOn) {
      setSavedMsg("Both channels are off, so you won't get alerts. Flip one on anytime to start hearing about camps again.")
      setSavedTags([])
    } else {
      const via = emailOn && textOn ? "email and text" : textOn ? "text" : "email"
      setSavedMsg(`You're all set. We'll reach you by ${via} about the camps you chose.`)
      setSavedTags(tags)
    }
    if (result) {
      setSkills(result.skillLevels ?? [])
      setRegions(result.regions ?? [])
    }
    setView("saved")
    window.scrollTo({ top: 0 })
  }

  async function onConfirmUnsub() {
    setConfirmOpen(false)
    setSubmitting(true)
    await post({ action: "unsubscribe" })
    setSubmitting(false)
    setEmailOn(false)
    setTextOn(false)
    setView("unsubbed")
    window.scrollTo({ top: 0 })
  }

  async function onResub() {
    setSubmitting(true)
    await post({ action: "resubscribe" })
    setSubmitting(false)
    setEmailOn(true)
    setView("prefs")
    window.scrollTo({ top: 0 })
  }

  // ---- Render ----
  if (loading) {
    return <p className={styles.loading}>Loading your preferences…</p>
  }
  if (loadError) {
    return (
      <section className={styles.result}>
        <h2>Link Trouble</h2>
        <p>{loadError}</p>
      </section>
    )
  }

  if (view === "saved") {
    return (
      <section className={styles.result} aria-live="polite">
        <div className={`${styles.badge} ${styles.badgeGo}`}>
          <CheckIcon />
        </div>
        <h2>Preferences Saved</h2>
        <p>{savedMsg}</p>
        {savedTags.length > 0 && (
          <div className={styles.tags}>
            {savedTags.map((t) => (
              <span key={t} className={styles.tag}>
                {t}
              </span>
            ))}
          </div>
        )}
        <button type="button" className={styles.ghost} onClick={() => setView("prefs")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          Edit preferences
        </button>
      </section>
    )
  }

  if (view === "unsubbed") {
    return (
      <section className={styles.result} aria-live="polite">
        <div className={`${styles.badge} ${styles.badgeBye}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </div>
        <h2>You&apos;re Unsubscribed</h2>
        <p>
          We&apos;ve removed <b>{email || "this address"}</b> from all camp alerts. Sorry to see you go — the courts
          will miss you.
        </p>
        <button type="button" className={styles.ghost} onClick={onResub} disabled={submitting}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          I changed my mind — resubscribe
        </button>
      </section>
    )
  }

  return (
    <section>
      <span className={styles.eyebrow}>Breakaway Pickleball</span>
      <h1 className={styles.headline}>Your Notification Preferences</h1>
      <p className={styles.subtitle}>Choose how we reach you and which camps you want to hear about. Update anytime.</p>

      {/* Locked identity */}
      <div className={styles.identity}>
        <span className={styles.identityIc} aria-hidden="true">
          <MailIcon />
        </span>
        <span className={styles.identityMeta}>
          <span className={styles.k}>Preferences for</span>
          <span className={styles.v}>{email}</span>
        </span>
        <span className={styles.lock} title="This is the address from your link" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </span>
      </div>

      <form onSubmit={onSave} noValidate>
        {/* Channels */}
        <div className={styles.section}>
          <span className={styles.sectionHead}>How we reach you</span>
          <span className={styles.sectionSub}>Turn each channel on or off.</span>

          <div
            className={styles.toggleRow}
            role="checkbox"
            aria-checked={emailOn}
            tabIndex={0}
            onClick={() => setEmailOn((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault()
                setEmailOn((v) => !v)
              }
            }}
          >
            <span className={styles.chipIc} aria-hidden="true">
              <MailIcon />
            </span>
            <span className={styles.trText}>
              <span className={styles.t}>Email alerts</span>
              <span className={styles.d}>Camp launches matching your levels.</span>
            </span>
            <span className={styles.switch} aria-hidden="true" />
          </div>

          <div
            className={styles.toggleRow}
            role="checkbox"
            aria-checked={textOn}
            tabIndex={0}
            onClick={toggleText}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault()
                toggleText()
              }
            }}
          >
            <span className={styles.chipIc} aria-hidden="true">
              <MessageIcon />
            </span>
            <span className={styles.trText}>
              <span className={styles.t}>Text alerts</span>
              <span className={styles.d}>A quick SMS the moment a camp opens.</span>
            </span>
            <span className={styles.switch} aria-hidden="true" />
          </div>

          <div className={`${styles.phoneReveal} ${textOn ? styles.open : ""}`}>
            <label className={styles.lbl} htmlFor="phone">
              Cell phone for texts
            </label>
            <input
              ref={phoneInputRef}
              className={`${styles.inp} ${phoneErr ? styles.invalid : ""} ${phoneShake ? styles.shake : ""}`}
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="(416) 555-0142"
              maxLength={14}
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              onAnimationEnd={() => setPhoneShake(false)}
            />
            <span className={`${styles.err} ${phoneErr ? styles.show : ""}`}>
              Enter a 10-digit number so we can text you.
            </span>
            <span className={styles.hint}>Standard message rates may apply. Reply STOP anytime.</span>
          </div>
        </div>

        {/* Skill levels */}
        <div className={styles.section}>
          <span className={styles.sectionHead}>Camps you care about</span>
          <span className={styles.sectionSub}>Pick any that fit — we&apos;ll only alert you about these.</span>
          <div className={`${styles.chips} ${skillShake ? styles.shake : ""}`} role="group" aria-label="Skill level" onAnimationEnd={() => setSkillShake(false)}>
            {SKILLS.map((s) => {
              const on = skills.includes(s.key)
              return (
                <button
                  key={s.key}
                  type="button"
                  className={styles.chip}
                  aria-pressed={on}
                  onClick={() => {
                    setSkillErr(false)
                    toggleIn(skills, setSkills, s.key)
                  }}
                >
                  <span className={styles.tick}>
                    <CheckIcon />
                  </span>
                  {s.label}
                </button>
              )
            })}
          </div>
          <span className={`${styles.err} ${skillErr ? styles.show : ""}`}>
            Pick at least one — or unsubscribe below to stop everything.
          </span>
        </div>

        {/* Location */}
        <div className={styles.section}>
          <span className={styles.sectionHead}>Where you&apos;d play</span>
          <span className={styles.sectionSub}>Choose one or both regions.</span>
          <div className={styles.chips} role="group" aria-label="Region">
            {REGIONS.map((r) => {
              const on = regions.includes(r.key)
              return (
                <button
                  key={r.key}
                  type="button"
                  className={styles.chip}
                  aria-pressed={on}
                  onClick={() => toggleIn(regions, setRegions, r.key)}
                >
                  <span className={styles.tick}>
                    <CheckIcon />
                  </span>
                  {r.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? "Saving…" : "Save Preferences"}
          </button>
        </div>
      </form>

      {/* Unsubscribe-all */}
      <div className={styles.divider} />
      <div className={styles.unsubZone}>
        <p>Want to stop hearing from us entirely?</p>
        <button type="button" className={styles.linkbtn} onClick={() => setConfirmOpen(true)}>
          Unsubscribe from all emails &amp; texts
        </button>
      </div>

      {/* Unsubscribe confirm modal */}
      <div
        className={`${styles.confirmOverlay} ${confirmOpen ? styles.show : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setConfirmOpen(false)
        }}
      >
        <div className={styles.confirm} role="alertdialog" aria-modal="true" aria-labelledby="unsubConfirmTitle">
          <h3 id="unsubConfirmTitle">Unsubscribe from everything?</h3>
          <p>You&apos;ll stop getting all camp alerts. You can resubscribe anytime — even right after.</p>
          <div className={styles.confirmRow}>
            <button type="button" className={styles.keep} onClick={() => setConfirmOpen(false)}>
              Keep my alerts
            </button>
            <button type="button" className={styles.leave} onClick={onConfirmUnsub} disabled={submitting}>
              Unsubscribe
            </button>
          </div>
        </div>
      </div>

      <p className={styles.foot}>
        <span className={styles.org}>Breakaway Pickleball Camps</span> · Toronto, ON
        <br />
        You&apos;re receiving alerts you asked for. Manage them anytime on this page.
      </p>
    </section>
  )
}
