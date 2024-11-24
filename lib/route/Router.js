import { ArrayUtils, EventContainer } from "@common-module/ts";
if (!window.URLPattern) {
    await import("urlpattern-polyfill");
}
class Router extends EventContainer {
    prefix = "";
    routes = [];
    isViewOpening = false;
    activeViews = [];
    constructor() {
        super();
        window.addEventListener("popstate", (event) => this.updateActiveViews(event.state));
    }
    openView(View, data) {
        this.isViewOpening = true;
        const view = new View();
        view.changeData(data);
        this.activeViews.push(view);
        this.isViewOpening = false;
    }
    add(pathname, View) {
        const pathnames = Array.isArray(pathname) ? pathname : [pathname];
        const urlPatterns = pathnames.map((path) => new URLPattern({ pathname: `${this.prefix}${path}` }));
        this.routes.push({ urlPatterns, View });
        const params = urlPatterns.find((pattern) => pattern.test({ pathname: location.pathname }))?.exec({ pathname: location.pathname })?.pathname.groups;
        if (params)
            this.openView(View, params);
        return this;
    }
    updateActiveViews(data) {
        for (const route of this.routes) {
            const openingView = this.activeViews.find((view) => view instanceof route.View);
            const urlPatternParams = route.urlPatterns.find((pattern) => pattern.test({ pathname: location.pathname }))?.exec({ pathname: location.pathname })?.pathname.groups;
            if (urlPatternParams) {
                if (data)
                    Object.assign(data, urlPatternParams);
                else
                    data = urlPatternParams;
            }
            delete data?.["0"];
            if (urlPatternParams) {
                openingView
                    ? openingView.changeData(data)
                    : this.openView(route.View, data);
            }
            else if (openingView) {
                openingView.close();
                ArrayUtils.pull(this.activeViews, openingView);
            }
        }
    }
    performNavigation(pathname, data, replace) {
        replace
            ? history.replaceState(undefined, "", `${this.prefix}${pathname}`)
            : history.pushState(undefined, "", `${this.prefix}${pathname}`);
        this.emit("routeChanged", pathname, data);
        this.updateActiveViews(data);
        window.scrollTo(0, 0);
    }
    go(pathname, data) {
        if (location.pathname !== `${this.prefix}${pathname}`) {
            if (this.isViewOpening) {
                setTimeout(() => this.performNavigation(pathname, data, false), 0);
            }
            else {
                this.performNavigation(pathname, data, false);
            }
        }
    }
    goWithoutHistory(pathname, data) {
        if (location.pathname !== `${this.prefix}${pathname}`) {
            if (this.isViewOpening) {
                setTimeout(() => this.performNavigation(pathname, data, true), 0);
            }
            else {
                this.performNavigation(pathname, data, true);
            }
        }
    }
}
export default new Router();
//# sourceMappingURL=Router.js.map