import { EventContainer } from "@common-module/ts";
import DomSelector from "./DomSelector.js";
export type DomChild = DomNode | string;
export default class DomNode<HE extends HTMLElement = HTMLElement, ET extends Record<string, (...args: any[]) => any> = {}> extends EventContainer<ET & {
    visible: () => void;
}> {
    private parent;
    private children;
    protected htmlElement: HE;
    constructor(htmlElement?: HE | DomSelector, ...children: DomChild[]);
    private appendText;
    append(...children: DomChild[]): void;
    private isVisible;
    private notifyVisibility;
    appendTo(parent: DomNode, index?: number): this;
    delete(): void;
    empty(): this;
    set text(text: string | undefined);
    get text(): string;
    style(styles: Partial<CSSStyleDeclaration>): this;
}
//# sourceMappingURL=DomNode.d.ts.map