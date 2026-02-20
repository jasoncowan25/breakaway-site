import { NextResponse } from "next/server"
import { CAMP_REGISTRY } from "@/lib/camps"
import { buildConfirmationEmail } from "@/lib/emails/confirmation"

export async function GET() {
  // Only available in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Use the first camp in the registry for the preview
  const firstProductId = Object.keys(CAMP_REGISTRY)[0]
  const camp = CAMP_REGISTRY[firstProductId]

  const html = buildConfirmationEmail(camp, "Jane Smith")

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  })
}
