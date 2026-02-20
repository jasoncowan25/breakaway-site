export function getOpenInfo(searchParams?: string | URLSearchParams) {
  const openAtIso = process.env.NEXT_PUBLIC_OPEN_AT_ISO ?? "2099-01-01T00:00:00-05:00"

  const openAt = new Date(openAtIso)
  let isOpen = new Date() >= openAt

  // Optional test override: ?open=1 (force open), ?open=0 (force closed)
  try {
    const sp =
      typeof searchParams === "string"
        ? new URLSearchParams(searchParams)
        : (searchParams ?? (typeof window !== "undefined" ? new URLSearchParams(window.location.search) : undefined))
    const ov = sp?.get("open")
    if (ov === "1") isOpen = true
    if (ov === "0") isOpen = false
  } catch {}

  return { openAtIso, isOpen }
}
