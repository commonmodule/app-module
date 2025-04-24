import { EventRecord } from "@commonmodule/ts";
import { DomSelector, ElementOrSelector, ElementProperties, InferElementType } from "@commonmodule/universal-page";
import WindowEventTreeNode from "./WindowEventTreeNode.js";
export type DomChild<EOS extends ElementOrSelector = ElementOrSelector> = DomNode | ElementProperties<InferElementType<EOS>> | string | undefined;
export default class DomNode<H extends HTMLElement = HTMLElement, E extends EventRecord = EventRecord> extends WindowEventTreeNode<DomNode, E & {
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
    appendTo(parent: DomNode, index?: number): this;
    clear(...except: (DomNode | undefined)[]): this;
    remove(): void;
    set text(text: string | undefined);
    get text(): string;
    addClass(...classNames: string[]): this;
    hasClass(className: string): boolean;
    removeClass(...classNames: string[]): this;
    style<T extends Partial<CSSStyleDeclaration> | string>(styles: T): T extends string ? string : this;
    onDom<K extends keyof HTMLElementEventMap>(type: K, listener: (this: H, event: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): this;
    offDom<K extends keyof HTMLElementEventMap>(type: K, listener: (this: H, event: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): this;
    calculateRect(): DOMRect;
    clone(): DomNode<H, E>;
}
//# sourceMappingURL=DomNode.d.ts.map