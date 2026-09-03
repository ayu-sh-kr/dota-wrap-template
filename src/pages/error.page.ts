import { Component, DotaPageElement, Property, SEO, String } from "@ayu-sh-kr/dota-wrap/core";
import { html } from "@ayu-sh-kr/dota-wrap/rendering";
import { Route } from "@ayu-sh-kr/dota-wrap/router";

@Route({ path: "/error" })
@Component({
  selector: "app-error",
  shadow: false,
})
export class ErrorPage extends DotaPageElement {
  @Property({ name: "status", type: String })
  status: number = 404;

  @Property({ name: "message", type: String })
  message: string = "Page Not Found";

  constructor() {
    super();
  }

  get seo(): SEO {
    return {
      title: "404 — Page Not Found",
      description: "The page you requested could not be found.",
      keywords: ["404", "error"],
      og: {
        title: "404 — Page Not Found",
        description: "The page you requested could not be found.",
      },
    };
  }

  render() {
    return html`
      <div class="flex min-h-[100svh] items-center justify-center bg-[var(--background-color)] px-6 py-10 text-[var(--foreground-color)]">
        <div class="w-full max-w-2xl rounded-[var(--layout-radius-lg)] border border-[var(--border-color)] bg-[var(--surface-color)] p-8 shadow-sm sm:p-12">
          <p class="font-mono text-xs uppercase tracking-[0.24em] text-[var(--primary-color)]">Request failed</p>
          <h1 class="mt-4 font-display text-6xl font-bold tracking-tight text-[var(--primary-color)] sm:text-7xl">${this.status}</h1>
          <p class="mt-4 max-w-xl text-2xl font-semibold text-balance">${this.message}</p>
          <p class="mt-3 max-w-lg text-base leading-7 text-[var(--muted-color)]">
            The page you requested could not be resolved. Check the address, or return to the main route and continue from
            there.
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="/"
              class="inline-flex items-center justify-center rounded-[var(--layout-radius-sm)] bg-[var(--primary-color)] px-5 py-3 text-sm font-semibold text-[var(--primary-color-on)] transition-colors duration-200 hover:bg-[var(--primary-color-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-color)]"
            >
              Return Home
            </a>
            <span class="text-sm text-[var(--muted-color)]">Route: <span class="font-mono text-[var(--foreground-color)]">/error</span></span>
          </div>
        </div>
      </div>
    `;
  }
}
