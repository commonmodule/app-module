import DomUtil from "./DomUtil.js";
export default class DomNode {
    htmlElement;
    constructor(htmlElement, ...children) {
        this.htmlElement = htmlElement instanceof HTMLElement
            ? htmlElement
            : DomUtil.createHtmlElement(htmlElement ?? "");
        this.append(...children);
    }
    appendText(text) {
        if (this.htmlElement instanceof HTMLTextAreaElement) {
            this.htmlElement.value += text;
        }
        else {
            const fragment = document.createDocumentFragment();
            text.split("\n").forEach((line, index) => {
                if (index > 0)
                    fragment.appendChild(document.createElement("br"));
                fragment.appendChild(document.createTextNode(line));
            });
            this.htmlElement.appendChild(fragment);
        }
        return this;
    }
    append(...children) {
    }
    style(styles) {
        Object.assign(this.htmlElement.style, styles);
        return this;
    }
    delete() {
    }
}
//# sourceMappingURL=DomNode.js.map