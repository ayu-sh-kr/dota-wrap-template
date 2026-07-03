import "@app/pages/home.page.ts";
import "@app/pages/error.page.ts";
import "@app/components/app-header.component.ts";
import { AfterInit, BaseElement, Component } from "@ayu-sh-kr/dota-wrap/core";
import { GeneralUtils } from "@app/utils/general.utils.ts";

@Component({
  selector: "app-root",
  shadow: false,
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
    return "";
  }
}
