"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import type { Stripe, StripeElements } from "@stripe/stripe-js"

import { CheckoutView } from "@/components/checkout/CheckoutView"
import { Icon } from "@/components/Icon"
import type {
  Account,
  Agreements,
  Camp,
  Guardian as GuardianModel,
  Player,
} from "@/lib/types"

export type CheckoutCampView = {
  id: string
  slug: string
  title: string
  subtitle: string
  dateLabel: string
  timeLabel: string
  venue: string
  location: string
  priceLabel: string
  capacity: number
  spotsLeft: number
  isSoldOut: boolean
  heroImageUrl: string
  skillLabel: string
  coachName: string
  isKidsCamp: boolean
  collectTshirtSizes: boolean
  lunchType: "catered" | "byo" | null
}

type CheckoutMode = "adult" | "kids"

type CheckoutSession = {
  clientSecret: string
  paymentIntentId: string
  registrationId: string
  amountTotalCents: number
  currency: string
}

type LivePayer = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : Promise.resolve(null)
const breakawayApiBase = (
  process.env.NEXT_PUBLIC_BREAKAWAY_API_URL ?? "https://api.breakawaypickleball.ca"
).replace(/\/$/, "")

const fallbackAccount: Account = {
  first: "Jordan",
  last: "Lee",
  email: "jordan@example.com",
  savedCard: { brand: "Visa", last4: "4242", exp: "08/27" },
}

function clean(value: string) {
  return value.trim()
}

function isEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(clean(value))
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function numberFromPrice(label: string) {
  const value = Number.parseFloat(label.replace(/[^0-9.]/g, ""))
  return Number.isFinite(value) ? value : 0
}

function money(n: number) {
  return n.toLocaleString("en-CA")
}

function skillParts(camp: CheckoutCampView) {
  const title = camp.title.toLowerCase()
  const text = `${camp.title} ${camp.subtitle}`.toLowerCase()
  const skill = title.includes("intermediate")
    ? "Intermediate"
    : title.includes("beginner") || text.includes("beginner")
    ? "Beginner"
    : title.includes("advanced") || text.includes("advanced")
      ? "Advanced"
      : camp.isKidsCamp
        ? "Kids"
        : "All levels"

  return { skill, skillSub: camp.skillLabel }
}

function toDesignCamp(camp: CheckoutCampView): Camp {
  const pricePerPlayer = numberFromPrice(camp.priceLabel)
  const { skill, skillSub } = skillParts(camp)

  return {
    eyebrow: "Breakaway Pickleball",
    title: camp.title,
    coachLead: camp.coachName,
    coachPhoto: camp.coachName.toLowerCase().includes("joey") ? "/coach-joey.jpg" : "/placeholder-user.jpg",
    photo: camp.heroImageUrl,
    date: camp.dateLabel,
    dateSub: camp.timeLabel,
    location: camp.venue,
    locSub: camp.location,
    skill,
    skillSub,
    pricePerPlayer,
    isKidsCamp: camp.isKidsCamp,
    collectTshirtSizes: camp.collectTshirtSizes,
    lunchType: camp.lunchType,
    maxPlayers: Math.max(1, Math.min(6, camp.spotsLeft || camp.capacity || 6)),
    coachRatio: "4:1",
    urgencyBadge:
      !camp.isSoldOut && camp.spotsLeft > 0 && camp.spotsLeft <= 4 ? "Selling fast" : undefined,
  }
}

function playerPayload(players: Player[], checkoutMode: CheckoutMode) {
  return players.map((player) => ({
    firstName: clean(player.first),
    lastName: clean(player.last),
    email: checkoutMode === "kids" ? undefined : clean(player.email).toLowerCase(),
    ageAtCamp: checkoutMode === "kids" ? clean(player.age) || undefined : undefined,
    tshirtSize: clean(player.tee) || undefined,
  }))
}

function CheckoutPayment({
  onError,
  onCompletionChange,
  onReady,
}: {
  onError: (message: string) => void
  onCompletionChange: (complete: boolean) => void
  onReady: (stripe: Stripe | null, elements: StripeElements | null) => void
}) {
  const stripe = useStripe()
  const elements = useElements()

  useEffect(() => {
    onReady(stripe, elements)
  }, [stripe, elements, onReady])

  return (
    <div className="stripe-box">
      <PaymentElement
        options={{
          layout: {
            type: "accordion",
            defaultCollapsed: false,
            radios: "always",
            spacedAccordionItems: false,
          },
        }}
        onLoadError={(event) => {
          onError(event.error?.message ?? "Stripe payment form failed to load.")
        }}
        onChange={(event) => {
          onCompletionChange(event.complete)
        }}
      />
    </div>
  )
}

function CheckoutElementsFrame({
  camp,
  designCamp,
}: {
  camp: CheckoutCampView
  designCamp: Camp
}) {
  return <CheckoutClientInner camp={camp} designCamp={designCamp} />
}

export function CheckoutClient({ camp }: { camp: CheckoutCampView }) {
  const designCamp = useMemo(() => toDesignCamp(camp), [camp])
  return <CheckoutElementsFrame camp={camp} designCamp={designCamp} />
}

