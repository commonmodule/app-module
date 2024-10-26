import { EventContainer } from "@common-module/ts";
import View from "./View.js";
type ViewConstructor = new () => View<any>;
declare class Router extends EventContainer<{
    routeChanged: (pathname: `/${string}`, data: any) => void;
}> {
    prefix: string;
    private routes;
    private isViewOpening;
    private activeViews;
    constructor();
    private openView;
    add(pathname: `/${string}` | `/${string}`[], View: ViewConstructor): this;
    updateActiveViews(data?: any): void;
    private performNavigation;
    go(pathname: `/${string}`, data?: any): void;
    goWithoutHistory(pathname: `/${string}`, data?: any): void;
}
declare const _default: Router;
export default _default;
//# sourceMappingURL=Router.d.ts.map