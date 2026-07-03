import { Component, DotaPageElement, HTML, SEO } from "@ayu-sh-kr/dota-wrap/core";
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

  render(): string {
    // language=html
    return HTML`
      <main class="relative min-h-screen bg-couture-black-50 dark:bg-couture-black-950">
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
          <div class="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
            <p class="font-mono text-xs uppercase tracking-[0.24em] text-muted">Dota workspace</p>
            <h1 class="mt-4 text-4xl font-bold tracking-tight text-ink sm:text-5xl">Build on Dota without extra noise.</h1>
            <p class="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">
              A minimal starting point for Dota apps, with the core workspace, docs, and page structure kept clear and close.
            </p>
            <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://dota-workspace.vercel.app/docs?content=Getting-Started.md"
                target="_blank"
                rel="noreferrer"
                class="inline-flex min-h-11 items-center justify-center rounded-full bg-couture-black-950 px-5 py-3 text-sm font-semibold text-couture-black-50 transition-colors duration-200 hover:bg-couture-black-950/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-couture-black-50 dark:bg-couture-black-50 dark:text-couture-black-950 dark:hover:bg-couture-black-50/90 dark:focus-visible:ring-offset-couture-black-950"
              >
                Read documentation
              </a>
              <a
                href="https://dota-workspace.vercel.app/"
                target="_blank"
                rel="noreferrer"
                class="inline-flex min-h-11 items-center justify-center rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-couture-black-50 dark:border-white/10 dark:hover:bg-white/5 dark:focus-visible:ring-offset-couture-black-950"
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
