# Kids Camp Discovery and Muskoka Recap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Surface both kids programs across Breakaway discovery paths, publish a full Muskoka 2026 recap, and make the existing marketing header and footer consistent while preserving focused transactional routes.

**Architecture:** Centralize static cards, related links, completed cards, and pure filter logic in `lib/camp-discovery.ts`; keep live camps in `lib/public-camps.ts` while consuming the static model there. Wrap marketing routes with one pathname-aware `SiteChrome` from the root layout, explicitly excluding checkout, waiver, preferences, thank-you, countdown, and design-system routes.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Node 22 test runner, Next `Image`, existing `Navigation`, `Footer`, `CampCard`, and Supabase-backed public camp feed.

## Global Constraints

- The two weekly database rows remain one aggregate public card and continue linking to `/pickleball-camps/kids-weekly-pickleball-camp-toronto`.
- Weekly card copy is exactly `Kids Weekly Pickleball Camp`, `Joey Manchurek`, `Weekly, Sep – Dec, 2026`, `The Jar Pickleball Club`, and `From $600`.
- Weekly card image is `/images/kids-weekly/kids-camp-joey.jpg`; no new remote image dependency is introduced.
- The Kids filter shows exactly the weekly program and the Baseline × Breakaway summer program among upcoming cards and hides the Muskoka hub.
- The related-link label is exactly `Pickleball Kids Weekly` and uses the weekly landing path.
- The Muskoka recap covers one full period, July 10–August 6, 2026, and does not invent 2027 dates or availability.
- The supplied source image is `/Users/airuntime/Documents/breakaway/docs/reference/muskoka-photos/muskoka_2026.png`; the public asset is `/muskoka-photos/muskoka-2026.png`.
- The existing `Navigation` and `Footer` are the only marketing chrome components; focused and internal routes remain chromeless.
- Every changed web view must be opened in the preview pane before release.
- No dependency versions or database records change in this release.

---

### Task 1: Centralize kids discovery data and pure filter behavior

**Files:**
- Create: `lib/camp-discovery.ts`
- Modify: `lib/public-camps.ts`
- Create: `tests/camp-discovery.test.mjs`

**Interfaces:**
- Produces: `PublicCampCard`, `STATIC_PUBLIC_CAMP_CARDS`, `RELATED_CAMP_LINKS`, `CAMP_SKILL_FILTERS`, `campMatchesFilters(camp, filters)`, `shouldShowMuskokaHub(input)`, and `staticPublicCampNavItems(today)`.
- Consumes: ISO `YYYY-MM-DD` dates and the existing public card fields already used by `CampCard` and `lib/public-camps.ts`.

- [ ] **Step 1: Write the failing discovery-model tests**

Create `tests/camp-discovery.test.mjs` with direct behavioral assertions:

