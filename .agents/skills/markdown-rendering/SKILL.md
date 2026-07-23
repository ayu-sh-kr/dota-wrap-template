---
name: markdown-rendering
description: Use when adding Markdown documentation, blogs, tutorials, changelogs, or other long-form content to a web app. Provides a reusable content-loading and rendering pipeline with syntax highlighting, heading anchors, a table of contents, routing, loading/error states, accessibility, security, caching, and a framework-agnostic custom-theme contract. Use it when a client project needs Markdown rendering quickly or when an existing Markdown viewer needs to be made reusable and themeable.
---

# Markdown Rendering

Use this skill to turn a folder or endpoint of Markdown files into a reliable web content system. The target is not merely `markdown -> innerHTML`; it is a small pipeline that can discover content, load one document, render HTML and navigation data, present it accessibly, and let the host application own its visual identity.

## Outcome

Build these separable responsibilities:

```text
content catalog/config
        ↓ route or selection
document loader ──→ raw Markdown
        ↓
Markdown renderer ──→ { html, toc, metadata? }
        ↓
viewer + TOC + surrounding navigation
        ↑
theme state / application events / persistence
```

Keep the loader independent from the renderer and keep the viewer independent from the source of the Markdown. This allows the same viewer to render local public assets, a CMS response, or an authenticated API response.

## Workflow

### 1. Inspect the host project before implementing

Identify the existing conventions instead of introducing a second content system. Search for:

- Markdown directories, static asset roots, CMS/API clients, and content metadata.
- The router and how path, query, and hash parameters are exposed.
- Existing HTML-string, React, Vue, Svelte, or server-rendered component patterns.
- Global CSS, typography/prose styles, dark-mode state, design tokens, and code-block styles.
- A loading/error boundary and any event bus or state store.

Record the project-specific equivalents of these contracts:

| Concern | Required decision |
| --- | --- |
| Source | Where files live or which endpoint returns them |
| Identity | Safe document key, route, category, and optional slug |
| Loader | Base URL, timeout/cancellation, response validation, cache policy |
| Renderer | Markdown dialect, plugins, sanitization, highlight language policy |
| View | Where rendered HTML is mounted and how it is updated |
| Navigation | Sidebar/list, breadcrumbs, previous/next, and in-page TOC |
| Theme | CSS classes, design tokens, or a structured theme object |

If the project already has a Markdown package, reuse its parser and renderer contract. Do not create a second singleton parser without checking how existing components communicate.

### 2. Choose the smallest architecture that still scales

Use a direct component for one small, trusted document. Use a service plus viewer for documentation and blogs:

- `ContentCatalog`: maps categories and document keys to labels, routes, dates, authors, and file paths.
- `DocumentLoader`: fetches raw Markdown and normalizes failures.
- `MarkdownRenderer`: returns HTML and a structured TOC in one render.
- `MarkdownViewer`: owns loading, empty, error, and rendered states.
- `TableOfContents`: consumes the TOC; it must not scrape headings from arbitrary page HTML.
- `ThemeController`: stores the active theme and sends changes to every Markdown surface.

Do not put file paths, fetch calls, parser configuration, and theme classes in one page component. That makes blogs, docs, previews, search results, and tests harder to reuse.

### 3. Install and configure a renderer

For a client-side TypeScript app, a practical baseline is `markdown-it` plus plugins for heading anchors, syntax highlighting, and TOC extraction. Equivalent libraries are fine if they expose the same result shape.

```ts
type TocEntry = {
  level: number;
  text: string;
  id: string;
  children: TocEntry[];
};

type MarkdownResult = {
  html: string;
  toc: TocEntry[];
};

const renderer = createMarkdownRenderer({
  html: false,       // enable only for trusted content or after sanitizing
  linkify: true,
  typographer: true,
  anchors: true,
  highlight: true,
  toc: true,
});

function renderMarkdown(source: string): MarkdownResult {
  // The implementation may use a temporary TOC marker internally, but the
  // returned HTML should not expose that marker or a duplicate TOC.
  return renderer.renderWithToc(source);
}
```

Use one configured renderer per application or package. Parser/plugin creation can be expensive, while the same renderer can safely process many documents. Cache results by raw content or a versioned document key, and expose invalidation when content can change.

