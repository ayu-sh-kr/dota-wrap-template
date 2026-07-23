---
name: dark-mode
description: Use when implementing, modifying, or reviewing dark mode in a Dota Wrap/Dota Web project. Covers the local convention for toggling Tailwind class-based dark mode with GeneralUtils, persisted theme preference, AppComponent startup initialization, dark-mode-button, themeChange window events, and dark: Tailwind styling.
---

# Skill: Implementing Dark Mode with dota-core

## Overview

Dark mode in a dota-wrap application is implemented using three cooperating pieces:
1. CSS class manipulation on `<html>` (Tailwind `dark` variant)
2. A `GeneralUtils` helper for all theme logic
3. A toggle web component that listens for the `themeChange` window event

In this portfolio, `src/style.css` declares the class variant with `@custom-variant dark (&:where(.dark, .dark *));`. Keep theme tokens in `:root` and override them under `html.dark` so colocated component styles respond to the same class.

## Portfolio file conventions

- Theme logic lives in `src/utils/general.utils.ts` and uses the `theme` localStorage key.
- The toggle lives in `src/components/dark-mode-button/dark-mode-button.component.ts` with its sibling `.component.css`.
- The Dota Vite preloader discovers the component; do not import it from `src/app.component.ts` or `src/main.ts`.
- Import the sibling stylesheet from `src/style.css`, alongside the other component stylesheets.
- `index.html` applies the saved/system class before the module loads to avoid a light-mode flash.

---

## Package Imports

All decorators and base classes come from the `/core` sub-export:

```ts
import {
  BaseElement,
  Component,
  AfterInit,
  BindEvent,
  WindowListener,
  HostListener,
  Property,
  String,
  HTML,
  ApplicationEventService,
} from "@ayu-sh-kr/dota-wrap/core";
```

Application-level events (if needed beyond window events) come from `/event`:

```ts
import { type ApplicationEvent, OnEvent } from "@ayu-sh-kr/dota-wrap/event";
```

`@ayu-sh-kr/dota-wrap/core` re-exports everything from `@ayu-sh-kr/dota-core`.
`@ayu-sh-kr/dota-wrap/event` re-exports everything from `@ayu-sh-kr/dota-event`.

---

## 1. The Theme Utility - `GeneralUtils`

> Source: `packages/apps/dota-web/src/utils/GeneralUtils.ts`

```ts
import { LocalStorageService } from "@dota/service/local-storage.service.ts";

export class GeneralUtils {

  // Toggle between dark and light, persist, and broadcast
  static toggleDarkMode() {
    const isDarkMode = document.documentElement.classList.toggle('dark');
    document.documentElement.classList.toggle('bg-slate-950', isDarkMode);
    LocalStorageService.add('theme', isDarkMode ? 'dark' : 'light');
    window.dispatchEvent(new CustomEvent('themeChange', {
      detail: { isDarkMode: GeneralUtils.isDarkMode() }
    }));
  }

  static isDarkMode(): boolean {
    return document.documentElement.classList.contains('dark');
  }

  // Reads localStorage first, falls back to system prefers-color-scheme
  static getBrowserTheme(): string {
    const theme = LocalStorageService.get('theme');
    if (theme) return theme;
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  }

  // Apply a resolved theme string to the DOM
  static setBrowserTheme(theme: string) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark', 'bg-slate-950');
    } else {
      document.documentElement.classList.remove('dark', 'bg-slate-950');
    }
  }
}
```

**Key points:**
- `'dark'` and `'bg-slate-950'` are always toggled together.
- `'theme'` is the localStorage key.
- `toggleDarkMode` fires a native `CustomEvent('themeChange')` on `window` so any component can re-render reactively without subscribing to `ApplicationEventService`.

---

## 2. LocalStorageService

> Source: `packages/apps/dota-web/src/service/local-storage.service.ts`

```ts
export class LocalStorageService {
  static get(key: string): string | null {
    return localStorage.getItem(key);
  }
  static add(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
}
```

---

## 3. Initializing Theme on App Start - `AppComponent`

Apply the saved/system theme once the root component is connected using the `@AfterInit()` lifecycle hook.

> Source: `packages/apps/dota-web/src/app.component.ts`

```ts
import { GeneralUtils } from "@dota/utils/GeneralUtils.ts";
import { AfterInit, BaseElement, Component } from "@ayu-sh-kr/dota-wrap/core";

@Component({
  selector: 'app-root',
  shadow: false
})
export class AppComponent extends BaseElement {

  constructor() {
    super();
  }

  @AfterInit()
  afterViewInit() {
    const browserTheme = GeneralUtils.getBrowserTheme();
    GeneralUtils.setBrowserTheme(browserTheme);
  }

  render(): string {
    return '';
  }
}
```

