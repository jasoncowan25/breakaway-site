interface NotifyPayload {
  email: string
  source: string
  launchAt: string
}

export async function subscribeEmail(
  email: string,
  meta: { source: string; launchAt: string },
): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch("/api/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        source: meta.source,
        launchAt: meta.launchAt,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || "Failed to subscribe")
    }

    return await response.json()
  } catch (error) {
    console.error("Email subscription error:", error)
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
