import { BindEvent, BaseElement, Component, WindowListener } from "@ayu-sh-kr/dota-wrap/core";
import { html } from "@ayu-sh-kr/dota-wrap/rendering";
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

  render() {
    const isDarkTheme = typeof document !== "undefined" && GeneralUtils.isDarkMode();
    const themeIcon = isDarkTheme ? "mdi:white-balance-sunny" : "mdi:brightness-2";
    const themeLabel = isDarkTheme ? "Switch to light theme" : "Switch to dark theme";

    return html`
      <header class="absolute inset-x-0 top-0 z-[var(--layout-z-nav)] px-5 pt-5 sm:px-6 lg:px-8">
        <div class="layout-page flex items-center justify-between gap-4">
          <a
            href="/"
            class="truncate text-2xl font-extrabold text-[var(--foreground-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)]"
          >
            Dota
          </a>
          <button
            id="theme-toggle"
            type="button"
            aria-label="${themeLabel}"
            title="${themeLabel}"
            class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--foreground-color)] transition-colors duration-200 hover:bg-[var(--surface-hover-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)]"
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
