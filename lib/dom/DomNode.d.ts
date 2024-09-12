import { EventTreeNode } from "@common-module/ts";
type Tag = "" | keyof HTMLElementTagNameMap;
export type DomSelector = Tag | `${Tag}#${string}` | `${Tag}.${string}` | `${Tag}#${string}.${string}`;
export type ElementOrSelector = HTMLElement | DomSelector;
type InferElementTypeByTag<TT extends Tag | string> = TT extends "" ? HTMLDivElement : (TT extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[TT] : HTMLElement);
export type InferElementType<EOS extends ElementOrSelector> = EOS extends HTMLElement ? EOS : (EOS extends "" ? HTMLDivElement : (EOS extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[EOS] : (EOS extends `${infer TT}#${string}` ? InferElementTypeByTag<TT> : (EOS extends `${infer TT}.${string}` ? InferElementTypeByTag<TT> : HTMLElement))));
export type DomChild<EOS extends ElementOrSelector> = DomNode | Partial<InferElementType<EOS>> | string | undefined;
export default class DomNode<HE extends HTMLElement = HTMLElement, ET extends Record<string, (...args: any[]) => any> = {}> extends EventTreeNode<DomNode, ET & {
    visible: () => void;
    remove: () => void;
}> {
    private removed;
    element: HE;
    constructor(elementOrSelector?: HE | DomSelector, ...children: DomChild<HE>[]);
    private appendText;
    append(...children: DomChild<HE>[]): void;
    private isVisible;
    private notifyVisibility;
    appendTo(parent: DomNode, index?: number): this;
    remove(): void;
    empty(): this;
    set text(text: string | undefined);
    get text(): string;
    style<T extends Partial<CSSStyleDeclaration> | string>(styles: T): T extends string ? string : this;
    onDom<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HE, event: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): this;
    offDom<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HE, event: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): this;
    calculateRect(): DOMRect;
}
export {};
//# sourceMappingURL=DomNode.d.ts.map