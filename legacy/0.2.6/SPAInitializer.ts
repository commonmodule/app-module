import Router from "./route/Router.js";

class SPAInitializer {
  private static readonly INITIAL_PATH_KEY = "initialPath";

  public init() {
    const initialPath = sessionStorage[SPAInitializer.INITIAL_PATH_KEY];
    if (initialPath) {
      Router.goWithoutHistory(initialPath);
      sessionStorage.removeItem(SPAInitializer.INITIAL_PATH_KEY);
    }
  }
}

export default new SPAInitializer();
