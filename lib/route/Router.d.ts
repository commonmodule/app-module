import View from "./View.js";
type ViewClass = new () => View;
declare class Router {
    private routes;
    private viewOpening;
    private openingViews;
    constructor();
    private openView;
    route(uri: string, View: ViewClass): void;
    private changeUri;
    go(uri: string): void;
}
declare const _default: Router;
export default _default;
//# sourceMappingURL=Router.d.ts.map