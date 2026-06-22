"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import { SuccessView } from "@/components/checkout/SuccessView"
import type { Account, Camp, Guardian, Player } from "@/lib/types"

type ConfirmationStatus = {
  id: string
  status: string | null
  paymentStatus: string | null
  customerEmail: string | null
  payerFirstName?: string | null
  playerCount?: number | null
  amountTotal: number | null
  currency: string | null
  checkoutMode?: "adult" | "kids" | string | null
  portalUrl: string | null
  portalEligible?: boolean
  camp: {
    id: string
    title: string
    startDate: string | null
    endDate: string | null
    venue: string | null
    coachLead?: string | null
  } | null
}

const breakawayApiBase = (
  process.env.NEXT_PUBLIC_BREAKAWAY_API_URL ?? "https://api.breakawaypickleball.ca"
).replace(/\/$/, "")

const localPreviewStatus: ConfirmationStatus = {
  id: "cs_test_local_preview",
  status: "complete",
  paymentStatus: "paid",
  customerEmail: "jordan@example.com",
  amountTotal: 80000,
  currency: "cad",
  checkoutMode: "adult",
  portalUrl: "http://127.0.0.1:3022/#mybreakaway,setup",
  camp: {
    id: "toronto-intermediate-intensive-sep-12-2026-3",
    title: "Toronto Intermediate Intensive",
    startDate: "2026-09-12",
    endDate: "2026-09-13",
    venue: "Breakaway Toronto",
  },
}

function formatMoney(cents: number | null, currency: string | null) {
  if (cents == null) return "Paid"
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: (currency ?? "cad").toUpperCase(),
  }).format(cents / 100)
}

function dateLabel(startDate: string | null, endDate: string | null) {
  if (!startDate) return "Camp dates"
  const start = new Date(`${startDate}T00:00:00Z`)
  const end = new Date(`${endDate ?? startDate}T00:00:00Z`)
  const startText = start.toLocaleDateString("en-CA", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })

  if (!endDate || startDate === endDate) return `${startText}, ${start.getUTCFullYear()}`
  if (start.getUTCMonth() === end.getUTCMonth() && start.getUTCFullYear() === end.getUTCFullYear()) {
    return `${startText}-${end.getUTCDate()}, ${end.getUTCFullYear()}`
  }

  const endText = end.toLocaleDateString("en-CA", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
  return `${startText} - ${endText}`
}

function successCamp(status: ConfirmationStatus | null): Camp {
  const paid = formatMoney(status?.amountTotal ?? null, status?.currency ?? null)

  return {
    eyebrow: "Breakaway Pickleball",
    title: status?.camp?.title ?? "Your Breakaway camp",
    coachLead: status?.camp?.coachLead ?? "Breakaway",
    coachPhoto: "/assets/breakaway-monogram.png",
    photo: "/jar3.png",
    date: dateLabel(status?.camp?.startDate ?? null, status?.camp?.endDate ?? null),
    dateSub: status?.paymentStatus ? `Payment ${status.paymentStatus.replace(/_/g, " ")}` : "Confirmation pending",
    location: status?.camp?.venue ?? "Breakaway",
    locSub: "Exact address emailed",
    skill: "Booked",
    skillSub: paid,
    pricePerPlayer: status?.amountTotal ? status.amountTotal / 100 : 0,
    isKidsCamp: false,
    collectTshirtSizes: false,
    lunchType: null,
    maxPlayers: Math.max(1, status?.playerCount ?? 1),
    coachRatio: "4:1",
  }
}

function account(email: string | null): Account {
  return {
    first: "",
    last: "",
    email: email ?? "",
    savedCard: { brand: "Card", last4: "paid", exp: "" },
  }
}

function primaryPlayer(email: string | null): Player {
  return {
    id: "confirmed-player",
    first: "",
    last: "",
    email: email ?? "",
    age: "",
    tee: "",
    isChild: false,
  }
}

const guardian: Guardian = {
  first: "",
  last: "",
  phone: "",
  email: "",
  authorized: true,
  waiver: true,
}

