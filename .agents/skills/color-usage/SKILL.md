---
name: color-usage
description: Use when adding, changing, or reviewing colors, themes, gradients, borders, icons, charts, and status states in a Dota Wrap application. Keeps palette literals separate from semantic UI roles and protects accessible contrast in light and dark modes.
---

# Color Usage

Use color to communicate role and state, not decoration alone. Keep literal color families in `src/theme.css`; map the selected family to semantic roles in `src/style.css`; consume those roles from component CSS and templates.

## Workflow

1. Inspect the existing palette, semantic mapping, and both theme modes before changing a color.
2. Add a complete 50–950 literal scale only when the project needs a new family. Do not create a duplicate `primary` family.
3. Map the family through `--primary-*` and role tokens such as `--primary-color`, `--background-color`, `--foreground-color`, `--muted-color`, `--border-color`, `--surface-color`, and `--surface-hover-color`.
4. Use semantic tokens for every color-bearing property: text, fill, stroke, background, border, outline, gradient, shadow, and focus indicator. In Tailwind markup, use utilities such as `bg-[var(--surface-color)]` and `text-[var(--muted-color)]`.
5. Review light and dark values together. A dark-mode override must update the full relationship between background, foreground, muted text, borders, surfaces, and interactive primary states.

## Decisions and guardrails

- Use the primary family for the key action, active state, and intentional emphasis. Use surface and border roles to create hierarchy before adding more accents.
- Never rely on color alone for errors, selection, or status: pair it with a label, icon, position, or other visible cue.
- Reserve red, amber, and green status colors for their meanings; do not use them as arbitrary decoration.
- Verify normal text and controls have sufficient contrast, including hover, focus, disabled, selected, and dark-mode states. Muted text must remain readable, not merely visible.
- Prefer a semantic role over a literal palette utility in application components. Literal utilities are appropriate only for palette swatches, documentation, intentional illustration, or a clearly local exception.
- Keep visual tokens central. A component must not become the source of truth for a hex value or a theme-specific color decision.

## Validation

Search touched code for raw hex, RGB, and palette-family utilities that should use a semantic role. Check both modes at mobile and desktop widths, keyboard focus, and reduced contrast conditions. Run the production build after token or palette changes.

