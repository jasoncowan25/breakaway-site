export type CheckoutOffer = {
  code: string
  label: string
  unitPriceCents: number
  sessionDates: string[]
  sessionLabel: string
  scheduleNote: string
}

const REDUCED_SESSION_DATES = [
  "2026-09-14",
  "2026-09-28",
  "2026-10-05",
  "2026-10-19",
  "2026-10-26",
  "2026-11-02",
  "2026-11-09",
  "2026-11-16",
  "2026-11-23",
  "2026-11-30",
  "2026-12-07",
  "2026-12-14",
]

const REDUCED_SCHEDULE_NOTE = "No class September 21 or October 12"

export function resolveCheckoutOffer(
  campId: string,
  offerCode: string | null | undefined,
): CheckoutOffer | null {
  if (
    campId === "a828af29-f41f-42e6-a83d-86a4e40baee9"
    && offerCode === "reduced-weeks-480"
  ) {
    return {
      code: offerCode,
      label: "Reduced weeks",
      unitPriceCents: 48000,
      sessionDates: [...REDUCED_SESSION_DATES],
      sessionLabel: "6:00 PM – 7:00 PM",
      scheduleNote: REDUCED_SCHEDULE_NOTE,
    }
  }
  if (
    campId === "d77526f5-1e63-48bd-8d50-4ce3ebcd593a"
    && offerCode === "reduced-weeks-960"
  ) {
    return {
      code: offerCode,
      label: "Reduced weeks",
      unitPriceCents: 96000,
      sessionDates: [...REDUCED_SESSION_DATES],
      sessionLabel: "5:00 PM – 7:00 PM",
      scheduleNote: REDUCED_SCHEDULE_NOTE,
    }
  }
  return null
}
