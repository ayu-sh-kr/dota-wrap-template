---
name: typography
description: Maintain a shared, readable typography system across a Dota Wrap application.
---

# Typography

Use `src/typography.css` as the source of truth. Choose existing roles instead of a component-local scale: `.type-display` for heroes, `.type-section` and `.type-subsection` for headings, `.type-lede` for introductions, `.type-eyebrow` and `.type-label` for small uppercase metadata, and `.type-price` for changing metrics.

Component CSS should consume `--type-*` tokens. Reserve `text-wrap: balance` for display and headings, keep prose at body or lede leading, and use tabular numbers for dates, counters, and prices. Inputs inherit the primary font and must stay at least 1rem on touch devices.

Change the app-wide font through `--primary-font` in `src/typography.css` or the semantic layer, not component by component. Add a role only when none of the current roles fits and document its intended use.
