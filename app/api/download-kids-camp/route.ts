import { get } from "@vercel/blob"
import { NextResponse } from "next/server"

// Serves the packaged kids summer camp HTML+images zip from private Blob storage.
export async function GET() {
  try {
    const result = await get("downloads/kids-summer-camp.zip", {
      access: "private",
    })

    if (!result) {
      return new NextResponse("Not found", { status: 404 })
    }

    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="kids-summer-camp.zip"',
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Error serving kids camp zip:", error)
    return NextResponse.json({ error: "Failed to serve file" }, { status: 500 })
  }
}