```js
import assert from "node:assert/strict"
import test from "node:test"

import {
  CAMP_SKILL_FILTERS,
  RELATED_CAMP_LINKS,
  STATIC_PUBLIC_CAMP_CARDS,
  campMatchesFilters,
  shouldShowMuskokaHub,
  staticPublicCampNavItems,
} from "../lib/camp-discovery.ts"

test("defines one aggregate weekly kids card with the approved content", () => {
  const weekly = STATIC_PUBLIC_CAMP_CARDS.find(
    (camp) => camp.id === "kids-weekly-pickleball-camp-toronto",
  )

  assert.deepEqual(
    {
      title: weekly?.title,
      coach: weekly?.coach,
      date: weekly?.date,
      sortDate: weekly?.sortDate,
      endDate: weekly?.endDate,
      location: weekly?.location,
      price: weekly?.price,
      image: weekly?.image,
      skillLevel: weekly?.skillLevel,
      link: weekly?.link,
    },
    {
      title: "Kids Weekly Pickleball Camp",
      coach: "Joey Manchurek",
      date: "Weekly, Sep – Dec, 2026",
      sortDate: "2026-09-07",
      endDate: "2026-12-21",
      location: "The Jar Pickleball Club",
      price: "From $600",
      image: "/images/kids-weekly/kids-camp-joey.jpg",
      skillLevel: "Kids",
      link: "/pickleball-camps/kids-weekly-pickleball-camp-toronto",
    },
  )
})

test("categorizes both upcoming youth programs as Kids", () => {
  const kids = STATIC_PUBLIC_CAMP_CARDS
    .filter((camp) => camp.skillLevel === "Kids")
    .map((camp) => camp.id)

  assert.deepEqual(kids, [
    "kids-summer-pickleball-camp-toronto",
    "kids-weekly-pickleball-camp-toronto",
  ])
  assert.ok(CAMP_SKILL_FILTERS.includes("Kids"))
})

test("Kids filtering returns only the two kids programs", () => {
  const result = STATIC_PUBLIC_CAMP_CARDS
    .filter((camp) => campMatchesFilters(camp, {
      locations: [],
      formats: [],
      skillLevels: ["Kids"],
    }))
    .map((camp) => camp.id)

  assert.deepEqual(result, [
    "kids-summer-pickleball-camp-toronto",
    "kids-weekly-pickleball-camp-toronto",
  ])
  assert.equal(shouldShowMuskokaHub({
    campCount: 8,
    locations: [],
    formats: [],
    skillLevels: ["Kids"],
  }), false)
})

test("adds the weekly program to related links and active static navigation", () => {
  assert.deepEqual(
    RELATED_CAMP_LINKS.find((link) => link.href.includes("kids-weekly")),
    {
      label: "Pickleball Kids Weekly",
      homeLabel: "Pickleball Kids Weekly",
      href: "/pickleball-camps/kids-weekly-pickleball-camp-toronto",
    },
  )
  assert.equal(
    staticPublicCampNavItems("2026-08-09").some(
      (item) => item.title === "Kids Weekly Pickleball Camp",
    ),
    true,
  )
  assert.equal(
    staticPublicCampNavItems("2026-12-22").some(
      (item) => item.title === "Kids Weekly Pickleball Camp",
    ),
    false,
  )
})
```

- [ ] **Step 2: Run the new test and verify RED**

Run:

```bash
node --experimental-strip-types --test tests/camp-discovery.test.mjs
```

Expected: FAIL because `lib/camp-discovery.ts` does not exist.

- [ ] **Step 3: Implement the central discovery model**

Create `lib/camp-discovery.ts` with the existing static summer and Toronto cards moved from `RESTORED_PUBLIC_CAMP_CARDS`, plus the weekly aggregate card. Define the shared types and helpers with these signatures:

```ts
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
  { label: "Pickleball coaches", homeLabel: "Pickleball coaches in Toronto", href: "/pickleball-coaches" },
  { label: "Camp schedule", homeLabel: "Camp schedule", href: "/schedule" },
  { label: "Punta Cana pickleball retreat", homeLabel: "Punta Cana pickleball retreat", href: "/pickleball-camps/punta-cana" },
  { label: "Pickleball camp experience", homeLabel: "Pickleball camp experience", href: "/pickleball-camp-experience" },
  { label: "Pickleball Kids Weekly", homeLabel: "Pickleball Kids Weekly", href: "/pickleball-camps/kids-weekly-pickleball-camp-toronto" },
] as const
```

Add the aggregate card after the Baseline summer card so their shared sort order is deterministic:

```ts
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
}
```

Change the Baseline summer card’s `skillLevel` from `All Levels` to `Kids`. Implement filter and navigation helpers as pure functions:

```ts
export function campMatchesFilters(
  camp: Pick<PublicCampCard, "locationFilter" | "format" | "skillLevel">,
  filters: CampFilters,
) {
  if (filters.locations.length > 0 && !filters.locations.includes(camp.locationFilter)) return false
  if (filters.formats.length > 0 && !filters.formats.includes(camp.format)) return false
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
  return campCount > 0
    && skillLevels.length === 0
    && (locations.length === 0 || locations.includes("Muskoka"))
    && (formats.length === 0 || formats.includes("Camp"))
}

export function staticPublicCampNavItems(today: string) {
  return STATIC_PUBLIC_CAMP_CARDS
    .filter((camp) => camp.endDate >= today)
    .map((camp) => ({ title: camp.title, href: camp.link }))
}
```

- [ ] **Step 4: Point the live camp feed at the shared static model**

In `lib/public-camps.ts`:

```ts
import {
  STATIC_PUBLIC_CAMP_CARDS,
  staticPublicCampNavItems,
  type PublicCampCard,
} from "@/lib/camp-discovery"

export type { PublicCampCard } from "@/lib/camp-discovery"
```

