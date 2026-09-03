import { Component, DotaPageElement, SEO } from "@ayu-sh-kr/dota-wrap/core";
import { html } from "@ayu-sh-kr/dota-wrap/rendering";
import { Route } from "@ayu-sh-kr/dota-wrap/router";

@Route({ path: "/" })
@Component({
  selector: "app-home",
  shadow: false,
})
export class HomePage extends DotaPageElement {
  constructor() {
    super();
  }

  get seo(): SEO {
    return {
      title: "Dota",
      description: "A minimal Dota starter focused on a clean home page, documentation, and core workspace links.",
      keywords: ["Dota", "Dota Wrap", "documentation", "workspace"],
      og: {
        title: "Dota",
        description: "A minimal Dota starter focused on a clean home page, documentation, and core workspace links.",
      },
    };
  }

  render() {
    return html`
      <main class="relative min-h-[100svh] bg-[var(--background-color)] text-[var(--foreground-color)]">
        <app-header></app-header>
        <section class="relative flex min-h-screen w-full items-center justify-center overflow-clip px-5 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8">
          <orb-background
            orbit-position="center"
            orbit-speed="5"
            orbit-direction="random"
            orbit-count="7"
            orbit-spacing="15"
            orbit-color="orange"
          ></orb-background>
          <div class="layout-content relative z-10 flex flex-col items-center text-center">
            <p class="font-mono text-xs uppercase tracking-[0.24em] text-[var(--muted-color)]">Dota workspace</p>
            <h1 class="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Build on Dota without extra noise.</h1>
            <p class="mt-5 max-w-xl text-base leading-7 text-[var(--muted-color)] sm:text-lg">
              A minimal starting point for Dota apps, with the core workspace, docs, and page structure kept clear and close.
            </p>
            <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://dota-workspace.vercel.app/docs?content=Getting-Started.md"
                target="_blank"
                rel="noreferrer"
                class="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--primary-color)] px-5 py-3 text-sm font-semibold text-[var(--primary-color-on)] transition-colors duration-200 hover:bg-[var(--primary-color-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-color)]"
              >
                Read documentation
              </a>
              <a
                href="https://dota-workspace.vercel.app/"
                target="_blank"
                rel="noreferrer"
                class="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border-color)] px-5 py-3 text-sm font-semibold transition-colors duration-200 hover:bg-[var(--surface-hover-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-color)]"
              >
                Open Dota home
              </a>
            </div>
          </div>
        </section>
      </main>
    `;
  }
}
