import Router from "./route/Router.js";

export default class SPAInitializer {
  private static readonly INITIAL_PATH_KEY = "initialPath";

  public static init() {
    const initialPath = sessionStorage[this.INITIAL_PATH_KEY];
    if (initialPath) {
      Router.goWithoutHistory(initialPath);
      sessionStorage.removeItem(this.INITIAL_PATH_KEY);
    }
  }
}
