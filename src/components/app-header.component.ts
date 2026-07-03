import { BindEvent, BaseElement, Component, HTML, WindowListener } from "@ayu-sh-kr/dota-wrap/core";
import { GeneralUtils } from "@app/utils/general.utils.ts";

@Component({
  selector: "app-header",
  shadow: false,
})
export class AppHeaderComponent extends BaseElement {
  constructor() {
    super();
  }

  @BindEvent({ event: "click", id: "#theme-toggle" })
  toggleTheme(): void {
    GeneralUtils.toggleDarkMode();
  }

  @WindowListener({ event: "themeChange" })
  handleThemeChange(): void {
    this.updateHTML();
  }

  render(): string {
    const isDarkTheme = typeof document !== "undefined" && GeneralUtils.isDarkMode();
    const themeIcon = isDarkTheme ? "mdi:white-balance-sunny" : "mdi:brightness-2";
    const themeLabel = isDarkTheme ? "Switch to light theme" : "Switch to dark theme";

    // language=html
    return `
      <header class="relative z-10 px-5 pt-5 sm:px-6 lg:px-8">
        <div class="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a href="/" class="truncate text-2xl font-extrabold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            Dota
          </a>
          <button
            id="theme-toggle"
            type="button"
            aria-label="${themeLabel}"
            title="${themeLabel}"
            class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus dark:hover:bg-white/10"
          >
            <dota-icon name="${themeIcon}" size="md" variant="ghost"></dota-icon>
          </button>
        </div>
      </header>
    `;
  }
}
