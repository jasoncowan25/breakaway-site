import { CAMP_SKILL_FILTERS, type CampFilters } from "./camp-discovery.ts"

const LOCATION_KEYS = {
  "toronto-gta": "Toronto & GTA",
  muskoka: "Muskoka",
  "punta-cana": "Punta Cana",
} as const

export type CampFilterState = CampFilters & { view: "upcoming" | "completed" }

type Query = Pick<URLSearchParams, "get" | "getAll">
const unique = (values: string[]) => [...new Set(values)]

/** Accept existing search links while exposing one canonical value per control. */
export function readCampFilterState(query: Query): CampFilterState {
  return {
    locations: unique(query.getAll("location").flatMap((key) =>
      Object.entries(LOCATION_KEYS).filter(([slug]) => slug === key).map(([, label]) => label),
    )),
    skillLevels: unique(query.getAll("skill").map((value) => value.trim() === "4.0" ? "4.0+" : value)
      .filter((value) => CAMP_SKILL_FILTERS.some((level) => level === value))),
    formats: unique(query.getAll("format").filter((value) => value === "Camp" || value === "Clinic")),
    view: query.get("view") === "completed" ? "completed" : "upcoming",
  }
}

/** Keep unrelated query parameters; repeated keys preserve multiple selections. */
export function writeCampFilterState(query: string, state: CampFilterState): string {
  const params = new URLSearchParams(query)
  for (const key of ["location", "skill", "format", "view"]) params.delete(key)
  for (const label of unique(state.locations)) {
    const entry = Object.entries(LOCATION_KEYS).find(([, value]) => value === label)
    if (entry) params.append("location", entry[0])
  }
  for (const level of unique(state.skillLevels)) params.append("skill", level)
  for (const format of unique(state.formats)) params.append("format", format)
  if (state.view === "completed") params.set("view", "completed")
  return params.toString()
}
