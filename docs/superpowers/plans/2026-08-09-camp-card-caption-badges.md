# Camp Card Caption and Badge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the approved date caption and promotional badges on the four shared Toronto camp cards.

**Architecture:** Keep the approved card content in `STATIC_PUBLIC_CAMP_CARDS`, which feeds both the homepage and All Camps page. Add an optional `availabilityLabel` card property so fixed promotional availability copy can render independently from live numeric registration availability.

**Tech Stack:** TypeScript, React, Next.js, Node test runner.

## Global Constraints

- Kids Weekly date text must be exactly `Weekly programs · Sep 7–Dec 21, 2026`.
- Baseline badge must be exactly `New`.
- Kids Weekly badge must be exactly `Just Announced`.
- Both Toronto Intermediate cards must omit `New` and show exactly `Only 16 Spots` regardless of registrations.
- Do not change dates, capacity, registrations, pricing, links, images, filters, checkout, or Supabase data.

---

### Task 1: Shared camp-card caption and badges

**Files:**
- Modify: `tests/camp-discovery.test.mjs`
- Modify: `lib/camp-discovery.ts`
- Modify: `components/CampCard.tsx`

**Interfaces:**
- Consumes: `STATIC_PUBLIC_CAMP_CARDS: PublicCampCard[]` and `CampCard` prop spreading on homepage and All Camps.
- Produces: `PublicCampCard.availabilityLabel?: string` and `CampCardProps.availabilityLabel?: string`.

- [ ] **Step 1: Write the failing discovery test**

Add a test that selects the four cards and asserts these literal user-visible values:

```js
assert.deepEqual(
  cards.map(({ id, date, badges, availabilityLabel }) => ({ id, date, badges, availabilityLabel })),
  [
    {
      id: "kids-summer-pickleball-camp-toronto",
      date: "August 17 – September 4, 2026",
      badges: [{ text: "New", variant: "accent" }],
      availabilityLabel: undefined,
    },
    {
      id: "kids-weekly-pickleball-camp-toronto",
      date: "Weekly programs · Sep 7–Dec 21, 2026",
      badges: [{ text: "Just Announced", variant: "accent" }],
      availabilityLabel: undefined,
    },
    {
      id: "toronto-intermediate-intensive-sep-12-2026-3",
      date: "September 12-13, 2026",
      badges: [],
      availabilityLabel: "Only 16 Spots",
    },
    {
      id: "toronto-intermediate-intensive-oct-24-2026",
      date: "October 24-25, 2026",
      badges: [],
      availabilityLabel: "Only 16 Spots",
    },
  ],
)
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --experimental-strip-types --test tests/camp-discovery.test.mjs`

Expected: FAIL because the weekly date/badges still use the old copy and the intermediate cards have no `availabilityLabel`.

- [ ] **Step 3: Add the shared model and approved card content**

In `PublicCampCard`, add:

```ts
availabilityLabel?: string
```

Update the four static card definitions to the exact values from the test. Remove `spotsRemaining` from the two intermediate cards so their display is not registration-derived.

- [ ] **Step 4: Render fixed availability copy**

Add `availabilityLabel?: string` to `CampCardProps`, include it in the component arguments, and treat it as an availability signal. Render it before the existing loading/sold-out/numeric branches:

```tsx
{availabilityLabel ? (
  <Badge variant="outline" className="text-xs bg-white/90 border-border text-foreground">
    {availabilityLabel}
  </Badge>
) : isLoadingAvailability ? (
  // existing loading branch
) : soldOut ? (
  // existing sold-out branch
) : (
  // existing numeric branch
)}
```

- [ ] **Step 5: Run the focused test and verify GREEN**

Run: `node --experimental-strip-types --test tests/camp-discovery.test.mjs`

Expected: all discovery tests PASS.

- [ ] **Step 6: Run complete verification**

Run:

```bash
node --experimental-strip-types --test tests/*.test.mjs
npx tsc --noEmit
npm run build
git diff --check
```

Expected: 35 or more tests pass; TypeScript, production build, and diff check exit successfully.

- [ ] **Step 7: Preview desktop and mobile**

Start the local site, then open `/` and `/pickleball-camps` in the preview pane. Verify all four approved card captions/badges at desktop and 390px mobile widths, with no horizontal overflow or console errors.

- [ ] **Step 8: Commit and publish**

```bash
git add tests/camp-discovery.test.mjs lib/camp-discovery.ts components/CampCard.tsx docs/superpowers/plans/2026-08-09-camp-card-caption-badges.md
git commit -m "Update promoted camp card captions"
git push -u origin codex/kids-card-captions
```

Open a ready pull request, merge after checks pass, and verify the same card copy on production.
