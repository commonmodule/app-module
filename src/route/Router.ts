import { ArrayUtil } from "@common-module/ts";
import View, { ViewParams } from "./View.js";

if (!(window as any).URLPattern) {
  await import("urlpattern-polyfill");
}

type ViewClass = new () => View;

class Router {
  private routes: { urlPattern: URLPattern; View: ViewClass }[] = [];
  private viewOpening = false;
  private openingViews: View[] = [];

  constructor() {
    window.addEventListener("popstate", (event) => {
      //TODO:
      console.log(event);
    });
  }

  private openView(View: ViewClass, params: ViewParams) {
    this.viewOpening = true;
    const view = new View();
    view.changeParams(params);
    this.openingViews.push(view);
    this.viewOpening = false;
  }

  public route(uri: string, View: ViewClass) {
    const pathname = "/" + uri;
    const urlPattern = new URLPattern({ pathname });
    this.routes.push({ urlPattern, View });

    const params = urlPattern.exec({ pathname: location.pathname })?.pathname
      .groups;
    if (params) this.openView(View, params);
  }

  private changeUri(uri: string) {
    const pathname = "/" + uri;
    history.pushState(undefined, "", pathname);

    for (const route of this.routes) {
      const openingView = this.openingViews.find((view) =>
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
        ArrayUtil.pull(this.openingViews, openingView);
      }
    }
  }

  public go(uri: string) {
    const pathname = "/" + uri;
    if (location.pathname !== pathname) {
      if (this.viewOpening) setTimeout(() => this.changeUri(uri));
      else this.changeUri(uri);
    }
  }
}

export default new Router();
