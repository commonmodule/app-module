import { EventHandlers, EventNode } from "@commonmodule/ts";
import { DomSelector, ElementOrSelector, ElementProperties, InferElementType } from "@commonmodule/universal-page";
export type DomChild<EOS extends ElementOrSelector = ElementOrSelector> = Dom | ElementProperties<InferElementType<EOS>> | string | undefined;
type DOMEventHandlers = {
    [K in keyof HTMLElementEventMap]: (event: HTMLElementEventMap[K]) => void;
};
export default class Dom<H extends HTMLElement = HTMLElement, E extends EventHandlers = {}> extends EventNode<Dom, E & DOMEventHandlers & {
    visible: () => void;
}> {
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