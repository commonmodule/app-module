import View, { ViewParams } from "./View.js";
type ViewConstructor = new () => View;
declare class Router {
    private routes;
    private isViewOpening;
    private activeViews;
    constructor();
    private openView;
    add(pathname: `/${string}`, View: ViewConstructor): this;
    updateActiveViews(params?: ViewParams): void;
    private performNavigation;
    go(pathname: `/${string}`, params?: ViewParams): void;
    goWithoutHistory(pathname: `/${string}`, params?: ViewParams): void;
}
declare const _default: Router;
export default _default;
//# sourceMappingURL=Router.d.ts.map