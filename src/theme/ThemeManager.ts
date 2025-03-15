import Store from "../store/Store.js";
import Browser from "../utils/Browser.js";
import Theme from "./Theme.js";

class ThemeManager {
  private store = new Store("theme-manager");

  constructor() {
    this.theme = this.theme;
  }

  public get theme() {
    const theme = this.store.get<Theme | undefined>("theme");
    return theme === undefined ? Theme.Auto : theme;
  }

  public set theme(theme: Theme) {
    this.store.setPermanent("theme", theme);
    document.documentElement.setAttribute("data-theme", this.getShowingTheme());
  }

  public getShowingTheme() {
    const theme = this.theme;
    return theme === Theme.Auto
      ? (Browser.isDarkMode() === true ? Theme.Dark : Theme.Light)
      : theme;
  }

  public toggleTheme() {
    this.theme = this.getShowingTheme() === Theme.Dark
      ? Theme.Light
      : Theme.Dark;
  }
}

export default new ThemeManager();
