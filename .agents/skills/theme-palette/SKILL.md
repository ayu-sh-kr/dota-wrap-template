---
name: theme-palette
description: Use when adding, restoring, or reviewing custom color families in `src/theme.css`, or when mapping an existing family to this portfolio's semantic primary palette in `src/style.css`.
---

# Theme Palette

Use this skill when adding, restoring, or reviewing custom palette tokens in `src/theme.css`, then use the semantic aliases in `src/style.css` when the app needs a runtime role such as primary, surface, foreground, or border.

## Files

- `src/theme.css`

## Rules

- Define colors only inside `@theme`.
- Use full Tailwind-style scales such as `--color-charcoal-50` through `--color-charcoal-950`.
- Build each named family from the explicit dark color and its paired complementary white from the brief.
- Do not duplicate Tailwind built-in families like `slate`, `neutral`, or `zinc`.
- Do not add `html`, `body`, `:root`, or semantic alias tokens unless the user explicitly asks for them.
- Treat the existing palette collection as canonical: restore or extend it; never replace it when introducing project-specific colors.
- Add new families alongside existing families and preserve their original token values and names.
- Every new family must include the complete `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950` scale so Tailwind utilities remain predictable.
- Keep typography tokens and literal color tokens inside the same `@theme` block; keep runtime semantic variables such as `--background-color` and `--primary-color` in the global stylesheet when the app needs them.
- Treat `src/theme.css` as the literal palette source and `src/style.css` as the semantic mapping layer. The portfolio's primary mapping uses `--primary-50` through `--primary-950` and aliases them with `--primary-color`, `--primary-color-hover`, `--primary-color-strong`, `--primary-color-subtle`, `--primary-color-on`, and `--primary-font`.
- Use semantic aliases for component and page styles, including `color`, `background`, `border`, `outline`, `fill`, `stroke`, gradients, shadows, and Tailwind arbitrary-value utilities such as `text-[var(--primary-color)]`.
- Override semantic roles under `html.dark` and the existing system-preference fallback. Do not duplicate dark-mode literals in individual components.

## Tailwind v4 color workflow

This app uses Tailwind v4 CSS-first configuration. A custom family becomes a utility family by adding tokens like:

```css
@theme {
  --color-designer-50: #fff;
  /* ...all intermediate shades... */
  --color-designer-950: #111;
}
```

Use the resulting classes directly (`bg-designer-50`, `text-designer-700`, `border-designer-200`). Do not add a parallel `tailwind.config.js` color definition for the same family, and do not silently rename an existing family.

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
- `paper`
- `inkstone`
- `persimmon`
- cyan families: `crystal-cyan`, `arctic-cyan`, `deep-aqua-cyan`, `tiffany-cyan`
- blue families: `google-blue-premium`, `apple-accent-blue`, `royal-tech-blue`, `deep-flag-blue`
- sky families: `soft-sky-mist`, `clear-sky-blue`, `frosted-sky`, `cloud-whisper`
- Webingo families: `webingo-premium-cyan`, `deepened-webingo-cyan`, `neon-soft-webingo-cyan`, `mature-webingo-teal`

The black-family collection above is intentionally retained as a reusable mini-palette library even when a page uses only the project-specific `paper`, `inkstone`, and `persimmon` families.
