import { Component, DotaPageElement, HTML, Property, SEO, String } from "@ayu-sh-kr/dota-wrap/core";
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

  render(): string {
    // language=html
    return HTML`
      <div class="flex min-h-screen items-center justify-center bg-canvas px-6 py-10 text-ink">
        <div class="w-full max-w-2xl rounded-xl border border-line bg-panel/90 p-8 shadow-panel backdrop-blur-sm sm:p-12">
          <p class="font-mono text-xs uppercase tracking-[0.24em] text-accent-400">Request Failed</p>
          <h1 class="mt-4 font-display text-6xl font-bold tracking-tight text-brand-500 sm:text-7xl">${this.status}</h1>
          <p class="mt-4 max-w-xl text-2xl font-semibold text-ink text-balance">${this.message}</p>
          <p class="mt-3 max-w-lg text-base leading-7 text-muted">
            The page you requested could not be resolved. Check the address, or return to the main route and continue from
            there.
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="/"
              class="inline-flex items-center justify-center rounded-md bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              Return Home
            </a>
            <span class="text-sm text-muted">Route: <span class="font-mono text-ink">/error</span></span>
          </div>
        </div>
      </div>
    `;
  }
}
