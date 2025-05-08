import { el as UniversalEl, html, } from "@commonmodule/universal-page";
import Dom from "./Dom.js";
export default function el(elementOrSelector, ...children) {
    return new Dom(elementOrSelector, ...children);
}
UniversalEl.impl = el;
html.impl = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    return new Dom(doc.body.firstChild);
};
//# sourceMappingURL=el.js.map