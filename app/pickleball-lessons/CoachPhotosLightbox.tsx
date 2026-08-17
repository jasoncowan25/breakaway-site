'use client'

/* Coach photo lightbox — ported from the approved Claude Design template
   (templates/lesson-booking/CoachPhotos.dc.html): keyboard navigation,
   focus trap, swipe support, thumbnail strip. */

import { useCallback, useEffect, useRef, useState } from 'react'

import { track, type CoachPhoto } from './lessons-data'

export function CoachPhotosLightbox({
  photos,
  coachName,
  coachId,
  onClose,
}: {
  photos: CoachPhoto[]
  coachName: string
  coachId: string
  onClose: () => void
}) {
  const [i, setI] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const touchX = useRef<number | null>(null)
  const n = photos.length
  const idx = n ? Math.min(i, n - 1) : 0
  const cur = photos[idx] ?? { src: '', alt: '' }

  const step = useCallback(
    (d: number) => {
      if (n < 2) return
      setI((s) => (s + d + n) % n)
      track('coach_photo_viewed', { coach: coachId, direction: d > 0 ? 'next' : 'prev' })
    },
    [n, coachId],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
      else if (e.key === 'ArrowRight') { e.preventDefault(); step(1) }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1) }
      else if (e.key === 'Tab') {
        const root = rootRef.current
        if (!root) return
        const items = Array.from(root.querySelectorAll('button')).filter((b) => !b.disabled)
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        const active = document.activeElement
        if (e.shiftKey && (active === first || !root.contains(active))) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && (active === last || !root.contains(active))) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const opener = document.activeElement as HTMLElement | null
    const t = setTimeout(() => closeRef.current?.focus(), 0)
    photos.forEach((p) => { const im = new Image(); im.src = p.src })
    return () => {
      document.removeEventListener('keydown', onKey)
      clearTimeout(t)
      document.body.style.overflow = prevOverflow
      if (opener && document.contains(opener)) setTimeout(() => opener.focus(), 0)
    }
  }, [onClose, step, photos])

  return (
    <div
      data-cpwrap=""
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${coachName} photos`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: 'fixed', inset: 0, zIndex: 140, background: 'rgba(8,32,54,.88)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, animation: 'cpFade .16s ease' }}
    >
      <div
        data-cppanel=""
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 16, width: 'min(900px,100%)', maxHeight: 'min(92vh,880px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,.42)', animation: 'cpRise .22s cubic-bezier(.32,.72,0,1)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px 14px 20px', borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#124A7A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{coachName}</span>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: '#4b5563', background: '#f3f4f6', borderRadius: 9999, padding: '5px 11px', whiteSpace: 'nowrap' }}>{n ? `${idx + 1} of ${n}` : ''}</span>
          <button
            type="button"
            data-cpclose=""
            ref={closeRef}
            tabIndex={0}
            onClick={onClose}
            aria-label="Close photos"
            style={{ marginLeft: 'auto', width: 40, height: 40, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 0, borderRadius: 9999, background: '#f3f4f6', color: '#374151', cursor: 'pointer', transition: 'background 140ms ease' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <div
          data-cpstage=""
          onTouchStart={(e) => { touchX.current = e.changedTouches[0].clientX }}
          onTouchEnd={(e) => {
            if (touchX.current == null) return
            const dx = e.changedTouches[0].clientX - touchX.current
            touchX.current = null
            if (Math.abs(dx) > 44) step(dx < 0 ? 1 : -1)
          }}
          style={{ position: 'relative', flex: 1, minHeight: 0, background: '#0a2a46', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={cur.src} src={cur.src} alt={cur.alt} style={{ maxWidth: '100%', maxHeight: 'min(60vh,600px)', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block', animation: 'cpSwap .2s ease' }} />
          {n > 1 && (
            <>
              <button type="button" data-cpnav="" onClick={() => step(-1)} aria-label="Previous photo" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 0, borderRadius: 9999, background: 'rgba(255,255,255,.9)', color: '#0a2a46', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,.28)', transition: 'background 140ms ease,transform 140ms ease' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m14 6-6 6 6 6" /></svg>
              </button>
              <button type="button" data-cpnav="" onClick={() => step(1)} aria-label="Next photo" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 0, borderRadius: 9999, background: 'rgba(255,255,255,.9)', color: '#0a2a46', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,.28)', transition: 'background 140ms ease,transform 140ms ease' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m10 6 6 6-6 6" /></svg>
              </button>
            </>
          )}
        </div>
        {n > 1 && (
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', padding: '14px 16px', borderTop: '1px solid #f3f4f6', background: '#fff', overflowX: 'auto', flexShrink: 0 }}>
            {photos.map((p, k) => (
              <button
                key={p.src}
                type="button"
                data-cpthumb=""
                onClick={() => setI(k)}
                aria-label={`Show photo ${k + 1} of ${n}`}
                aria-current={k === idx}
                style={{ width: 74, height: 74, flexShrink: 0, padding: 0, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', background: '#f3f4f6', transition: 'opacity 140ms ease,border-color 140ms ease' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 22%', display: 'block' }} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
