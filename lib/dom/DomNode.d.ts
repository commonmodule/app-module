import DomSelector from "./DomSelector.js";
export type DomChild = DomNode | string;
export default class DomNode<HE extends HTMLElement = HTMLElement> {
    private htmlElement;
    constructor(htmlElement?: HE | DomSelector, ...children: DomChild[]);
    private appendText;
    append(...children: DomChild[]): void;
    appendTo(parent: DomNode, index?: number): this;
    delete(): void;
    empty(): this;
    set text(text: string | undefined);
    get text(): string;
    style(styles: Partial<CSSStyleDeclaration>): this;
}
//# sourceMappingURL=DomNode.d.ts.map