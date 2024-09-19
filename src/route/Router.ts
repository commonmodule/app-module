import { ArrayUtils } from "@common-module/ts";
import View, { ViewParams } from "./View.js";

if (!(window as any).URLPattern) {
  await import("urlpattern-polyfill");
}

type ViewConstructor = new () => View;

class Router {
  private routes: { urlPattern: URLPattern; View: ViewConstructor }[] = [];
  private isViewOpening = false;
  private activeViews: View[] = [];

  constructor() {
    window.addEventListener("popstate", (event) => {
      //TODO:
      console.log(event);

      this.updateActiveViews();
    });
  }

  private openView(View: ViewConstructor, params: ViewParams) {
    this.isViewOpening = true;
    const view = new View();
    view.changeParams(params);
    this.activeViews.push(view);
    this.isViewOpening = false;
  }

  public add(pathname: `/${string}`, View: ViewConstructor) {
    const urlPattern = new URLPattern({ pathname });
    this.routes.push({ urlPattern, View });

    const params = urlPattern.exec({ pathname: location.pathname })?.pathname
      .groups;
    if (params) this.openView(View, params);

    return this;
  }

  private updateActiveViews() {
    for (const route of this.routes) {
      const openingView = this.activeViews.find((view) =>
        view instanceof route.View
      );
      const params = route.urlPattern.exec({ pathname: location.pathname })
        ?.pathname.groups;
      if (params) {
        openingView
          ? openingView.changeParams(params)
          : this.openView(route.View, params);
      } else if (openingView) {
        openingView.close();
        ArrayUtils.pull(this.activeViews, openingView);
      }
    }
  }

  private performNavigation(pathname: `/${string}`, replace: boolean) {
    replace
      ? history.replaceState(undefined, "", pathname)
      : history.pushState(undefined, "", pathname);

    this.updateActiveViews();
  }

  public go(pathname: `/${string}`) {
    if (location.pathname !== pathname) {
      if (this.isViewOpening) {
        setTimeout(() => this.performNavigation(pathname, false));
      } else {
        this.performNavigation(pathname, false);
      }
    }
  }

  public goWithoutHistory(pathname: `/${string}`) {
    if (location.pathname !== pathname) {
      if (this.isViewOpening) {
        setTimeout(() => this.performNavigation(pathname, true), 0);
      } else {
        this.performNavigation(pathname, true);
      }
    }
  }
}

export default new Router();