Delete the local `PublicCampCard` type and `RESTORED_PUBLIC_CAMP_CARDS`. Replace their uses with `STATIC_PUBLIC_CAMP_CARDS`, and replace the local restored-card navigation mapping with:

```ts
...staticPublicCampNavItems(today),
```

Keep `shouldListKidsWeeklyCampAsStandalone` on database rows so the two child rows remain excluded from standalone listings.

- [ ] **Step 5: Verify GREEN and regression safety**

Run:

```bash
node --experimental-strip-types --test tests/camp-discovery.test.mjs tests/kids-weekly-camp.test.mjs tests/upcoming-camps.test.mjs
```

Expected: all discovery, weekly routing, and date-filter tests pass.

- [ ] **Step 6: Commit the discovery model**

```bash
git add lib/camp-discovery.ts lib/public-camps.ts tests/camp-discovery.test.mjs
git commit -m "Add kids weekly camp to shared discovery data"
```

---

### Task 2: Render the kids card, related link, and Kids filter

**Files:**
- Modify: `lib/camp-discovery.ts`
- Modify: `app/page.tsx`
- Modify: `app/pickleball-camps/camps-page-client.tsx`
- Create: `tests/camp-discovery-ui.test.mjs`

**Interfaces:**
- Consumes: discovery constants and pure helpers from Task 1.
- Produces: `COMPLETED_CAMP_CARDS` and `HOME_COMPLETED_CAMP_CARDS`, plus UI wiring that renders shared data on both discovery pages.

- [ ] **Step 1: Write the failing UI-wiring test**

Create `tests/camp-discovery-ui.test.mjs`:

```js
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const home = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8")
const camps = readFileSync(
  new URL("../app/pickleball-camps/camps-page-client.tsx", import.meta.url),
  "utf8",
)

test("homepage renders shared related links and completed cards", () => {
  assert.match(home, /RELATED_CAMP_LINKS\.map/)
  assert.match(home, /HOME_COMPLETED_CAMP_CARDS\.map/)
  assert.doesNotMatch(home, /Kids Passover Camp \*\//)
})

test("all-camps page renders the shared Kids filter and matching helpers", () => {
  assert.match(camps, /CAMP_SKILL_FILTERS\.map/)
  assert.match(camps, /campMatchesFilters/)
  assert.match(camps, /shouldShowMuskokaHub/)
  assert.match(camps, /RELATED_CAMP_LINKS\.map/)
  assert.match(camps, /COMPLETED_CAMP_CARDS/)
  assert.doesNotMatch(camps, /\["2\.5", "3\.0", "3\.5", "4\.0\+"\]/)
})
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
node --experimental-strip-types --test tests/camp-discovery-ui.test.mjs
```

Expected: FAIL because both pages still contain local arrays and hardcoded links.

- [ ] **Step 3: Centralize the existing completed cards**

Move the four existing completed card objects from `app/pickleball-camps/camps-page-client.tsx` into `lib/camp-discovery.ts` and export them as `COMPLETED_CAMP_CARDS`. Preserve their current titles, dates, images, badges, links, and buttons. Set skill categories exactly as follows: Toronto April `3.0-3.5`, Kids Passover `Kids`, Saint Martin `3.0-4.0`, and Toronto January `3.0-4.0`.

Export the two existing homepage cards through:

```ts
const HOME_COMPLETED_IDS = new Set(["toronto-april", "kids-passover-camp"])

export const HOME_COMPLETED_CAMP_CARDS = COMPLETED_CAMP_CARDS.filter((camp) =>
  HOME_COMPLETED_IDS.has(camp.id),
)
```

- [ ] **Step 4: Render shared data on the homepage**

In `app/page.tsx`, import `Fragment` from React plus `RELATED_CAMP_LINKS` and `HOME_COMPLETED_CAMP_CARDS`. Replace the related-link JSX with a map, preserving the slash separators:

```tsx
{RELATED_CAMP_LINKS.map((item, index) => (
  <Fragment key={item.href}>
    {index > 0 && <span className="hidden text-muted-foreground sm:inline">/</span>}
    <Link href={item.href} className="font-medium text-primary underline-offset-4 hover:underline">
      {item.homeLabel}
    </Link>
  </Fragment>
))}
```

Replace the two hand-authored completed cards with:

```tsx
<div className="grid gap-6 md:grid-cols-2">
  {HOME_COMPLETED_CAMP_CARDS.map((camp) => (
    <CampCard key={camp.id} {...camp} />
  ))}
</div>
```

