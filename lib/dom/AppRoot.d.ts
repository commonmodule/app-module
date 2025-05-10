import { DefaultHandlers, IEventContainer } from "@commonmodule/ts";
import Dom, { DomDefaultHandlers, ElementEventMap } from "./Dom.js";
declare class AppRoot extends Dom<HTMLBodyElement> {
    private windowEventManager;
    private documentEventListeners;
    constructor();
    on<K extends keyof {}>(eventName: K, eventHandler: {}[K]): this;
    on<K extends keyof DefaultHandlers>(eventName: K, eventHandler: DefaultHandlers[K]): this;
    on<K extends keyof DomDefaultHandlers>(eventName: K, eventHandler: DomDefaultHandlers[K]): this;
    on<K extends keyof ElementEventMap<HTMLBodyElement>>(eventName: K, eventHandler: (event: ElementEventMap<HTMLBodyElement>[K]) => void): this;
    once<K extends keyof {}>(eventName: K, eventHandler: {}[K]): this;
    once<K extends keyof DefaultHandlers>(eventName: K, eventHandler: DefaultHandlers[K]): this;
    once<K extends keyof DomDefaultHandlers>(eventName: K, eventHandler: DomDefaultHandlers[K]): this;
    once<K extends keyof ElementEventMap<HTMLBodyElement>>(eventName: K, eventHandler: (event: ElementEventMap<HTMLBodyElement>[K]) => void): this;
    off<K extends keyof {}>(eventName: K, eventHandler?: {}[K]): this;
    off<K extends keyof DefaultHandlers>(eventName: K, eventHandler?: DefaultHandlers[K]): this;
    off<K extends keyof DomDefaultHandlers>(eventName: K, eventHandler?: DomDefaultHandlers[K]): this;
    off<K extends keyof ElementEventMap<HTMLBodyElement>>(eventName: K, eventHandler?: (event: ElementEventMap<HTMLBodyElement>[K]) => void): this;
    emit<K extends keyof {}>(eventName: K, ...args: Parameters<{}[K]>): Promise<ReturnType<{}[K]>[]>;
    emit<K extends keyof DefaultHandlers>(eventName: K, ...args: Parameters<DefaultHandlers[K]>): Promise<ReturnType<DefaultHandlers[K]>[]>;
    emit<K extends keyof DomDefaultHandlers>(eventName: K, ...args: Parameters<DomDefaultHandlers[K]>): Promise<ReturnType<DomDefaultHandlers[K]>[]>;
    emit<K extends keyof ElementEventMap<HTMLBodyElement>>(eventName: K, ...args: Parameters<(event: ElementEventMap<HTMLBodyElement>[K]) => void>): Promise<ReturnType<(event: ElementEventMap<HTMLBodyElement>[K]) => void>[]>;
    bind<K extends keyof {}>(eventName: K, eventHandler: {}[K], target: IEventContainer): this;
    bind<K extends keyof DefaultHandlers>(target: IEventContainer, eventName: K, eventHandler: DefaultHandlers[K]): this;
    bind<K extends keyof DomDefaultHandlers>(target: IEventContainer, eventName: K, eventHandler: DomDefaultHandlers[K]): this;
    bind<K extends keyof ElementEventMap<HTMLBodyElement>>(target: IEventContainer, eventName: K, eventHandler: (event: ElementEventMap<HTMLBodyElement>[K]) => void): this;
    remove(): void;
}
declare const _default: AppRoot;
export default _default;
//# sourceMappingURL=AppRoot.d.ts.map