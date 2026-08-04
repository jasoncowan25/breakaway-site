# Kids Weekly Shared Site Chrome

## Problem

The kids weekly landing page currently owns a custom navigation bar that duplicates the marketing site navigation. Its logo links to an on-page anchor, and its Camps item does not contain the live camp list. Although the page imports the shared footer, it renders that footer inside the landing page's style scope instead of composing it as site chrome.

## Approved Design

- Render the existing shared `Navigation` component above the kids weekly landing content.
- Populate its Camps dropdown with `getPublishedPublicCampNavItems()`, matching the homepage and other current camp pages.
- Preserve the shared navigation's standard home logo, Coaches link, Experience link, All Camps link, live camp links, and Find Your Camp action.
- Render the existing shared `Footer` below the landing content, outside the landing page's custom CSS scope.
- Keep the standard footer notification signup, navigation links, contact details, terms, and privacy links.
- Remove the custom navigation markup, mobile-menu state, and page-specific logo from the kids weekly client component.

## Architecture And Data Flow

The server page fetches the two weekly camp records and the published navigation items together. It then composes the shared `Navigation`, the interactive `KidsWeeklyLanding` body, and the shared `Footer`. The client component remains responsible only for switching between the two kids programs and rendering the landing-page sections.

If a weekly child camp is unavailable, the existing program-level disabled state remains unchanged. Navigation data follows the same loading and error behaviour already used by the site's other server-rendered camp pages.

## Verification

- Confirm the server page renders the shared navigation with live camp items and the shared footer outside the landing component.
- Confirm the custom navigation and its mobile-menu state are removed.
- Run the marketing-site tests and production build.
- After deployment, verify the logo opens the homepage, the Camps dropdown is populated, and the shared footer links are present on the production kids weekly URL.
