# Camp Card Caption and Badge Design

## Goal

Make the four newly promoted Toronto camp cards clearer and more intentional without changing their ordering, links, images, pricing, or filtering.

## Approved card copy

- Baseline x Breakaway Kids Summer Camp: replace `Just Announced` with `New`.
- Kids Weekly Pickleball Camp: replace `Weekly, Sep – Dec, 2026` with `Weekly programs · Sep 7–Dec 21, 2026`, and replace `New` with `Just Announced`.
- Toronto Intermediate Intensive on September 12–13: remove the `New` badge and show `Only 16 Spots`.
- Toronto Intermediate Intensive on October 24–25: remove the `New` badge and show `Only 16 Spots`.

The intermediate availability caption is deliberate promotional copy. It remains fixed at 16 and does not decrease with registrations.

## Implementation

Keep the copy in the shared static camp-card definitions in `lib/camp-discovery.ts`, since those definitions feed both the homepage and the All Camps page. Add an explicit availability-label field to the shared card model and render it through `CampCard`. This separates fixed promotional wording from the existing numeric `spotsRemaining` behaviour used for live availability.

## Testing and verification

- Extend the discovery-data test to assert the exact date and badge copy for all four cards.
- Add a focused card-rendering assertion for the fixed availability label if the existing test setup supports component rendering; otherwise test that the shared model carries the exact label and manually verify its rendering in the browser.
- Run the complete Node test suite, TypeScript, and production build.
- Open the homepage and All Camps page in the preview pane at desktop and mobile sizes. Confirm the shared card copy is visible and the intermediate cards show only the fixed `Only 16 Spots` badge.

## Out of scope

No camp dates, capacity, registration counts, checkout pricing, Supabase data, navigation, or landing-page program details change.

## Follow-up: weekly youth age badge

Add `Ages 9–14` as a second badge on the Kids Weekly Pickleball Camp card. Keep `Just Announced` first in the green accent treatment and render the age badge directly beneath it in the existing blue secondary treatment used by completed kids camp cards. The change flows through the shared static card definition to both the homepage and All Camps page.