function CheckoutClientInner({
  camp,
  designCamp,
}: {
  camp: CheckoutCampView
  designCamp: Camp
}) {
  const checkoutMode: CheckoutMode = designCamp.isKidsCamp ? "kids" : "adult"
  const kidsMode = checkoutMode === "kids"

  const blankPlayer = (extra: Partial<Player> = {}): Player => ({
    id: Math.random().toString(36).slice(2),
    first: "",
    last: "",
    email: "",
    age: "",
    tee: "",
    isChild: false,
    ...extra,
  })

  const [players, setPlayers] = useState<Player[]>(() => [blankPlayer({ id: "you", isChild: kidsMode })])
  const [guardian, setGuardian] = useState<GuardianModel>({
    first: "",
    last: "",
    phone: "",
    email: "",
    authorized: false,
    waiver: false,
  })
  const [entering, setEntering] = useState<string[]>([])
  const [leaving, setLeaving] = useState<string[]>([])
  const [savedCardOpen, setSavedCardOpen] = useState(false)
  const [agree, setAgreeState] = useState<Agreements>({ terms: false, marketing: false })
  const [error, setError] = useState("")
  const [isPreparingPayment, setIsPreparingPayment] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [paymentSession, setPaymentSession] = useState<CheckoutSession | null>(null)
  const [paymentHandles, setPaymentHandles] = useState<{
    stripe: Stripe | null
    elements: StripeElements | null
  }>({ stripe: null, elements: null })

  const subtotal = players.length * designCamp.pricePerPlayer
  const payer: LivePayer = kidsMode
    ? {
        firstName: guardian.first,
        lastName: guardian.last,
        email: guardian.email,
        phone: guardian.phone,
      }
    : {
        firstName: players[0]?.first ?? "",
        lastName: players[0]?.last ?? "",
        email: players[0]?.email ?? "",
        phone: "",
      }

  function resetPayment() {
    setError("")
  }

  function clearPreparedPayment() {
    setPaymentSession(null)
    setPaymentHandles({ stripe: null, elements: null })
    setPaymentComplete(false)
    setIsPaying(false)
  }

  function updatePlayer(i: number, patch: Partial<Player>) {
    resetPayment()
    setPlayers((ps) => ps.map((p, idx) => (idx === i ? { ...p, ...patch } : p)))
  }

  function addPlayer() {
    resetPayment()
    if (players.length >= designCamp.maxPlayers) return
    const np = blankPlayer({ isChild: kidsMode })
    setEntering((e) => [...e, np.id])
    setPlayers((ps) => [...ps, np])
    setTimeout(() => setEntering((e) => e.filter((x) => x !== np.id)), 420)
  }

  function removePlayer(i: number) {
    resetPayment()
    const id = players[i]?.id
    if (!id) return
    setLeaving((l) => [...l, id])
    setTimeout(() => {
      setPlayers((ps) => ps.filter((p) => p.id !== id))
      setLeaving((l) => l.filter((x) => x !== id))
    }, 290)
  }

  function validate() {
    if (!stripePublishableKey) return "Stripe is not configured for this site yet."
    if (camp.isSoldOut) return "This camp is sold out."
    if (!clean(payer.firstName) || !clean(payer.lastName) || !clean(payer.email)) {
      return kidsMode ? "Add the parent or guardian name and email." : "Add your name and email."
    }
    if (!isEmail(payer.email)) return "Enter a valid email."
    if (kidsMode && !clean(payer.phone)) return "Add the parent or guardian cell phone."
    if (kidsMode && !guardian.authorized) return "Confirm guardian authorization before payment."

    for (const player of players) {
      if (!clean(player.first) || !clean(player.last)) return "Add every player name."
      if (!kidsMode && !isEmail(player.email)) return "Add a valid email for every adult player."
      if (kidsMode && !clean(player.age)) return "Add each child age at camp."
      if (designCamp.collectTshirtSizes && !clean(player.tee)) return "Choose a T-shirt size for every player."
    }

    if (camp.spotsLeft > 0 && players.length > camp.spotsLeft) {
      return `Only ${camp.spotsLeft} ${camp.spotsLeft === 1 ? "spot is" : "spots are"} left.`
    }
    if (!agree.terms) return "Accept the booking terms to continue."
    return ""
  }

  async function startPaymentSession() {
    const validationMessage = validate()
    if (validationMessage) {
      setError(validationMessage)
      return false
    }

    if (paymentSession) return true

    if (!isUuid(camp.id)) {
      setError("This preview checkout is not connected to a real camp yet. Open a checkout URL for a camp from the admin/API to test payment.")
      return false
    }

    setIsPreparingPayment(true)
    setError("")
    setPaymentComplete(false)
    setPaymentHandles({ stripe: null, elements: null })
    try {
      const response = await fetch(`${breakawayApiBase}/api/checkout/payment-intents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campId: camp.id,
          checkoutMode,
          accountOptIn: checkoutMode !== "kids",
          payer: {
            firstName: clean(payer.firstName),
            lastName: clean(payer.lastName),
            email: clean(payer.email).toLowerCase(),
            phone: clean(payer.phone) || undefined,
          },
          players: playerPayload(players, checkoutMode),
        }),
      })

      const body = await response.json()
      if (!response.ok) throw new Error(body?.error ?? "Could not start payment.")
      if (!body.clientSecret || !body.paymentIntentId || !body.registrationId) {
        throw new Error("Payment was missing secure confirmation details.")
      }
      setPaymentSession(body as CheckoutSession)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start payment.")
      return false
    } finally {
      setIsPreparingPayment(false)
    }
  }

  async function book() {
    const validationMessage = validate()
    if (validationMessage) {
      setError(validationMessage)
      return
    }
    if (!paymentSession) {
      setError("Start secure payment first.")
      return
    }
    const { stripe, elements } = paymentHandles
    if (!stripe || !elements) {
      setError("Stripe payment form is still loading. Try again in a moment.")
      return
    }
    setIsPaying(true)
    setError("")
    try {
      const submitResult = await elements.submit()
      if (submitResult.error) throw new Error(submitResult.error.message)

      const result = await stripe.confirmPayment({
        elements,
        clientSecret: paymentSession.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/confirmation`,
        },
        redirect: "if_required",
      })
      if (result.error) throw new Error(result.error.message)

      const confirmedId = result.paymentIntent?.id ?? paymentSession.paymentIntentId
      if (confirmedId) {
        const params = new URLSearchParams({
          payment_intent: confirmedId,
          payment_intent_client_secret: paymentSession.clientSecret,
        })
        window.location.href = `/checkout/confirmation?${params.toString()}`
      } else {
        window.location.href = "/checkout/confirmation"
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete payment.")
      setIsPaying(false)
    } finally {
      setIsPaying(false)
    }
  }

  const stripeOptions = useMemo(
    () =>
      paymentSession
        ? {
            clientSecret: paymentSession.clientSecret,
            appearance: {
              theme: "stripe" as const,
              variables: {
                colorPrimary: "#124A7A",
                colorText: "#111827",
                colorDanger: "#dc2626",
                borderRadius: "10px",
                fontFamily: "Geist, system-ui, sans-serif",
              },
            },
            loader: "auto" as const,
          }
        : null,
    [paymentSession],
  )
  const handleStripeReady = useCallback((stripe: Stripe | null, elements: StripeElements | null) => {
    setPaymentHandles({ stripe, elements })
  }, [])

  const paymentContent = !stripePublishableKey ? (
    <div className="payment-waiting">
      <Icon name="lock" size={18} />
      <span>Stripe is not configured for this checkout yet.</span>
    </div>
  ) : isPreparingPayment ? (
    <div className="payment-waiting">
      <Icon name="lock" size={18} />
      <span>Preparing secure payment...</span>
    </div>
  ) : paymentSession && stripeOptions ? (
    <Elements key={paymentSession.paymentIntentId} stripe={stripePromise} options={stripeOptions}>
      <CheckoutPayment
        onError={setError}
        onCompletionChange={setPaymentComplete}
        onReady={handleStripeReady}
      />
    </Elements>
  ) : (
    <div className="payment-waiting">
      <Icon name="lock" size={18} />
      <span>Complete the details above to unlock payment.</span>
    </div>
  )

  const checkoutError = error ? <div className="checkout-error">{error}</div> : null
  const payButtonLabel = isPaying
    ? "Booking..."
    : `Book ${players.length} ${players.length === 1 ? "Spot" : "Spots"} — $${money(subtotal)} CAD`

  return (
    <div className="co-scope">
      <div className="backdrop bg-clean" style={{ justifyContent: "center" }}>
        <CheckoutView
          camp={designCamp}
          kidsMode={kidsMode}
          players={players}
          guardian={guardian}
          showGuardian={kidsMode}
          prefill={false}
          acct={fallbackAccount}
          savedCardOpen={savedCardOpen}
          subtotal={subtotal}
          agree={agree}
          entering={entering}
          leaving={leaving}
          updatePlayer={updatePlayer}
          addPlayer={addPlayer}
          removePlayer={removePlayer}
          setGuardian={(updater) => {
            resetPayment()
            setGuardian(updater)
          }}
          setSavedCardOpen={setSavedCardOpen}
          setAgree={(updater) => {
            resetPayment()
            setAgreeState(updater)
          }}
          onContinuePayment={startPaymentSession}
          onEditDetails={clearPreparedPayment}
          onPay={() => {
            void book()
          }}
          paymentContent={paymentContent}
          checkoutError={checkoutError}
          continuePaymentLabel={
            isPreparingPayment ? (
              <>
                <Icon name="card" size={20} strokeWidth={2.5} /> Preparing secure payment...
              </>
            ) : undefined
          }
          continuePaymentDisabled={isPreparingPayment}
          payButtonLabel={payButtonLabel}
          payButtonDisabled={
            isPaying ||
            camp.isSoldOut ||
            !paymentSession ||
            !paymentComplete ||
            !paymentHandles.stripe ||
            !paymentHandles.elements
          }
        />
      </div>
    </div>
  )
}