`@AfterInit()` runs after the component's initial render, ensuring the DOM is ready before class manipulation.

---

## 4. The Toggle Button Component

> Source: `packages/apps/dota-web/src/components/utils/buttons/dark-mode-button.component.ts`

```ts
import {
  BaseElement,
  Component,
  BindEvent,
  Property,
  String,
  WindowListener,
} from "@ayu-sh-kr/dota-wrap/core";
import { GeneralUtils } from "@dota/utils/GeneralUtils.ts";

@Component({
  selector: 'dark-mode-button',
  shadow: false
})
export class DarkModeButtonComponent extends BaseElement {

  @Property({ name: 'color', type: String })
  color: string = 'purple';

  constructor() {
    super();
  }

  // Bind the click on the inner element by CSS id
  @BindEvent({ event: 'click', id: '#dark-button' })
  handleDark() {
    GeneralUtils.toggleDarkMode();
  }

  // Re-render whenever any component calls toggleDarkMode()
  @WindowListener({ event: 'themeChange' })
  handleThemeChange() {
    this.updateHTML();
  }

  render(): string {
    const isDarkTheme = GeneralUtils.isDarkMode();
    const icon = isDarkTheme
      ? 'material-symbols:dark-mode'
      : 'material-symbols:sunny-rounded';

    return `
      <span id="dark-button" class="active:scale-95 cursor-pointer">
        <dota-icon name="${icon}" color="${this.color}" variant="ghost" size="md"></dota-icon>
      </span>
    `;
  }
}
```

**Key decorator patterns used:**

| Decorator | Purpose |
|---|---|
| `@Component({ selector, shadow })` | Registers the class as a custom element |
| `@Property({ name, type })` | Declares a reactive HTML attribute |
| `@BindEvent({ event, id })` | Binds a DOM event on a child element matched by CSS id/selector |
| `@WindowListener({ event })` | Listens to a `window` event; calling `this.updateHTML()` re-renders |
| `@HostListener({ event })` | Listens to events on the host element itself |
| `@AfterInit()` | Lifecycle callback after initial render (used in root component) |
| `@OnEvent(name, connected?)` | Listens to `ApplicationEventService` events; `true` = fires on connect |

---

## 5. Using the Toggle Button in a Template

Once registered, embed `<dark-mode-button>` anywhere in a `render()` string:

```ts
render(): string {
  return `
    <header>
      <dark-mode-button color="purple"></dark-mode-button>
    </header>
  `;
}
```

The `color` attribute is optional (default: `'purple'`).

---

## 6. Reactivity Pattern - `themeChange` Window Event

Because components don't share state directly, the `themeChange` window event is the broadcast mechanism:

```text
User clicks dark-mode-button
  -> GeneralUtils.toggleDarkMode()
    -> toggles .dark / .bg-slate-950 on <html>
    -> writes to localStorage('theme')
    -> window.dispatchEvent(new CustomEvent('themeChange', { detail: { isDarkMode } }))
      -> any component with @WindowListener({ event: 'themeChange' }) calls this.updateHTML()
```

If you need to react to theme changes in any component, add:

```ts
@WindowListener({ event: 'themeChange' })
onThemeChange() {
  this.updateHTML();
}
```

---

## 7. Tailwind Dark Variant

Components use the `dark:` prefix for dark-mode styles:

```html
<div class="bg-white text-gray-900 dark:bg-slate-950 dark:text-gray-100">
  ...
</div>
```

Because `shadow: false` is used throughout (no Shadow DOM), the `dark` class on `<html>` cascades into all components without any extra configuration.

---

## Checklist for Adding Dark Mode to a New Project

- [ ] `tailwind.config` has `darkMode: 'class'` (or omits it, which defaults to `'class'` in v3+)
- [ ] `GeneralUtils` (or equivalent) is available with `toggleDarkMode`, `isDarkMode`, `getBrowserTheme`, `setBrowserTheme`
- [ ] `LocalStorageService` is available for persistence
- [ ] Root component (`AppComponent`) applies theme via `@AfterInit()` on startup
- [ ] Toggle button dispatches `themeChange` via `window.dispatchEvent`
- [ ] Any component that must re-render on theme change uses `@WindowListener({ event: 'themeChange' })`
- [ ] All dota-wrap decorators imported from `@ayu-sh-kr/dota-wrap/core`
