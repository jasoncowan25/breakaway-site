export type CheckoutOffer = {
  code: string
  label: string
  unitPriceCents: number
}

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
    }
  }
  return null
}
