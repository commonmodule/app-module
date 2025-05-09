import { DefaultHandlers } from "@commonmodule/ts";
import Dom, { DomDefaultHandlers, ElementEventMap } from "./Dom.js";
declare class AppRoot extends Dom<HTMLBodyElement> {
    constructor();
    on<K extends keyof {}>(eventName: K, eventHandler: {}[K]): this;
    on<K extends keyof DefaultHandlers>(eventName: K, eventHandler: DefaultHandlers[K]): this;
    on<K extends keyof DomDefaultHandlers>(eventName: K, eventHandler: DomDefaultHandlers[K]): this;
    on<K extends keyof ElementEventMap<HTMLBodyElement>>(eventName: K, eventHandler: (event: ElementEventMap<HTMLBodyElement>[K]) => void): this;
    bind<K extends keyof {}>(eventName: K, target: Dom<HTMLElement>, eventHandler: {}[K]): this;
    bind<K extends keyof DefaultHandlers>(eventName: K, target: Dom<HTMLElement>, eventHandler: DefaultHandlers[K]): this;
    bind<K extends keyof DomDefaultHandlers>(eventName: K, target: Dom<HTMLElement>, eventHandler: DomDefaultHandlers[K]): this;
    bind<K extends keyof ElementEventMap<HTMLBodyElement>>(eventName: K, target: Dom<HTMLElement>, eventHandler: (event: ElementEventMap<HTMLBodyElement>[K]) => void): this;
}
declare const _default: AppRoot;
export default _default;
//# sourceMappingURL=AppRoot.d.ts.map