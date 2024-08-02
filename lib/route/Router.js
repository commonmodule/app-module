import { ArrayUtil } from "@common-module/ts";
if (!window.URLPattern) {
    await import("urlpattern-polyfill");
}
class Router {
    routes = [];
    viewOpening = false;
    openingViews = [];
    constructor() {
        window.addEventListener("popstate", (event) => {
            console.log(event);
        });
    }
    openView(View, params) {
        this.viewOpening = true;
        const view = new View();
        view.changeParams(params);
        this.openingViews.push(view);
        this.viewOpening = false;
    }
    route(uri, View) {
        const pathname = "/" + uri;
        const urlPattern = new URLPattern({ pathname });
        this.routes.push({ urlPattern, View });
        const params = urlPattern.exec({ pathname: location.pathname })?.pathname
            .groups;
        if (params)
            this.openView(View, params);
    }
    changeUri(uri) {
        const pathname = "/" + uri;
        history.pushState(undefined, "", pathname);
        for (const route of this.routes) {
            const openingView = this.openingViews.find((view) => view instanceof route.View);
            const params = route.urlPattern.exec({ pathname: location.pathname })
                ?.pathname.groups;
            if (params) {
                openingView
                    ? openingView.changeParams(params)
                    : this.openView(route.View, params);
            }
            else if (openingView) {
                openingView.close();
                ArrayUtil.pull(this.openingViews, openingView);
            }
        }
    }
    go(uri) {
        const pathname = "/" + uri;
        if (location.pathname !== pathname) {
            if (this.viewOpening)
                setTimeout(() => this.changeUri(uri));
            else
                this.changeUri(uri);
        }
    }
}
export default new Router();
//# sourceMappingURL=Router.js.map