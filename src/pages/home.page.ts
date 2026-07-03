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
      description: "A stripped-down Dota starter page with a simple header and minimal content.",
      keywords: ["Dota", "Dota Wrap", "web components"],
      og: {
        title: "Dota",
        description: "A stripped-down Dota starter page with a simple header and minimal content.",
      },
    };
  }

  render(): string {
    // language=html
    return HTML`
      <main class="min-h-screen bg-couture-black-50 dark:bg-couture-black-950">
        <app-header></app-header>
        <section class="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center px-5 py-16 sm:px-6 lg:px-8">
          <orb-background 
              orbit-position="center"
              orbit-speed="5"
              orbit-direction="random"
              orbit-count="7"
              orbit-spacing="15"
              orbit-color="orange"
          ></orb-background>
          <div class="max-w-2xl">
            <p class="font-mono text-xs uppercase tracking-[0.24em] text-muted">Minimal starter</p>
            <h1 class="mt-4 text-4xl font-bold tracking-tight text-ink sm:text-5xl">Dota, simplified.</h1>
            <p class="mt-5 text-lg leading-8 text-muted">
              A quiet landing page with one header, one message, and the theme tokens kept small and reusable.
            </p>
          </div>
        </section>
      </main>
    `;
  }
}