### 4. Implement a defensive document loader

Keep the loader’s public API small and make paths explicit. A loader should return text only; parsing belongs to the renderer.

```ts
class DocumentLoader {
  constructor(private readonly baseUrl: string) {}

  async load(key: string, signal?: AbortSignal): Promise<string> {
    const safeKey = key.trim().replace(/^\/+/, "");
    if (!safeKey || safeKey.includes("..")) {
      throw new Error("Invalid document key");
    }

    const response = await fetch(`${this.baseUrl}/${encodeURI(safeKey)}`, {
      signal,
      headers: { Accept: "text/markdown,text/plain;q=0.9" },
    });
    if (!response.ok) {
      throw new Error(`Document request failed (${response.status})`);
    }
    return response.text();
  }
}
```

Add a timeout or `AbortController` when the host app needs it. Avoid silently rendering an HTTP error page as Markdown. For route changes, cancel the previous request or ignore stale responses so a slower document cannot overwrite the currently selected one. Use a cache for immutable/versioned content and a revalidation strategy for editable content.

### 5. Build the viewer around explicit states

The viewer should render a semantic article and expose a status while the document is loading. It should not assume that a sibling component has already rendered content.

```html
<main class="docs-layout">
  <nav aria-label="Documentation navigation">…</nav>
  <article class="markdown-content" aria-busy="true">
    <p role="status">Loading document…</p>
  </article>
  <aside aria-label="On this page">…</aside>
</main>
```

After a successful render, replace the status with the HTML result, set `aria-busy="false"`, update the document title/description from trusted metadata, and resolve the current URL hash after the headings exist. On failure, show a useful message and a retry action. Keep the error boundary outside `innerHTML` generated from Markdown.

For component systems with a shared event bus, publish one event such as `markdown:render` containing `{ html, toc }`; viewers and TOC components can subscribe independently. Publish theme changes separately, for example `markdown:theme-change` and `markdown:color-change`. If the app has no event bus, pass the result and theme as component state instead.

### 6. Add navigation and in-page behavior

Generate a content catalog rather than deriving navigation by scanning the filesystem at runtime. Use the catalog for sidebars, cards, category filters, breadcrumbs, previous/next links, and blog suggestions.

Heading anchors must be deterministic and unique. If the parser’s anchor plugin does not guarantee uniqueness, add a slug registry so two equal headings receive distinct IDs. The TOC should link to those exact IDs and preserve heading nesting.

Account for a sticky header when scrolling to a hash. Handle both initial hashes after rendering and later `hashchange` events. Use native links for navigation and buttons only for actions such as opening a mobile drawer or changing a theme.

### 7. Make the theme an adapter, not a renderer fork

The Markdown renderer should produce structural HTML; a theme should decide how that HTML looks. Offer a stable theme input such as:

```ts
type MarkdownTheme = {
  name: string;
  fontFamily?: string;
  typography: Partial<Record<TagName, string>>;
  colors: Partial<Record<string, Partial<Record<TagName, ThemeToken>>>>;
};

type ThemeToken = {
  text?: string;
  background?: string;
  border?: string;
  hover?: string;
  active?: string;
  focus?: string;
};
```

Use either of these client-friendly strategies:

1. **CSS-first theme:** wrap the result in `.markdown-content`, style descendant elements (`h1`, `h2`, `p`, `a`, `pre`, `table`, and so on), and switch a `data-theme` attribute or class on the wrapper. This is the best default when the client already has CSS variables or a design system.
2. **Token-to-class adapter:** map the structured theme to classes while rendering or post-processing the known tags. Keep typography/layout separate from semantic color tokens, and include light/dark states in the token system. This is useful for utility-CSS projects such as the reference implementation.

For a client-owned theme, define and register it at the application boundary:

```ts
const editorialTheme: MarkdownTheme = {
  name: "editorial",
  fontFamily: "Charter, Georgia, serif",
  typography: {
    h1: "text-4xl font-bold tracking-tight",
    h2: "text-2xl font-semibold mt-10",
    p: "leading-8 my-4",
    pre: "overflow-x-auto rounded-xl p-5",
    table: "w-full border-collapse",
  },
  colors: {
    indigo: {
      h1: { text: "text-slate-950 dark:text-white", border: "border-slate-200 dark:border-slate-700" },
      p: { text: "text-slate-700 dark:text-slate-300" },
      a: { text: "text-indigo-700 dark:text-indigo-300", hover: "hover:text-indigo-500" },
      code: { text: "text-pink-700", background: "bg-pink-50 dark:bg-pink-950/40" },
      pre: { background: "bg-slate-950", border: "border-slate-800" },
    },
  },
};

markdownThemes.register(editorialTheme);
```

