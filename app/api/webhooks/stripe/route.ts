import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { Resend } from "resend"
import { getCampByProductId } from "@/lib/camps"
import { buildConfirmationEmail } from "@/lib/emails/confirmation"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  let event: Stripe.Event

  // 1. Verify webhook signature
  try {
    const rawBody = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error(`Webhook signature verification failed: ${message}`)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  // 2. Handle checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items.data.price.product"],
      })

      const customerEmail =
        fullSession.customer_details?.email ?? fullSession.customer_email

      if (!customerEmail) {
        console.error(`No customer email for session ${session.id}`)
        return NextResponse.json({ received: true })
      }

      const customerName = fullSession.customer_details?.name ?? undefined

      // Extract product ID from line items
      const lineItems = fullSession.line_items?.data ?? []
      let productId = ""

      if (lineItems.length > 0) {
        const price = lineItems[0].price
        if (price?.product && typeof price.product === "object") {
          productId = (price.product as Stripe.Product).id
        } else if (typeof price?.product === "string") {
          productId = price.product
        }
      }

      const camp = getCampByProductId(productId)
      const emailHtml = buildConfirmationEmail(camp, customerName ?? undefined)

      // 3. Send confirmation email
      const { error: emailError } = await resend.emails.send({
        from: "Breakaway Pickleball Camps <bookings@breakawaycamps.ca>",
        replyTo: "breakawaypickleball@gmail.com",
        to: customerEmail,
        bcc: "breakawaypickleball@gmail.com",
        subject: `Booking Confirmed — ${camp.title}`,
        html: emailHtml,
      })

      if (emailError) {
        console.error(`Failed to send email to ${customerEmail}:`, emailError)
      } else {
        console.log(`Confirmation email sent to ${customerEmail} for ${camp.title}`)
      }
    } catch (err) {
      console.error("Error processing checkout.session.completed:", err)
    }
  }

  return NextResponse.json({ received: true })
}
