import { Suspense } from "react"

import { ConfirmationClient } from "./confirmation-client"
import "@/styles/tokens.css"
import "@/styles/checkout.css"
import "@/styles/checkout-integration.css"

export default function CheckoutConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmationClient />
    </Suspense>
  )
}
