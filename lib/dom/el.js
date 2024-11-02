import { el as UniversalEl, html, } from "@common-module/universal-page";
import DomNode from "./DomNode.js";
export default function el(elementOrSelector, ...children) {
    return new DomNode(elementOrSelector, ...children);
}
UniversalEl.impl = el;
html.impl = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    return new DomNode(doc.body.firstChild);
};
//# sourceMappingURL=el.js.map