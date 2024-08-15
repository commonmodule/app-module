import { EventContainer } from "@common-module/ts";
type Tag = "" | keyof HTMLElementTagNameMap;
type Selector = Tag | `${Tag}#${string}` | `${Tag}.${string}` | `${Tag}#${string}.${string}`;
export type ElementOrSelector = HTMLElement | Selector;
type InferElementTypeByTag<TT extends Tag | string> = TT extends "" ? HTMLDivElement : (TT extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[TT] : HTMLElement);
export type InferElementType<EOS extends ElementOrSelector> = EOS extends HTMLElement ? EOS : (EOS extends "" ? HTMLDivElement : (EOS extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[EOS] : (EOS extends `${infer TT}#${string}` ? InferElementTypeByTag<TT> : (EOS extends `${infer TT}.${string}` ? InferElementTypeByTag<TT> : HTMLElement))));
type DomNodeOptions<EOS extends ElementOrSelector> = Partial<InferElementType<EOS>> & {
    removalDelay?: number;
    removalClassName?: string;
};
export type DomChild<EOS extends ElementOrSelector> = DomNode | DomNodeOptions<EOS> | string | undefined;
export default class DomNode<HE extends HTMLElement = HTMLElement, ET extends Record<string, (...args: any[]) => any> = {}> extends EventContainer<ET & {
    visible: () => void;
    remove: () => void;
}> {
    private parent;
    private children;
    element: HE;
    private removalDelay;
    private removalClassName;
    private removed;
    constructor(elementOrSelector: HE | Selector, ...children: DomChild<HE>[]);
    private appendText;
    append(...children: DomChild<HE>[]): void;
    private isVisible;
    private notifyVisibility;
    appendTo(parent: DomNode, index?: number): this;
    remove(): void;
    empty(): this;
    set text(text: string | undefined);
    get text(): string;
    style(styles: Partial<CSSStyleDeclaration>): this;
    onDom<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HE, event: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): this;
    calculateRect(): DOMRect;
}
export {};
//# sourceMappingURL=DomNode.d.ts.map