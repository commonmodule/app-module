import DomNode from "./DomNode.js";
export default function el(elementOrSelector, ...children) {
    return new DomNode(elementOrSelector, ...children);
}
//# sourceMappingURL=el.js.map