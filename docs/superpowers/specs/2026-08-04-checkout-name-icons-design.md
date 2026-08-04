# Checkout Name Icons

## Problem

Checkout name inputs are wrapped by the same component used for inputs with leading icons. The wrapper adds left padding, but the name inputs do not currently render an icon, leaving an awkward blank area before the entered name or placeholder.

## Approved Design

- Render the existing 16-pixel outline `user` icon at the left of every first-name and last-name input in the checkout.
- Apply the treatment consistently to player, child, editable account-holder, and parent/guardian name fields.
- Use the existing muted icon colour and input spacing already used by phone and email fields.
- Keep labels, placeholders, focus styling, and the green validation check unchanged.
- Leave age, phone, email, and all checkout behaviour unchanged.

## Implementation Boundaries

Reuse the existing checkout `Icon` component and `lead` positioning class. Wrap any remaining unwrapped name inputs with the established `inp-wrap` structure. No new icon assets, global form abstractions, API changes, or data changes are required.

The icons are decorative and remain hidden from assistive technology. The visible field labels continue to provide the accessible name for each input.

## Verification

- Confirm every checkout name input shows a person icon without colliding with text or the validation check.
- Check empty, populated, focused, and valid states.
- Verify desktop and mobile layouts on the kids weekly checkout.
- Run the marketing-site tests and production build.
- Keep the revised local checkout open for visual approval before any production push.
