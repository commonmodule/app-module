import { ArrayUtils } from "@common-module/ts";
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
            this.updateActiveViews(event.state);
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
    updateActiveViews(params) {
        for (const route of this.routes) {
            const openingView = this.activeViews.find((view) => view instanceof route.View);
            const urlPatternParams = route.urlPattern.exec({
                pathname: location.pathname,
            })?.pathname.groups;
            if (urlPatternParams) {
                if (params)
                    Object.assign(params, urlPatternParams);
                else
                    params = urlPatternParams;
            }
            if (urlPatternParams) {
                openingView
                    ? openingView.changeParams(params)
                    : this.openView(route.View, params);
            }
            else if (openingView) {
                openingView.close();
                ArrayUtils.pull(this.activeViews, openingView);
            }
        }
    }
    performNavigation(pathname, params, replace) {
        replace
            ? history.replaceState(undefined, "", pathname)
            : history.pushState(undefined, "", pathname);
        this.updateActiveViews(params);
    }
    go(pathname, params) {
        if (location.pathname !== pathname) {
            if (this.isViewOpening) {
                setTimeout(() => this.performNavigation(pathname, params, false), 0);
            }
            else {
                this.performNavigation(pathname, params, false);
            }
        }
    }
    goWithoutHistory(pathname, params) {
        if (location.pathname !== pathname) {
            if (this.isViewOpening) {
                setTimeout(() => this.performNavigation(pathname, params, true), 0);
            }
            else {
                this.performNavigation(pathname, params, true);
            }
        }
    }
}
export default new Router();
//# sourceMappingURL=Router.js.map