import Router from "./route/Router.js";
export default class SPAInitializer {
    static INITIAL_PATH_KEY = "initialPath";
    static init() {
        const initialPath = sessionStorage[this.INITIAL_PATH_KEY];
        if (initialPath) {
            Router.goWithoutHistory(initialPath);
            sessionStorage.removeItem(this.INITIAL_PATH_KEY);
        }
    }
}
//# sourceMappingURL=SPAInitializer.js.map