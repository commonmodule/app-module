import { DomSelector, Tag } from "@common-module/universal-page";
import WindowEventTreeNode from "./WindowEventTreeNode.js";
export type ElementOrSelector = HTMLElement | DomSelector;
type InferElementTypeByTag<TT extends Tag | string> = TT extends "" ? HTMLDivElement : (TT extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[TT] : HTMLElement);
export type InferElementType<EOS extends ElementOrSelector> = EOS extends HTMLElement ? EOS : (EOS extends "" ? HTMLDivElement : (EOS extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[EOS] : (EOS extends `${infer TT}#${string}` ? InferElementTypeByTag<TT> : (EOS extends `${infer TT}.${string}` ? InferElementTypeByTag<TT> : HTMLElement))));
type ElementProperties<EOS extends ElementOrSelector> = Partial<Omit<InferElementType<EOS>, "style">> & {
    style?: Partial<CSSStyleDeclaration>;
};
export type DomChild<EOS extends ElementOrSelector = ElementOrSelector> = DomNode | ElementProperties<InferElementType<EOS>> | string | undefined;
export default class DomNode<HE extends HTMLElement = HTMLElement, ET extends Record<string, (...args: any[]) => any> = {}> extends WindowEventTreeNode<DomNode, ET & {
    visible: () => void;
    remove: () => void;
}> {
    htmlElement: HE;
    constructor(elementOrSelector?: HE | DomSelector, ...children: DomChild<HE>[]);
    private prependText;
    private appendText;
    prepend(...children: DomChild<HE>[]): this;
    append(...children: DomChild<HE>[]): this;
    private isVisible;
    private notifyVisibility;
    appendTo(parent: DomNode, index?: number): this;
    remove(): void;
    set text(text: string | undefined);
    get text(): string;
    addClass(...classNames: string[]): this;
    removeClass(...classNames: string[]): this;
    style<T extends Partial<CSSStyleDeclaration> | string>(styles: T): T extends string ? string : this;
    onDom<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HE, event: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): this;
    offDom<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HE, event: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): this;
    calculateRect(): DOMRect;
    clone(): DomNode<HE, ET>;
}
export {};
//# sourceMappingURL=DomNode.d.ts.map