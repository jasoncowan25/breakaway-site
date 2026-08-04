# Kids Weekly Shared Chrome And Checkout Name Icons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make checkout name-field spacing intentional with person icons and compose the kids weekly landing page with the marketing site's populated navigation and full shared footer.

**Architecture:** Reuse the existing checkout `Icon` and `lead` input pattern without changing form data. Move site chrome composition to the server page, where the two weekly camps and live navigation items are fetched together, leaving the client landing component responsible only for interactive page content.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS Modules, Node test runner, existing shared `Navigation`, `Footer`, and checkout `Icon` components.

## Global Constraints

- No API, database, checkout calculation, validation, or payment-flow changes.
- Use the existing 16-pixel outline `user` icon and muted leading-icon styling.
- Keep the shared footer notification signup visible.
- Do not retain custom kids-page navigation markup or CSS.
- Run the sandbox E2E gate before pushing to production.

---

### Task 1: Add Person Icons To Checkout Name Fields

**Files:**
- Create: `tests/kids-weekly-ui-shell.test.mjs`
- Modify: `components/checkout/PlayerCard.tsx`
- Modify: `components/checkout/Guardian.tsx`

**Interfaces:**
- Consumes: `Icon` with `name="user"`, `size={16}`, and the existing `.inp-wrap .lead` layout.
- Produces: Consistent leading person icons on player, child, editable account-holder, and guardian first/last name inputs.

- [ ] **Step 1: Write the failing name-icon test**

```js
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const playerCardSource = readFileSync(
  new URL("../components/checkout/PlayerCard.tsx", import.meta.url),
  "utf8",
)
const guardianSource = readFileSync(
  new URL("../components/checkout/Guardian.tsx", import.meta.url),
  "utf8",
)

test("checkout name fields render the existing person icon", () => {
  assert.equal((playerCardSource.match(/<Icon name="user" size=\{16\} \/>/g) ?? []).length, 4)
  assert.equal((guardianSource.match(/<Icon name="user" size=\{16\} \/>/g) ?? []).length, 2)
})
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --experimental-strip-types --test tests/kids-weekly-ui-shell.test.mjs`

Expected: FAIL because both icon counts are zero.

- [ ] **Step 3: Add the existing leading-icon treatment**

For each name input already inside `.inp-wrap`, insert:

```tsx
<span className="lead">
  <Icon name="user" size={16} />
</span>
```

Wrap the two editable `YouCard` name inputs in the same `.inp-wrap` structure and add the same leading icon. Preserve inputs, values, handlers, placeholders, validation checks, and labels exactly.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `node --experimental-strip-types --test tests/kids-weekly-ui-shell.test.mjs`

Expected: PASS with one passing test.

- [ ] **Step 5: Commit the name-icon change**

```bash
git add tests/kids-weekly-ui-shell.test.mjs components/checkout/PlayerCard.tsx components/checkout/Guardian.tsx
git commit -m "Fix checkout name field spacing"
```

### Task 2: Replace Custom Landing Chrome With Shared Site Chrome

**Files:**
- Modify: `tests/kids-weekly-ui-shell.test.mjs`
- Modify: `app/pickleball-camps/kids-weekly-pickleball-camp-toronto/page.tsx`
- Modify: `app/pickleball-camps/kids-weekly-pickleball-camp-toronto/kids-weekly-landing.tsx`
- Modify: `app/pickleball-camps/kids-weekly-pickleball-camp-toronto/kids-weekly.module.css`

**Interfaces:**
- Consumes: `getPublishedPublicCampNavItems(): Promise<PublicCampNavItem[]>`, `Navigation({ campItems })`, `Footer()`.
- Produces: A server-composed page with populated shared navigation, interactive landing content, and the shared notification/footer block.

- [ ] **Step 1: Add the failing shared-chrome test**

Append to `tests/kids-weekly-ui-shell.test.mjs`:

