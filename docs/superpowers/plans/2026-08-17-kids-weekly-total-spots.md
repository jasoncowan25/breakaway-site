# Kids Weekly Total Spots Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show total program capacity on the Kids Weekly landing page instead of remaining inventory.

**Architecture:** Extend the existing `KidsWeeklyCampLike` input with the API's capacity field and derive `spotsLabel` from live capacity, falling back to the configured program capacity. Preserve the existing live spots-left branch for sold-out state and all checkout enforcement.

**Tech Stack:** TypeScript, Next.js, Node test runner

## Global Constraints

- Only the Kids Weekly landing-page capacity label changes.
- A 10-capacity program with 9 spots remaining displays `10 spots`.
- Sold-out programs continue to display `Sold out`.

---

### Task 1: Render total Kids Weekly capacity

**Files:**
- Modify: `lib/kids-weekly-camp.ts`
- Test: `tests/kids-weekly-camp.test.mjs`

**Interfaces:**
- Consumes: `ApiCamp.capacity`, existing per-program fallback capacity, live `spotsLeft`, and `isSoldOut`.
- Produces: `buildKidsWeeklyProgram(...).spotsLabel` as either `Sold out` or `<capacity> spots`.

- [ ] **Step 1: Write the failing test**

Update the experienced-program fixture to use `capacity: 10` and `spotsLeft: 9`, then assert:

```js
assert.equal(program.spotsLabel, "10 spots")
```

Also update the all-levels expectation from remaining inventory to total capacity:

```js
assert.equal(program.spotsLabel, "20 spots")
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/kids-weekly-camp.test.mjs`

Expected: FAIL because the current implementation returns `17 spots left` or `9 spots left`.

- [ ] **Step 3: Write minimal implementation**

Include `capacity` in `KidsWeeklyCampLike`, derive total capacity with a safe fallback, and replace the non-sold-out label branch:

```ts
const capacity = camp?.capacity ?? config.capacity

spotsLabel: soldOut ? "Sold out" : `${capacity} spots`,
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/kids-weekly-camp.test.mjs`

Expected: PASS.

- [ ] **Step 5: Run complete verification**

Run the repository's full test, lint/type-check, and production-build commands. Start the local site and visually inspect the Kids Weekly route in the in-app preview.

- [ ] **Step 6: Commit**

```bash
git add lib/kids-weekly-camp.ts tests/kids-weekly-camp.test.mjs docs/superpowers/specs/2026-08-17-kids-weekly-total-spots-design.md docs/superpowers/plans/2026-08-17-kids-weekly-total-spots.md
git commit -m "fix(kids): show total weekly program capacity"
```
