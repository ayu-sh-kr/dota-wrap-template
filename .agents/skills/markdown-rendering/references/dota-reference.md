# Dota Web Reference

This reference explains how the generic Markdown workflow maps to the Dota Web implementation that was inspected while creating the skill.

## Content locations and routing

Documentation metadata lives in `packages/apps/dota-web/src/configs/doc.config.ts`. It groups Markdown filenames into categories and also declares routes that resolve to the docs page. The sidebar consumes the grouped paths and routes to `/docs?content=<file>`.

Blog metadata lives in `packages/apps/dota-web/src/configs/blogs.config.ts`. Each post has a date, writer, title, description, category, and Markdown path. That catalog powers cards, pagination, categories, and suggested posts; it is not inferred from the filesystem during rendering.

The Markdown files are served from public content roots. A Dota deployment therefore needs the static server or API to make the matching `/documents/<path>`, `/blogs/<path>`, and `/materials/<path>` URLs available.

## Loading

`packages/apps/dota-web/src/service/doc-loader.service.ts` owns the transport boundary. It creates one REST client with a timeout and redirects unsuccessful responses to the app error route. Its three methods return raw text:

- `loadDoc(path)` requests `/documents/<path>`.
- `loadBlog(path)` requests `/blogs/<path>`.
- `loadResource(path)` requests `/materials/<path>`.

When reusing this design in another project, keep the method separation only if the server has distinct content roots. Otherwise expose one `load(key, kind)` method and keep category/path mapping in the catalog. Add path validation and request cancellation when content keys can be influenced by users or when route changes can race.

## Rendering and event flow

`packages/ui/dota-md/src/services/md.service.ts` configures `markdown-it` with raw-HTML behavior, linkification, typography, syntax highlighting, heading anchors, and TOC extraction. `MDService.render(raw, { publish: true })` returns `{ html, toc }`, caches results, and publishes one `md:render` application event.

`DocContentComponent` loads a document and publishes the render result. It hosts `<md-view>` and handles hash scrolling. `BlogViewComponent` follows the same pattern for category + blog route parameters and also places `<md-toc>` beside the article.

This separation means the loader does not know about the DOM and `md-view` does not know where the Markdown came from. If another client does not have an event bus, pass the returned result directly into the viewer.

## Layout and navigation

`DocSectionComponent` composes the docs header, sidebar, content, and TOC. `DocSidebarComponent` handles desktop navigation and a mobile drawer. `DocHeaderComponent` displays the active filename as a breadcrumb and owns theme/color controls. `DocTocComponent` receives the same TOC and theme state as the article.

The blog article uses a wider responsive shell and places the TOC in a sticky desktop aside. These are presentation decisions, not renderer requirements; a client can replace them with tabs, a mobile `<details>` disclosure, or no TOC at all.

## Theme contract

`packages/ui/dota-md/src/Types.ts` defines the useful shape:

- `Typography` maps HTML tags to structural/layout classes.
- `ColorEntry` maps tags to semantic `text`, `background`, `border`, `hover`, `active`, and `focus` classes, plus a `selection` class.
- `Theme` combines a name, font family, typography map, and color map.

`renderer.ts` applies the typography class and color-token classes to known Markdown tags. `md-view` resolves the active theme and color, applies the theme, and renders the result. `md-toc` reads the same theme/color pair through `TocUtils`, so the article and TOC stay visually aligned.

The client can register a new `Theme` alongside the built-in `flat`, `material`, `apple`, and `github` themes. It must also ensure any generated utility classes are included in the Tailwind scan/safelist. A CSS-first client can skip the token map and style a wrapper such as `.markdown-content[data-theme="editorial"]` instead.

## Important caveats from the reference

- `markdown-it` is configured with `html: true`; that is appropriate only for trusted project-authored content or after sanitization.
- The docs and blog views use event publication so sibling components update without prop drilling. A direct state model is equally valid.
- Theme initialization is deferred until Markdown components are connected. Preserve that ordering if using event-based initialization.
- Hash scrolling subtracts the sticky header height. Keep the offset configurable instead of hard-coding it in a generic package.
- Resource content demonstrates the simpler path: load raw Markdown, render HTML, and place it inside an article with prose styles. It does not provide the docs/blog TOC and theme synchronization.
