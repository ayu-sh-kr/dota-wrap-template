---
name: theme-palette
description: Use when adding custom color families to `src/theme.css` in Tailwind-style names, especially for non-built-in families like `warm`, `cool`, and `designer`.
---

# Theme Palette

Use this skill when adding custom palette tokens to `src/theme.css`.

## Files

- `src/theme.css`

## Rules

- Define colors only inside `@theme`.
- Use full Tailwind-style scales such as `--color-charcoal-50` through `--color-charcoal-950`.
- Build each named family from the explicit dark color and its paired complementary white from the brief.
- Do not duplicate Tailwind built-in families like `slate`, `neutral`, or `zinc`.
- Do not add `html`, `body`, `:root`, or semantic alias tokens unless the user explicitly asks for them.

## Current Families

- `pure-black`
- `carbon-black`
- `material-black`
- `charcoal`
- `graphite`
- `warm-charcoal`
- `espresso-black`
- `earth-black`
- `obsidian-warm`
- `midnight-black`
- `slate-black`
- `steel-black`
- `ink-black`
- `couture-black`
- `velvet-black`
- `onyx-black`
- `shadow-black`
- direct accent tokens: `red-400`, `purple-400`, `purple-600`
