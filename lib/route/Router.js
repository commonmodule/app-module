import { ArrayUtil } from "@common-module/ts";
if (!window.URLPattern) {
    await import("urlpattern-polyfill");
}
class Router {
    routes = [];
    isViewOpening = false;
    activeViews = [];
    constructor() {
        window.addEventListener("popstate", (event) => {
            console.log(event);
        });
    }
    openView(View, params) {
        this.isViewOpening = true;
        const view = new View();
        view.changeParams(params);
        this.activeViews.push(view);
        this.isViewOpening = false;
    }
    add(pathname, View) {
        const urlPattern = new URLPattern({ pathname });
        this.routes.push({ urlPattern, View });
        const params = urlPattern.exec({ pathname: location.pathname })?.pathname
            .groups;
        if (params)
            this.openView(View, params);
        return this;
    }
    performNavigation(pathname, replace) {
        replace
            ? history.replaceState(undefined, "", pathname)
            : history.pushState(undefined, "", pathname);
        for (const route of this.routes) {
            const openingView = this.activeViews.find((view) => view instanceof route.View);
            const params = route.urlPattern.exec({ pathname: location.pathname })
                ?.pathname.groups;
            if (params) {
                openingView
                    ? openingView.changeParams(params)
                    : this.openView(route.View, params);
            }
            else if (openingView) {
                openingView.close();
                ArrayUtil.pull(this.activeViews, openingView);
            }
        }
    }
    go(pathname) {
        if (location.pathname !== pathname) {
            if (this.isViewOpening) {
                setTimeout(() => this.performNavigation(pathname, false));
            }
            else {
                this.performNavigation(pathname, false);
            }
        }
    }
    goWithoutHistory(pathname) {
        if (location.pathname !== pathname) {
            if (this.isViewOpening) {
                setTimeout(() => this.performNavigation(pathname, true), 0);
            }
            else {
                this.performNavigation(pathname, true);
            }
        }
    }
}
export default new Router();
//# sourceMappingURL=Router.js.map