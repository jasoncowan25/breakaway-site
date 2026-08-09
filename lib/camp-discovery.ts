export type PublicCampCard = {
  id: string
  title: string
  date: string
  sortDate: string
  endDate: string
  location: string
  locationFilter: string
  format: string
  skillLevel: string
  price: string
  image: string
  badges: Array<{
    text: string
    variant: "default" | "destructive" | "secondary" | "accent"
  }>
  coach: string
  link: string
  imageEnhanced: boolean
  soldOut: boolean
  spotsRemaining?: number
  buttonText: string
}

export type CampFilters = {
  locations: string[]
  formats: string[]
  skillLevels: string[]
}

export const CAMP_SKILL_FILTERS = ["2.5", "3.0", "3.5", "4.0+", "Kids"] as const

export const RELATED_CAMP_LINKS = [
  {
    label: "Pickleball coaches",
    homeLabel: "Pickleball coaches in Toronto",
    href: "/pickleball-coaches",
  },
  { label: "Camp schedule", homeLabel: "Camp schedule", href: "/schedule" },
  {
    label: "Punta Cana pickleball retreat",
    homeLabel: "Punta Cana pickleball retreat",
    href: "/pickleball-camps/punta-cana",
  },
  {
    label: "Pickleball camp experience",
    homeLabel: "Pickleball camp experience",
    href: "/pickleball-camp-experience",
  },
  {
    label: "Pickleball Kids Weekly",
    homeLabel: "Pickleball Kids Weekly",
    href: "/pickleball-camps/kids-weekly-pickleball-camp-toronto",
  },
] as const

export const STATIC_PUBLIC_CAMP_CARDS: PublicCampCard[] = [
  {
    id: "kids-summer-pickleball-camp-toronto",
    title: "Baseline x Breakaway Kids Summer Camp",
    date: "August 17 – September 4, 2026",
    sortDate: "2026-08-17",
    endDate: "2026-09-04",
    location: "The JAR Pickleball Club",
    locationFilter: "Toronto & GTA",
    format: "Camp",
    skillLevel: "Kids",
    price: "From $575 CAD",
    image: "/kids-passover-camp-hero.webp",
    badges: [{ text: "Just Announced", variant: "accent" }],
    coach: "Joey Manchurek",
    link: "/pickleball-camps/kids-summer-pickleball-camp-toronto",
    imageEnhanced: false,
    soldOut: false,
    buttonText: "Learn More",
  },
  {
    id: "kids-weekly-pickleball-camp-toronto",
    title: "Kids Weekly Pickleball Camp",
    date: "Weekly, Sep – Dec, 2026",
    sortDate: "2026-09-07",
    endDate: "2026-12-21",
    location: "The Jar Pickleball Club",
    locationFilter: "Toronto & GTA",
    format: "Camp",
    skillLevel: "Kids",
    price: "From $600",
    image: "/images/kids-weekly/kids-camp-joey.jpg",
    badges: [{ text: "New", variant: "accent" }],
    coach: "Joey Manchurek",
    link: "/pickleball-camps/kids-weekly-pickleball-camp-toronto",
    imageEnhanced: false,
    soldOut: false,
    buttonText: "Learn More",
  },
  {
    id: "toronto-intermediate-intensive-sep-12-2026-3",
    title: "Toronto Intermediate Intensive",
    date: "September 12-13, 2026",
    sortDate: "2026-09-12",
    endDate: "2026-09-13",
    location: "The JAR Pickleball Club",
    locationFilter: "Toronto & GTA",
    format: "Camp",
    skillLevel: "3.0-3.5",
    price: "$700 CAD",
    image: "/jar3.png",
    badges: [{ text: "New", variant: "accent" }],
    coach: "Joey Manchurek",
    link: "/pickleball-camps/toronto-intermediate-intensive-sep-12-2026-3",
    imageEnhanced: false,
    soldOut: false,
    spotsRemaining: 16,
    buttonText: "Learn More",
  },
  {
    id: "toronto-intermediate-intensive-oct-24-2026",
    title: "Toronto Intermediate Intensive",
    date: "October 24-25, 2026",
    sortDate: "2026-10-24",
    endDate: "2026-10-25",
    location: "The JAR Pickleball Club",
    locationFilter: "Toronto & GTA",
    format: "Camp",
    skillLevel: "3.0-3.5",
    price: "$700 CAD",
    image: "/toronto-coaching-instruction.png",
    badges: [{ text: "New", variant: "accent" }],
    coach: "Joey Manchurek",
    link: "/pickleball-camps/toronto-intermediate-intensive-oct-24-2026",
    imageEnhanced: false,
    soldOut: false,
    spotsRemaining: 14,
    buttonText: "Learn More",
  },
]

export function campMatchesFilters(
  camp: Pick<PublicCampCard, "locationFilter" | "format" | "skillLevel">,
  filters: CampFilters,
) {
  if (filters.locations.length > 0 && !filters.locations.includes(camp.locationFilter)) {
    return false
  }
  if (filters.formats.length > 0 && !filters.formats.includes(camp.format)) {
    return false
  }
  if (filters.skillLevels.length === 0) return true

  return filters.skillLevels.some((level) => {
    if (level === "2.5") {
      return camp.skillLevel.includes("Under 3.0") || camp.skillLevel.includes("2.5")
    }
    return camp.skillLevel.includes(level)
  })
}

export function shouldShowMuskokaHub({
  campCount,
  locations,
  formats,
  skillLevels,
}: CampFilters & { campCount: number }) {
  return (
    campCount > 0 &&
    skillLevels.length === 0 &&
    (locations.length === 0 || locations.includes("Muskoka")) &&
    (formats.length === 0 || formats.includes("Camp"))
  )
}

export function staticPublicCampNavItems(today: string) {
  return STATIC_PUBLIC_CAMP_CARDS.filter((camp) => camp.endDate >= today).map((camp) => ({
    title: camp.title,
    href: camp.link,
  }))
}