Remove the now-unused `Badge` import.

- [ ] **Step 5: Wire shared filtering and content into all camps**

In `app/pickleball-camps/camps-page-client.tsx`, import:

```ts
import {
  CAMP_SKILL_FILTERS,
  COMPLETED_CAMP_CARDS,
  RELATED_CAMP_LINKS,
  campMatchesFilters,
  shouldShowMuskokaHub,
} from "@/lib/camp-discovery"
```

Delete the local `completedCamps` array. Replace the filter body with:

```ts
const filterCamps = <T extends { locationFilter: string; format: string; skillLevel: string }>(camps: T[]) =>
  camps.filter((camp) => campMatchesFilters(camp, {
    locations: selectedLocations,
    formats: selectedFormats,
    skillLevels: selectedSkillLevels,
  }))
```

Render `CAMP_SKILL_FILTERS.map(...)` in the skill-level button group, compute `showMuskokaHub` through the helper, render `RELATED_CAMP_LINKS.map(...)` in the header, and use `COMPLETED_CAMP_CARDS` for the completed tab.

```tsx
{CAMP_SKILL_FILTERS.map((level) => (
  <Button
    key={level}
    variant={selectedSkillLevels.includes(level) ? "default" : "outline"}
    size="sm"
    className="rounded-full"
    onClick={() => toggleSkillLevel(level)}
  >
    {level}
  </Button>
))}

const showMuskokaHub = shouldShowMuskokaHub({
  campCount: muskokaCamps.length,
  locations: selectedLocations,
  formats: selectedFormats,
  skillLevels: selectedSkillLevels,
})

{RELATED_CAMP_LINKS.map((item) => (
  <a
    key={item.href}
    href={item.href}
    className="font-medium text-primary underline-offset-4 hover:underline"
  >
    {item.label}
  </a>
))}

const filteredCompletedCamps = filterCamps(COMPLETED_CAMP_CARDS)
```

- [ ] **Step 6: Verify GREEN and all existing tests**

Run:

```bash
node --experimental-strip-types --test tests/*.test.mjs
```

Expected: the new UI-wiring tests and all existing tests pass.

- [ ] **Step 7: Commit the discovery UI**

```bash
git add lib/camp-discovery.ts app/page.tsx app/pickleball-camps/camps-page-client.tsx tests/camp-discovery-ui.test.mjs
git commit -m "Show kids programs across camp discovery pages"
```

---

### Task 3: Add the Muskoka season recap and completed card

**Files:**
- Modify: `lib/camp-discovery.ts`
- Create: `app/pickleball-camps/muskoka/recap/page.tsx`
- Modify: `app/sitemap.ts`
- Create: `public/muskoka-photos/muskoka-2026.png`
- Create: `tests/muskoka-recap.test.mjs`

**Interfaces:**
- Consumes: `COMPLETED_CAMP_CARDS` and `HOME_COMPLETED_CAMP_CARDS` from Task 2.
- Produces: the `/pickleball-camps/muskoka/recap` route, its completed card, metadata, public image, and sitemap URL.

- [ ] **Step 1: Write the failing Muskoka recap test**

Create `tests/muskoka-recap.test.mjs`:

```js
import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import test from "node:test"

import {
  COMPLETED_CAMP_CARDS,
  HOME_COMPLETED_CAMP_CARDS,
} from "../lib/camp-discovery.ts"

const recapUrl = new URL(
  "../app/pickleball-camps/muskoka/recap/page.tsx",
  import.meta.url,
)
const sitemap = readFileSync(new URL("../app/sitemap.ts", import.meta.url), "utf8")

test("puts the Muskoka season first in completed discovery", () => {
  const muskoka = COMPLETED_CAMP_CARDS[0]
  assert.deepEqual(
    {
      id: muskoka.id,
      title: muskoka.title,
      date: muskoka.date,
      image: muskoka.image,
      link: muskoka.link,
      buttonText: muskoka.buttonText,
    },
    {
      id: "muskoka-summer-2026",
      title: "Muskoka Summer Pickleball Camps",
      date: "July 10 – August 6, 2026",
      image: "/muskoka-photos/muskoka-2026.png",
      link: "/pickleball-camps/muskoka/recap",
      buttonText: "View Recap",
    },
  )
  assert.equal(HOME_COMPLETED_CAMP_CARDS[0].id, "muskoka-summer-2026")
})

test("publishes the full-period Muskoka recap content and image", () => {
  assert.equal(existsSync(recapUrl), true)
  const recap = readFileSync(recapUrl, "utf8")
  assert.match(recap, /Our First Summer in Muskoka/)
  assert.match(recap, /July 10 – August 6, 2026/)
  assert.match(recap, /12 Days of Nonstop Action/)
  assert.match(recap, /third-shot drives and drops/)
  assert.match(recap, /returning smashes/)
  assert.match(recap, /more Muskoka programming next year/)
  assert.match(recap, /muskoka-2026\.png/)
  assert.equal(
    existsSync(new URL("../public/muskoka-photos/muskoka-2026.png", import.meta.url)),
    true,
  )
})

test("adds the Muskoka recap to the sitemap", () => {
  assert.match(sitemap, /pickleball-camps\/muskoka\/recap/)
})
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
node --experimental-strip-types --test tests/muskoka-recap.test.mjs
```

