import DomNode from "./DomNode.js";
export default function el(htmlElement, ...children) {
    return new DomNode(htmlElement, ...children);
}
//# sourceMappingURL=el.js.map