import { ArrayUtils } from "@common-module/ts";
import View from "./View.js";

if (!(window as any).URLPattern) {
  await import("urlpattern-polyfill");
}

type ViewConstructor = new () => View<any>;

class Router {
  public prefix = "";

  private routes: { urlPattern: URLPattern; View: ViewConstructor }[] = [];
  private isViewOpening = false;
  private activeViews: View<any>[] = [];

  constructor() {
    window.addEventListener("popstate", (event) => {
      //TODO:
      console.log(event);

      this.updateActiveViews(event.state);
    });
  }

  private openView(View: ViewConstructor, data: any) {
    this.isViewOpening = true;
    const view = new View();
    view.changeData(data);
    this.activeViews.push(view);
    this.isViewOpening = false;
  }

  public add(pathname: `/${string}`, View: ViewConstructor) {
    const urlPattern = new URLPattern({
      pathname: `${this.prefix}${pathname}`,
    });
    this.routes.push({ urlPattern, View });

    const params = urlPattern.exec({ pathname: location.pathname })?.pathname
      .groups;
    if (params) this.openView(View, params);

    return this;
  }

  public updateActiveViews(data?: any) {
    for (const route of this.routes) {
      const openingView = this.activeViews.find((view) =>
        view instanceof route.View
      );

      const urlPatternParams = route.urlPattern.exec({
        pathname: location.pathname,
      })?.pathname.groups;

      if (urlPatternParams) {
        if (data) Object.assign(data, urlPatternParams);
        else data = urlPatternParams;
      }

      if (urlPatternParams) {
        openingView
          ? openingView.changeData(data)
          : this.openView(route.View, data);
      } else if (openingView) {
        openingView.close();
        ArrayUtils.pull(this.activeViews, openingView);
      }
    }
  }

  private performNavigation(
    pathname: `/${string}`,
    data: any,
    replace: boolean,
  ) {
    replace
      ? history.replaceState(undefined, "", `${this.prefix}${pathname}`)
      : history.pushState(undefined, "", `${this.prefix}${pathname}`);

    this.updateActiveViews(data);
  }

  public go(pathname: `/${string}`, data?: any) {
    if (location.pathname !== `${this.prefix}${pathname}`) {
      if (this.isViewOpening) {
        setTimeout(() => this.performNavigation(pathname, data, false), 0);
      } else {
        this.performNavigation(pathname, data, false);
      }
    }
  }

  public goWithoutHistory(pathname: `/${string}`, data?: any) {
    if (location.pathname !== `${this.prefix}${pathname}`) {
      if (this.isViewOpening) {
        setTimeout(() => this.performNavigation(pathname, data, true), 0);
      } else {
        this.performNavigation(pathname, data, true);
      }
    }
  }
}

export default new Router();
