import { DefaultHandlers, EventNode } from "@commonmodule/ts";
import { DomSelector, ElementOrSelector, ElementProperties, InferElementType } from "@commonmodule/universal-page";
type ElementEventMap<H extends HTMLElement> = H extends HTMLVideoElement ? HTMLMediaElementEventMap & HTMLVideoElementEventMap : H extends HTMLAudioElement ? HTMLMediaElementEventMap : HTMLElementEventMap;
type ElementEventHandlers<H extends HTMLElement> = {
    [K in keyof HTMLElementEventMap]: (event: ElementEventMap<H>[K]) => void;
};
type DomDefaultHandlers = {
    visible: () => void;
};
export type DomHandlers<E, H extends HTMLElement> = Omit<E, keyof DomDefaultHandlers | keyof ElementEventHandlers<H>>;
type WithDomDefaultHandlers<E> = E & DomDefaultHandlers;
type WithAllHandlers<H extends HTMLElement, E> = WithDomDefaultHandlers<E> & ElementEventHandlers<H> & DefaultHandlers;
export type DomChild<EOS extends ElementOrSelector = ElementOrSelector> = Dom | ElementProperties<InferElementType<EOS>> | string | undefined;
export default class Dom<H extends HTMLElement = HTMLElement, E extends DomHandlers<E, H> = {}> extends EventNode<Dom, WithDomDefaultHandlers<E>> {
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
    on<K extends keyof WithAllHandlers<H, E>>(eventName: K, handler: WithAllHandlers<H, E>[K]): this;
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