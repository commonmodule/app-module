import { DefaultHandlers, EventHandlers, EventNode, IEventContainer } from "@commonmodule/ts";
import { DomSelector, ElementOrSelector, ElementProperties, InferElementType } from "@commonmodule/universal-page";
export type ElementEventMap<H extends HTMLElement> = H extends HTMLBodyElement ? WindowEventMap & DocumentEventMap & HTMLBodyElementEventMap : H extends HTMLVideoElement ? HTMLMediaElementEventMap & HTMLVideoElementEventMap : H extends HTMLAudioElement ? HTMLMediaElementEventMap : HTMLElementEventMap;
type ElementEventHandlers<H extends HTMLElement> = {
    [K in keyof HTMLElementEventMap]: (event: ElementEventMap<H>[K]) => void;
};
export type DomDefaultHandlers = {
    visible: () => void;
};
export type AllDomHandlers<H extends HTMLElement, E> = E & DefaultHandlers & DomDefaultHandlers & ElementEventHandlers<H>;
export type DomChild<EOS extends ElementOrSelector = ElementOrSelector> = Dom | ElementProperties<InferElementType<EOS>> | string | undefined;
export default class Dom<H extends HTMLElement = HTMLElement, E extends EventHandlers = {}> extends EventNode<Dom, AllDomHandlers<H, E>> {
    htmlElement: H;
    private htmlElementEventManager;
    constructor(elementOrSelector?: H | DomSelector, ...children: DomChild<H>[]);
    private prependText;
    private appendText;
    prepend(...children: DomChild<H>[]): this;
    append(...children: DomChild<H>[]): this;
    protected isVisible(): boolean;
    private notifyVisibility;
    appendTo(parent: Dom, index?: number): this;
    clear(...except: (Dom | undefined)[]): this;
    set text(text: string | undefined);
    get text(): string;
    on<K extends keyof E>(eventName: K, eventHandler: E[K]): this;
    on<K extends keyof DefaultHandlers>(eventName: K, eventHandler: DefaultHandlers[K]): this;
    on<K extends keyof DomDefaultHandlers>(eventName: K, eventHandler: DomDefaultHandlers[K]): this;
    on<K extends keyof ElementEventMap<H>>(eventName: K, eventHandler: (event: ElementEventMap<H>[K]) => void): this;
    once<K extends keyof E>(eventName: K, eventHandler: E[K]): this;
    once<K extends keyof DefaultHandlers>(eventName: K, eventHandler: DefaultHandlers[K]): this;
    once<K extends keyof DomDefaultHandlers>(eventName: K, eventHandler: DomDefaultHandlers[K]): this;
    once<K extends keyof ElementEventMap<H>>(eventName: K, eventHandler: (event: ElementEventMap<H>[K]) => void): this;
    hasEvent<K extends keyof E>(eventName: K): boolean;
    hasEvent<K extends keyof DefaultHandlers>(eventName: K): boolean;
    hasEvent<K extends keyof DomDefaultHandlers>(eventName: K): boolean;
    hasEvent<K extends keyof ElementEventMap<H>>(eventName: K): boolean;
    off<K extends keyof E>(eventName: K, eventHandler?: E[K]): this;
    off<K extends keyof DefaultHandlers>(eventName: K, eventHandler?: DefaultHandlers[K]): this;
    off<K extends keyof DomDefaultHandlers>(eventName: K, eventHandler?: DomDefaultHandlers[K]): this;
    off<K extends keyof ElementEventMap<H>>(eventName: K, eventHandler?: (event: ElementEventMap<H>[K]) => void): this;
    protected emit<K extends keyof E>(eventName: K, ...args: Parameters<E[K]>): Promise<ReturnType<E[K]>[]>;
    protected emit<K extends keyof DefaultHandlers>(eventName: K, ...args: Parameters<DefaultHandlers[K]>): Promise<ReturnType<DefaultHandlers[K]>[]>;
    protected emit<K extends keyof DomDefaultHandlers>(eventName: K, ...args: Parameters<DomDefaultHandlers[K]>): Promise<ReturnType<DomDefaultHandlers[K]>[]>;
    bind<K extends keyof E>(target: IEventContainer, eventName: K, eventHandler: E[K]): this;
    bind<K extends keyof DefaultHandlers>(target: IEventContainer, eventName: K, eventHandler: DefaultHandlers[K]): this;
    bind<K extends keyof DomDefaultHandlers>(target: IEventContainer, eventName: K, eventHandler: DomDefaultHandlers[K]): this;
    bind<K extends keyof ElementEventMap<H>>(target: IEventContainer, eventName: K, eventHandler: (event: ElementEventMap<H>[K]) => void): this;
    addClass(...classNames: string[]): this;
    hasClass(className: string): boolean;
    removeClass(...classNames: string[]): this;
    style<T extends Partial<CSSStyleDeclaration> | string>(styles: T): T extends string ? string : this;
    calculateRect(): DOMRect;
    clone(): Dom<H, E>;
    remove(): void;
}
export {};
//# sourceMappingURL=Dom.d.ts.map