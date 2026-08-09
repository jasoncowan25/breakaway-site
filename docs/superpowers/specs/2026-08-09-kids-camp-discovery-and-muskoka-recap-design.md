# Kids Camp Discovery and Muskoka Recap Design

## Goal

Make the two current kids programs easy to discover from the Breakaway homepage, the all-camps page, and the shared navigation; add a complete Muskoka 2026 season recap; and make the existing shared marketing header and footer consistent across public marketing pages.

## Site Chrome

The existing `Navigation` and `Footer` components remain the only marketing header and footer. A root-level marketing shell will render them around public content instead of requiring each page to opt in independently. The shell receives the same live camp navigation items on every route, so the Camps dropdown cannot vary between pages.

The following focused or internal routes remain chromeless:

- `/checkout` and `/checkout/**`
- `/waiver`, `/waiver/**`, `/waiver-sign`, `/waiver-sign/**`, `/waiver-u18`, and `/waiver-u18/**`
- `/preferences`
- `/thank-you`
- `/countdown` and `/countdown-b`
- `/design-system/**`

All other public pages use the shared marketing shell. Existing page-level `Navigation`, `Footer`, and recap-only footer signup instances will be removed so that each page renders the shared header and footer exactly once. Page-specific calls to action remain part of page content.

## Kids Weekly Discovery Card

The two database rows for the weekly program continue to share one public landing page. They must not appear as two separate cards. One aggregate discovery card will be added to the static public-camp card collection with this content:

- Title: `Kids Weekly Pickleball Camp`
- Coach: `Joey Manchurek`
- Date: `Weekly, Sep – Dec, 2026`
- Sort date: `2026-09-07`
- End date: `2026-12-21`
- Location: `The Jar Pickleball Club`
- Price: `From $600`
- Thumbnail: `/images/kids-weekly/kids-camp-joey.jpg`
- Skill category: `Kids`
- Destination: `/pickleball-camps/kids-weekly-pickleball-camp-toronto`
- Button: `Learn More`

Because static public cards feed the homepage, all-camps page, structured data, and camp navigation, this one definition will surface the weekly program consistently. It will age out after December 21 through the existing end-date filter.

The Baseline × Breakaway Kids Summer Camp will also receive the `Kids` skill category. The all-camps skill selector will add a `Kids` button. Selecting it must show exactly these two upcoming kids cards and hide the Muskoka hub and adult camps. Existing location and format filters continue to combine with the skill filter.

The Camps dropdown label for the aggregate weekly card is `Kids Weekly Pickleball Camp` and points to the shared weekly landing page.

## Related Links

The homepage and all-camps related-link strips will both add:

- Label: `Pickleball Kids Weekly`
- Destination: `/pickleball-camps/kids-weekly-pickleball-camp-toronto`

The existing coach, schedule, Punta Cana, and camp-experience links remain unchanged.

## Muskoka Recently Completed Card

The newest completed item will appear first in the homepage and all-camps completed sections:

- Title: `Muskoka Summer Pickleball Camps`
- Date: `July 10 – August 6, 2026`
- Location: `Muskoka, Ontario`
- Thumbnail: `/muskoka-photos/muskoka-2026.png`
- Badge: `Completed`
- Coach: `Joey Manchurek`
- Destination: `/pickleball-camps/muskoka/recap`
- Button: `View Recap`

The supplied `docs/reference/muskoka-photos/muskoka_2026.png` image will be copied into the site’s public Muskoka image directory as `muskoka-2026.png` and used for both the card and recap hero. Existing completed cards remain available.

## Muskoka Recap Page

The route `/pickleball-camps/muskoka/recap` will be one season recap covering the full July 10–August 6 period. The page title is `Our First Summer in Muskoka`.

The recap will contain:

1. An opening that describes Breakaway’s first Muskoka summer, the people who joined, and the value of getting active in cottage country.
2. A `12 Days of Nonstop Action` section explaining the connected three-day curriculum:
   - Day 1: net play, dinking, speed-ups, and resets, followed by live play.
   - Day 2: transitioning to the net, third-shot drives and drops, fifth-shot drops, and combining the transition work with Day 1 net skills.
   - Day 3: switching between offense and defense, overhead smashes, returning smashes, lobs, lob retrieval, and full-camp game application.
3. A section about the energy, the new indoor facility, and the strong response from participants.
4. Joey’s comments presented as an edited-for-clarity recap, preserving every substantive point without presenting altered wording as a verbatim quotation.
5. A closing that says Breakaway will return with more Muskoka programming next year without inventing dates or availability.
6. A call to action back to the Muskoka camp hub and the standard shared site footer.

The page metadata will use the recap title, the July–August date range, the recap URL as canonical, and the supplied image for Open Graph and Twitter previews. The recap route will be added to the sitemap with monthly change frequency.

## Shared Content and Filtering

Static discovery content will be centralized so the homepage and all-camps page do not maintain separate copies of completed cards or related links. Filter matching will be extracted into a pure helper that can be tested without rendering React. The helper will require a camp to match every active filter category and will treat `Kids` as an ordinary exact skill-category match.

Muskoka hub visibility will use the same active filters. Any selected skill level, including `Kids`, hides the all-level Muskoka hub unless the hub gains an explicit compatible skill category in the future.

## Accessibility and Responsive Behaviour

- The new Kids filter uses the existing button pattern, selection styling, and keyboard behavior.
- Card links retain descriptive titles and the supplied images receive descriptive alternative text through the existing camp-card component.
- The recap uses one `h1`, ordered section headings, readable text contrast, and descriptive image alternative text.
- The shared sticky navigation and footer appear once per marketing page at desktop and mobile widths.
- Mobile filter-sheet behavior remains unchanged and includes the Kids button.

## Verification

Automated tests will cover:

- exact aggregate weekly-card copy, image, route, dates, price, and Kids category;
- the weekly card’s inclusion in shared navigation data;
- Kids-filter results containing the weekly and Baseline programs while excluding adult cards and the Muskoka hub;
- shared related links and completed-card content;
- marketing-shell inclusion and the explicit chromeless-route exceptions;
- the Muskoka recap metadata, image, core curriculum copy, and sitemap entry.

The complete unit suite and production build must pass. The revised homepage, all-camps page, Kids-filter state, weekly landing page, one legacy camp page, Muskoka recap, and at least one chromeless checkout page will be opened and inspected in the preview pane at desktop and mobile sizes. After the branch is pushed, its pull request checks must pass before merge and the production pages must be verified after deployment.
