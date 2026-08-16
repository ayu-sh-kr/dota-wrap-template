---
name: layout
description: Maintain a consistent, responsive page geometry system in a Dota Wrap application.
---

# Layout

Use `src/layout.css` as the single shared layout contract. It owns containers, spacing, grids, radii, sticky offsets, and stacking order; semantic colour roles belong in `src/style.css` and component appearance stays colocated.

Choose one container per section: `.layout-reading` (45rem prose), `.layout-form` (38rem), `.layout-content` (60rem), or `.layout-page` (80rem). Do not nest containers. Pair it with a section rhythm class such as `.layout-section`, `.layout-section-sm`, `.layout-section-lg`, or `.layout-section-hero`.

Use `--layout-space-*` for gaps and padding, `.layout-stack` for vertical rhythm, `.layout-grid-auto` before a fixed-count grid, and `.layout-row` for wrapped action groups. Use the supplied radius, sticky, and z-index tokens rather than local values.

Keep breakpoints mobile-first at 520px, 700px, and 1100px. Grid and flex children need `min-inline-size: 0`; anchors use `--layout-stick`; regular full-height surfaces use `100svh`. Check 320px, 768px, 1440px, and 200% zoom before shipping.
