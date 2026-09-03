export class GeneralUtils {
  private static readonly themeStorageKey = "theme";
  private static readonly colorSchemeMetaSelector = 'meta[name="color-scheme"]';

  static toggleDarkMode(): void {
    const isDarkMode = !this.isDarkMode();
    this.setBrowserTheme(isDarkMode ? "dark" : "light");
    localStorage.setItem(this.themeStorageKey, isDarkMode ? "dark" : "light");
    window.dispatchEvent(
      new CustomEvent("themeChange", {
        detail: { isDarkMode: GeneralUtils.isDarkMode() },
      }),
    );
  }

  static isDarkMode(): boolean {
    return document.documentElement.classList.contains("dark");
  }

  static getBrowserTheme(): string {
    const theme = localStorage.getItem(this.themeStorageKey);
    if (theme) {
      return theme;
    }
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  static setBrowserTheme(theme: string): void {
    const isDarkMode = theme === "dark";
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.documentElement.classList.toggle("light", !isDarkMode);
    this.syncColorSchemeMeta(isDarkMode ? "dark" : "light");
  }

  private static syncColorSchemeMeta(theme: string): void {
    const meta = document.querySelector<HTMLMetaElement>(this.colorSchemeMetaSelector);
    if (meta) {
      meta.content = theme;
    }
  }
}
