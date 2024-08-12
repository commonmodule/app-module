import { EventContainer } from "@common-module/ts";
import DomSelector from "./DomSelector.js";
interface DomNodeOptions {
    removalDelay?: number;
    removalClassName?: string;
}
export type DomChild = DomNode | DomNodeOptions | string;
export default class DomNode<HE extends HTMLElement = HTMLElement, ET extends Record<string, (...args: any[]) => any> = {}> extends EventContainer<ET & {
    visible: () => void;
}> {
    private parent;
    private children;
    private removalDelay;
    private removalClassName;
    protected htmlElement: HE;
    constructor(htmlElement?: HE | DomSelector, ...children: DomChild[]);
    private appendText;
    append(...children: DomChild[]): void;
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