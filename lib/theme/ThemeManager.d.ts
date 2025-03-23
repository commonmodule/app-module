import Theme from "./Theme.js";
declare class ThemeManager {
    private store;
    init(): void;
    get theme(): Theme;
    set theme(theme: Theme);
    getShowingTheme(): Theme.Dark | Theme.Light;
    toggleTheme(): void;
}
declare const _default: ThemeManager;
export default _default;
//# sourceMappingURL=ThemeManager.d.ts.map