import Store from "../store/Store.js";
import Browser from "../utils/Browser.js";
import Theme from "./Theme.js";
class ThemeManager {
    store = new Store("theme-manager");
    init() {
        this.theme = this.theme;
    }
    get theme() {
        const theme = this.store.get("theme");
        return theme === undefined ? Theme.Auto : theme;
    }
    set theme(theme) {
        this.store.setPermanent("theme", theme);
        document.documentElement.setAttribute("data-theme", this.getShowingTheme());
    }
    getShowingTheme() {
        const theme = this.theme;
        return theme === Theme.Auto
            ? (Browser.isDarkMode() === true ? Theme.Dark : Theme.Light)
            : theme;
    }
    toggleTheme() {
        this.theme = this.getShowingTheme() === Theme.Dark
            ? Theme.Light
            : Theme.Dark;
    }
}
export default new ThemeManager();
//# sourceMappingURL=ThemeManager.js.map