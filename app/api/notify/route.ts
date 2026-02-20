import { type NextRequest, NextResponse } from "next/server"

interface NotifyPayload {
  email: string
  source: string
  launchAt: string
}

// Simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const body: NotifyPayload = await request.json()
    const { email, source, launchAt } = body

    // Validate required fields
    if (!email || !source || !launchAt) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: email, source, launchAt" },
        { status: 400 },
      )
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email format" }, { status: 400 })
    }

    // Validate launchAt is a valid date
    const launchDate = new Date(launchAt)
    if (isNaN(launchDate.getTime())) {
      return NextResponse.json({ ok: false, error: "Invalid launchAt date format" }, { status: 400 })
    }

    // For now, just log the payload - easy to swap to ESP later
    console.log("📧 Email subscription received:", {
      email,
      source,
      launchAt,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
    })

    // TODO: Replace with actual ESP integration
    // Examples:
    // - await sendgrid.send(...)
    // - await mailchimp.lists.addListMember(...)
    // - await convertkit.subscribers.create(...)
    // - await resend.emails.send(...)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("❌ Email subscription error:", error)

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: "Invalid JSON payload" }, { status: 400 })
    }

    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 })
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed" }, { status: 405 })
}
