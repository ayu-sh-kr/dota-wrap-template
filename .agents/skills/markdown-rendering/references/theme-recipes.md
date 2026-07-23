# Markdown Theme Recipes

Use one of these recipes when a client asks to provide its own look for Markdown content.

## Recipe A: CSS-first theme with design tokens

This is the most portable option. The renderer emits stable semantic HTML and the client owns the CSS.

```html
<article class="markdown-content" data-theme="editorial">
  <!-- sanitized renderer output -->
</article>
```

```css
.markdown-content {
  --md-text: light-dark(#334155, #cbd5e1);
  --md-heading: light-dark(#0f172a, #f8fafc);
  --md-accent: light-dark(#4f46e5, #a5b4fc);
  --md-code-bg: light-dark(#f8fafc, #0f172a);
  color: var(--md-text);
  font-family: Charter, Georgia, serif;
}

.markdown-content[data-theme="editorial"] h1,
.markdown-content[data-theme="editorial"] h2,
.markdown-content[data-theme="editorial"] h3 {
  color: var(--md-heading);
  letter-spacing: -0.02em;
}

.markdown-content[data-theme="editorial"] a {
  color: var(--md-accent);
}

.markdown-content[data-theme="editorial"] pre {
  overflow-x: auto;
  background: var(--md-code-bg);
}
```

Switch themes by changing one attribute or class. Keep the active value validated against a registry and persist only the name, not arbitrary CSS.

## Recipe B: Structured theme tokens

Use this when the host already represents component styling as utility classes or a typed design system. Keep structural typography separate from semantic colors so the same layout can use many accents.

```ts
const theme = {
  name: "brand",
  fontFamily: "Inter, sans-serif",
  typography: {
    h1: "text-4xl font-bold mb-6",
    h2: "text-2xl font-semibold mt-10 mb-3",
    p: "leading-7 my-4",
    code: "rounded px-1 font-mono text-sm",
    pre: "overflow-x-auto rounded-lg p-4",
    table: "w-full border-collapse",
  },
  color: {
    indigo: {
      h1: { text: "text-slate-950 dark:text-white", border: "border-slate-200 dark:border-slate-700" },
      p: { text: "text-slate-700 dark:text-slate-300" },
      a: { text: "text-indigo-700 dark:text-indigo-300", hover: "hover:text-indigo-500" },
      pre: { background: "bg-slate-950", border: "border-slate-800" },
    },
  },
} as const;
```

The adapter should apply only to tags it understands and safely ignore missing tokens. A useful minimum set is `h1`–`h6`, `p`, `a`, `strong`, `em`, `code`, `pre`, `blockquote`, `ul`, `ol`, `li`, `table`, `th`, `td`, `hr`, and `button` if Markdown extensions emit buttons.

If a client uses Tailwind or another compile-time utility system, classes assembled from runtime theme data may be purged. Prefer static CSS variables, a safelist, or statically discoverable theme files. Test the production build, not just the development server.

## Recipe C: Theme-aware TOC

The TOC is part of the same content experience. It should use the active accent and neutral tokens, expose a semantic `<nav aria-label="On this page">`, and highlight the current heading without relying on color alone. Keep its sticky offset configurable to match the host header.

For theme changes, update the article wrapper and TOC together. An event-based client can publish:

```ts
publish({ name: "markdown:theme-change", data: { theme: "brand" } });
publish({ name: "markdown:color-change", data: { color: "indigo" } });
```

A state-based client can pass the same values as props. Do not duplicate the theme registry in the TOC.

## Theme acceptance checklist

- Typography, color, focus, hover, selection, code, tables, and blockquotes are covered.
- Light and dark states have sufficient contrast.
- Links and current-TOC indicators remain identifiable without color alone.
- Long code lines scroll without changing page width.
- Images have constrained dimensions and descriptive alt text.
- The production CSS bundle contains every class or token used by the theme.
- Changing a theme does not reload or reparse Markdown.