```js
const kidsPageSource = readFileSync(
  new URL("../app/pickleball-camps/kids-weekly-pickleball-camp-toronto/page.tsx", import.meta.url),
  "utf8",
)
const landingSource = readFileSync(
  new URL("../app/pickleball-camps/kids-weekly-pickleball-camp-toronto/kids-weekly-landing.tsx", import.meta.url),
  "utf8",
)
const landingCssSource = readFileSync(
  new URL("../app/pickleball-camps/kids-weekly-pickleball-camp-toronto/kids-weekly.module.css", import.meta.url),
  "utf8",
)

test("kids weekly page uses populated shared site navigation and footer", () => {
  assert.match(kidsPageSource, /getPublishedPublicCampNavItems/)
  assert.match(kidsPageSource, /<Navigation campItems=\{navCampItems\} \/>/)
  assert.match(kidsPageSource, /<Footer \/>/)
  assert.doesNotMatch(landingSource, /<nav\b/)
  assert.doesNotMatch(landingSource, /<Footer \/>/)
  assert.doesNotMatch(landingSource, /menuOpen/)
  assert.doesNotMatch(landingCssSource, /^\.nav/m)
})
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --experimental-strip-types --test tests/kids-weekly-ui-shell.test.mjs`

Expected: FAIL because the server page does not render shared chrome and the client still contains custom navigation.

- [ ] **Step 3: Compose shared chrome in the server page**

Import `Navigation`, `Footer`, and `getPublishedPublicCampNavItems`. Fetch `navCampItems` in the existing `Promise.all`, then return:

```tsx
return (
  <>
    <Navigation campItems={navCampItems} />
    <KidsWeeklyLanding
      allLevels={buildKidsWeeklyProgram("allLevels", allLevelsCamp)}
      experienced={buildKidsWeeklyProgram("experienced", experiencedCamp)}
    />
    <Footer />
  </>
)
```

- [ ] **Step 4: Remove custom chrome from the client landing**

Remove the custom nav imports, `menuOpen` state, custom `<nav>`, and client-owned `<Footer />`. Keep the landing body inside its page-scoped wrapper:

```tsx
<div className={styles.page}>
  <main>
```

Close the client component immediately after the existing closing-CTA section with:

```tsx
  </main>
</div>
```

Delete the now-unused navigation selectors from `kids-weekly.module.css`, including their mobile media-query overrides.

- [ ] **Step 5: Run the focused test and verify GREEN**

Run: `node --experimental-strip-types --test tests/kids-weekly-ui-shell.test.mjs`

Expected: PASS with two passing tests.

- [ ] **Step 6: Commit the shared-chrome change**

```bash
git add tests/kids-weekly-ui-shell.test.mjs app/pickleball-camps/kids-weekly-pickleball-camp-toronto/page.tsx app/pickleball-camps/kids-weekly-pickleball-camp-toronto/kids-weekly-landing.tsx app/pickleball-camps/kids-weekly-pickleball-camp-toronto/kids-weekly.module.css
git commit -m "Use shared site chrome on kids weekly page"
```

### Task 3: Verify And Release

**Files:**
- Verify only; no planned source changes.

**Interfaces:**
- Consumes: The complete site branch after Tasks 1 and 2.
- Produces: Verified production deployment on the existing canonical kids weekly URL.

- [ ] **Step 1: Run the complete marketing-site test suite**

Run: `pnpm test`

Expected: All tests pass with zero failures.

- [ ] **Step 2: Run the production build**

Run: `pnpm build`

Expected: Next.js build exits successfully.

- [ ] **Step 3: Run the required sandbox E2E gate**

Start the sandbox API on `:3001`, marketing site on `:3005`, and admin on `:3009`, then run `pnpm test:e2e` from the approved admin release worktree.

Expected: `status=passed` with zero failed checkpoints.

- [ ] **Step 4: Rebase on the latest production branch and reverify**

Run `git fetch origin main`, rebase the feature branch onto `origin/main`, then rerun `pnpm test` and `pnpm build`.

Expected: Rebase succeeds and both commands remain green.

- [ ] **Step 5: Push to production**

Push the verified branch head to `origin/main` without force.

- [ ] **Step 6: Verify production**

Confirm the canonical URL returns successfully, the logo links to `/`, the Camps menu contains live camp items, the shared footer is present, and both checkout routes still respond.