export function ConfirmationClient() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const paymentIntentId = searchParams.get("payment_intent")
  const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret")
  const confirmationId = paymentIntentId ?? sessionId
  const [status, setStatus] = useState<ConfirmationStatus | null>(null)
  const [error, setError] = useState("")
  const [isResolving, setIsResolving] = useState(Boolean(confirmationId))
  const [isOpeningPortal, setIsOpeningPortal] = useState(false)

  useEffect(() => {
    if (!confirmationId) {
      setIsResolving(false)
      setError("Missing checkout confirmation.")
      return
    }

    if (process.env.NODE_ENV !== "production" && confirmationId === "local") {
      setStatus(localPreviewStatus)
      setIsResolving(false)
      setError("")
      return
    }

    let cancelled = false
    async function loadStatus() {
      setIsResolving(true)
      setError("")
      try {
        const path = paymentIntentId
          ? `/api/checkout/payment-intents/${encodeURIComponent(paymentIntentId)}`
          : `/api/checkout/sessions/${encodeURIComponent(sessionId!)}`
        const url = new URL(`${breakawayApiBase}${path}`)
        if (paymentIntentId && paymentIntentClientSecret) {
          url.searchParams.set("payment_intent_client_secret", paymentIntentClientSecret)
        }
        const response = await fetch(url.toString())
        const body = await response.json()
        if (!response.ok) throw new Error(body?.error ?? "Could not load confirmation.")
        if (!cancelled) setStatus(body as ConfirmationStatus)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load confirmation.")
      } finally {
        if (!cancelled) setIsResolving(false)
      }
    }

    loadStatus()
    return () => {
      cancelled = true
    }
  }, [confirmationId, paymentIntentId, paymentIntentClientSecret, sessionId])

  const camp = useMemo(() => successCamp(status), [status])
  const payerEmail = status?.customerEmail ?? null
  // Reconstruct one entry per registered seat so the success card shows the
  // right "N players registered" copy and the multi-player emails note. We only
  // know the payer's name + email; the heading personalizes off players[0].
  const players = useMemo<Player[]>(() => {
    const count = Math.max(1, status?.playerCount ?? 1)
    return Array.from({ length: count }, (_, i) =>
      i === 0
        ? { ...primaryPlayer(payerEmail), first: status?.payerFirstName ?? "" }
        : { ...primaryPlayer(null), id: `confirmed-player-${i}` },
    )
  }, [status?.playerCount, status?.payerFirstName, payerEmail])
  const kidsMode = status?.checkoutMode === "kids"
  const portalUrl = kidsMode ? null : status?.portalUrl ?? null
  const portalEligible = !kidsMode && Boolean(status?.portalEligible || portalUrl)
  const orderLabel = confirmationId ? confirmationId.slice(-8).toUpperCase() : undefined

  async function openPortal() {
    // Show the button's loading state immediately on click (covers both the
    // instant-redirect and the async portal-handoff paths) instead of flashing
    // the whole account card to a skeleton.
    setIsOpeningPortal(true)
    setError("")
    if (portalUrl) {
      window.location.href = portalUrl
      return
    }
    if (!paymentIntentId || !paymentIntentClientSecret) {
      setError("Your account link is not ready yet. Use the emailed sign-in link or refresh this page.")
      setIsOpeningPortal(false)
      return
    }

    try {
      const response = await fetch(
        `${breakawayApiBase}/api/checkout/payment-intents/${encodeURIComponent(paymentIntentId)}/portal-handoff`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payment_intent_client_secret: paymentIntentClientSecret }),
        },
      )
      const body = await response.json()
      if (!response.ok || !body?.portalUrl) {
        throw new Error(body?.error ?? "Could not open your account.")
      }
      window.location.href = body.portalUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open your account.")
      setIsOpeningPortal(false)
    }
  }

  return (
    <main className="co-scope">
      <div className="backdrop bg-clean" style={{ justifyContent: "center" }}>
        {error ? (
          <div className="shell view" style={{ paddingBottom: 0 }}>
            <div className="success-error">{error}</div>
          </div>
        ) : null}
        <SuccessView
          camp={camp}
          kidsMode={kidsMode}
          players={players}
          guardian={{ ...guardian, email: kidsMode ? payerEmail ?? "" : "" }}
          prefill={false}
          acct={account(payerEmail)}
          acctOptIn={portalEligible}
          orderLabel={orderLabel}
          isResolving={isResolving}
          opening={isOpeningPortal}
          onBack={openPortal}
        />
      </div>
    </main>
  )
}
