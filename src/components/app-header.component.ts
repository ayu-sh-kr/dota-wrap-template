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
      <header class="absolute inset-x-0 top-0 z-20 px-5 pt-5 sm:px-6 lg:px-8">
        <div class="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a
            href="/"
            class="truncate text-2xl font-extrabold text-couture-black-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus dark:text-couture-black-50"
          >
            Dota
          </a>
          <button
            id="theme-toggle"
            type="button"
            aria-label="${themeLabel}"
            title="${themeLabel}"
            class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-couture-black-950 transition-colors duration-200 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus dark:text-couture-black-50 dark:hover:bg-white/10"
          >
            <dota-icon 
                name="${themeIcon}" 
                size="md" variant="ghost" 
                classname="cursor-pointer active:scale-95" 
                color="black"
            >
            </dota-icon>
          </button>
        </div>
      </header>
    `;
  }
}
