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
    openView(View, data) {
        this.isViewOpening = true;
        const view = new View();
        view.changeData(data);
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
    updateActiveViews(data) {
        for (const route of this.routes) {
            const openingView = this.activeViews.find((view) => view instanceof route.View);
            const urlPatternParams = route.urlPattern.exec({
                pathname: location.pathname,
            })?.pathname.groups;
            if (urlPatternParams) {
                if (data)
                    Object.assign(data, urlPatternParams);
                else
                    data = urlPatternParams;
            }
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
            ? history.replaceState(undefined, "", pathname)
            : history.pushState(undefined, "", pathname);
        this.updateActiveViews(data);
    }
    go(pathname, data) {
        if (location.pathname !== pathname) {
            if (this.isViewOpening) {
                setTimeout(() => this.performNavigation(pathname, data, false), 0);
            }
            else {
                this.performNavigation(pathname, data, false);
            }
        }
    }
    goWithoutHistory(pathname, data) {
        if (location.pathname !== pathname) {
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