Expected: FAIL because the completed card, recap route, and public image are absent.

- [ ] **Step 3: Add the image and completed card**

Copy the supplied PNG without transformation:

```bash
cp /Users/airuntime/Documents/breakaway/docs/reference/muskoka-photos/muskoka_2026.png public/muskoka-photos/muskoka-2026.png
```

Prepend this object to `COMPLETED_CAMP_CARDS` in `lib/camp-discovery.ts`:

```ts
{
  id: "muskoka-summer-2026",
  title: "Muskoka Summer Pickleball Camps",
  date: "July 10 – August 6, 2026",
  location: "Muskoka, Ontario",
  locationFilter: "Muskoka",
  format: "Camp",
  skillLevel: "All Levels",
  price: "",
  image: "/muskoka-photos/muskoka-2026.png",
  badges: [{ text: "Completed", variant: "secondary" as const }],
  coach: "Joey Manchurek",
  link: "/pickleball-camps/muskoka/recap",
  buttonText: "View Recap",
  compact: true,
}
```

Add `muskoka-summer-2026` to the home completed ID set and change the homepage completed grid to `md:grid-cols-3` with `max-w-5xl` so all three cards are balanced.

- [ ] **Step 4: Create the recap page**

Create `app/pickleball-camps/muskoka/recap/page.tsx` using `Image`, `Link`, `Calendar`, `MapPin`, `Users`, `ArrowRight`, `Badge`, and `Button`. Set metadata exactly:

```ts
export const metadata: Metadata = {
  title: "Our First Summer in Muskoka | Breakaway Pickleball",
  description:
    "A recap of Breakaway Pickleball's first Muskoka summer: 12 days of connected training, great people, and active time in cottage country from July 10 to August 6, 2026.",
  alternates: { canonical: "/pickleball-camps/muskoka/recap" },
  openGraph: {
    title: "Our First Summer in Muskoka",
    description:
      "Twelve days of pickleball training, community, and cottage-country energy with Joey Manchurek.",
    url: "/pickleball-camps/muskoka/recap",
    images: ["/muskoka-photos/muskoka-2026.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/muskoka-photos/muskoka-2026.png"],
  },
}
```

Use the supplied image as a full-width hero with alt text `Players training with Joey Manchurek during Breakaway's first Muskoka summer`. Build the article in this order:

```tsx
<h1>Our First Summer in Muskoka</h1>
<p>July 10 – August 6, 2026</p>
<p>
  Our first summer in Muskoka was everything we hoped it would be: great people,
  high-energy pickleball, and a chance to get moving in the heart of cottage country.
</p>
<h2>12 Days of Nonstop Action</h2>
<h3>Day 1 — Owning the Net</h3>
<p>Net play, dinking patterns, speed-ups, resets, and live play.</p>
<h3>Day 2 — Earning the Kitchen Line</h3>
<p>
  Transition work connected third-shot drives and drops, fifth-shot drops, and the
  net skills introduced on Day 1.
</p>
<h3>Day 3 — Offense, Defense, and Putting It Together</h3>
<p>
  Players trained overhead smashes, returning smashes, lobs, retrieving lobs, and
  switching between offense and defense before combining the full camp in game play.
</p>
<h2>A New Muskoka Home</h2>
<p>
  The new indoor facility gave every group a focused place to train, and the energy
  stayed high from the first session to the last.
</p>
<h2>Joey’s Recap</h2>
<p>
  Joey described the run as 12 days of nonstop action. Each day connected to the one
  before it, and participants embraced both the progression and the new facility.
  The response was enthusiastic, and everyone was already looking forward to next year.
</p>
<h2>We’ll Be Back</h2>
<p>
  Thank you to everyone who made our first Muskoka summer so memorable. Breakaway will
  be back with even more Muskoka programming next year.
</p>
```

