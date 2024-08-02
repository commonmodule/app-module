import DomSelector from "./DomSelector.js";
export type DomChild = DomNode<HTMLElement>;
export default class DomNode<HE extends HTMLElement> {
    private htmlElement;
    constructor(htmlElement?: HE | DomSelector, ...children: DomChild[]);
    private appendText;
    private append;
    style(styles: Partial<CSSStyleDeclaration>): this;
    delete(): void;
}
//# sourceMappingURL=%C3%98%C3%8F.d.ts.map