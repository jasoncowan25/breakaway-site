export const muskokaCamps = [
  {
    id: "muskoka-fundamentals-jul-10",
    title: "Fundamentals Camp",
    level: "Fundamentals (Under 3.0)",
    levelVariant: "secondary" as const,
    dates: "July 10-12, 2026",
    time: "9:00 AM - 12:00 PM",
    duration: "3 Days",
    price: "$800 CAD / player",
    maxPlayers: 4,
    focus: ["Core shots", "Dinking & control", "Court movement", "Positioning basics", "Game confidence"],
    checkoutUrl: "https://book.stripe.com/28E00j2Vmbz18qy5q2f3a0p",
    week: 1,
  },
  {
    id: "muskoka-intermediate-jul-10",
    title: "Intermediate Camp",
    level: "Intermediate (3.0+)",
    levelVariant: "secondary" as const,
    dates: "July 10-12, 2026",
    time: "1:00 PM - 4:00 PM",
    duration: "3 Days",
    price: "$800 CAD / player",
    maxPlayers: 4,
    focus: ["Drops & resets", "Drives & speed-ups", "Dinking patterns", "Positioning & transitions", "Smart attacking"],
    checkoutUrl: "https://book.stripe.com/dRm8wPeE46eHeOW05If3a0q",
    week: 1,
  },
  {
    id: "muskoka-intermediate-jul-13-am",
    title: "Intermediate Camp",
    level: "Intermediate (3.0+)",
    levelVariant: "secondary" as const,
    dates: "July 13-15, 2026",
    time: "9:00 AM - 12:00 PM",
    duration: "3 Days",
    price: "$800 CAD / player",
    maxPlayers: 4,
    focus: ["Drops & resets", "Drives & speed-ups", "Dinking patterns", "Positioning & transitions", "Smart attacking"],
    checkoutUrl: "https://book.stripe.com/dRmfZhanOcD5bCK8Cef3a0r",
    week: 2,
  },
  {
    id: "muskoka-intermediate-jul-13",
    title: "Intermediate Camp",
    level: "Intermediate (3.0+)",
    levelVariant: "secondary" as const,
    dates: "July 13-15, 2026",
    time: "1:00 PM - 4:00 PM",
    duration: "3 Days",
    price: "$800 CAD / player",
    maxPlayers: 4,
    focus: ["Drops & resets", "Drives & speed-ups", "Dinking patterns", "Positioning & transitions", "Smart attacking"],
    checkoutUrl: "https://book.stripe.com/9B600j7bC5aD22a3hUf3a0s",
    week: 2,
  },
  {
    id: "muskoka-fundamentals-jul-17",
    title: "Fundamentals Camp",
    level: "Fundamentals (Under 3.0)",
    levelVariant: "secondary" as const,
    dates: "July 17-19, 2026",
    time: "9:00 AM - 12:00 PM",
    duration: "3 Days",
    price: "$800 CAD / player",
    maxPlayers: 4,
    focus: ["Core shots", "Dinking & control", "Court movement", "Positioning basics", "Game confidence"],
    checkoutUrl: "https://book.stripe.com/3cI5kDanOfPhgX4g4Gf3a0t",
    week: 3,
  },
  {
    id: "muskoka-intermediate-jul-17",
    title: "Intermediate Camp",
    level: "Intermediate (3.0+)",
    levelVariant: "secondary" as const,
    dates: "July 17-19, 2026",
    time: "1:00 PM - 4:00 PM",
    duration: "3 Days",
    price: "$800 CAD / player",
    maxPlayers: 4,
    focus: ["Drops & resets", "Drives & speed-ups", "Dinking patterns", "Positioning & transitions", "Smart attacking"],
    checkoutUrl: "https://book.stripe.com/6oU3cvgMc32v6iqf0Cf3a0u",
    week: 3,
  },
  {
    id: "muskoka-intermediate-aug-4-am",
    title: "Intermediate Camp",
    level: "Intermediate (3.0+)",
    levelVariant: "secondary" as const,
    dates: "August 4-6, 2026",
    time: "9:00 AM - 12:00 PM",
    duration: "3 Days",
    price: "$800 CAD / player",
    maxPlayers: 4,
    focus: ["Drops & resets", "Drives & speed-ups", "Dinking patterns", "Positioning & transitions", "Smart attacking"],
    checkoutUrl: "https://book.stripe.com/bJe00j1Ri6eH4ai4lYf3a0v",
    week: 4,
  },
  {
    id: "muskoka-intermediate-aug-4-pm",
    title: "Intermediate Camp",
    level: "Intermediate (3.0+)",
    levelVariant: "secondary" as const,
    dates: "August 4-6, 2026",
    time: "1:00 PM - 4:00 PM",
    duration: "3 Days",
    price: "$800 CAD / player",
    maxPlayers: 4,
    focus: ["Drops & resets", "Drives & speed-ups", "Dinking patterns", "Positioning & transitions", "Smart attacking"],
    checkoutUrl: "https://book.stripe.com/7sY6oHfI89qTgX405If3a0w",
    week: 4,
  },
]

export type MuskokaCamp = (typeof muskokaCamps)[number]

/**
 * Get unique date ranges from Muskoka camps, formatted for display
 * Returns dates like "July 10–12 · July 13–15 · August 4–6"
 */
export function getMuskokaCampDateRanges(): string | null {
  if (muskokaCamps.length === 0) return null

  // Extract unique date ranges (without year)
  const uniqueDates = new Set<string>()
  
  for (const camp of muskokaCamps) {
    // Convert "July 10-12, 2026" to "July 10–12"
    const dateWithoutYear = camp.dates.replace(/, \d{4}$/, "").replace(/-/g, "–")
    uniqueDates.add(dateWithoutYear)
  }

  if (uniqueDates.size === 0) return null

  // Sort by parsing the month and day
  const sortedDates = Array.from(uniqueDates).sort((a, b) => {
    const parseDate = (str: string) => {
      const match = str.match(/(\w+)\s+(\d+)/)
      if (!match) return 0
      const months: Record<string, number> = {
        January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
        July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
      }
      return (months[match[1]] || 0) * 100 + parseInt(match[2])
    }
    return parseDate(a) - parseDate(b)
  })

  return sortedDates.join(" · ")
}

/**
 * Get the lowest price from all Muskoka camps
 */
export function getMuskokaCampMinPrice(): string {
  if (muskokaCamps.length === 0) return "$800 CAD / player"
  
  // All camps currently have the same price, but this will work if they differ
  const prices = muskokaCamps.map(c => {
    const match = c.price.match(/\$(\d+)/)
    return match ? parseInt(match[1]) : 800
  })
  
  const minPrice = Math.min(...prices)
  return `$${minPrice} CAD / player`
}