End with a button linking to `/pickleball-camps/muskoka` and label it `Explore Muskoka Camps`. Do not render page-level `Navigation` or `Footer`; Task 4 supplies the shared shell.

- [ ] **Step 5: Add the recap sitemap entry**

In `app/sitemap.ts`, add:

```ts
sitemapEntry("/pickleball-camps/muskoka/recap", "monthly", 0.7),
```

next to the existing Muskoka hub entry.

- [ ] **Step 6: Verify GREEN and image integrity**

Run:

```bash
node --experimental-strip-types --test tests/muskoka-recap.test.mjs tests/camp-discovery-ui.test.mjs
file public/muskoka-photos/muskoka-2026.png
```

Expected: tests pass and `file` reports a valid PNG image.

- [ ] **Step 7: Commit the Muskoka recap**

```bash
git add lib/camp-discovery.ts app/page.tsx app/pickleball-camps/muskoka/recap/page.tsx app/sitemap.ts public/muskoka-photos/muskoka-2026.png tests/muskoka-recap.test.mjs
git commit -m "Add Muskoka 2026 summer recap"
```

---

### Task 4: Standardize marketing navigation and footer

**Files:**
- Create: `lib/site-chrome.ts`
- Create: `components/SiteChrome.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/camp/[id]/page.tsx`
- Modify: `app/camps/loading.tsx`
- Modify: `app/camps/page.tsx`
- Modify: `app/camps/saint-martin-clinic/page.tsx`
- Modify: `app/camps/toronto-april/page.tsx`
- Modify: `app/camps/toronto-intensive-jan/page.tsx`
- Modify: `app/camps/toronto-intensive-jan/recap/page.tsx`
- Modify: `app/coaches/page.tsx`
- Modify: `app/experience/page.tsx`
- Modify: `app/pickleball-camp-experience/page.tsx`
- Modify: `app/pickleball-camps/[slug]/page.tsx`
- Modify: `app/pickleball-camps/page.tsx`
- Modify: `app/pickleball-camps/camps-page-client.tsx`
- Modify: `app/pickleball-camps/kids-passover-pickleball-camp-toronto/kids-camp-client.tsx`
- Modify: `app/pickleball-camps/kids-passover-pickleball-camp-toronto/recap/page.tsx`
- Modify: `app/pickleball-camps/kids-summer-pickleball-camp-toronto/kids-summer-client.tsx`
- Modify: `app/pickleball-camps/kids-weekly-pickleball-camp-toronto/page.tsx`
- Modify: `app/pickleball-camps/muskoka/page.tsx`
- Modify: `app/pickleball-camps/muskoka/muskoka-page-client.tsx`
- Modify: `app/pickleball-camps/punta-cana/page.tsx`
- Modify: `app/pickleball-camps/punta-cana/punta-cana-page-client.tsx`
- Modify: `app/pickleball-camps/saint-martin-clinic/page.tsx`
- Modify: `app/pickleball-camps/saint-martin-pickleball-clinic/recap/page.tsx`
- Modify: `app/pickleball-camps/saint-martin-pickleball-clinic/saint-martin-client.tsx`
- Modify: `app/pickleball-camps/toronto-april/page.tsx`
- Modify: `app/pickleball-camps/toronto-intensive-jan/page.tsx`
- Modify: `app/pickleball-camps/toronto-intensive-jan/recap/page.tsx`
- Modify: `app/pickleball-camps/toronto-intermediate-pickleball-camp/toronto-camp-client.tsx`
- Modify: `app/pickleball-coaches/page.tsx`
- Modify: `app/schedule/page.tsx`
- Create: `tests/site-chrome.test.mjs`

**Interfaces:**
- Produces: `shouldRenderSiteChrome(pathname: string): boolean` and `SiteChrome({ children, campItems })`.
- Consumes: `getPublishedPublicCampNavItems()` from `lib/public-camps.ts`, plus existing `Navigation` and `Footer` components.

