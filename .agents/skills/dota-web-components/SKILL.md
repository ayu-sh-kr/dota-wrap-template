---
name: dota-web-components
description: Use when creating, modifying, or reviewing components and pages in a Dota Wrap app. Captures this repository's Dota Wrap/Dota Core conventions for custom element classes, decorators, routing, lifecycle hooks, properties, events, rendering, Tailwind styling, markdown views, and preloader registration.
---

# Dota Web Components Skill

Use this skill when creating or modifying components in this app's `src` tree (or the equivalent Dota Web app tree).
Dota web components are TypeScript classes built on `dota-core`/`dota-wrap`, registered with decorators, and rendered as custom elements using HTML string templates.

Primary local references:

- `packages/apps/dota-web/src/pages/home.page.ts`
- `packages/apps/dota-web/src/components/blogs/blog-view.component.ts`
- `packages/apps/dota-web/src/components/utils/buttons/dark-mode-button.component.ts`
- `packages/libs/dota-core/src/core/elements/base-elements.ts`
- `packages/libs/dota-core/src/core/elements/dota-page-element.ts`

## Package Imports

Prefer imports from `@ayu-sh-kr/dota-wrap`, not from `dota-core` directly, inside `dota-web`.

```ts
import {
  BaseElement,
  Component,
  Property,
  String,
  BindEvent,
  WindowListener,
  HTML,
} from "@ayu-sh-kr/dota-wrap/core";
```

Use these package surfaces by responsibility:

```ts
import { OnEvent } from "@ayu-sh-kr/dota-wrap/event";
import { Route } from "@ayu-sh-kr/dota-wrap/router";
```

Use the app alias for local source:

```ts
import { GeneralUtils } from "@dota/utils/GeneralUtils.ts";
import { DocLoaderService } from "@dota/service/doc-loader.service.ts";
```

Local imports commonly include the `.ts` extension because `tsconfig.json` enables `allowImportingTsExtensions`.

## Component Shape

Every component uses `@Component` and extends `BaseElement`, unless it is a routed page.

```ts
@Component({
  selector: "example-card",
  shadow: false,
})
export class ExampleCardComponent extends BaseElement {

  constructor() {
    super();
  }

  render(): string {
    return HTML`
      <section class="rounded-lg border border-gray-200 dark:border-gray-800">
        Example
      </section>
    `;
  }
}
```

Conventions:

- Use kebab-case custom element selectors, for example `blog-view`, `dark-mode-button`, `resource-section`.
- Use PascalCase class names with a suffix like `Component` or `Page`.
- Keep `shadow: false` unless style isolation is explicitly required. `dota-web` relies on global Tailwind classes and dark-mode variants.
- Include an explicit constructor that calls `super()` when matching existing component style.
- Return a string from `render()`. Use either `HTML\`...\`` from core or a plain template string with `// language=html`.

## Component file organization and CSS

Keep each local component in a directory named after the component. Preserve the component's filename and colocate its stylesheet:

```text
src/components/hero-section/
├── hero-section.component.ts
└── hero-section.component.css
```

Use the same pattern for every component (`app-header/app-header.component.ts`, `app-header/app-header.component.css`, and so on). The TypeScript filename must retain the `.component.ts` suffix because the Dota Vite preloader scans `src/components/**/*.component.ts`.

Import the individual component stylesheets from the app stylesheet, `src/style.css`, alongside the Tailwind and theme imports:

```css
@import "./components/hero-section/hero-section.component.css";
```

Do not import component CSS from the component TypeScript file, and do not append component-specific selectors to `src/style.css`. Keep `src/style.css` limited to Tailwind setup, shared design tokens, and document-level rules. Put component selectors, responsive rules, motion states, and component-specific reduced-motion/forced-colors rules in the colocated stylesheet.

## Pages

Pages extend `DotaPageElement`, include a `@Route`, and implement `get seo(): SEO`.

```ts
@Route({ path: "/docs" })
@Component({
  selector: "doc-page",
  shadow: false,
})
export class DocPage extends DotaPageElement {

  constructor() {
    super();
  }

  get seo(): SEO {
    return {
      title: "Dota Web - Documentation",
      description: "Explore the comprehensive documentation for Dota Web.",
      keywords: ["Dota Web Documentation", "Dota Framework Guide"],
      og: {
        title: "Dota Web Documentation",
        description: "Dive into the detailed documentation for Dota Web.",
      },
    };
  }

  render(): string {
    return HTML`<doc-section></doc-section>`;
  }
}
```

`DotaPageElement` updates `document.title`, description, keywords, favicon, and Open Graph tags during `handleBeforeInit()`. Do not duplicate SEO updates in page components.

Use page shells to compose sections rather than putting all UI into the page. `home.page.ts` is the pattern: header, main, section components, footer.

## Properties and Attributes

Use `@Property` for values passed as HTML attributes. The attribute name is kebab-case; the class property is camelCase.

```ts
@Property({ name: "current-blog", type: String })
currentBlog: string = "";

@Property({ name: "max-width", type: String })
maxWidth: string = "max-w-3xl";
```

Rules:

- Import primitive type markers such as `String` from `@ayu-sh-kr/dota-wrap/core`.
- Set a class field default even when the property can be overwritten by an attribute.
- Attribute changes call `bindProperty()` and then `updateHTML()` in `BaseElement`.
- When a property influences markup, reference it in `render()` with `this.propertyName`.

Use `@Param` for route/query parameters:

```ts
@Param("blog")
blog!: string;

@Param("category")
category!: string;
```

Load data after params are bound, usually in an init lifecycle event.

## Lifecycle

The core lifecycle in `BaseElement` is:

