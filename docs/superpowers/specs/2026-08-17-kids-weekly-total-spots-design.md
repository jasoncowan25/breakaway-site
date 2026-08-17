# Kids Weekly Total Spots Design

## Goal

On the Kids Weekly Pickleball Camp landing page, describe each program by its total capacity instead of its current remaining inventory. For example, the Experienced program should display `10 spots` when its capacity is 10 even if one player has registered and only 9 remain.

## Scope

- Change only the Kids Weekly program capacity label shared by its booking card and program cards.
- Use the live camp capacity when available, with the existing program configuration as a fallback.
- Keep `Sold out` for sold-out programs.
- Keep live `spotsLeft` data for sold-out detection and checkout registration limits; this is a presentation change, not an inventory-rule change.

## Verification

- A regression test supplies capacity 10 and spotsLeft 9 and expects `10 spots`.
- Existing sold-out behavior remains covered.
- Run the focused test, full tests, lint/type checks, production build, and visually inspect the Kids Weekly page.