The exact class names may be Tailwind, CSS module names, or design-token classes. If a utility-CSS build scans source files, ensure classes created by theme data are safelisted or use static CSS variables; otherwise the browser will receive class names with no generated CSS. Never make the TOC a separate hard-coded color system: it must consume the same active theme and accent as the article.

Persist only a validated theme name and accent. On startup, apply the saved value before or immediately after the viewer connects, then send one initial theme event after all listeners exist. Do not re-render a large page shell merely to change colors if the viewer can update its wrapper/classes in place.

### 8. Treat Markdown as an input boundary

Markdown from a repository that the team controls can be rendered with a broader feature set. Markdown from users, a CMS, or an API is untrusted HTML input:

- Disable raw HTML unless it is required.
- If raw HTML is enabled, sanitize the rendered output with an allowlist before assigning `innerHTML`.
- Validate or rewrite links and image URLs; consider blocking `javascript:` and unsafe protocols.
- Do not interpolate untrusted title, category, author, or path values into HTML attributes without escaping.
- Do not execute scripts or mount arbitrary custom elements from document content.
- Keep syntax highlighting in a known language allowlist when possible.

The loader’s HTTP status check is not a sanitizer. CSP, Trusted Types, and a server-side sanitizer can provide additional defense in depth.

### 9. Verify the complete flow

Test the user-visible path, not only the parser:

- valid document, empty document, malformed Markdown, and missing document;
- direct navigation, category changes, previous/next links, and browser back/forward;
- initial hash and sticky-header offset;
- duplicate headings and a deeply nested TOC;
- code blocks, tables, images, external links, and raw HTML policy;
- theme changes across article, TOC, code blocks, dark mode, and reload persistence;
- keyboard navigation, focus visibility, screen-reader landmarks, and zoom;
- slow network, timeout, cancellation, stale response, and retry;
- long documents, render cache behavior, image dimensions/lazy loading, and mobile layout.

For very large documents, split content into navigable pages before reaching for virtualization. If below-the-fold sections are independently mounted, `content-visibility: auto` can reduce work; pair it with `contain-intrinsic-size`, do not apply it to the initial viewport, and verify keyboard reachability.

## Reference implementation mapping

When working in the source project that motivated this skill, preserve these relationships:

| Generic role | Dota implementation |
| --- | --- |
| Content catalog | `docConfigs` and `blogPosts` |
| Loader | `DocLoaderService.loadDoc`, `.loadBlog`, `.loadResource` |
| Markdown renderer | `MDService.render` in `packages/ui/dota-md` |
| Render result | `{ html, toc }` published as `md:render` |
| Article viewer | `<md-view>` hosted by `DocContentComponent` or `BlogViewComponent` |
| TOC | `<md-toc>` |
| Docs shell | `DocSectionComponent` |
| Blog shell | `BlogViewComponent` and blog list components |
| Theme state | docs theme/color events, local storage, `THEMES` |

Read [references/dota-reference.md](references/dota-reference.md) when adapting this workflow inside Dota Web. Read [references/theme-recipes.md](references/theme-recipes.md) when implementing CSS-first or token-based client themes.

## Completion checklist

Before handing off a Markdown feature, confirm:

- [ ] One loader, one renderer contract, and one viewer contract are documented.
- [ ] The source key is validated and HTTP failures become a visible error state.
- [ ] HTML, anchors, syntax highlighting, and TOC behavior are intentional.
- [ ] The article uses semantic landmarks and keyboard-accessible controls.
- [ ] Theme changes update both article and TOC and survive reload if required.
- [ ] The client’s theme classes/tokens are actually emitted by its CSS build.
- [ ] Untrusted Markdown is sanitized or raw HTML is disabled.
- [ ] Route changes cannot display stale content.
- [ ] Tests cover loading, rendering, navigation, theme, security, and mobile behavior.
