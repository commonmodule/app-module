import { EventHandlers, EventNode, WithDefaultHandlers } from "@commonmodule/ts";
import { DomSelector, ElementOrSelector, ElementProperties, InferElementType } from "@commonmodule/universal-page";
type ElementEventMap<H extends HTMLElement> = H extends HTMLVideoElement ? HTMLMediaElementEventMap & HTMLVideoElementEventMap : H extends HTMLAudioElement ? HTMLMediaElementEventMap : HTMLElementEventMap;
type ElementEventHandlers<H extends HTMLElement> = {
    [K in keyof HTMLElementEventMap]: (event: ElementEventMap<H>[K]) => void;
};
type WithDomDefaultHandlers<E> = E & {
    visible: () => void;
};
type WithDomAllHandlers<H extends HTMLElement, E> = WithDomDefaultHandlers<E> & ElementEventHandlers<H> & WithDefaultHandlers<E>;
export type DomChild<EOS extends ElementOrSelector = ElementOrSelector> = Dom | ElementProperties<InferElementType<EOS>> | string | undefined;
export default class Dom<H extends HTMLElement = HTMLElement, E extends EventHandlers = {}> extends EventNode<Dom, WithDomDefaultHandlers<E>> {
    htmlElement: H;
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
    on<K extends keyof {
        remove: () => void;
    }>(eventName: K, handler: {
        remove: () => void;
    }[K]): this;
    on<K extends keyof {
        visible: () => void;
    }>(eventName: K, handler: {
        visible: () => void;
    }[K]): this;
    on<K extends keyof E>(eventName: K, handler: E[K]): this;
    on<K extends keyof ElementEventMap<H>>(eventName: K, handler: (event: ElementEventMap<H>[K]) => void): this;
    emit<K extends keyof WithDomAllHandlers<H, E>>(eventName: K, ...args: Parameters<WithDomAllHandlers<H, E>[K]>): this;
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