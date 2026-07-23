---
name: design-tokens
description: Maintain this portfolio's theme-backed color palettes and semantic typography tokens. Use when changing the primary color, primary font, light/dark surfaces, borders, text colors, or any color-bearing style across `src/theme.css`, `src/style.css`, `src/components`, or page templates.
---

# Design Tokens

Use this skill to keep visual changes centralized. Literal palette families live in `src/theme.css`; mode-aware semantic aliases live in `src/style.css`; component styles consume the aliases instead of repeating hex, RGB, or palette-specific utility values.

## Token layers

1. `src/theme.css` contains complete Tailwind v4 scales inside `@theme`, such as `--color-persimmon-50` through `--color-persimmon-950`, and typography families such as `--font-helvetica`, `--font-dm-sans`, `--font-banana`, `--font-poppins`, and `--font-montserrat`.
2. `src/style.css` maps the selected literal family to the semantic primary scale: `--primary-50` through `--primary-950`.
3. `src/style.css` exposes semantic roles: `--primary-color`, `--primary-color-hover`, `--primary-color-strong`, `--primary-color-subtle`, `--primary-color-on`, `--primary-font`, `--background-color`, `--foreground-color`, `--muted-color`, `--muted-strong-color`, `--border-color`, `--surface-color`, and `--surface-hover-color`.

## Workflow

- Change a literal hue or font family in `src/theme.css` only when the underlying palette or available font stack changes.
- Change the app-wide typeface by updating `--primary-font` in `src/style.css` to one of the `--font-*` tokens; do not edit every component.
- Keep provider loading in the first import section of `src/style.css`: DM Sans, Poppins, and Montserrat use the Google Fonts CSS provider. Helvetica remains a system stack. Banana uses its existing fallback stack until an Adobe Fonts Web Project kit URL is supplied; never invent a kit URL.
- Change the primary family by updating the `--primary-*` mappings in `src/style.css`; do not edit every component.
- Keep dark-mode semantic overrides under `html.dark` and the existing `prefers-color-scheme` fallback so components respond to the same class-based theme convention.
- Use semantic variables for every color-bearing property: `color`, `background`, `border`, `outline`, `fill`, `stroke`, gradients, shadows, and selection styles.
- In HTML template strings, use Tailwind arbitrary-value utilities such as `text-[var(--muted-color)]`, `bg-[var(--background-color)]`, and `border-[var(--border-color)]` when a utility is appropriate.
- Keep component selectors in the colocated component stylesheet. Keep `src/style.css` limited to imports, shared tokens, and document-level rules.

## Guardrails

- Do not add a duplicate `primary` family to `theme.css` when an existing project palette already supplies the literals.
- Do not hard-code a color in a component or page when a semantic token represents that role.
- Do not use a light-mode value as a dark-mode override accidentally; check foreground, muted, border, surface, and primary contrast together.
- Preserve complete 50–950 scales for named families in `theme.css`.
- Verify with `npm run build` and search `src` for stale semantic variables, direct component color literals, and old palette-specific utilities.