- [ ] **Step 1: Write failing route-policy and ownership tests**

Create `tests/site-chrome.test.mjs`:

```js
import assert from "node:assert/strict"
import { readFileSync, readdirSync } from "node:fs"
import { extname, join } from "node:path"
import test from "node:test"

import { shouldRenderSiteChrome } from "../lib/site-chrome.ts"

test("shows shared chrome on marketing and legal pages", () => {
  for (const path of [
    "/",
    "/pickleball-camps",
    "/pickleball-camps/muskoka/recap",
    "/pickleball-coaches",
    "/privacy-policy",
    "/terms",
  ]) {
    assert.equal(shouldRenderSiteChrome(path), true, path)
  }
})

test("keeps focused and internal routes chromeless", () => {
  for (const path of [
    "/checkout/example",
    "/checkout/confirmation",
    "/waiver",
    "/waiver-sign/token",
    "/waiver-u18/token",
    "/preferences",
    "/thank-you",
    "/countdown",
    "/countdown-b",
    "/design-system/cards",
  ]) {
    assert.equal(shouldRenderSiteChrome(path), false, path)
  }
})

test("root layout owns the shared marketing shell", () => {
  const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8")
  assert.match(layout, /getPublishedPublicCampNavItems/)
  assert.match(layout, /<SiteChrome campItems=\{navCampItems\}>/)
})

test("app views no longer render page-level Navigation or Footer", () => {
  const root = new URL("../app", import.meta.url)
  const files = readdirSync(root, { recursive: true })
    .filter((entry) => typeof entry === "string" && extname(entry) === ".tsx")

  for (const entry of files) {
    const source = readFileSync(join(root.pathname, entry), "utf8")
    assert.doesNotMatch(source, /<Navigation(?:\s|\/|>)/, entry)
    assert.doesNotMatch(source, /<Footer(?:\s|\/|>)/, entry)
    assert.doesNotMatch(source, /<FooterNotifySignup(?:\s|\/|>)/, entry)
  }
})
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
node --experimental-strip-types --test tests/site-chrome.test.mjs
```

Expected: FAIL because the route policy and root shell do not exist and page-level chrome is still present.

- [ ] **Step 3: Implement the route policy**

Create `lib/site-chrome.ts`:

```ts
const CHROMELESS_ROUTE_PREFIXES = [
  "/checkout",
  "/waiver",
  "/waiver-sign",
  "/waiver-u18",
  "/preferences",
  "/thank-you",
  "/countdown",
  "/countdown-b",
  "/design-system",
] as const

function matchesRoutePrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

export function shouldRenderSiteChrome(pathname: string) {
  return !CHROMELESS_ROUTE_PREFIXES.some((prefix) =>
    matchesRoutePrefix(pathname, prefix),
  )
}
```

- [ ] **Step 4: Implement the shared shell**

Create `components/SiteChrome.tsx`:

```tsx
"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { Footer } from "@/components/Footer"
import { Navigation } from "@/components/Navigation"
import { shouldRenderSiteChrome } from "@/lib/site-chrome"
import type { PublicCampNavItem } from "@/lib/public-camps"

export function SiteChrome({
  children,
  campItems,
}: {
  children: ReactNode
  campItems: PublicCampNavItem[]
}) {
  const pathname = usePathname()

  if (!shouldRenderSiteChrome(pathname)) return <>{children}</>

  return (
    <>
      <Navigation campItems={campItems} />
      {children}
      <Footer />
    </>
  )
}
```

Make `RootLayout` async, fetch navigation with a safe empty fallback, and wrap children:

```tsx
const navCampItems = await getPublishedPublicCampNavItems().catch(() => [])

<Suspense fallback={null}>
  <SiteChrome campItems={navCampItems}>{children}</SiteChrome>
</Suspense>
```

Keep analytics, scroll restoration, fonts, and scripts unchanged.

- [ ] **Step 5: Remove page-level chrome and redundant nav data plumbing**

For every file listed in this task:

```tsx
// Remove these imports wherever present.
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { FooterNotifySignup } from "@/components/FooterNotifySignup"

// Remove their JSX instances; keep all content between them.
<Navigation campItems={navCampItems} />
<Navigation />
<Footer />
<Footer hideNotifySignup={true} />
<FooterNotifySignup showViewCampsButton />
```