1. `connectedCallback()`
2. `handleBeforeInit()`
3. initial `render()` into the host or shadow root
4. bind properties, params, state, elements, events, emitters, and app event listeners
5. emit the connected lifecycle event
6. run after-init handlers

Common local patterns:

```ts
@OnEvent("connected", true)
async onConnected() {
  GeneralUtils.scrollToTop("smooth");
}
```

```ts
@AfterInit()
async afterViewInit() {
  // DOM and framework bindings are ready.
}
```

Use `@OnEvent("connected", true)` when matching existing app event style. Use `@AfterInit()` for direct component setup after the first render. In either case, avoid doing DOM work in the constructor.

## Events

Use decorators rather than manual `addEventListener` when the event can be described declaratively.

### Child Element Events

Use `@BindEvent` for events from elements rendered inside the component.

```ts
@BindEvent({ event: "click", id: "#dark-button" })
handleDark() {
  GeneralUtils.toggleDarkMode();
}
```

The `id` field is a CSS selector. `BaseElement` uses delegated listeners on the component root, so bindings survive `updateHTML()`.

### Host, Window, and Document Events

Use listener decorators for global or host events.

```ts
@WindowListener({ event: "themeChange" })
handleThemeChange() {
  this.updateHTML();
}
```

```ts
@HostListener({ event: "click" })
handleClick(event: MouseEvent) {
  const target = (event.target as HTMLElement).closest("[data-theme]");
}
```

Use native `CustomEvent`s for browser-level concerns like `themeChange` and `onPathChange`. Use `ApplicationEventService` / `@OnEvent` for app-level message flows such as docs theme changes.

## Rendering and Styling

Render markup as HTML strings. Most components use Tailwind utilities directly in the returned template.

```ts
render(): string {
  const icon = GeneralUtils.isDarkMode()
    ? "material-symbols:dark-mode"
    : "material-symbols:sunny-rounded";

  return `
    <span id="dark-button" class="active:scale-95 cursor-pointer">
      <dota-icon name="${icon}" color="${this.color}" variant="ghost" size="md"></dota-icon>
    </span>
  `;
}
```

Styling conventions:

- Use Tailwind classes inline.
- Include `dark:` variants when the component has colors, borders, or backgrounds.
- Use responsive prefixes such as `sm:`, `md:`, `lg:`, and `xl:` for layout changes.
- Prefer composition with existing custom elements such as `app-header`, `app-footer`, `md-view`, `md-toc`, `dota-icon`, and section components.
- For lists, map data to strings and `join("")` or `join(" ")`.
- Keep markup readable with multiline templates.

## Data Loading and Markdown

Instantiate local services in the constructor, then call them after params/properties are available.

```ts
docLoader!: DocLoaderService;

constructor() {
  super();
  this.docLoader = new DocLoaderService();
}

@OnEvent("connected", true)
async afterViewInit() {
  if (this.blog && this.category) {
    this.currentBlog = this.blog.trim();
    const raw = await this.docLoader.loadBlog(
      `${this.category.toLowerCase()}/${this.blog}`,
    );
    MDService.render(raw, { publish: true });
  }
}
```

For markdown pages and blogs:

- Render content through `MDService.render(raw, { publish: true })`.
- Place `<md-view>` in the template where markdown should appear.
- Use `<md-toc>` for table-of-contents sidebars.
- Pass theme, color, and max-width as component properties when needed.

## Re-rendering

Call `this.updateHTML()` when internal state changes outside the automatic `@Property` attribute flow.

Examples:

- A `WindowListener` responds to `themeChange`.
- An app event updates a selected docs theme.
- A method changes local state used by `render()`.

Do not call `updateHTML()` in the constructor or before the component is initialized; `BaseElement.updateHTML()` intentionally returns early until initialization is complete.

After `updateHTML()`, `BaseElement` rebinds `@BindEvent` methods and element references.

## Registration and the Dota Vite preloader

This standalone app configures `dotaVitePreloader` in `vite.config.ts` with the repository root as its scan root. The preloader discovers decorated custom elements and exposes them through the generated `virtual:dota-components` module. `main.ts` registers those discovered constructors by passing them to `initializeApp({ modules: components })`.

When adding a component:

- Put it under the relevant `src/components/...` folder.
- Use the `<component-name>/<component-name>.component.ts` and `<component-name>/<component-name>.component.css` layout described above.
- Add `@Component({ selector, shadow: false })` to the class.
- Do not import component files into `app.component.ts` for side effects; the preloader owns component discovery and registration.
- Do not add a manual component import list to `main.ts`; import `components` from `virtual:dota-components` and pass it as `modules`.
- Import the root class and any page classes explicitly in `main.ts` when `initializeApp` needs their constructors for `root`, `defaultRoute`, or `errorRoute`.
- For pages, add `@Route` and export them through the local pages index when the app uses one. The generated `virtual:dota-routes` module supplies the route configuration.

External UI components and markdown components are separate from preloaded local components. Register those constructors through `externalComponents` in `main.ts` only when the app actually uses them.

## Checklist

Before finishing a Dota web component:

- Component has `@Component({ selector, shadow: false })`.
- Component extends `BaseElement`; routed pages extend `DotaPageElement`.
- Page components include `@Route` and `get seo(): SEO`.
- Public attributes use `@Property` with kebab-case names and typed defaults.
- Route/query values use `@Param`.
- DOM events use `@BindEvent`, `@HostListener`, `@WindowListener`, or `@DocumentListener`.
- App events use `ApplicationEventService` and `@OnEvent`.
- Markup uses Tailwind classes with dark-mode variants where needed.
- Component-specific CSS lives beside the component and is imported by `src/style.css`; `src/style.css` contains only global setup/tokens/document rules.
- Internal state changes that affect markup call `this.updateHTML()`.
- Data loading happens after connect/init, not in `render()` or the constructor.
