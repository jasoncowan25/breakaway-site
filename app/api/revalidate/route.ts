import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * On-demand revalidation endpoint.
 *
 * The admin app calls this after a camp/event write so the affected public
 * pages rebuild immediately instead of waiting for the ISR window. Authenticated
 * with a shared secret in the `x-revalidate-secret` header.
 *
 * Body: { "paths": ["/pickleball-camps/muskoka", ...] }
 */
export async function POST(request: Request) {
  const expected = process.env.BREAKAWAY_REVALIDATE_SECRET
  if (!expected) {
    return NextResponse.json(
      { revalidated: false, error: "Revalidation is not configured." },
      { status: 503 },
    )
  }

  const secret = request.headers.get("x-revalidate-secret")
  if (secret !== expected) {
    return NextResponse.json({ revalidated: false, error: "Unauthorized." }, { status: 401 })
  }

  let body: { paths?: unknown }
  try {
    body = (await request.json()) as { paths?: unknown }
  } catch {
    return NextResponse.json({ revalidated: false, error: "Invalid JSON body." }, { status: 400 })
  }

  const paths = Array.isArray(body.paths)
    ? body.paths.filter((p): p is string => typeof p === "string" && p.startsWith("/"))
    : []

  if (paths.length === 0) {
    return NextResponse.json(
      { revalidated: false, error: "No valid paths supplied." },
      { status: 400 },
    )
  }

  for (const path of paths) revalidatePath(path)
  return NextResponse.json({ revalidated: true, paths })
}
