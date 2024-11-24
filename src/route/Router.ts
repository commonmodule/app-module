import { ArrayUtils, EventContainer } from "@common-module/ts";
import View from "./View.js";

if (!(window as any).URLPattern) {
  await import("urlpattern-polyfill");
}

type ViewConstructor = new () => View<any>;

class Router extends EventContainer<{
  routeChanged: (pathname: `/${string}`, data: any) => void;
}> {
  public prefix = "";

  private routes: { urlPatterns: URLPattern[]; View: ViewConstructor }[] = [];
  private isViewOpening = false;
  private activeViews: View<any>[] = [];

  constructor() {
    super();
    window.addEventListener(
      "popstate",
      (event) => this.updateActiveViews(event.state),
    );
  }

  private openView(View: ViewConstructor, data: any) {
    this.isViewOpening = true;
    const view = new View();
    view.changeData(data);
    this.activeViews.push(view);
    this.isViewOpening = false;
  }

  public add(pathname: `/${string}` | `/${string}`[], View: ViewConstructor) {
    const pathnames = Array.isArray(pathname) ? pathname : [pathname];

    const urlPatterns = pathnames.map((path) =>
      new URLPattern({ pathname: `${this.prefix}${path}` })
    );

    this.routes.push({ urlPatterns, View });

    const params = urlPatterns.find((pattern) =>
      pattern.test({ pathname: location.pathname })
    )?.exec({ pathname: location.pathname })?.pathname.groups;

    if (params) this.openView(View, params);

    return this;
  }

  public updateActiveViews(data?: any) {
    for (const route of this.routes) {
      const openingView = this.activeViews.find((view) =>
        view instanceof route.View
      );

      const urlPatternParams = route.urlPatterns.find((pattern) =>
        pattern.test({ pathname: location.pathname })
      )?.exec({ pathname: location.pathname })?.pathname.groups;

      if (urlPatternParams) {
        if (data) Object.assign(data, urlPatternParams);
        else data = urlPatternParams;
      }

      delete data?.["0"];

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

    this.emit("routeChanged", pathname, data);
    this.updateActiveViews(data);

    window.scrollTo(0, 0);
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