Remove obsolete `navCampItems` props from `CampsPageClient`, `MuskokaPageClient`, and `PuntaCanaPageClient`. In their server pages and in `app/page.tsx`, `app/schedule/page.tsx`, `app/pickleball-camps/[slug]/page.tsx`, and the weekly landing page, remove redundant `getPublishedPublicCampNavItems()` calls while preserving every other parallel fetch.

Keep recap hero back buttons because they are page content, not site navigation.

- [ ] **Step 6: Verify GREEN, types, and the full suite**

Run:

```bash
node --experimental-strip-types --test tests/site-chrome.test.mjs
node --experimental-strip-types --test tests/*.test.mjs
npx tsc --noEmit
```

Expected: route policy, shell ownership, all existing tests, and TypeScript checks pass.

- [ ] **Step 7: Commit the shared site chrome**

```bash
git add app components/SiteChrome.tsx lib/site-chrome.ts tests/site-chrome.test.mjs
git commit -m "Use one shared marketing header and footer"
```

---

### Task 5: Full verification, preview, pull request, and production confirmation

**Files:**
- Verify: all files changed in Tasks 1–4
- Update only if verification exposes a reproducible defect: the smallest owning file and its regression test

**Interfaces:**
- Consumes: completed implementation and existing Vercel/GitHub release flow.
- Produces: passing test/build evidence, preview-pane evidence, a merged pull request, and production verification.

- [ ] **Step 1: Run the complete automated verification**

Run:

```bash
node --experimental-strip-types --test tests/*.test.mjs
npx tsc --noEmit
npm run build
git diff --check
git status --short
```

Expected: all tests pass, TypeScript passes, the Next production build succeeds, no whitespace errors appear, and only the dependency verifier’s untracked `pnpm-workspace.yaml` remains outside the intentional changes.

- [ ] **Step 2: Start the isolated preview server**

Run:

```bash
npm run dev -- --port 3017
```

Keep the process running only for the visual checks below.

- [ ] **Step 3: Open and inspect every changed web view in the preview pane**

At desktop and mobile widths, open:

```text
http://localhost:3017/
http://localhost:3017/pickleball-camps
http://localhost:3017/pickleball-camps/kids-weekly-pickleball-camp-toronto
http://localhost:3017/pickleball-camps/punta-cana
http://localhost:3017/pickleball-camps/muskoka/recap
http://localhost:3017/checkout/toronto-kids-weekly-all-levels-sep-10-2026
```

Confirm visually and through DOM text inspection:

- homepage weekly card shows the approved image and exact title, coach, date, venue, and `From $600`;
- both homepage and camps page include `Pickleball Kids Weekly`;
- Camps navigation contains `Kids Weekly Pickleball Camp` on homepage, camps, weekly, Punta Cana, and recap routes;
- selecting Kids on `/pickleball-camps` shows exactly the Baseline and weekly cards;
- Muskoka completed card uses the supplied image and opens the recap;
- recap hierarchy, image crop, curriculum, facility, Joey recap, and next-year close render cleanly;
- marketing routes show one identical header and footer;
- checkout remains chromeless and its flow is not submitted.

- [ ] **Step 4: Rebase safely onto the latest remote main**

Because other agents push to this repository, run:

```bash
git fetch origin main
git rebase origin/main
node --experimental-strip-types --test tests/*.test.mjs
npm run build
```

Expected: rebase completes without losing any task commit; tests and build remain green.

- [ ] **Step 5: Push and open a ready pull request**

```bash
git push -u origin codex/kids-camp-discovery
gh pr create \
  --base main \
  --head codex/kids-camp-discovery \
  --title "Add kids camp discovery and Muskoka summer recap" \
  --body "Adds the weekly kids camp across discovery and navigation, introduces a Kids filter, publishes the Muskoka 2026 recap, and standardizes shared marketing chrome while preserving focused transactional routes."
```

- [ ] **Step 6: Wait for checks and merge**

```bash
gh pr checks --watch
gh pr merge --squash --delete-branch
```

Expected: required checks pass before the squash merge succeeds.

- [ ] **Step 7: Verify production after deployment**

Open the production equivalents of the homepage, camps page, weekly landing, Punta Cana legacy page, Muskoka recap, and one checkout route. Repeat the Step 3 assertions, confirm the Muskoka Open Graph image URL responds successfully, and record the merged PR URL and production-visible copy in the final report.
