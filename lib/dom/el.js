import { el as UniversalEl, } from "@common-module/universal-page";
import DomNode from "./DomNode.js";
export default function el(elementOrSelector, ...children) {
    return new DomNode(elementOrSelector, ...children);
}
UniversalEl.impl = el;
//# sourceMappingURL=el.js.map